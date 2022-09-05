import React from 'react';

import './modal.css';
import Modal from './modal';

import paymentfailure from '../../assets/images/paymentfailure.gif';


const PaymentFailed = ({modalid,toggle,setOpenPaymentFailedModal}) => {
  return(
    <Modal modalid={modalid} toggle={toggle}>
      <div className="modal-body">
        <div className="close-icon" data-dismiss="modal" aria-label="Close" onClick={()=>{setOpenPaymentFailedModal(false)}}>
          <div className="close-btn-icon"></div>
        </div>
        <div className="thankyou-body failer">
          <img src={paymentfailure} alt="smile"/>
          <h5>Payment failed</h5>
          <span>We can’t process your payment. check your internet connections and try again later</span>
          <button type="submit" className="btn btn-secondry" onClick={()=>{setOpenPaymentFailedModal(false)}}>Try Again</button>
        </div>
      </div>
    </Modal>
  );
};
export default PaymentFailed;
