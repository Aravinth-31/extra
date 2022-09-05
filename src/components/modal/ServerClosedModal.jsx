import React from 'react';

import './modal.css';
import Modal from './modal';
import serverClosedGif from "../../assets/images/serverclosed.gif";
import smile from "../../assets/images/smilenormal.svg";

const ServerClosed = ({ modalid, toggle, setUpgradeKey }) => {
  return (
    <Modal modalid={modalid} toggle={toggle}>
      <div className="modal-body server-closed">
        <div className="close-icon" data-dismiss="modal" aria-label="Close">
          <div className="close-btn-icon" onClick={() => {
            localStorage.setItem("upgrade-alert-flag", JSON.stringify(true));
            setUpgradeKey(new Date());
          }}></div>
        </div>
        <div className="server-closed-body">
          {/* <img src={serverClosedGif} alt="" /> */}
          <img src={smile} alt="" />
          <h1>Welcome back to PLAY! </h1>
          <h4>As we have upgraded to new servers, we will be running tests today to ensure smooth operations. In such cases, you may experience delayed services. Thank you for your understanding!</h4>
          {/* <h4>Hey! Looking to PLAY? We are undergoing our quarterly updates until Monday 9pm IST. Please visit again on Tuesday 12th April and get ready to PLAY faster and stronger!</h4> */}
        </div>
      </div>
    </Modal>
  );
};
export default ServerClosed;
