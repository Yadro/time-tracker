import { makeObservable, observable } from 'mobx';

import AbstractModel from '../../../base/AbstractModel';
import { SettingsV1 } from '../types/SettingsV1';
import { DEFAULT_SETTINGS } from '../consts';

export default class SettingsModel extends AbstractModel implements SettingsV1 {
  readonly __version: number = 0;
  currentProfile: string = DEFAULT_SETTINGS.currentProfile;
  profiles: string[] = DEFAULT_SETTINGS.profiles;
  numberOfWorkingHours: number = DEFAULT_SETTINGS.numberOfWorkingHours;
  isFirstLoad: boolean = DEFAULT_SETTINGS.isFirstLoad;
  showNotifications: boolean = DEFAULT_SETTINGS.showNotifications;

  constructor(data: SettingsV1) {
    super();
    this.load(data);
    makeObservable(this, {
      currentProfile: observable,
      profiles: observable,
      numberOfWorkingHours: observable,
      isFirstLoad: observable,
      showNotifications: observable,
    });
  }
}
