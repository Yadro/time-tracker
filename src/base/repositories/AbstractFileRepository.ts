const fs = require('fs');
const path = require('path');

import FsHelper from '../../helpers/FsHelper';

const APP_FOLDER = 'YadroTimeTracker';
const PROFILE_FOLDER = 'profile1';

export default abstract class AbstractFileRepository<T = any> {
  folderWithProfile: string = 'profile1';
  fileName: string = 'defaultFileName.json';

  private static get appDataFolder() {
    return process.env.APPDATA || '';
  }

  private static get profileFolder() {
    return path.join(
      AbstractFileRepository.appDataFolder,
      APP_FOLDER,
      PROFILE_FOLDER
    );
  }

  private get filePath() {
    return path.join(AbstractFileRepository.profileFolder, this.fileName);
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
    FsHelper.mkdirIfNotExists(AbstractFileRepository.profileFolder);
    return FsHelper.writeFile(this.filePath, data);
  }
}
