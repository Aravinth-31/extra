import React from 'react';

import './modal.css';
import Modal from './modal';

const UsersAddedModal = ({ modalid, toggle, setOpenUsersAddedModal, uploadedEmployeeDetails }) => {
    return (
        <Modal modalid={modalid} toggle={toggle}>
            <div className="modal-body">
                <div className="close-icon" data-dismiss="modal" aria-label="Close" onClick={() => setOpenUsersAddedModal(false)} >
                    <div className="close-btn-icon" ></div>
                </div>
                <div className="thankyou-body users-added-body">
                    <h4 className='title'>Users Added</h4>
                    <span className='sub-title'>The file was uploaded {uploadedEmployeeDetails?.error ? "with some errors" : "successfully"}</span>
                    <h5 className='counts'>Items succesfully added: <span style={{ color: "green" }}>{uploadedEmployeeDetails?.userCount}</span></h5>
                    <h5 className='counts'>Items failed to add: <span style={{ color: "red" }}>{uploadedEmployeeDetails?.userAlreadyExist || 0}</span></h5>
                    {
                        uploadedEmployeeDetails?.error &&
                        <h6 className='download-file'>Click <a href={uploadedEmployeeDetails?.sheetLink}>here</a> to download the CSV file of failed items.</h6>
                    }
                    <div className="confrim-btn">
                        <button type="submit" className="btn btn-primary" onClick={() => setOpenUsersAddedModal(false)}>Continue</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
export default UsersAddedModal;
