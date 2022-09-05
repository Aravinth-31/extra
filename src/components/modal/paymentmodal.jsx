import React, { useState } from 'react';
import {useHistory} from 'react-router-dom';

import './modal.css';
import Modal from './modal';
import stripe from '../../assets/images/stripe.svg';
import payu from '../../assets/images/payu.svg';
import arrowback from '../../assets/images/arrow-left.svg';

const PaymentModal = ({modalid,setOpenPaymentModal}) => {
  const history = useHistory();
  const [paymentMethod,setPaymentMethod] = useState('');
  const handleChange = (e)=>{
    const {value} = e.target;
    setPaymentMethod(value);
  }
  const handleClick = () =>{
    if(paymentMethod==='offline'){
      history.push('/purchase-order');
    }
  }
  return(
    <Modal modalid={modalid}>
      <div className="modal-body payment-wrapper">
        <div className="close-icon" data-dismiss="modal" aria-label="Close" onClick={()=>setOpenPaymentModal(false)}>
          <div className="close-btn-icon"></div>
        </div>
        <div className="contact-modal paymentmodal">
            <div className="contact-heading">
              <div className="payment-back" data-dismiss="modal" aria-label="Close">
              <img src={arrowback} alt="back"/>
              </div>
              <h6>Select Payment </h6>
            </div>
            <div className="contact-form">
              <div className="paymentmodal-group">
                <div className="form-group">
                  <label htmlFor="name">Online Mode</label>
                  <div className="radio-group">
                    <div className="radio-right">
                      <label>
                        <input type="radio" id="pay-stripe" name="payment" value="stripe" onChange={handleChange}/>
                        <span>
                          <img src={stripe} alt="stripe"/>
                        </span>
                      </label>
                    </div>
                    <div className="radio-right">
                      <label>
                        <input type="radio" id="pay-payu" name="payment" value="payU" onChange={handleChange}/>
                        <span>
                          <img src={payu} alt="payu"/>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Offline Mode</label>
                  <div className="radio-right">
                    <label>
                      <input type="radio" name="payment" value = "offline" onChange={handleChange}/>
                      <span>
                        Purchase Order
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="payment-btn">
                <button type="submit" className="btn btn-secondry" onClick={()=>setOpenPaymentModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" onClick={handleClick}>Proceed</button>
              </div>
            </div>
        </div>
      </div>
    </Modal>
  );
};
export default PaymentModal;