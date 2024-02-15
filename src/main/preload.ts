// // Disable no-unused-vars, broken for spread args
// /* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = string;

export interface ElectronHandler {
  store: {
    get(key: string): any;
    set(property: string, val: any): void;
    // Add other methods like has(), reset(), etc. here
  };
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: any[]): void;
    on(channel: Channels, func: (...args: any[]) => void): () => void;
    once(channel: Channels, func: (...args: any[]) => void): void;
  };
  printComponent(url: string, callback: (response: any) => void): Promise<void>;
  previewComponent(
    url: string,
    callback: (response: any) => void,
  ): Promise<void>;
}

const electronHandler = {
  store: {
    get(key) {
      return ipcRenderer.sendSync('electron-store-get', key);
    },
    set(property, val) {
      ipcRenderer.send('electron-store-set', property, val);
    },
    // Other method you want to add like has(), reset(), etc.
  },
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: any[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: any[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: any[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: any[]) => void) {
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
