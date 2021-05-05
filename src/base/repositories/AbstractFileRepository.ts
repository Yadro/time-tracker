const fs = require('fs');
const path = require('path');

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
      return JSON.parse(data);
    }
    return defaultValue;
  }

  public save(data: T) {
    [
      path.join(AbstractFileRepository.appDataFolder, APP_FOLDER),
      AbstractFileRepository.profileFolder,
    ].forEach((p) => AbstractFileRepository.createFolderIfNotExists(p));
    fs.writeFileSync(this.filePath, JSON.stringify(data), 'utf-8');
  }

  private static createFolderIfNotExists(path: string) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  }
}
