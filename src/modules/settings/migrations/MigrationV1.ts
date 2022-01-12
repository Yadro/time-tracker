import { SettingsV0, SettingsV1 } from '../types';

export default function migration(data: SettingsV0): SettingsV1 {
  return Object.assign({}, data, {
    __version: 1,
  });
}
