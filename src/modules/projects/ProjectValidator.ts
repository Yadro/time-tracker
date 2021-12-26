import Ajv from 'ajv';
import ProjectSchemaV0 from './schemas/ProjectSchemaV0';

const ajv = new Ajv({ allErrors: true });
export const validate = ajv.compile(ProjectSchemaV0);
