import { JSONSchemaType } from 'ajv';
import { TaskTypeV1, TimeRangeTypeV1, TaskDataV1 } from '../types';
import { TaskSchemaV0 } from './TaskSchemaV0';

export const TimeRangeSchemaV1: JSONSchemaType<TimeRangeTypeV1> = {
  type: 'object',
  properties: {
    start: { type: 'string' },
    end: { type: 'string', nullable: true },
    description: { type: 'string', nullable: true },
  },
  required: ['start'],
};

export const TaskSchemaV1: JSONSchemaType<TaskTypeV1> = {
  type: 'object',
  properties: {
    key: { type: 'string' },
    title: { type: 'string' },
    children: {
      type: 'array',
      items: {
        type: 'object',
        $ref: '#',
        required: ['key', 'title'],
      },
      nullable: true,
    },
    projectId: { type: 'string' },
    checked: { type: 'boolean' },
    active: { type: 'boolean' },
    expanded: { type: 'boolean' },
    inMyDay: { type: 'string', nullable: true },
    time: {
      type: 'array',
      items: TimeRangeSchemaV1,
    },
    datesInProgress: {
      type: 'array',
      items: { type: 'string' },
    },
    details: { type: 'string' },
    withoutActions: { type: 'boolean' },
  },
  required: [
    'key',
    'title',
    'projectId',
    'checked',
    'active',
    'expanded',
    'time',
    'datesInProgress',
    'details',
    'withoutActions',
  ],
};

export const TaskDataSchemaV1: JSONSchemaType<TaskDataV1> = {
  type: 'object',
  properties: {
    __version: { type: 'number' },
    data: {
      type: 'object',
      patternProperties: {
        '.*': {
          type: 'array',
          items: TaskSchemaV0,
        },
      },
      required: [],
    },
  },
  required: ['data', '__version'],
};
