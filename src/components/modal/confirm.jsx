import React from 'react';

import './modal.css';
import Modal from './modal';

const Confirm = ({ modalid, toggle, setOpenConfirmUploadModal, setUploadFlag, isFileExisting }) => {
  const confirmHandler = () => {
    setUploadFlag(true);
    setOpenConfirmUploadModal(false)
  }
  return (
    <Modal modalid={modalid} toggle={toggle}>
      <div className="modal-body">
        <div className="close-icon" onClick={() => setOpenConfirmUploadModal(false)}>
          <div className="close-btn-icon"></div>
        </div>
        <div className="thankyou-body file-upload-confirm">
          <h5>Confirmation</h5>
          <span>{
            // isFileExisting ?
            // "Uploading a new file will replace current user reports. Are you sure you want to upload this"
            // : 
            "Is your file ready for upload?"
          }</span>
          <div className="confrim-btn">
            <button type="submit" className="btn btn-outline" onClick={() => setOpenConfirmUploadModal(false)}>{isFileExisting ? "Cancel" : "No"}</button>
            <button type="submit" className="btn btn-primary" onClick={confirmHandler}>{isFileExisting ? "Upload" : "Yes"}</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default Confirm;
