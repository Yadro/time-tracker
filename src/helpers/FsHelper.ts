const fs = require('fs');

const FsHelper = {
  writeFile(path: string, data: any) {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(data), 'utf-8', (err: NodeJS.ErrnoException | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
  },
  mkdirIfNotExists(path: string) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  },
};

export default FsHelper;
