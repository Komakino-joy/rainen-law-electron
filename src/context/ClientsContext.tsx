import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ipc } from '~/constants/ipcEvents';
import { Client, LabelValuePair } from '~/contracts';
import { hasValue, uniqueLabelValuePairs } from '~/utils';
import { useIsloggedIn } from './AuthContext';
import { useIsConnectedToDB } from './DatabaseContext';

interface OwnProps {
  isLoadingClientsContext: boolean;
  clientSelectOptions: {
    c_name: [{ label: string; value: string }];
    c_number: [{ label: string; value: string }];
    c_status: [{ label: string; value: string }];
    c_contact: [{ label: string; value: string }];
    c_statement_addressee: [{ label: string; value: string }];
    c_city: [{ label: string; value: string }];
    c_state: [{ label: string; value: string }];
    c_zip: [{ label: string; value: string }];
    c_phone: [{ label: string; value: string }];
    c_fax: [{ label: string; value: string }];
    c_email: [{ label: string; value: string }];
  };
}

const ClientsContext = createContext<OwnProps>({
  isLoadingClientsContext: false,
  clientSelectOptions: {
    c_name: [{ label: '', value: '' }],
    c_number: [{ label: '', value: '' }],
    c_status: [{ label: '', value: '' }],
    c_contact: [{ label: '', value: '' }],
    c_statement_addressee: [{ label: '', value: '' }],
    c_city: [{ label: '', value: '' }],
    c_state: [{ label: '', value: '' }],
    c_zip: [{ label: '', value: '' }],
    c_phone: [{ label: '', value: '' }],
    c_fax: [{ label: '', value: '' }],
    c_email: [{ label: '', value: '' }],
  },
});

export const ClientsContextProvider = ({ children }: { children: any }) => {
  const [isLoadingClientsContext, setIsLoading] = useState<boolean>(false);
  const [clientSelectOptions, setclientSelectOptions] = useState<any>([]);

  const mounted = useRef(false);
  const isLoggedIn = useIsloggedIn();
  const isConnectedToDB = useIsConnectedToDB();

  useEffect(() => {
    const httpFetchClientInfo = async () => {
      mounted.current = true;

      setIsLoading(true);

      // These are the only fields we care to make into Options for Select component
      const fields = [
        'c_name',
        'c_number',
        'c_status',
        'c_contact',
        'c_statement_addressee',
        'c_city',
        'c_state',
        'c_zip',
        'c_phone',
        'c_fax',
        'c_email',
      ];

      window.electron.ipcRenderer.sendMessage(ipc.getAllClients);
      window.electron.ipcRenderer.once(ipc.getAllClients, (response) => {
        const clientsObject = response.reduce((acc: any, row: Client) => {
          // Iterate through our fields and see if we have assigned a value for each property in our accumulator
          // Assign empty array if no value is found
          for (let i = 0; i < fields.length; i++) {
            if (!acc[fields[i]]) {
              acc[fields[i]] = [];
            }
          }

          type clientKey = keyof typeof row;

          // Iterate through our fields and push to our accumulator arrays
          for (let i = 0; i < fields.length; i++) {
            if (hasValue(row[fields[i] as clientKey])) {
              acc[fields[i]].push({
                label: row[fields[i] as clientKey],
                value: row[fields[i] as clientKey],
              });
            }
          }

          return acc;
        }, {});

        // Remove all duplicate objects from our new arrays
        Object.keys(clientsObject).map(
          (key) =>
            (clientsObject[key] = uniqueLabelValuePairs(clientsObject[key])),
        );

        clientsObject.c_number.sort(function (
          a: LabelValuePair,
          b: LabelValuePair,
        ) {
          return a.value - b.value;
        });

        setclientSelectOptions(clientsObject);
        setIsLoading(false);
      });
    };

    if (mounted && isLoggedIn && isConnectedToDB) {
      httpFetchClientInfo();
    }

    return () => {
      mounted.current = false;
    };
  }, [isLoggedIn, isConnectedToDB]);

  return (
    <ClientsContext.Provider
      value={{ clientSelectOptions, isLoadingClientsContext }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

export const useClientsContext = () => useContext(ClientsContext);
