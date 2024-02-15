import React, { useEffect, useRef } from 'react';
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

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    async function fetchDBConnectionStatus() {
      try {
        setIsLoading(true);
        await new Promise((resolve) => {
          window.electron.ipcRenderer.sendMessage(ipc.checkDBConnection);
          window.electron.ipcRenderer.once(
            ipc.checkDBConnection,
            ({ isConnectedToDB }) => {
              setIsConnectedToDB(isConnectedToDB);
              resolve('');
            },
          );
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (mounted.current) fetchDBConnectionStatus();

    return () => {
      mounted.current = false;
    };
  }, [isConnectedToDB]);

  const connectToDB = async (credentials: DBCredentials) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => {
        window.electron.ipcRenderer.sendMessage(ipc.connectDB, credentials);
        window.electron.ipcRenderer.once(
          ipc.connectDB,
          ({ isConnectedToDB }) => {
            if (!isConnectedToDB) {
              toast.error('Authentication failed', { id: 'DB auth' });
            } else {
              setIsConnectedToDB(isConnectedToDB);
            }
            resolve('');
          },
        );
      });
    } finally {
      setIsLoading(false);
    }
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
