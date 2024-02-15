import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import EditClientForm from '@/components/Forms/EditClientForm/EditClientForm';
import Modal from '@/components/Modal/Modal';
import Pagination from '@/components/Pagination/Pagination';
import ClientsTable from '@/components/Tables/Clients/ClientsTable';
import Spinner from '@/components/Spinner/Spinner';
import { ipc } from '~/constants/ipcEvents';
import { Client } from '~/contracts';
import { useIsConnectedToDB } from '~/context/DatabaseContext';
import getCookie from '~/utils/getCookie';

const ClientsPage = () => {
  const isConnectedToDB = useIsConnectedToDB();
  const { page: currentPage } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableData, setTableData] = useState<Client[] | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [shouldReload, setShouldReload] = useState(false);

  const handleModalOpen = (e: React.SyntheticEvent, clientId: string) => {
    e.preventDefault();
    setSelectedClientId(clientId);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedClientId(null);
    setShowModal(false);
  };

  const handleAfterSubmit = () => {
    setShouldReload(true);
  };

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    async function fetchClients() {
      setIsLoading(true);
      await new Promise((resolve) => {
        const filters = getCookie('last-clients-search-filters');

        window.electron.ipcRenderer.sendMessage(ipc.postClientsPage, {
          page: currentPage,
          filters: filters || '{}',
        });

        window.electron.ipcRenderer.once(
          ipc.postClientsPage,
          ({ clients, totalRecords, pageSize, status, message }) => {
            if (status === 'success') {
              setTableData(clients);
              setTotalRecords(totalRecords);
              setPageSize(pageSize);
              window.scrollTo(0, 0);
              resolve(setIsLoading(false));
            } else {
              toast.error(message, { id: 'fetch-properties-page' });
              reject(setIsLoading(false));
            }
          },
        );
      });
    }

    if (mounted.current && isConnectedToDB) fetchClients();

    return () => {
      mounted.current = false;
    };
  }, [shouldReload, currentPage, isConnectedToDB]);

  if (isLoading) return <Spinner containerClassName="page-spinner" />;

  const totalPages = Math.floor(totalRecords / pageSize);

  return (
    <>
      {tableData && (
        <div className="all-records-view-page">
          <header>
            <h1>
              All Clients
              {totalPages > 0 && (
                <span className="italicized-record-count">
                  page ({currentPage}/{totalPages})
                </span>
              )}
            </h1>
            <span
              className="back-to-search"
              onClick={() => navigate('/clients/search')}
            >
              {'<- Back to search'}
            </span>
          </header>

          <ClientsTable
            tableData={tableData}
            handleModalOpen={handleModalOpen}
            setTableData={setTableData}
          />

          {totalPages > 0 && (
            <Pagination
              href={'clients'}
              totalRecords={totalRecords}
              pageSize={pageSize}
              currentPage={Number(currentPage)}
            />
          )}
        </div>
      )}

      <Modal onClose={handleModalClose} show={showModal} title={''}>
        {selectedClientId && (
          <EditClientForm
            clientId={selectedClientId}
            queryType="update"
            handleAfterSubmit={handleAfterSubmit}
          />
        )}
      </Modal>
    </>
  );
};

export default ClientsPage;
