import React from "react";
import "./modal.css";
import { useHistory } from "react-router-dom";
import Modal from "./modal";

const PurchasePlanModal = ({ modalid, toggle, setOpenPurchasePlansModal,purchaseModalType }) => {
  const history = useHistory();
  return (
    <Modal modalid={modalid} toggle={toggle}>
      <div className="modal-body">
        <div
          className="close-icon"
          data-dismiss="modal"
          aria-label="Close"
          onClick={() => setOpenPurchasePlansModal(false)}
        >
          <div className="close-btn-icon"></div>
        </div>
        <div className="loginModal">
          <h5>
            Purchase a <span>Plan</span>
          </h5>
          <p>
            To {purchaseModalType} <br />
            you will have to purchase a plan
          </p>
          <button type="submit" className="btn btn-primary" onClick={()=>history.push('/plans')}>
            View Plans
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PurchasePlanModal;
