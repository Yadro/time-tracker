import AbstractModel from '../../../base/AbstractModel';

export const DEFAULT_SETTINGS = {
  currentProfile: 'profile1',
  profiles: ['profile1'],
  hoursInWorkingDay: 8 * 60 * 60 * 1000,
  isFirstLoad: true,
};

export default class SettingsModel extends AbstractModel {
  currentProfile: string = DEFAULT_SETTINGS.currentProfile;
  profiles: string[] = DEFAULT_SETTINGS.profiles;
  hoursInWorkingDay: number = DEFAULT_SETTINGS.hoursInWorkingDay;
  isFirstLoad: boolean = DEFAULT_SETTINGS.isFirstLoad;

  constructor(data: any) {
    super();
    this.load(data);
  }
}
