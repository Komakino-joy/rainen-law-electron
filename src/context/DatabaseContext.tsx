import React, { useEffect } from 'react';
import { Dispatch, createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { ipc } from '~/constants/ipcEvents';
import { DBCredentials } from '~/model/dbconfig';

interface OwnProps {
  connectToDB: (credentials: DBCredentials) => void;
  isConnectedToDB: boolean;
  isLoadingDBContext: boolean;
  setIsConnectedToDB: Dispatch<boolean>;
}

const DatabaseContext = createContext<OwnProps>({
  connectToDB: () => {},
  isConnectedToDB: false,
  isLoadingDBContext: false,
  setIsConnectedToDB: () => {},
});

export const DatabaseContextProvider = ({ children }: { children: any }) => {
  const [isConnectedToDB, setIsConnectedToDB] = useState<boolean>(false);
  const [isLoadingDBContext, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    window.electron.ipcRenderer.sendMessage(ipc.checkDBConnection);
    window.electron.ipcRenderer.once(
      ipc.checkDBConnection,
      ({ isConnectedToDB }) => {
        setIsConnectedToDB(isConnectedToDB);
      },
    );
    setIsLoading(false);
  }, []);

  const connectToDB = (credentials: DBCredentials) => {
    setIsLoading(true);
    console.log(credentials);
    window.electron.ipcRenderer.sendMessage(ipc.connectDB, credentials);
    window.electron.ipcRenderer.once(ipc.connectDB, ({ isConnectedToDB }) => {
      if (!isConnectedToDB)
        toast.error('Authentication failed', { id: 'DB auth' });
      setIsConnectedToDB(isConnectedToDB);
    });
    setIsLoading(false);
  };

  return (
    <DatabaseContext.Provider
      value={{
        connectToDB,
        isConnectedToDB,
        isLoadingDBContext,
        setIsConnectedToDB,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabaseContext = () => useContext(DatabaseContext);

export const useIsConnectedToDB = () => {
  const { isConnectedToDB } = React.useContext(DatabaseContext);
  return isConnectedToDB ?? false;
};

export const useIsLoadingDBContext = () => {
  const { isLoadingDBContext } = React.useContext(DatabaseContext);
  return isLoadingDBContext;
};
