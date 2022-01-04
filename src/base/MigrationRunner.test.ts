import MigrationRunner from './MigrationRunner';
import { SchemaMigration } from '../types/SchemaMigration';
import { JSONSchemaType } from 'ajv';
import MigrationErrorCodes from '../types/MigrationErrorCodes';

describe('MigrationRunner tests', () => {
  describe('Constructor tests', () => {
    test(`Throw ErrorCode=${MigrationErrorCodes.NoMigrations} NoMigrations`, () => {
      expect(() => new MigrationRunner([])).toThrow(
        `schemaMigrations can't be empty`
      );
    });

    test(`Throw ErrorCode=${MigrationErrorCodes.NoZeroMigration} NoZeroMigration`, () => {
      expect(() => new MigrationRunner([{ version: 1, schema: {} }])).toThrow(
        'schemaMigrations should have migration for `version=0`'
      );
    });

    test(`Throw ErrorCode=${MigrationErrorCodes.IncorrectMigrationsOrder} IncorrectMigrationsOrder`, () => {
      expect(
        () =>
          new MigrationRunner([
            { version: 0, schema: {} },
            { version: 2, schema: {} },
          ])
      ).toThrow('Each version should go one after the other');
    });
  });

  describe('Migration tests', () => {
    test('Test migration with 3 iterations', () => {
      type TypeV0 = { data: number };
      type TypeV1 = { data: number[]; __version: number };
      type TypeV2 = {
        data: number[];
        additionalData: string;
        __version: number;
      };
      const schemaV0: JSONSchemaType<TypeV0> = {
        type: 'object',
        properties: {
          data: { type: 'number' },
        },
        required: ['data'],
      };
      const schemaV1: JSONSchemaType<TypeV1> = {
        type: 'object',
        properties: {
          __version: { type: 'number' },
          data: { type: 'array', items: { type: 'number' } },
        },
        required: ['data', '__version'],
      };
      const schemaV2: JSONSchemaType<TypeV2> = {
        type: 'object',
        properties: {
          __version: { type: 'number' },
          data: { type: 'array', items: { type: 'number' } },
          additionalData: { type: 'string' },
        },
        required: ['data', '__version', 'additionalData'],
      };
      const migrations: SchemaMigration[] = [
        { version: 0, schema: schemaV0 },
        {
          version: 1,
          schema: schemaV1,
          migration(item: TypeV0): TypeV1 {
            return {
              data: [item.data] as number[],
              __version: 1,
            };
          },
        },
        {
          version: 2,
          schema: schemaV2,
          migration(item: TypeV1): TypeV2 {
            return {
              data: item.data,
              additionalData: 'test',
              __version: 2,
            };
          },
        },
      ];

      const dataV0: TypeV0 = { data: 77 };
      const expectedData: TypeV2 = {
        data: [77],
        additionalData: 'test',
        __version: 2,
      };
      const mr = new MigrationRunner(migrations);

      const resultData = mr.runMigration(dataV0);
      expect(resultData).toStrictEqual(expectedData);
    });

    test(`Throw ErrorCode=${MigrationErrorCodes.ValidationFailed} ValidationFailed`, () => {
      type TypeV0 = { data: number; text: string; prop: { test: 1 } };

      const schemaV0: JSONSchemaType<TypeV0> = {
        type: 'object',
        properties: {
          data: { type: 'number' },
          text: { type: 'string' },
          prop: {
            type: 'object',
            properties: { test: { type: 'number' } },
            required: ['test'],
          },
        },
        required: ['data', 'text'],
      };

      const migrations: SchemaMigration[] = [{ version: 0, schema: schemaV0 }];

      const dataV0 = { fakeData: 77, text: 123, prop: { testFail: 1 } };

      const mr = new MigrationRunner(migrations);

      expect(() => mr.runMigration(dataV0)).toThrow(
        [
          'Migration to version=0. Schema validation error. Found next errors:',
          '"/": "must have required property \'data\'"',
          '"/text": "must be string"',
          '"/prop": "must have required property \'test\'"',
        ].join('\n')
      );
    });

    test(`Throw ErrorCode=${MigrationErrorCodes.MigrationNotFound} MigrationNotFound`, () => {
      type TypeV0 = { data: number };

      const schemaV0: JSONSchemaType<TypeV0> = {
        type: 'object',
        properties: {
          data: { type: 'number' },
        },
        required: ['data'],
      };

      const migrations: SchemaMigration[] = [
        { version: 0, schema: schemaV0 },
        { version: 1, schema: schemaV0 },
      ];

      const dataV0 = { data: 1 };

      const mr = new MigrationRunner(migrations);

      expect(() => mr.runMigration(dataV0)).toThrow(
        /Migration {undefined->\d} not found/
      );
    });

    test(`Throw ErrorCode=${MigrationErrorCodes.MigrationFailed} MigrationFailed - migration returned undefined`, () => {
      type TypeV0 = { data: number };
      type TypeV1 = { data: number };

      const schemaV0: JSONSchemaType<TypeV0> = {
        type: 'object',
        properties: {
          data: { type: 'number' },
        },
        required: ['data'],
      };
      const schemaV1: JSONSchemaType<TypeV1> = {
        type: 'object',
        properties: {
          data: { type: 'number' },
        },
        required: ['data'],
      };

      const migrations: SchemaMigration[] = [
        { version: 0, schema: schemaV0 },
        {
          version: 1,
          schema: schemaV1,
          migration() {
            return undefined;
          },
        },
      ];

      const dataV0 = { data: 1 };

      const mr = new MigrationRunner(migrations);

      expect(() => mr.runMigration(dataV0)).toThrow(
        `migration returned 'undefined'`
      );
    });

    test(`Throw ErrorCode=${MigrationErrorCodes.MigrationFailed} MigrationFailed migration returned 'data' without '__version'`, () => {
      type TypeV0 = { data: number };
      type TypeV1 = { data: number };

      const schemaV0: JSONSchemaType<TypeV0> = {
        type: 'object',
        properties: {
          data: { type: 'number' },
        },
        required: ['data'],
      };
      const schemaV1: JSONSchemaType<TypeV1> = {
        type: 'object',
        properties: {
          data: { type: 'number' },
        },
        required: ['data'],
      };

      const migrations: SchemaMigration[] = [
        { version: 0, schema: schemaV0 },
        {
          version: 1,
          schema: schemaV1,
          migration(item) {
            return item;
          },
        },
      ];

      const dataV0 = { data: 1 };

      const mr = new MigrationRunner(migrations);

      expect(() => mr.runMigration(dataV0)).toThrow(
        `migration returned 'data' without '__version'`
      );
    });
  });
});
