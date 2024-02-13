import { ipc } from '../constants/ipcEvents';
import { postClientsPage } from '../model/clients/postClientsPage';
import { postPropertiesPage } from '../model/properties/postPropertiesPage';
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
import { getAllUsers } from '../model/users/getAllUsers';
import { postDeleteUser } from '../model/users/postDeleteUser';
import { postInsertUser } from '../model/users/postInsertUser';
import { postSelectedUser } from '../model/users/postSelectedUser';
import { postUpdateUser } from '../model/users/postUpdateUser';
import { postDeleteExaminer } from '../model/examiners/postDeleteExaminer';
import { postInsertExaminer } from '../model/examiners/postInsertExaminer';
import { postSelectedExaminer } from '../model/examiners/postSelectedExaminer';
import { postUpdateExaminer } from '../model/examiners/postUpdateExaminer';
import { postDeleteDropDownOption } from '../model/management/postDeleteDropDownOption';
import { postInsertDropDownOption } from '../model/management/postInsertDropDownOption';
import { postUpdateDropDownOption } from '../model/management/postUpdateDropDownOptions';
import { postSelectedDropDownOption } from '../model/management/postSelectedDropDownOption';
import { getDistinctTypeOptions } from '../model/properties/getDistinctTypeOptions';
import { getDistinctAssignOptions } from '../model/properties/getDistinctAssignOptions';
import { getDistinctCityOptions } from '../model/properties/getDistinctCityOptions';
import { getDistinctStatusOptions } from '../model/properties/getDistinctStatusOptions';

export function setupIPCListeners() {
  // Auth
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

  // Buyer Seller
  ipcMain.on(ipc.postBuyerSellerInfo, async (event, payload: string) => {
    const response = await postBuyerSellerInfo(payload);
    event.reply(ipc.postBuyerSellerInfo, response);
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

  ipcMain.on(
    ipc.postClientsPage,
    async (event, { page, filters }: { page: string; filters: string }) => {
      const response = await postClientsPage(page, filters);
      event.reply(ipc.postClientsPage, response);
    },
  );

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

  ipcMain.on(
    ipc.postPropertiesPage,
    async (event, { page, filters }: { page: string; filters: string }) => {
      const response = await postPropertiesPage(page, filters);
      event.reply(ipc.postPropertiesPage, response);
    },
  );

  ipcMain.on(ipc.postUpdateProperty, async (event, payload: Property) => {
    const response = await postUpdateProperty(payload);
    event.reply(ipc.postUpdateProperty, response);
  });

  ipcMain.on(ipc.getNewCompRef, async (event) => {
    const response = await getNewCompRef();
    event.reply(ipc.getNewCompRef, response);
  });

  ipcMain.on(ipc.getDistinctCityOptions, async (event) => {
    const response = await getDistinctCityOptions();
    event.reply(ipc.getDistinctCityOptions, response);
  });

  ipcMain.on(ipc.getDistinctPropertyTypeOptions, async (event) => {
    const response = await getDistinctTypeOptions();
    event.reply(ipc.getDistinctPropertyTypeOptions, response);
  });

  ipcMain.on(ipc.getDistinctStatusOptions, async (event) => {
    const response = await getDistinctStatusOptions();
    event.reply(ipc.getDistinctStatusOptions, response);
  });

  ipcMain.on(ipc.getDistinctAssignOptions, async (event) => {
    const response = await getDistinctAssignOptions();
    event.reply(ipc.getDistinctAssignOptions, response);
  });

  // Examiners
  ipcMain.on(ipc.getExaminers, async (event) => {
    const response = await getExaminers();
    event.reply(ipc.getExaminers, response);
  });

  ipcMain.on(ipc.postDeleteExaminer, async (event, payload) => {
    const response = await postDeleteExaminer(payload);
    event.reply(ipc.postDeleteExaminer, response);
  });

  ipcMain.on(ipc.postInsertExaminer, async (event, payload) => {
    const response = await postInsertExaminer(payload);
    event.reply(ipc.postInsertExaminer, response);
  });

  ipcMain.on(ipc.postSelectedExaminer, async (event, payload) => {
    const response = await postSelectedExaminer(payload);
    event.reply(ipc.postSelectedExaminer, response);
  });

  ipcMain.on(ipc.postUpdateExaminer, async (event, payload) => {
    const response = await postUpdateExaminer(payload);
    event.reply(ipc.postUpdateExaminer, response);
  });

  // Management
  ipcMain.on(ipc.getDropDownOptions, async (event) => {
    const response = await getSelectDropDownOptions();
    event.reply(ipc.getDropDownOptions, response);
  });

  ipcMain.on(ipc.postDeleteDropDownOption, async (event, payload) => {
    const response = await postDeleteDropDownOption(payload);
    event.reply(ipc.postDeleteDropDownOption, response);
  });

  ipcMain.on(ipc.postInsertDropDownOption, async (event, payload) => {
    const response = await postInsertDropDownOption(payload);
    event.reply(ipc.postInsertDropDownOption, response);
  });

  ipcMain.on(ipc.postSelectedDropDownOption, async (event, payload) => {
    const response = await postSelectedDropDownOption(payload);
    event.reply(ipc.postSelectedDropDownOption, response);
  });

  ipcMain.on(ipc.postUpdateDropDownOption, async (event, payload) => {
    const response = await postUpdateDropDownOption(payload);
    event.reply(ipc.postUpdateDropDownOption, response);
  });

  // Titles
  ipcMain.on(ipc.postInsTitlesInfo, async (event, payload: string) => {
    const response = await postInsTitlesInfo(payload);
    event.reply(ipc.postInsTitlesInfo, response);
  });

  // Users
  ipcMain.on(ipc.getAllUsers, async (event) => {
    const response = await getAllUsers();
    event.reply(ipc.getAllUsers, response);
  });

  ipcMain.on(ipc.postDeleteUser, async (event, payload) => {
    const response = await postDeleteUser(payload);
    event.reply(ipc.postDeleteUser, response);
  });

  ipcMain.on(ipc.postInsertUser, async (event, payload) => {
    const response = await postInsertUser(payload);
    event.reply(ipc.postInsertUser, response);
  });

  ipcMain.on(ipc.postSelectedUser, async (event, payload) => {
    const response = await postSelectedUser(payload);
    event.reply(ipc.postSelectedUser, response);
  });

  ipcMain.on(ipc.postUpdateUser, async (event, payload) => {
    const response = await postUpdateUser(payload);
    event.reply(ipc.postUpdateUser, response);
  });
}
