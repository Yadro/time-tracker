import { makeAutoObservable } from 'mobx';
import SettingsModel, { DEFAULT_SETTINGS } from './models/SettingsModel';
import SettingsService from './SettingsService';

export default class SettingsStore {
  settings: SettingsModel = new SettingsModel(DEFAULT_SETTINGS);

  private service: SettingsService = new SettingsService();

  constructor() {
    makeAutoObservable(this);
  }

  setActiveProfile(profile: string) {
    this.settings.currentProfile = profile;
    this.service.save(this.settings);
  }

  restore() {
    this.settings = this.service.getAll();
  }
}
