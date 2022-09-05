import React from "react";
import "./modal.css";

import Modal from "./modal";
import loginicon from "../../assets/images/login.svg";
import { useHistory } from "react-router-dom";

const LoginModal = ({ modalid, toggle, setOpenLoginModal, gameDetailPage,plan }) => {
  const history = useHistory();
  const handleClick = () => {
    history.push("/signin");
    setOpenLoginModal(false);
  };
  return (
    <Modal modalid={modalid} toggle={toggle}>
      <div className="modal-body">
        <div
          className="close-icon"
          data-dismiss="modal"
          aria-label="Close"
          onClick={() => setOpenLoginModal(false)}
        >
          <div className="close-btn-icon"></div>
        </div>
        <div className="loginModal">
          <img src={loginicon} alt="login" />
          <h5>
            Login or Create an <span>account</span>
          </h5>
          {gameDetailPage ? (
            <p>
              Experience the games by clicking on PLAY DEMO. To schedule games within your organization, create an account.{" "}
            </p>
          ) : plan ? (<p>Play fun team bonding games with your peers by subscribing to any Plan.</p>) :(
            <p>
              Play unlimited games, no credit card needed.<br/> To customize games
              you need to purchase your plan.{" "}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleClick}
          >
            Login
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
