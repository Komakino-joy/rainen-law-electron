import { createContext, useContext, useEffect, useRef, useState } from 'react';
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
    mounted.current = true;
    async function fetchExaminers() {
      setIsLoading(true);
      await window.electron.ipcRenderer.sendMessage(ipc.getExaminers);
      await window.electron.ipcRenderer.once(ipc.getExaminers, (response) => {
        setExaminersList(response);

        setExaminersDropDownOptions(
          response.map((examiner: Examiner) => ({
            label: examiner.name,
            value: examiner.name,
          })),
        );

        setIsLoading(false);
      });
    }

    if (mounted.current && isConnectedToDB) fetchExaminers();

    return () => {
      mounted.current = false;
    };
  }, [isConnectedToDB]);

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
