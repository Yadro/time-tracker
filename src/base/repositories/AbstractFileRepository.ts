import { EChannels } from '../../main/EChannels';

const fs = require('fs');
const path = require('path');
import { ipcRenderer } from 'electron';

import FsHelper from '../../helpers/FsHelper';
import PromiseQueue from '../../helpers/PromiseQueueHelper';
import { SchemaMigration } from '../../types/SchemaMigration';

const APP_DIR =
  process.env.NODE_ENV === 'development'
    ? 'YadroTimeTracker_test'
    : 'YadroTimeTracker';

let _appDataPath: string = '';

export default abstract class AbstractFileRepository<T = any> {
  dirWithProfileData: string = 'profile1';
  fileName: string = 'defaultFileName.json';
  saveInRoot: boolean = false;
  schemaMigrations: SchemaMigration[] = [];

  private writeFileQueue = new PromiseQueue();

  private get logPrefix() {
    const filePath = !this.saveInRoot ? this.dirWithProfileData : '';
    return `FileRepository [${filePath}/${this.fileName}]:`;
  }

  static get appDataFolder() {
    if (_appDataPath) {
      return _appDataPath;
    }
    _appDataPath = ipcRenderer.sendSync(EChannels.GetPathUserData);
    return _appDataPath;
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

  public setProfile(profile: string) {
    this.dirWithProfileData = profile;
  }

  public restore(defaultValue: T): T {
    console.log(`${this.logPrefix} restore ${this.filePath}`);
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, { encoding: 'utf-8' });
      // TODO handle parse error. Backup file with issues and return defaultValue
      const parsedData = JSON.parse(data);
    }
    return defaultValue;
  }

  public save(data: T) {
    FsHelper.mkdirIfNotExists(this.destFolder);
    this.writeFileQueue.add(() => {
      console.log(`${this.logPrefix} save`);
      return FsHelper.writeFile(this.filePath, data).catch(() => {
        console.error(`${this.logPrefix} can't save file '${this.filePath}'`);
      });
    });
    this.writeFileQueue.execute();
  }
}
