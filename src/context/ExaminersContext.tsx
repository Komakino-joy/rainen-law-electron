import {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ipc } from '~/constants/ipcEvents';
import { Examiner } from '~/contracts';
import { useIsConnectedToDB } from './DatabaseContext';
import toast from 'react-hot-toast';
interface OwnProps {
  isLoadingExaminerscontext: boolean;
  examinersList: any[];
  examinersDropDownOptions: any[];
  setShouldFetch: Dispatch<boolean>;
}

const ExaminersContext = createContext<OwnProps>({
  isLoadingExaminerscontext: false,
  examinersList: [],
  examinersDropDownOptions: [],
  setShouldFetch: () => {},
});

export const ExaminersContextProvider = ({ children }: { children: any }) => {
  const isConnectedToDB = useIsConnectedToDB();
  const [shouldFetch, setShouldFetch] = useState(true);
  const [isLoadingExaminerscontext, setIsLoading] = useState<boolean>(false);
  const [examinersList, setExaminersList] = useState([]);
  const [examinersDropDownOptions, setExaminersDropDownOptions] = useState([]);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    async function fetchExaminers() {
      try {
        setIsLoading(true);
        await new Promise((resolve) => {
          window.electron.ipcRenderer.sendMessage(ipc.getExaminers);
          window.electron.ipcRenderer.once(
            ipc.getExaminers,
            ({ examiners, status, message }) => {
              if (status === 'success') {
                setExaminersList(examiners);
                setExaminersDropDownOptions(
                  examiners
                    .filter((examiner) => examiner.name && examiner.is_active)
                    .map((examiner: Examiner) => ({
                      label: examiner.name,
                      value: examiner.name,
                    })),
                );
                resolve('');
              } else {
                resolve(toast[status](message, { id: 'get-examiners' }));
              }
            },
          );
        });
      } finally {
        setIsLoading(false);
        setShouldFetch(false);
      }
    }

    if (mounted.current && isConnectedToDB && shouldFetch) fetchExaminers();

    return () => {
      mounted.current = false;
    };
  }, [isConnectedToDB, shouldFetch]);

  return (
    <ExaminersContext.Provider
      value={{
        examinersList,
        examinersDropDownOptions,
        isLoadingExaminerscontext,
        setShouldFetch,
      }}
    >
      {children}
    </ExaminersContext.Provider>
  );
};

export const useExaminersContext = () => useContext(ExaminersContext);

export const useFetchExaminerList = () => {
  const examiner = useContext(ExaminersContext);
  return () => examiner.setShouldFetch(true);
};
