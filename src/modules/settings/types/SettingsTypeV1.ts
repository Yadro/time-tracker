import { ModelWithVersion } from '../../../types/ModelWithVersion';

export interface SettingsV1 extends ModelWithVersion {
  currentProfile: string;
  profiles: string[];
  numberOfWorkingHours: number;
  isFirstLoad: boolean;
  showNotifications: boolean;
}
