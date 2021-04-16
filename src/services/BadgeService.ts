import { ipcRenderer } from 'electron';

export default class BadgeService {
  static setBadge(showBadge: boolean) {
    ipcRenderer.sendSync('update-badge', showBadge ? 1 : null);
  }
}
