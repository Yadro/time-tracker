// main process
import { ipcMain, app } from 'electron';

import { EChannels } from './EChannels';

ipcMain.on(EChannels.GetPathUserData, (event) => {
  event.returnValue = app.getPath('appData');
});
