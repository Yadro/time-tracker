import { JSONSchemaType } from 'ajv';
import { TaskDataV0, TaskTypeV0, TimeRangeTypeV0 } from '../types';

export const TimeRangeSchemaV0: JSONSchemaType<TimeRangeTypeV0> = {
  type: 'object',
  properties: {
    start: { type: 'string' },
    end: { type: 'string', nullable: true },
    description: { type: 'string', nullable: true },
  },
  required: ['start'],
};

export const TaskSchemaV0: JSONSchemaType<TaskTypeV0> = {
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
      items: TimeRangeSchemaV0,
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

export const TaskDataSchemaV0: JSONSchemaType<TaskDataV0> = {
  type: 'object',
  patternProperties: {
    '.*': {
      type: 'array',
      items: TaskSchemaV0,
    },
  },
  required: [],
};
