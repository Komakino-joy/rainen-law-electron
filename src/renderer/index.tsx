import { createRoot } from 'react-dom/client';
import App from './App';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '~/context/AuthContext';
import { CitiesProvider } from '~/context/CitiesContext';
import { ClientsContextProvider } from '~/context/ClientsContext';
import { DatabaseContextProvider } from '~/context/DatabaseContext';
import { ExaminersContextProvider } from '~/context/ExaminersContext';
import { PropertiesContextProvider } from '~/context/PropertiesContext';
import { SelectDropDownsContextProvider } from '~/context/SelectDropDownsContext';
import { UsersContextProvider } from '~/context/UsersContext';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <>
    <BrowserRouter>
      <DatabaseContextProvider>
        <AuthProvider>
          <UsersContextProvider>
            <ExaminersContextProvider>
              <SelectDropDownsContextProvider>
                <CitiesProvider>
                  <ClientsContextProvider>
                    <PropertiesContextProvider>
                      <App />
                    </PropertiesContextProvider>
                  </ClientsContextProvider>
                </CitiesProvider>
              </SelectDropDownsContextProvider>
            </ExaminersContextProvider>
          </UsersContextProvider>
        </AuthProvider>
      </DatabaseContextProvider>
    </BrowserRouter>
    <Toaster />
    <div id="modal-root"></div>
  </>,
);
