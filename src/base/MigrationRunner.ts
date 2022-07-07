import Ajv, { ValidateFunction, _ } from 'ajv';
import { SchemaMigration } from '../types/SchemaMigration';
import { SchemaType } from '../types/SchemaType';
import { last } from '../helpers/ArrayHelper';
import MigrationErrorCodes from '../types/MigrationErrorCodes';

function migrationAssert(
  assertValue: unknown,
  error: MigrationErrorCodes | undefined,
  message: string
): asserts assertValue {
  if (!assertValue) {
    throw new Error(`[MigrationRunner] [error=${error ?? -1}] ${message}`);
  }
}

function migrationAssertShowValidationErrors(
  assertValue: unknown,
  validate: ValidateFunction<unknown>,
  toVersion: number
): asserts assertValue {
  const errors = validate.errors
    ?.map((e) => `"${e.instancePath ? e.instancePath : '/'}": "${e.message}"`)
    ?.join('\n');
  return migrationAssert(
    assertValue,
    MigrationErrorCodes.ValidationFailed,
    `Migration to version=${toVersion}. Schema validation error. Found next errors:\n${errors}}`
  );
}

export default class MigrationRunner<TRes extends SchemaType> {
  private schemaMigrations: SchemaMigration[] = [];
  private ajv: Ajv;

  constructor(schemaMigrations: SchemaMigration[]) {
    migrationAssert(
      schemaMigrations.length,
      MigrationErrorCodes.NoMigrations,
      `schemaMigrations can't be empty`
    );

    const schemaMigrationsSorted = schemaMigrations.slice();
    schemaMigrationsSorted.sort((a, b) => a.version - b.version);

    migrationAssert(
      schemaMigrationsSorted.find((i) => i.version === 0),
      MigrationErrorCodes.NoZeroMigration,
      'schemaMigrations should have migration for `version=0`'
    );

    const hasAllVersions = schemaMigrations.every(
      (i, idx) => i.version === idx
    );

    migrationAssert(
      hasAllVersions,
      MigrationErrorCodes.IncorrectMigrationsOrder,
      'Each version should go one after the other'
    );

    this.schemaMigrations = schemaMigrationsSorted;
    this.ajv = new Ajv({ allErrors: true });
  }

  runMigration<T extends SchemaType>(data: T): TRes {
    let newData: T = data;
    let fromVersion = newData.__version || 0;
    let toVersion = fromVersion !== undefined ? fromVersion + 1 : 1;

    const latestVersion = last(this.schemaMigrations)?.version;

    migrationAssert(
      latestVersion !== undefined,
      MigrationErrorCodes.NoMigrations,
      'There are no migrations'
    );

    const migration = this.schemaMigrations.find(
      (i) => i.version === fromVersion
    );

    migrationAssert(
      migration?.schema,
      MigrationErrorCodes.NoMigrations,
      'There are no migrations'
    );

    const validate = this.ajv.compile(migration.schema);
    const validateResult = validate(newData);
    migrationAssertShowValidationErrors(validateResult, validate, toVersion);

    while (true) {
      if (toVersion > latestVersion) {
        return newData as TRes;
      }

      const migration = this.schemaMigrations.find(
        (m) => m.version === toVersion
      );

      migrationAssert(
        migration?.migration,
        MigrationErrorCodes.MigrationNotFound,
        `Migration {${fromVersion}->${toVersion}} not found`
      );

      const nextData: T = migration.migration(newData);

      migrationAssert(
        nextData,
        MigrationErrorCodes.MigrationFailed,
        `After run migration {${fromVersion}->${toVersion}}, migration returned 'undefined'`
      );

      migrationAssert(
        nextData.__version !== undefined,
        MigrationErrorCodes.MigrationFailed,
        `After run migration {${fromVersion}->${toVersion}}, migration returned 'data' without '__version'`
      );

      const validate = this.ajv.compile(migration.schema);
      const validateResult = validate(nextData);
      migrationAssertShowValidationErrors(validateResult, validate, toVersion);

      newData = nextData;
      toVersion = nextData.__version + 1;
    }
  }
}
