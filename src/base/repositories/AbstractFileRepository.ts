const fs = require('fs');

export default abstract class AbstractFileRepository<T = any> {
  folder: string = 'profile1';
  fileName: string = 'defaultFileName.json';

  get path() {
    return `${this.folder}/${this.fileName}`;
  }

  public restore(defaultValue: T): T {
    if (fs.existsSync(this.path)) {
      const data = fs.readFileSync(this.path);
      return JSON.parse(data);
    }
    return defaultValue;
  }

  public save(data: T) {
    if (!fs.existsSync(this.folder)) {
      fs.mkdirSync(this.folder);
    }
    fs.writeFileSync(this.path, JSON.stringify(data), 'utf-8');
  }
}
