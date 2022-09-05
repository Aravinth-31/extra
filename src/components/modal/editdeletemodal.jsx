
import React from 'react';

import './modal.css';
import Modal from './modal';
import CreateQuestion from './createquestion';
import UploadFileModal from './uploadfilemodal';

const EditDeleteModal = ({modalid, title}) => {
  return(
    <Modal modalid={modalid}>
      <div className="modal-body">
        <div className="close-icon" data-dismiss="modal" aria-label="Close">
          <div className="close-btn-icon"></div>
        </div>
        <div className="contact-modal edit-delete">
          <div className="edit-delete-text">
            <h5>{title} Question?</h5>
            <span>Are you sure you want to {title} this Question</span>
          </div>
          <div className="edit-delete-btn">
            <button type="submit" className="btn btn-outline" aria-label="Close" data-toggle="modal" data-target="#uploadfile">No</button>
            <button type="submit" className="btn btn-primary" aria-label="Close" data-toggle="modal" data-target="#createquestion">Yes</button>
          </div>
        </div>
      </div>
      <UploadFileModal modalid="uploadfile"/>
      <CreateQuestion modalid="createquestion"/>
    </Modal>
  );
};
export default EditDeleteModal;