import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from '~/components/NavBar/NavBar';
import { useIsloggedIn, useIsLoadingAuth } from '~/context/AuthContext';
import {
  useIsConnectedToDB,
  useIsLoadingDBContext,
} from '~/context/DatabaseContext';
import AuthPage from '~/pages/auth';
import AddNewClientPage from '~/pages/clients/AddNewClientPage';
import HomePage from '~/pages/home/HomePage';
import '~/styles/confirm-alert.scss';
import '~/styles/home.scss';
import '~/styles/forms.scss';
import '~/styles/globals.scss';
import '~/styles/layout.scss';
import '~/styles/pages.scss';
import '~/styles/tables.scss';

export default function App() {
  const isLoggedIn = useIsloggedIn();
  const isConnectedToDB = useIsConnectedToDB();
  const isLoadingAuth = useIsLoadingAuth();
  const isLoadingDB = useIsLoadingDBContext();

  if (isLoadingAuth || isLoadingDB) {
    return <h1>Loading...</h1>;
  }

  if (!isLoggedIn || !isConnectedToDB) {
    return <AuthPage />;
  }

  const homePaths = ['/', '/main_window', '/index.html'];

  return (
    <div className="app">
      <NavBar />
      <Routes>
        {homePaths.map((path) => (
          <Route key={path} path={path} Component={HomePage} />
        ))}
        <Route path="/clients/add-new" Component={AddNewClientPage} />
      </Routes>
    </div>
  );
}
