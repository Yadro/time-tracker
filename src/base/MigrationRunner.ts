import { SchemaMigration } from '../types/SchemaMigration';
import { SchemaType } from '../types/SchemaType';
import { last } from '../helpers/ArrayHelper';

export default class MigrationRunner {
  private schemaMigrations: SchemaMigration[] = [];
  private genErrorMsg = (message: string) => `[MigrationRunner] ${message}`;

  constructor(schemaMigrations: SchemaMigration[]) {
    const schemaMigrationsSorted = schemaMigrations.slice();
    schemaMigrationsSorted.sort((a, b) => a.version - b.version);

    if (!schemaMigrationsSorted.length) {
      throw new Error(this.genErrorMsg('schemaMigrations can`t be empty'));
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
  }

  runMigration<T extends SchemaType>(data: T) {
    let newData: T = data;
    const lastVersion = last(this.schemaMigrations)?.version;

    if (lastVersion === undefined) {
      throw new Error('There are no migrations');
    }

    // if (!('__version' in data)) {
    //   const migration = this.schemaMigrations.find((i) => i.version === 1);
    //   if (!migration) {
    //     throw new Error();
    //   }
    //   newData = migration.migration?.(data);
    // } else {
    //   newData = data;
    // }

    // if (newData === undefined || newData.__version === undefined) {
    //   throw new Error();
    // }

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
          `Migration from ${newData.__version} to ${nextVersion} not found`
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

        newData = nextData;
        nextVersion = nextData.__version + 1;
      }
    }
  }
}
