import React from 'react';

import './modal.css';
import Modal from './modal';

const SaveAccountChanges = ({modalid,toggle,setOpenSaveAccountChangesModal,updateChanges}) => {
  return(
    <Modal modalid={modalid} toggle={toggle}>
      <div className="modal-body">
        <div className="close-icon" data-dismiss="modal" aria-label="Close" onClick={()=>setOpenSaveAccountChangesModal(false)} >
          <div className="close-btn-icon" ></div>
        </div>
        <div className="thankyou-body">
          <h5>Save Changes</h5>
          <span>Would you like to confirm the changes?</span>
          <div className="confrim-btn">
            <button type="submit" className="btn btn-outline" onClick={()=>setOpenSaveAccountChangesModal(false)}>No</button>
            <button type="submit" className="btn btn-primary"onClick={updateChanges}>Yes</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default SaveAccountChanges;
