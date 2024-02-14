import { ipc } from '@/constants/ipcEvents';
import {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { LabelValuePair } from '~/contracts';
import { useIsConnectedToDB } from './DatabaseContext';

interface OwnProps {
  isLoadingPropertyContext: boolean;
  setShouldFetch: Dispatch<boolean>;
  propertiesSelectOptions: {
    p_city: LabelValuePair[];
    p_type: LabelValuePair[];
    p_status: LabelValuePair[];
    p_assign: LabelValuePair[];
  };
}

const PropertiesContext = createContext<OwnProps>({
  isLoadingPropertyContext: false,
  setShouldFetch: () => {},
  propertiesSelectOptions: {
    p_city: [],
    p_type: [],
    p_status: [],
    p_assign: [],
  },
});

export const PropertiesContextProvider = ({ children }: { children: any }) => {
  const isConnectedToDB = useIsConnectedToDB();
  const [shouldFetch, setShouldFetch] = useState(true);
  const [isLoadingPropertyContext, setIsLoading] = useState<boolean>(false);
  const [propResponseMap, setPropResponseMap] = useState({});

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    async function fetchPropertiesContext() {
      setIsLoading(true);
      const cities = await new Promise((resolve) => {
        window.electron.ipcRenderer.sendMessage(ipc.getDistinctCityOptions);

        window.electron.ipcRenderer.once(ipc.getDistinctCityOptions, (cities) =>
          resolve(cities),
        );
      });

      const types = await new Promise((resolve) => {
        window.electron.ipcRenderer.sendMessage(
          ipc.getDistinctPropertyTypeOptions,
        );
        window.electron.ipcRenderer.once(
          ipc.getDistinctPropertyTypeOptions,
          (types) => resolve(types),
        );
      });

      const statuses = await new Promise((resolve) => {
        window.electron.ipcRenderer.sendMessage(ipc.getDistinctStatusOptions);
        window.electron.ipcRenderer.once(
          ipc.getDistinctStatusOptions,
          (statuses) => resolve(statuses),
        );
      });

      const assignTypes = await new Promise((resolve) => {
        window.electron.ipcRenderer.sendMessage(ipc.getDistinctAssignOptions);
        window.electron.ipcRenderer.once(
          ipc.getDistinctAssignOptions,
          (assignTypes) => resolve(assignTypes),
        );
      });

      setPropResponseMap((prevState) => ({
        ...prevState,
        p_city: cities,
        p_type: types,
        p_status: statuses,
        p_assign: assignTypes,
      }));

      setIsLoading(false);
      setShouldFetch(false);
    }

    if (mounted.current && isConnectedToDB && shouldFetch)
      fetchPropertiesContext();

    return () => {
      mounted.current = false;
    };
  }, [isConnectedToDB, shouldFetch]);

  const propertiesSelectOptions = Object.keys(propResponseMap).reduce(
    (acc: any, fieldName: any) => {
      acc[fieldName] = propResponseMap[fieldName].map((field: any) => ({
        label: field[fieldName],
        value: field[fieldName],
      }));
      return acc;
    },
    {},
  );

  return (
    <PropertiesContext.Provider
      value={{
        setShouldFetch,
        propertiesSelectOptions,
        isLoadingPropertyContext,
      }}
    >
      {children}
    </PropertiesContext.Provider>
  );
};

export const usePropertiesContext = () => useContext(PropertiesContext);

export const useFetchPropertiesLists = () => {
  const properties = useContext(PropertiesContext);
  return () => properties.setShouldFetch(true);
};
