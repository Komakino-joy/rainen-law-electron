// // Disable no-unused-vars, broken for spread args
// /* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'ipc-example'
  | 'checkDBConnection'
  | 'connectDB'
  | 'postLogin'
  | 'postBuyerSellerInfo'
  | 'postDeleteClient'
  | 'getLatestUpdatedProperties'
  | 'postDeleteProperty'
  | 'postInsertProperty'
  | 'postSelectedProperty'
  | 'postPropertiesInfo'
  | 'postUpdateProperty'
  | 'postDeleteUser'
  | 'postInsertUser'
  | 'postSelectedUser'
  | 'postUpdateUser'
  | 'getNewCompRef'
  | 'getAllClients'
  | 'getAllUsers'
  | 'getLatestUpdatedClients'
  | 'postInsertClient'
  | 'postSelectedClient'
  | 'postUpdateClient'
  | 'getExaminers'
  | 'getDropDownOptions'
  | 'postInsTitlesInfo'
  | 'postInsertDropDownOptions'
  | 'postSelectedDropDownOptions'
  | 'postUpdateDropDownOptions';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  printComponent: async (url, callback) => {
    let response = await ipcRenderer.invoke('printComponent', url);
    callback(response);
  },
  previewComponent: async (url, callback) => {
    let response = await ipcRenderer.invoke('previewComponent', url);
    callback(response);
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
