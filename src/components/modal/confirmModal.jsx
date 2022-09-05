import React from 'react';

import './modal.css';
import Modal from './modal';

const ConfirmModal = ({ modalid, toggle, title, question, setOpenConfirmModal, confirmFunction }) => {
    return (
        <Modal modalid={modalid} toggle={toggle}>
            <div className="modal-body">
                <div className="close-icon" data-dismiss="modal" aria-label="Close" onClick={() => setOpenConfirmModal(false)} >
                    <div className="close-btn-icon" ></div>
                </div>
                <div className="thankyou-body">
                    <h5>{title}</h5>
                    <span>{question}</span>
                    <div className="confrim-btn">
                        <button type="submit" className="btn btn-outline" onClick={() => setOpenConfirmModal(false)}>No</button>
                        <button type="submit" className="btn btn-primary" onClick={confirmFunction}>Yes</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
export default ConfirmModal;
