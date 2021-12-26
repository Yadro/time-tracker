import migrationV1 from './MigrationV1';
import SettingsSchemaV1 from '../schemas/SettingsSchemaV1';
import SettingsSchemaV0 from '../schemas/SettingsSchemaV1';
import { SchemaMigration } from '../../../types/SchemaMigration';

export const schemaMigrations: SchemaMigration[] = [
  { version: 0, schema: SettingsSchemaV0 },
  { version: 1, schema: SettingsSchemaV1, migration: migrationV1 },
];
