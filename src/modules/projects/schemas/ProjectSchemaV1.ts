import { JSONSchemaType } from 'ajv';
import { ProjectTypeV1, ProjectDataV1 } from '../types';

export const ProjectSchemaV1: JSONSchemaType<ProjectTypeV1> = {
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
  required: ['key', 'title', 'color'],
};

export const ProjectDataSchemaV1: JSONSchemaType<ProjectDataV1> = {
  type: 'object',
  properties: {
    __version: { type: 'number' },
    data: {
      type: 'array',
      items: ProjectSchemaV1,
    },
  },
  required: ['__version', 'data'],
};
