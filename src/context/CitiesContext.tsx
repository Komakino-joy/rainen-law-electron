import {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ipc } from '~/constants/ipcEvents';
import { County } from '~/contracts';
import { useIsConnectedToDB } from './DatabaseContext';
import toast from 'react-hot-toast';

interface CitiesProps {
  isLoadingCities: boolean;
  countyIdMap: any;
  countiesList: any[];
  setShouldFetch: Dispatch<boolean>;
}

const Cities = createContext<CitiesProps>({
  isLoadingCities: false,
  countyIdMap: {},
  countiesList: [],
  setShouldFetch: () => {},
});

export const CitiesProvider = ({ children }: { children: any }) => {
  const isConnectedToDB = useIsConnectedToDB();
  const [shouldFetch, setShouldFetch] = useState(true);
  const [isLoadingCities, setIsLoading] = useState<boolean>(false);
  const [countiesList, setCountiesList] = useState([]);
  const [countyIdMap, setCountyIdMap] = useState({});

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    async function fetchCities() {
      try {
        setIsLoading(true);
        await new Promise((resolve) => {
          window.electron.ipcRenderer.sendMessage(ipc.getCities);
          window.electron.ipcRenderer.once(
            ipc.getCities,
            ({ cities, status, message }) => {
              if (status === 'success') {
                setCountiesList(
                  cities.map((county: County) => ({
                    label: county.county,
                    value: county.code,
                  })),
                );

                setCountyIdMap(
                  cities.reduce((acc: {}, county: any) => {
                    // @ts-ignore
                    acc[county.code] = county.county;
                    return acc;
                  }, {}),
                );
              } else {
                toast[status](message, { id: 'get-cities' });
              }
            },
          );
        });
      } finally {
        setIsLoading(false);
        setShouldFetch(false);
      }
    }

    if (mounted.current && isConnectedToDB && shouldFetch) fetchCities();

    return () => {
      mounted.current = false;
    };
  }, [isConnectedToDB, shouldFetch]);

  return (
    <Cities.Provider
      value={{
        countiesList,
        countyIdMap,
        isLoadingCities,
        setShouldFetch,
      }}
    >
      {children}
    </Cities.Provider>
  );
};

export const useCities = () => useContext(Cities);

export const useFetchCityList = () => {
  const cityCtx = useContext(Cities);
  return () => cityCtx.setShouldFetch(true);
};
