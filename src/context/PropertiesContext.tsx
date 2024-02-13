import { ipc } from '@/constants/ipcEvents';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { LabelValuePair } from '~/contracts';
import { useIsConnectedToDB } from './DatabaseContext';

interface OwnProps {
  isLoadingPropertyContext: boolean;
  propertiesSelectOptions: {
    p_city: LabelValuePair[];
    p_type: LabelValuePair[];
    p_status: LabelValuePair[];
    p_assign: LabelValuePair[];
  };
}

const PropertiesContext = createContext<OwnProps>({
  isLoadingPropertyContext: false,
  propertiesSelectOptions: {
    p_city: [],
    p_type: [],
    p_status: [],
    p_assign: [],
  },
});

export const PropertiesContextProvider = ({ children }: { children: any }) => {
  const isConnectedToDB = useIsConnectedToDB();
  const [isLoadingPropertyContext, setIsLoading] = useState<boolean>(false);
  const [propResponseMap, setPropResponseMap] = useState({});

  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    async function fetchPropertiesContext() {
      setIsLoading(true);

      const propertiesResponseMap = {
        p_city: [],
        p_type: [],
        p_status: [],
        p_assign: [],
      };

      await window.electron.ipcRenderer.sendMessage(ipc.getDistinctCityOptions);
      await window.electron.ipcRenderer.once(
        ipc.getDistinctCityOptions,
        (cities) => {
          propertiesResponseMap.p_city = cities;
        },
      );

      await window.electron.ipcRenderer.sendMessage(
        ipc.getDistinctPropertyTypeOptions,
      );
      await window.electron.ipcRenderer.once(
        ipc.getDistinctPropertyTypeOptions,
        (types) => {
          propertiesResponseMap.p_type = types;
          setPropResponseMap((prevState) => ({
            ...prevState,
            p_type: types,
          }));
        },
      );

      await window.electron.ipcRenderer.sendMessage(
        ipc.getDistinctStatusOptions,
      );
      await window.electron.ipcRenderer.once(
        ipc.getDistinctStatusOptions,
        (statuses) => {
          propertiesResponseMap.p_status = statuses;
        },
      );

      await window.electron.ipcRenderer.sendMessage(
        ipc.getDistinctAssignOptions,
      );
      await window.electron.ipcRenderer.once(
        ipc.getDistinctAssignOptions,
        (assignTypes) => {
          propertiesResponseMap.p_assign = assignTypes;
        },
      );

      setPropResponseMap(propertiesResponseMap);
      setIsLoading(false);
    }

    if (mounted.current && isConnectedToDB) fetchPropertiesContext();

    return () => {
      mounted.current = false;
    };
  }, [isConnectedToDB]);

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
      value={{ propertiesSelectOptions, isLoadingPropertyContext }}
    >
      {children}
    </PropertiesContext.Provider>
  );
};

export const usePropertiesContext = () => useContext(PropertiesContext);
