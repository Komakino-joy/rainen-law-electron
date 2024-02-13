import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditPropertyModal from '@/components/Modals/EditPropertyModal';
import Pagination from '@/components/Pagination/Pagination';
import PropertiesTable from '@/components/Tables/Properties/PropertiesTable';
import Spinner from '@/components/Spinner/Spinner';
import { ipc } from '~/constants/ipcEvents';
import { useIsConnectedToDB } from '~/context/DatabaseContext';
import { Property } from '~/contracts';
import getCookie from '~/utils/getCookie';

const PropertiesPage = () => {
  const isConnectedToDB = useIsConnectedToDB();
  const { page: currentPage } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(null);
  const [totalRecords, setTotalRecords] = useState(null);
  const [tableData, setTableData] = useState<Property[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shouldReload, setShouldReload] = useState(false);

  const handleModalOpen = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault();
    setSelectedId(id);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedId(null);
    setShowModal(false);
  };

  const handleAfterSubmit = (id: string) => {
    setShouldReload(true);
  };

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    async function fetchProperties() {
      setIsLoading(true);
      const filters = getCookie('last-properties-search-filters');
      await window.electron.ipcRenderer.sendMessage(ipc.postPropertiesPage, {
        page: currentPage,
        filters: filters || '{}',
      });
      await window.electron.ipcRenderer.once(
        ipc.postPropertiesPage,
        ({ properties, totalRecords, pageSize }) => {
          setTableData(properties);
          setTotalRecords(totalRecords);
          setPageSize(pageSize);
          window.scrollTo(0, 0);
        },
      );
      setIsLoading(false);
    }

    if (mounted.current && isConnectedToDB) fetchProperties();
  }, [shouldReload, currentPage, isConnectedToDB]);

  if (isLoading) return <Spinner containerClassName="page-spinner" />;
  if (!totalRecords || !pageSize) return <h1>Missing required props</h1>;

  const totalPages = Math.floor(totalRecords / pageSize) || 1;

  return (
    <>
      {tableData && (
        <div className="all-records-view-page">
          <header>
            <h1>Properties</h1>
            <div className="italicized-record-count">
              <span>Total Records ({totalRecords})</span>
              <span>
                Current Page ({currentPage} / {totalPages})
              </span>
            </div>
            <span
              className="back-to-search"
              onClick={() => navigate('/properties/search')}
            >
              {'<- Back to search'}
            </span>
          </header>

          <PropertiesTable
            tableData={tableData}
            handleModalOpen={handleModalOpen}
            setTableData={setTableData}
          />

          <Pagination
            href={'properties'}
            totalRecords={totalRecords}
            pageSize={pageSize}
            currentPage={Number(currentPage)}
          />
        </div>
      )}

      <EditPropertyModal
        handleAfterSubmit={handleAfterSubmit}
        handleModalClose={handleModalClose}
        selectedId={selectedId}
        showModal={showModal}
        title={''}
      />
    </>
  );
};

export default PropertiesPage;
