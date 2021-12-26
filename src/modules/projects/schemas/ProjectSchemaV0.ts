import { JSONSchemaType } from 'ajv';
import ProjectModel from '../models/ProjectModel';

const ProjectSchemaV0: JSONSchemaType<ProjectModel> = {
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

export default ProjectSchemaV0;
