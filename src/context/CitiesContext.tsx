import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ipc } from '~/constants/ipcEvents';
import { County } from '~/contracts';
import { useIsConnectedToDB } from './DatabaseContext';

interface CitiesProps {
  isLoadingCities: boolean;
  countyIdMap: any;
  countiesList: any[];
}

const Cities = createContext<CitiesProps>({
  isLoadingCities: false,
  countyIdMap: {},
  countiesList: [],
});

export const CitiesProvider = ({ children }: { children: any }) => {
  const isConnectedToDB = useIsConnectedToDB();
  const [isLoadingCities, setIsLoading] = useState<boolean>(false);
  const [countiesList, setCountiesList] = useState([]);
  const [countyIdMap, setCountyIdMap] = useState({});

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    async function fetchCities() {
      setIsLoading(true);
      await window.electron.ipcRenderer.sendMessage(ipc.getCities);
      await window.electron.ipcRenderer.once(ipc.getCities, (counties) => {
        setCountiesList(
          counties.map((county: County) => ({
            label: county.county,
            value: county.code,
          })),
        );

        setCountyIdMap(
          counties.reduce((acc: {}, county: any) => {
            // @ts-ignore
            acc[county.code] = county.county;
            return acc;
          }, {}),
        );

        setIsLoading(false);
      });
    }

    if (mounted.current && isConnectedToDB) fetchCities();

    return () => {
      mounted.current = false;
    };
  }, [isConnectedToDB]);

  return (
    <Cities.Provider
      value={{
        countiesList,
        countyIdMap,
        isLoadingCities,
      }}
    >
      {children}
    </Cities.Provider>
  );
};

export const useCities = () => useContext(Cities);
