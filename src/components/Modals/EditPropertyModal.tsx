import React from "react";
import EditPropertyForm from "@/components/Forms/EditPropertyForm/EditPropertyForm";
import Modal from "../Modal/Modal";

interface EditPropertyModal {
  handleModalClose: () => void;
  showModal: boolean;
  selectedId: string | null;
  title: string;
  handleAfterSubmit: (id: string) => void;
}

const EditPropertyModal: React.FC<EditPropertyModal> = ({
  handleModalClose,
  showModal,
  title = "",
  selectedId,
  handleAfterSubmit,
}) => {
  return (
    <Modal onClose={handleModalClose} show={showModal} title={title}>
      {selectedId && (
        <EditPropertyForm
          propertyId={selectedId}
          queryType="update"
          handleAfterSubmit={handleAfterSubmit}
        />
      )}
    </Modal>
  );
};

export default EditPropertyModal;
