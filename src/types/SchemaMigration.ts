export type SchemaMigration = {
  version: number;
  schema: any;
  migration?: <TIn = unknown, TOut = unknown>(data: TIn) => TOut;
};
