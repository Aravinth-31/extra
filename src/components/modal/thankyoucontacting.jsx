import React from 'react';

import './modal.css';
import Modal from './modal';

import submit from '../../assets/images/submit.gif';
import { Link } from 'react-router-dom';

const ThankyouModal = ({ modalid, toggle, setOpenThankyouModal }) => {
  return (
    <Modal modalid={modalid} toggle={toggle}>
      <div className="modal-body">
        <div className="close-icon" data-dismiss="modal" onClick={() => setOpenThankyouModal(false)} aria-label="Close">
          <div className="close-btn-icon"></div>
        </div>
        <div className="thankyou-body contactingus">
          <img src={submit} alt="msg" />
          <h5>Thank you for contacting us! </h5>
          <span>Your form has been successfully submitted and We will get back to you very soon </span>
          <Link to="/"><button type="submit" className="btn btn-secondry" onClick={() => setOpenThankyouModal(false)}>Back to Homepage</button></Link>
        </div>
      </div>
    </Modal>
  );
};
export default ThankyouModal;
