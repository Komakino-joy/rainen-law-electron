import { ipc } from '~/constants/ipcEvents';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useIsConnectedToDB } from './DatabaseContext';
import toast from 'react-hot-toast';

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
      try {
        setIsLoading(true);
        await new Promise((resolve) => {
          window.electron.ipcRenderer.sendMessage(ipc.getAllUsers);
          window.electron.ipcRenderer.once(
            ipc.getAllUsers,
            ({ users, status, message }) => {
              if (status === 'success') {
                setUsersList(users);
              } else {
                toast[status](message, { id: 'get-all-users' });
              }
              resolve('');
            },
          );
        });
      } finally {
        setIsLoading(false);
      }
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
