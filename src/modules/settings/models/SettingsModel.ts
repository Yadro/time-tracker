import AbstractModel from '../../../base/AbstractModel';
import { makeObservable, observable } from 'mobx';

export const DEFAULT_SETTINGS = {
  currentProfile: 'profile1',
  profiles: ['profile1'],
  numberOfWorkingHours: 8 * 60 * 60 * 1000,
  isFirstLoad: true,
};

export default class SettingsModel extends AbstractModel {
  currentProfile: string = DEFAULT_SETTINGS.currentProfile;
  profiles: string[] = DEFAULT_SETTINGS.profiles;
  numberOfWorkingHours: number = DEFAULT_SETTINGS.numberOfWorkingHours;
  isFirstLoad: boolean = DEFAULT_SETTINGS.isFirstLoad;
  // TODO showNotifications

  constructor(data: any) {
    super();
    this.load(data);
    makeObservable(this, {
      currentProfile: observable,
      profiles: observable,
      numberOfWorkingHours: observable,
      isFirstLoad: observable,
    });
  }
}
