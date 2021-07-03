import IService from '../../base/IService';
import SettingsModel, { DEFAULT_SETTINGS } from './models/SettingsModel';
import SettingsFactory from './SettingsFactory';
import SettingsRepository from './SettingsRepository';

export default class SettingsService implements IService<SettingsModel> {
  private repository: SettingsRepository = new SettingsRepository();
  private factory: SettingsFactory = new SettingsFactory();

  getAll(): SettingsModel {
    const settings = this.repository.restore(DEFAULT_SETTINGS);
    return this.factory.create(SettingsModel, settings);
  }

  save(data: SettingsModel): void {
    this.repository.save(data);
  }
}
