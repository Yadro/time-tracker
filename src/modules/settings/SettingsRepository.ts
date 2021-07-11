import AbstractFileRepository from '../../base/repositories/AbstractFileRepository';

export default class SettingsRepository extends AbstractFileRepository {
  saveInRoot = true;
  fileName = 'settings.json';
}
