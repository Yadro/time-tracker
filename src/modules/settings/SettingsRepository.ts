import AbstractFileRepository from '../../base/repositories/AbstractFileRepository';
import { schemaMigrations } from './migrations';

export default class SettingsRepository extends AbstractFileRepository {
  saveInRoot = true;
  fileName = 'settings.json';
  schemaMigrations = schemaMigrations;
}
