import { ipc } from '~/constants/ipcEvents';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useIsConnectedToDB } from './DatabaseContext';

interface OwnProps {
  isLoadingUserscontext: boolean;
  usersList: any[];
}

const UsersContext = createContext<OwnProps>({
  isLoadingUserscontext: false,
  usersList: [],
});

export const UsersContextProvider = ({ children }: { children: any }) => {
  const isConnectedToDB = useIsConnectedToDB();
  const [isLoadingUserscontext, setIsLoading] = useState<boolean>(false);
  const [usersList, setUsersList] = useState([]);

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    async function fetchUsersContext() {
      setIsLoading(true);
      await window.electron.ipcRenderer.sendMessage(ipc.getAllUsers);
      await window.electron.ipcRenderer.once(ipc.getAllUsers, (users) => {
        setUsersList(users);
      });
      setIsLoading(false);
    }

    if (mounted.current && isConnectedToDB) fetchUsersContext();

    return () => {
      mounted.current = false;
    };
  }, [isConnectedToDB]);

  return (
    <UsersContext.Provider
      value={{
        usersList,
        isLoadingUserscontext,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => useContext(UsersContext);
