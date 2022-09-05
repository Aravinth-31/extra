import React from 'react';

import './modal.css';
import Modal from './modal';

import paymentsucess from '../../assets/images/paymentsucess.gif';
import thankyou from '../../assets/images/thankyou.svg';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logOut } from '../../redux/actions/userAction';


const PaymentSuccess = ({ modalid, toggle, setOpenPaymentSuccessModal, po, offlinePayment }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const handleClick = () => {
    setOpenPaymentSuccessModal(false);
    history.push('/');
  }
  useEffect(() => {
    if (offlinePayment) {
      dispatch(logOut());
    }
  }, offlinePayment)
  return (
    <Modal modalid={modalid} toggle={toggle}>
      <div className="modal-body">
        <div className="close-icon" data-dismiss="modal" aria-label="Close" onClick={handleClick}>
          <div className="close-btn-icon"></div>
        </div>
        <div className="thankyou-body success">
          {!po ? <> <img src={paymentsucess} alt="smile" />
            <h5>Payment Successful</h5></> : null}
          {po ? <>
            <img style={{ width: "40px", height: "40px" }} src={thankyou} alt="smile" />
            <h4 className="thank-you">Thank You </h4>
            <span>we have received your details,<br /> our team will get back to you soon.</span></>
            :
            <span>Thanks for purchasing ExtraMile Premium membership, we will get back to you soon</span>
          }
          {/* {
            offlinePayment &&
            <p className="warning">* Your payment is successful, please wait for the verification email and log back in for account activation.</p>
          } */}
          <button type="submit" className="btn btn-secondry" onClick={handleClick}>Continue</button>
        </div>
      </div>
    </Modal>
  );
};
export default PaymentSuccess;
