import { makeAutoObservable } from 'mobx';

import SettingsModel, { DEFAULT_SETTINGS } from './models/SettingsModel';
import SettingsService from './SettingsService';
import { RootStore } from '../RootStore';
import { ISettings } from './models/ISettings';

export default class SettingsStore {
  settings: SettingsModel = new SettingsModel(DEFAULT_SETTINGS);

  private service: SettingsService = new SettingsService();

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  addProfile(profile: string) {
    this.settings.profiles.push(profile);
    this.service.save(this.settings);
  }

  setSettings(newSettings: ISettings) {
    const {
      currentProfile,
      numberOfWorkingHours,
      showNotifications,
    } = newSettings;

    this.settings.numberOfWorkingHours = numberOfWorkingHours;
    this.settings.showNotifications = showNotifications;
    this.rootStore.tasksStore.removeReminder();
    this.setActiveProfile(currentProfile);
    this.service.save(this.settings);
  }

  setActiveProfile(profile: string) {
    if (profile === this.settings.currentProfile) {
      return;
    }
    this.rootStore.tasksStore.stopTimer();
    this.settings.currentProfile = profile;
    this.service.save(this.settings);
    setTimeout(() => {
      this.rootStore.loadTaskAndProjects();
    });
  }

  restore() {
    this.settings = this.service.getAll();
  }
}
