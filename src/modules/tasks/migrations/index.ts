import { SchemaMigration } from '../../../types/SchemaMigration';
import { TaskSchemaV0, TaskSchemaV1 } from '../schemas';
import migrationV1 from './MigrationV1';

export const schemaMigrations: SchemaMigration[] = [
  { version: 0, schema: TaskSchemaV0 },
  { version: 1, schema: TaskSchemaV1, migration: migrationV1 },
];
