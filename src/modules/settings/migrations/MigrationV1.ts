import { SettingsV0 } from '../types/SettingsV0';
import { SettingsV1 } from '../types/SettingsV1';

export default function migration(data: SettingsV0): SettingsV1 {
  return Object.assign({}, data, {
    __version: 1,
  });
}
