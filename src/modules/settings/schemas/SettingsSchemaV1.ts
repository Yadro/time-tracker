import { JSONSchemaType } from 'ajv';
import SettingsModel from '../models/SettingsModel';

const SettingsSchemaV1: JSONSchemaType<SettingsModel> = {
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
