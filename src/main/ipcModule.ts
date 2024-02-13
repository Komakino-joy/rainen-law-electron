// ipcModule.js
import { ipc } from '../constants/ipcEvents';
import { UserCredentials, Property, Client } from '../contracts';
import { postLogin } from '../model/auth/postLogin';
import { postBuyerSellerInfo } from '../model/buyerseller/postBuyerSellerInfo';
import { getAllClients } from '../model/clients/getAllClients';
import { getLatestUpdatedClients } from '../model/clients/getLatestUpdatedClients';
import { postDeleteClient } from '../model/clients/postDeleteClient';
import { postInsertClient } from '../model/clients/postInsertClient';
import { postPropertiesInfo } from '../model/clients/postPropertiesInfo';
import { postSelectedClient } from '../model/clients/postSelectedClient';
import { postUpdateClient } from '../model/clients/postUpdateCleint';
import { DBCredentials, checkConnection, connectToDB } from '../model/dbconfig';
import { getExaminers } from '../model/examiners/getExaminers';
import { getSelectDropDownOptions } from '../model/management/getSelectDropDownOptions';
import { getLatestUpdatedProperties } from '../model/properties/getLatestUpdatedProperties';
import { getNewCompRef } from '../model/properties/getNewCompRef';
import { postDeleteProperty } from '../model/properties/postDeleteProperty';
import { postInsertProperty } from '../model/properties/postInsertProperty';
import { postSelectedProperty } from '../model/properties/postSelectedProperty';
import { postUpdateProperty } from '../model/properties/postUpdateProperty';
import { postInsTitlesInfo } from '../model/titles/postInsTitlesInfo';
import { ipcMain } from 'electron';

export function setupIPCListeners() {
  ipcMain.on(ipc.checkDBConnection, async (event) => {
    const isConnectedToDB = await checkConnection();
    event.reply(ipc.checkDBConnection, { isConnectedToDB });
  });

  ipcMain.on(ipc.connectDB, async (event, payload: DBCredentials) => {
    const isConnectedToDB = await connectToDB(payload);
    event.reply(ipc.connectDB, { isConnectedToDB });
  });

  ipcMain.on(ipc.postLogin, async (event, payload: UserCredentials) => {
    const authResponse = await postLogin(payload);
    event.reply(ipc.postLogin, { authResponse });
  });

  ipcMain.on(ipc.postBuyerSellerInfo, async (event, payload: string) => {
    const response = await postBuyerSellerInfo(payload);
    event.reply(ipc.postBuyerSellerInfo, response);
  });

  ipcMain.on(ipc.postDeleteClient, async (event, payload: string) => {
    const response = await postDeleteClient(payload);
    event.reply(ipc.postDeleteClient, response);
  });

  // Properties
  ipcMain.on(ipc.getLatestUpdatedProperties, async (event) => {
    const properties = await getLatestUpdatedProperties();
    event.reply(ipc.getLatestUpdatedProperties, properties);
  });

  ipcMain.on(ipc.postDeleteProperty, async (event, payload) => {
    const response = await postDeleteProperty(payload);
    event.reply(ipc.postDeleteProperty, response);
  });

  ipcMain.on(ipc.postInsertProperty, async (event, payload: Property) => {
    const response = await postInsertProperty(payload);
    event.reply(ipc.postInsertProperty, response);
  });

  ipcMain.on(ipc.postSelectedProperty, async (event, payload: string) => {
    const response = await postSelectedProperty(payload);
    event.reply(ipc.postSelectedProperty, response);
  });

  ipcMain.on(ipc.postPropertiesInfo, async (event, payload) => {
    const response = await postPropertiesInfo(payload);
    event.reply(ipc.postPropertiesInfo, response);
  });

  ipcMain.on(ipc.postUpdateProperty, async (event, payload: Property) => {
    const response = await postUpdateProperty(payload);
    event.reply(ipc.postUpdateProperty, response);
  });

  ipcMain.on(ipc.getNewCompRef, async (event) => {
    const response = await getNewCompRef();
    event.reply(ipc.getNewCompRef, response);
  });

  // Clients
  ipcMain.on(ipc.getAllClients, async (event) => {
    const response = await getAllClients();
    event.reply(ipc.getAllClients, response.data);
  });

  ipcMain.on(ipc.getLatestUpdatedClients, async (event) => {
    const response = await getLatestUpdatedClients();
    event.reply(ipc.getLatestUpdatedClients, response.data);
  });

  ipcMain.on(ipc.postInsertClient, async (event, payload: Client) => {
    const response = await postInsertClient(payload);
    event.reply(ipc.postInsertClient, response);
  });

  ipcMain.on(ipc.postSelectedClient, async (event, payload: string) => {
    const response = await postSelectedClient(payload);
    event.reply(ipc.postSelectedClient, response.data);
  });

  ipcMain.on(ipc.postUpdateClient, async (event, payload: Client) => {
    const response = await postUpdateClient(payload);
    event.reply(ipc.postUpdateClient, response);
  });

  // Examiners
  ipcMain.on(ipc.getExaminers, async (event) => {
    const response = await getExaminers();
    event.reply(ipc.getExaminers, response);
  });

  // Management
  ipcMain.on(ipc.getDropDownOptions, async (event) => {
    const response = await getSelectDropDownOptions();
    event.reply(ipc.getDropDownOptions, response);
  });

  // Titles
  ipcMain.on(ipc.postInsTitlesInfo, async (event, payload: string) => {
    const response = await postInsTitlesInfo(payload);
    event.reply(ipc.postInsTitlesInfo, response);
  });
}
