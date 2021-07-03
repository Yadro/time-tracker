const fs = require('fs');
const path = require('path');

import FsHelper from '../../helpers/FsHelper';

const APP_DIR = 'YadroTimeTracker';

export default abstract class AbstractFileRepository<T = any> {
  dirWithProfileData: string = 'profile1';
  fileName: string = 'defaultFileName.json';
  saveInRoot: boolean = false;

  private logPrefix = `Repository[${this.fileName}]:`;

  private static get appDataFolder() {
    return process.env.APPDATA || '';
  }

  private get destFolder() {
    const pathItems = [AbstractFileRepository.appDataFolder, APP_DIR];
    if (!this.saveInRoot) {
      pathItems.push(this.dirWithProfileData);
    }
    return path.join(...pathItems);
  }

  private get filePath() {
    return path.join(this.destFolder, this.fileName);
  }

  public setProfile(profile: string | null) {
    if (profile) {
      this.dirWithProfileData = profile;
      console.log(`${this.logPrefix} set profile=${profile}`);
    } else {
      console.error(`${this.logPrefix} set profile=null`);
    }
  }

  public restore(defaultValue: T): T {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath);
      // TODO handle parse error. Backup file with issues and return defaultValue
      return JSON.parse(data);
    }
    return defaultValue;
  }

  public save(data: T) {
    FsHelper.mkdirIfNotExists(this.destFolder);
    return FsHelper.writeFile(this.filePath, data);
  }
}
