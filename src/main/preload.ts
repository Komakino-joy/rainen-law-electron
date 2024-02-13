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
};

contextBridge.exposeInMainWorld('electron', electronHandler);

// export type ElectronHandler = typeof electronHandler;
// Import necessary dependencies
// import { contextBridge, ipcMain, IpcMainEvent } from 'electron';

// // Define IPC channels
// type IPCChannels =
//   | 'checkDBConnection'
//   | 'connectDB'
//   | 'postLogin'
//   | 'postBuyerSellerInfo'
//   | 'postDeleteClient'
//   | 'getLatestUpdatedProperties'
//   | 'postDeleteProperty'
//   | 'postInsertProperty'
//   | 'postSelectedProperty'
//   | 'postPropertiesInfo'
//   | 'postUpdateProperty'
//   | 'getNewCompRef'
//   | 'getAllClients'
//   | 'getLatestUpdatedClients'
//   | 'postInsertClient'
//   | 'postSelectedClient'
//   | 'postUpdateClient'
//   | 'getExaminers'
//   | 'getDropDownOptions'
//   | 'postInsTitlesInfo';

// // Define IPC event handler functions
// const ipcHandlers = {
//   checkDBConnection(event: IpcMainEvent) {
//     ipcMain.on('checkDBConnection', async () => {
//       const isConnectedToDB = await checkConnection();
//       event.reply('checkDBConnection', { isConnectedToDB });
//     });
//   },
//   connectDB(event: IpcMainEvent) {
//     ipcMain.on('connectDB', async (payload: DBCredentials) => {
//       const isConnectedToDB = await connectToDB(payload);
//       event.reply('connectDB', { isConnectedToDB });
//     });
//   },
//   postLogin(event: IpcMainEvent) {
//     ipcMain.on('postLogin', async (payload: UserCredentials) => {
//       const authResponse = await postLogin(payload);
//       event.reply('postLogin', { authResponse });
//     });
//   },
//   // Add more IPC event handlers similarly
// };

// // Loop through each IPC handler and expose it using context bridge
// Object.entries(ipcHandlers).forEach(([channel, handler]) => {
//   ipcMain.on(channel as IPCChannels, handler);
// });

// // Expose handlers to the main world
// contextBridge.exposeInMainWorld('electron', {
//   ipcMain: {
//     on(channel: IPCChannels, listener: (...args: any[]) => void) {
//       ipcMain.on(channel, listener);
//     },
//     once(channel: IPCChannels, listener: (...args: any[]) => void) {
//       ipcMain.once(channel, listener);
//     },
//     removeListener(channel: IPCChannels, listener: (...args: any[]) => void) {
//       ipcMain.removeListener(channel, listener);
//     },
//   },
// });

// // Define types
// interface DBCredentials {
//   // Define DBCredentials interface
// }

// interface UserCredentials {
//   // Define UserCredentials interface
// }

// // Define dummy functions for compilation
// async function checkConnection(): Promise<boolean> {
//   return true;
// }

// async function connectToDB(credentials: DBCredentials): Promise<boolean> {
//   return true;
// }

// async function postLogin(credentials: UserCredentials): Promise<any> {
//   return {};
// }

// Add other functions similarly
