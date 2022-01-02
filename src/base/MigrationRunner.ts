import Ajv from 'ajv';
import { SchemaMigration } from '../types/SchemaMigration';
import { SchemaType } from '../types/SchemaType';
import { last } from '../helpers/ArrayHelper';

enum ErrorCodes {
  NoMigrations,
  NoZeroMigration,
  IncorrectMigrationsOrder,
}

export default class MigrationRunner {
  private schemaMigrations: SchemaMigration[] = [];
  private ajv: Ajv;
  private genErrorMsg = (error: ErrorCodes | undefined, message: string) =>
    `[MigrationRunner] ${error ?? -1} ${message}`;

  constructor(schemaMigrations: SchemaMigration[]) {
    const schemaMigrationsSorted = schemaMigrations.slice();
    schemaMigrationsSorted.sort((a, b) => a.version - b.version);

    if (!schemaMigrationsSorted.length) {
      throw new Error(
        this.genErrorMsg(
          ErrorCodes.NoMigrations,
          'schemaMigrations can`t be empty'
        )
      );
    }

    if (!schemaMigrationsSorted.find((i) => i.version === 0)) {
      throw new Error(
        this.genErrorMsg(
          'schemaMigrations should have migration for `version=0`'
        )
      );
    }

    const hasAllVersions = schemaMigrations.every(
      (i, idx) => i.version === idx
    );
    if (!hasAllVersions) {
      throw new Error(
        this.genErrorMsg('Each version should go one after the other')
      );
    }

    this.schemaMigrations = schemaMigrationsSorted;
    this.ajv = new Ajv({ allErrors: true });
  }

  runMigration<T extends SchemaType>(data: T) {
    let newData: T = data;
    const lastVersion = last(this.schemaMigrations)?.version;

    if (lastVersion === undefined) {
      throw new Error('There are no migrations');
    }

    const firstMigration = this.schemaMigrations.find((i) => i.version === 0);
    if (!firstMigration) {
      throw new Error();
    }
    const validate = this.ajv.compile(firstMigration.schema);
    const validateResult = validate(newData);
    if (!validateResult) {
      throw new Error(
        this.genErrorMsg(
          `Schema validation error "version=0". Found next errors:\n${validate.errors
            ?.map(
              (e) =>
                `"${e.instancePath ? e.instancePath : '/'}": "${e.message}"`
            )
            ?.join('\n')}`
        )
      );
    }

    let nextVersion =
      newData.__version !== undefined ? newData.__version + 1 : 1;

    while (true) {
      if (nextVersion > lastVersion) {
        return newData;
      }

      const migration = this.schemaMigrations.find(
        (m) => m.version === nextVersion
      );

      if (!migration) {
        throw new Error(
          this.genErrorMsg(
            `Migration from ${newData.__version} to ${nextVersion} not found`
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
        const validateObj = validate(nextData);
        if (!validateObj) {
          throw new Error(
            this.genErrorMsg(
              `Schema validation error. version=${nextVersion}: ${validate.errors?.join(
                ', '
              )}`
            )
          );
        }

        newData = nextData;
        nextVersion = nextData.__version + 1;
      }
    }
  }
}
