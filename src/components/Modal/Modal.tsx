import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./Modal.scss";

interface ModalProps {
  show: boolean;
  onClose: Function;
  children: any;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children, title }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);

    // Add event listener to handle escape key press
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Remove event listener on component cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    // Add or remove class to body based on modal visibility
    if (isBrowser) {
      const bodyElement = document.body;

      if (bodyElement) {
        bodyElement.classList.toggle("modal-open", show);
      }
    }
  }, [show, isBrowser]);

  const handleCloseClick = (e: any) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <a className="close-icon" href="#" onClick={handleCloseClick}>
            x
          </a>
        </div>
        {title && <p>{title}</p>}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    const modalRoot = document.getElementById("modal-root");
    return modalRoot ? ReactDOM.createPortal(modalContent, modalRoot) : null;
  } else {
    return null;
  }
};

export default Modal;
