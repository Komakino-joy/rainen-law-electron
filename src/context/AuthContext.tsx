import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ipc } from '~/constants/ipcEvents';
import { UserCredentials } from '~/contracts';
export type User = {
  id: number;
  username: string;
  f_name: string;
  l_name: string;
  isAdmin: Boolean;
} | null;

type ContextType = {
  user: User;
  login: (user: UserCredentials) => Promise<void>;
  logout: () => void;
  isLoadingAuthContext: boolean;
};

const defaultContext: ContextType = {
  user: null,
  login: async () => {},
  logout: async () => {},
  isLoadingAuthContext: false,
};

export const AuthContext = createContext<ContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoadingAuthContext, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // check if the user is logged in on initial render
  useEffect(() => {
    setIsLoading(true);
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  // log in the user
  const login = async (userData: UserCredentials) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => {
        window.electron.ipcRenderer.sendMessage(ipc.postLogin, userData);
        window.electron.ipcRenderer.once(
          ipc.postLogin,
          ({ user, status, message }) => {
            if (status === 'success') {
              localStorage.setItem('user', JSON.stringify(user));
              setUser(user);
              resolve('');
            } else {
              resolve(toast.error(message, { id: 'invalid-credentials' }));
            }
          },
        );
      });
    } finally {
      setIsLoading(false);
      navigate('/');
    }
  };

  // log out the user
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoadingAuthContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const auth = React.useContext(AuthContext);
  if (!auth) {
    throw new Error('You must use this hook within the AuthProvider');
  }
  return auth;
};

export const useUser = () => {
  const auth = React.useContext(AuthContext);
  return auth.user ?? null;
};

export const useIsAdmin = () => {
  const auth = React.useContext(AuthContext);
  return auth.user?.isAdmin ?? false;
};

export const useIsloggedIn = () => {
  const auth = React.useContext(AuthContext);
  return auth.user ? true : false;
};

export const useIsLoadingAuth = () => {
  const auth = React.useContext(AuthContext);
  return auth.isLoadingAuthContext;
};
