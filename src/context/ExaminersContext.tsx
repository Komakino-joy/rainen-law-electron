import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ipc } from '~/constants/ipcEvents';
import { Examiner } from '~/contracts';
import { useIsConnectedToDB } from './DatabaseContext';

interface OwnProps {
  isLoadingExaminerscontext: boolean;
  examinersList: any[];
  examinersDropDownOptions: any[];
}

const ExaminersContext = createContext<OwnProps>({
  isLoadingExaminerscontext: false,
  examinersList: [],
  examinersDropDownOptions: [],
});

export const ExaminersContextProvider = ({ children }: { children: any }) => {
  const isConnectedToDB = useIsConnectedToDB();
  const [isLoadingExaminerscontext, setIsLoading] = useState<boolean>(false);
  const [examinersList, setExaminersList] = useState([]);
  const [examinersDropDownOptions, setExaminersDropDownOptions] = useState([]);

  const mounted = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      mounted.current = true;
      const fetchExaminerInfo = async () => {
        setIsLoading(true);
        window.electron.ipcRenderer.sendMessage(ipc.getExaminers);
        window.electron.ipcRenderer.once(ipc.getExaminers, (response) => {
          setExaminersList(response);

          setExaminersDropDownOptions(
            response.map((examiner: Examiner) => ({
              label: examiner.name,
              value: examiner.name,
            })),
          );

          setIsLoading(false);
        });
      };

      if (mounted && isConnectedToDB) {
        fetchExaminerInfo();
      }

      return () => {
        mounted.current = false;
      };
    }
  }, []);

  return (
    <ExaminersContext.Provider
      value={{
        examinersList,
        examinersDropDownOptions,
        isLoadingExaminerscontext,
      }}
    >
      {children}
    </ExaminersContext.Provider>
  );
};

export const useExaminersContext = () => useContext(ExaminersContext);
