import { SettingsV1 } from './types/SettingsV1';

export const DEFAULT_SETTINGS: SettingsV1 = {
  __version: 1,
  currentProfile: 'profile1',
  profiles: ['profile1'],
  numberOfWorkingHours: 8 * 60 * 60 * 1000,
  isFirstLoad: true,
  showNotifications: true,
};
