import migrationV1 from './MigrationV1';
import { ProjectSchemaV0, ProjectDataSchemaV1 } from '../schemas';
import { SchemaMigration } from '../../../types/SchemaMigration';

export const schemaMigrations: SchemaMigration[] = [
  { version: 0, schema: ProjectSchemaV0 },
  { version: 1, schema: ProjectDataSchemaV1, migration: migrationV1 },
];
