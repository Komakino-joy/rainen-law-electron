import { Routes, Route } from 'react-router-dom';
import NavBar from '~/components/NavBar/NavBar';
import { useIsloggedIn, useIsLoadingAuth } from '~/context/AuthContext';
import {
  useIsConnectedToDB,
  useIsLoadingDBContext,
} from '~/context/DatabaseContext';
import AuthPage from '~/pages/auth';
import AddNewClientPage from '~/pages/clients/AddNewClientPage';
import SearchClientsPage from '~/pages/clients/search';
import ClientsPage from '~/pages/clients/[page]';
import AddNewPropertyPage from '~/pages/properties/add-new';
import SearchPropertiesPage from '~/pages/properties/search';
import PropertiesPage from '~/pages/properties/[page]';
import HomePage from '~/pages/home/HomePage';
import ManagementPage from '~/pages/management';
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
    return null;
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
        <Route path="/properties/:page" element={<PropertiesPage />} />
        <Route path="/properties/add-new" Component={AddNewPropertyPage} />
        <Route path="/properties/search" Component={SearchPropertiesPage} />
        <Route path="/clients/:page" element={<ClientsPage />} />
        <Route path="/clients/add-new" Component={AddNewClientPage} />
        <Route path="/clients/search" Component={SearchClientsPage} />
        <Route path="/management" Component={ManagementPage} />
      </Routes>
    </div>
  );
}
