import React, { useEffect, useRef, useState } from 'react';
import Modal from '@/components/Modal/Modal';
import ClientsTable from '@/components/Tables/Clients/ClientsTable';
import EditPropertyForm from '@/components/Forms/EditPropertyForm/EditPropertyForm';
import EditClientForm from '~/components/Forms/EditClientForm/EditClientForm';
import PropertiesTable from '@/components/Tables/Properties/PropertiesTable';
import Spinner from '@/components/Spinner/Spinner';
import HomeRecordPreviewCard from '@/components/HomeRecordPreviewCard/HomeRecordPreviewCard';
import { ipc } from '~/constants/ipcEvents';
import { Client, ModalType, Property } from '~/contracts';
import { useUser } from '~/context/AuthContext';
import { useIsConnectedToDB } from '~/context/DatabaseContext';
import toast from 'react-hot-toast';

const HomePage: React.FC = () => {
  const isConnectedToDB = useIsConnectedToDB();
  const user = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [propertyData, setPropertyData] = useState<Property[] | null>(null);
  const [clientData, setClientData] = useState<Client[] | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleModalOpen = (
    e: React.SyntheticEvent,
    selectedRecordId: string,
    type: ModalType,
  ) => {
    e.preventDefault();

    switch (type) {
      case 'property':
        setSelectedPropertyId(selectedRecordId);
        break;
      case 'client':
        setSelectedClientId(selectedRecordId);
        break;
      default:
        break;
    }

    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedPropertyId(null);
    setSelectedClientId(null);
    setShowModal(false);
  };

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    const httpFetchPropertyData = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => {
          window.electron.ipcRenderer.sendMessage(
            ipc.getLatestUpdatedProperties,
          );
          window.electron.ipcRenderer.once(
            ipc.getLatestUpdatedProperties,
            ({ data, status, message }) => {
              if (status === 'success') {
                setPropertyData(data as Property[]);
              } else {
                toast[status](message, { id: 'get-latest-properties' });
              }
              resolve('');
            },
          );
        });
      } finally {
        setIsLoading(false);
      }
    };

    const httpFetchClientData = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => {
          window.electron.ipcRenderer.sendMessage(ipc.getLatestUpdatedClients);
          window.electron.ipcRenderer.once(
            ipc.getLatestUpdatedClients,
            ({ data, status, message }) => {
              if (status === 'success') {
                setClientData(data as Client[]);
              } else {
                toast[status](message, { id: 'get-latest-clients' });
              }
              resolve('');
            },
          );
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted.current && isConnectedToDB) {
      httpFetchPropertyData();
      httpFetchClientData();
    }

    return () => {
      mounted.current = false;
    };
  }, [isConnectedToDB]);

  const dataLoaded = propertyData && clientData;

  if (isLoading || !dataLoaded) {
    return (
      <div className="page-spinner">
        <Spinner />
      </div>
    );
  }

  return (
    user && (
      <div className="homepage-wrapper">
        <div className="homepage-content">
          <section>
            <div className="light-border welcome-header">
              <h1>{`Welcome, ${user.f_name} ${user.l_name[0]}.`}</h1>
              <h2>
                {new Date().toLocaleDateString('en-us', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h2>
            </div>
          </section>
          <section>
            <h3>Recent Updates</h3>
            {propertyData && propertyData.length > 0 ? (
              <HomeRecordPreviewCard title="Properties" href="/properties/1">
                <PropertiesTable
                  tableData={propertyData}
                  handleModalOpen={handleModalOpen}
                  setTableData={() => {}}
                  isHomePreviewTable
                />
              </HomeRecordPreviewCard>
            ) : null}

            {clientData && clientData.length > 0 ? (
              <HomeRecordPreviewCard title="Clients" href="/clients/1">
                <ClientsTable
                  tableData={clientData}
                  handleModalOpen={handleModalOpen}
                  setTableData={() => {}}
                  isHomePreviewTable={true}
                  hiddenColumns={[
                    'Phone',
                    'Fax',
                    'Is Client?',
                    'Properties',
                    'Titles',
                  ]}
                />
              </HomeRecordPreviewCard>
            ) : null}
          </section>
        </div>

        <Modal onClose={handleModalClose} show={showModal} title={''}>
          {selectedPropertyId && (
            <EditPropertyForm
              propertyId={selectedPropertyId}
              queryType="update"
              handleAfterSubmit={() => {}}
            />
          )}
          {selectedClientId && (
            <EditClientForm
              clientId={selectedClientId}
              queryType="update"
              handleAfterSubmit={() => {}}
            />
          )}
        </Modal>
      </div>
    )
  );
};

export default HomePage;
