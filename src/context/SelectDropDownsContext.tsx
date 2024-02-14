import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ipc } from '~/constants/ipcEvents';
import {
  City,
  ClientStatus,
  LabelValuePair,
  PropertyStatus,
  PropertyType,
} from '~/contracts';
import { useIsConnectedToDB } from './DatabaseContext';

interface OwnProps {
  allCitiesList: City[];
  cityDropDownOptions: LabelValuePair[];
  clientStatusDropDownOptions: LabelValuePair[];
  clientStatusList: ClientStatus[];
  countyDropDownOptions: LabelValuePair[];
  distinctCitiesList: Partial<City>[];
  isLoadingSelectDropDownsContext: boolean;
  propertyStatusDropDownOptions: LabelValuePair[];
  propertyStatusList: PropertyStatus[];
  propertyTypeDropDownOptions: LabelValuePair[];
  propertyTypeList: PropertyType[];
}

const SelectDropDownsContext = createContext<OwnProps>({
  allCitiesList: [],
  cityDropDownOptions: [],
  clientStatusDropDownOptions: [],
  clientStatusList: [],
  countyDropDownOptions: [],
  distinctCitiesList: [],
  isLoadingSelectDropDownsContext: false,
  propertyStatusDropDownOptions: [],
  propertyStatusList: [],
  propertyTypeDropDownOptions: [],
  propertyTypeList: [],
});

export const SelectDropDownsContextProvider = ({
  children,
}: {
  children: any;
}) => {
  const isConnectedToDB = useIsConnectedToDB();
  const [isLoadingSelectDropDownsContext, setIsLoading] =
    useState<boolean>(false);
  const [clientStatusList, setClientStatusList] = useState([]);
  const [propertyStatusList, setPropertyStatusList] = useState([]);
  const [propertyTypeList, setPropertyTypeList] = useState([]);
  const [allCitiesList, setAllCitiesList] = useState([]);
  const [distinctCitiesList, setDistinctCitiesList] = useState([]);

  const [clientStatusDropDownOptions, setClientStatusDropDownOptions] =
    useState([]);
  const [propertyStatusDropDownOptions, setPropertyStatusDropDownOptions] =
    useState([]);
  const [propertyTypeDropDownOptions, setPropertyTypeDropDownOptions] =
    useState([]);
  const [cityDropDownOptions, setCityDropDownOptions] = useState([]);
  const [countyDropDownOptions, setCountyDropDownOptions] = useState([]);

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    async function fetchDropdownOptions() {
      setIsLoading(true);

      const values: any = await new Promise((resolve) => {
        window.electron.ipcRenderer.sendMessage(ipc.getDropDownOptions);
        window.electron.ipcRenderer.once(ipc.getDropDownOptions, (response) => {
          resolve(response);
          setIsLoading(false);
        });
      });

      const {
        allCitiesList,
        clientStatusList,
        propertyStatusList,
        propertyTypeList,
        distinctCitiesList,
        distinctCountiesList,
      } = values;

      setClientStatusList(clientStatusList);
      setPropertyStatusList(propertyStatusList);
      setPropertyTypeList(propertyTypeList);
      setAllCitiesList(allCitiesList);
      setDistinctCitiesList(distinctCitiesList);

      setClientStatusDropDownOptions(
        clientStatusList.map((row: ClientStatus) => ({
          label: row.status_desc,
          value: row.status_desc,
        })),
      );
      setPropertyStatusDropDownOptions(
        propertyStatusList.map((row: PropertyStatus) => ({
          label: row.status_desc,
          value: row.status_desc,
        })),
      );
      setPropertyTypeDropDownOptions(
        propertyTypeList.map((row: PropertyType) => ({
          label: row.type_code,
          value: row.type_code,
        })),
      );
      setCityDropDownOptions(
        distinctCitiesList.map((row: Partial<City>) => ({
          label: row.city,
          value: row.city,
        })),
      );
      setCountyDropDownOptions(
        distinctCountiesList.map((row: Partial<City>) => ({
          label: row.county,
          value: row.county,
        })),
      );
    }

    if (mounted.current && isConnectedToDB) fetchDropdownOptions();

    return () => {
      mounted.current = false;
    };
  }, [isConnectedToDB]);

  return (
    <SelectDropDownsContext.Provider
      value={{
        allCitiesList,
        cityDropDownOptions,
        clientStatusDropDownOptions,
        clientStatusList,
        countyDropDownOptions,
        distinctCitiesList,
        isLoadingSelectDropDownsContext,
        propertyStatusDropDownOptions,
        propertyStatusList,
        propertyTypeDropDownOptions,
        propertyTypeList,
      }}
    >
      {children}
    </SelectDropDownsContext.Provider>
  );
};

export const useSelectDropDownsContext = () =>
  useContext(SelectDropDownsContext);
