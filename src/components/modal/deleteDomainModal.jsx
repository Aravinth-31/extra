import React from 'react';

import './modal.css';
import Modal from './modal';

const DeleteDomainModal = ({ modalid, toggle, setOpenDeleteDomainModal, deleteFunction, deleteData, session }) => {
  return (
    <Modal modalid={modalid} toggle={toggle}>
      <div className="modal-body">
        <div className="close-icon" onClick={() => setOpenDeleteDomainModal(false)}>
          <div className="close-btn-icon"></div>
        </div>
        <div className="thankyou-body delete-domain">
          <h5>Delete {session ? "Session" : "Domain"}</h5>
          <span>{session ?
            "Are you sure you want to delete this game session?"
            : "Do you want to delete this Domain?"}
          </span>
          <div className="confrim-btn">
            <button type="submit" className="btn btn-outline" onClick={() => setOpenDeleteDomainModal(false)}>No</button>
            <button type="submit" className="btn btn-primary" onClick={() => deleteFunction(deleteData)}>Yes</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default DeleteDomainModal;
