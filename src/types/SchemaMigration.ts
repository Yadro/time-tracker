export type SchemaMigration = {
  version: number;
  schema: any;
  migration?: (data: any) => any;
};
