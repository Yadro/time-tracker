import { JSONSchemaType } from 'ajv';
import { SettingsV1 } from '../types/SettingsV1';

const SettingsSchemaV1: JSONSchemaType<SettingsV1> = {
  type: 'object',
  properties: {
    __version: { type: 'number' },
    currentProfile: { type: 'string' },
    profiles: {
      type: 'array',
      items: { type: 'string' },
    },
    numberOfWorkingHours: { type: 'number' },
    isFirstLoad: { type: 'boolean' },
    showNotifications: { type: 'boolean' },
  },
  required: [
    '__version',
    'currentProfile',
    'profiles',
    'numberOfWorkingHours',
    'isFirstLoad',
    'showNotifications',
  ],
};

export default SettingsSchemaV1;
