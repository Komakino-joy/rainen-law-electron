import { createRoot } from 'react-dom/client';
import App from './App';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '~/context/AuthContext';
import { ClientsContextProvider } from '~/context/ClientsContext';
import { DatabaseContextProvider } from '~/context/DatabaseContext';
import { ExaminersContextProvider } from '~/context/ExaminersContext';
import { SelectDropDownsContextProvider } from '~/context/SelectDropDownsContext';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <>
    <BrowserRouter>
      <DatabaseContextProvider>
        <AuthProvider>
          <SelectDropDownsContextProvider>
            <ClientsContextProvider>
              <ExaminersContextProvider>
                <App />
              </ExaminersContextProvider>
            </ClientsContextProvider>
          </SelectDropDownsContextProvider>
        </AuthProvider>
      </DatabaseContextProvider>
    </BrowserRouter>
    <Toaster />
  </>,
);
