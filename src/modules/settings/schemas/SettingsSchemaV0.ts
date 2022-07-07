import { JSONSchemaType } from 'ajv';
import { SettingsV0 } from '../types/SettingsTypeV0';

export const SettingsSchemaV0: JSONSchemaType<SettingsV0> = {
  type: 'object',
  properties: {
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
    'currentProfile',
    'profiles',
    'numberOfWorkingHours',
    'isFirstLoad',
    'showNotifications',
  ],
};
