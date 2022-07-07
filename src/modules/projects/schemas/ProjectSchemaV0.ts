import { JSONSchemaType } from 'ajv';
import { ProjectTypeV0, ProjectDataV0 } from '../types';

export const ProjectSchemaV0: JSONSchemaType<ProjectTypeV0> = {
  type: 'object',
  properties: {
    key: { type: 'string' },
    title: { type: 'string' },
    color: { type: 'string' },
    expanded: { type: 'boolean', default: false, nullable: true },
    deletable: { type: 'boolean', default: true, nullable: true },
    children: {
      type: 'array',
      items: {
        type: 'object',
        $ref: '#',
        required: ['key', 'title', 'color'],
      },
      nullable: true,
    },
    parent: { type: 'object', $ref: '#', nullable: true },
  },
  required: [],
};

export const ProjectDataSchemaV0: JSONSchemaType<ProjectDataV0> = {
  type: 'array',
  items: ProjectSchemaV0,
};
