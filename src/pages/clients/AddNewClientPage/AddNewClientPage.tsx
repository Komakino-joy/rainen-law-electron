import { useState } from 'react';
import EditClientForm from '@/components/Forms/EditClientForm/EditClientForm';
import Modal from '@/components/Modal/Modal';

const AddNewClientPage = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleAfterSubmit = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedClientId(null);
    setShowModal(false);
  };

  return (
    <div className="center-margin">
      <h1>Create client</h1>
      <div className="light-border">
        <EditClientForm
          clientId={null}
          queryType="insert"
          handleAfterSubmit={handleAfterSubmit}
        />
      </div>
      <Modal onClose={handleModalClose} show={showModal} title={''}>
        {selectedClientId && (
          <EditClientForm clientId={selectedClientId} queryType="update" />
        )}
      </Modal>
    </div>
  );
};

export default AddNewClientPage;
