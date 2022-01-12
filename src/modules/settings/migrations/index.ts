import migrationV1 from './MigrationV1';
import { SettingsSchemaV0, SettingsSchemaV1 } from '../schemas';
import { SchemaMigration } from '../../../types/SchemaMigration';

export const schemaMigrations: SchemaMigration[] = [
  { version: 0, schema: SettingsSchemaV0 },
  { version: 1, schema: SettingsSchemaV1, migration: migrationV1 },
];
