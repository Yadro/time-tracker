import Ajv from 'ajv';
import ProjectSchemaV1 from './schemas/SettingsSchemaV1';

const ajv = new Ajv({ allErrors: true });
export const validate = ajv.compile(ProjectSchemaV1);
