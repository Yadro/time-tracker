import Ajv, { ValidateFunction } from 'ajv';
import { SchemaMigration } from '../types/SchemaMigration';
import { SchemaType } from '../types/SchemaType';
import { last } from '../helpers/ArrayHelper';
import MigrationErrorCodes from '../types/MigrationErrorCodes';

export default class MigrationRunner {
  private schemaMigrations: SchemaMigration[] = [];
  private ajv: Ajv;
  private genErrorMsg = (
    error: MigrationErrorCodes | undefined,
    message: string
  ) => `[MigrationRunner] [error=${error ?? -1}] ${message}`;
  private genValidationErrors = (
    validate: ValidateFunction<unknown>,
    toVersion: number
  ) =>
    this.genErrorMsg(
      MigrationErrorCodes.ValidationFailed,
      `Migration to version=${toVersion}. Schema validation error. Found next errors:\n${validate.errors
        ?.map(
          (e) => `"${e.instancePath ? e.instancePath : '/'}": "${e.message}"`
        )
        ?.join('\n')}`
    );

  constructor(schemaMigrations: SchemaMigration[]) {
    const schemaMigrationsSorted = schemaMigrations.slice();
    schemaMigrationsSorted.sort((a, b) => a.version - b.version);

    if (!schemaMigrationsSorted.length) {
      throw new Error(
        this.genErrorMsg(
          MigrationErrorCodes.NoMigrations,
          `schemaMigrations can't be empty`
        )
      );
    }

    if (!schemaMigrationsSorted.find((i) => i.version === 0)) {
      throw new Error(
        this.genErrorMsg(
          MigrationErrorCodes.NoZeroMigration,
          'schemaMigrations should have migration for `version=0`'
        )
      );
    }

    const hasAllVersions = schemaMigrations.every(
      (i, idx) => i.version === idx
    );
    if (!hasAllVersions) {
      throw new Error(
        this.genErrorMsg(
          MigrationErrorCodes.IncorrectMigrationsOrder,
          'Each version should go one after the other'
        )
      );
    }

    this.schemaMigrations = schemaMigrationsSorted;
    this.ajv = new Ajv({ allErrors: true });
  }

  runMigration<T extends SchemaType>(data: T) {
    let newData: T = data;
    const lastVersion = last(this.schemaMigrations)?.version;

    if (lastVersion === undefined) {
      throw new Error(
        this.genErrorMsg(
          MigrationErrorCodes.NoMigrations,
          'There are no migrations'
        )
      );
    }

    const zeroVersion = 0;
    const firstMigration = this.schemaMigrations.find(
      (i) => i.version === zeroVersion
    );
    if (!firstMigration) {
      throw new Error();
    }

    const validate = this.ajv.compile(firstMigration.schema);
    const validateResult = validate(newData);
    if (!validateResult) {
      throw new Error(this.genValidationErrors(validate, zeroVersion));
    }

    let fromVersion = newData.__version;
    let toVersion = fromVersion !== undefined ? fromVersion + 1 : 1;

    while (true) {
      if (toVersion > lastVersion) {
        return newData;
      }

      const migration = this.schemaMigrations.find(
        (m) => m.version === toVersion
      );

      if (!migration) {
        throw new Error(
          this.genErrorMsg(
            MigrationErrorCodes.MigrationNotFound,
            `Migration from ${fromVersion} to ${toVersion} not found`
          )
        );
      }

      if (migration?.migration) {
        const nextData: T = migration.migration(newData);

        if (nextData === undefined) {
          throw new Error();
        }
        if (nextData.__version === undefined) {
          throw new Error();
        }

        const validate = this.ajv.compile(migration.schema);
        const validateResult = validate(nextData);
        if (!validateResult) {
          throw new Error(this.genValidationErrors(validate, toVersion));
        }

        newData = nextData;
        toVersion = nextData.__version + 1;
      }
    }
  }
}
