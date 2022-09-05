import React from 'react';

import './modal.css';
import Modal from './modal';
import { Link } from "react-router-dom";
import smile from '../../assets/images/smile.svg';
import smileNormal from '../../assets/images/smilenormal.svg';
import smileSad from '../../assets/images/smilesad.svg';
import { useHistory } from 'react-router-dom';
import { encryptData } from '../../helpers/helper';

const ThankyouModal = ({ modalid, toggle, setOpenThankyouModal, finalRating, sessionId, gameId }) => {
  const history = useHistory();
  const handleClick = () => {
    setOpenThankyouModal(false);
    history.push('/');
  }
  return (
    <Modal modalid={modalid} toggle={toggle}>
      <div className="modal-body">
        <div className="close-icon" data-dismiss="modal" aria-label="Close" onClick={() => {
          sessionStorage.setItem("gameReportId", encryptData(gameId));
          history.push(`/game-reports/${sessionId}`);
          setOpenThankyouModal(false);
        }}>
          <div className="close-btn-icon" ></div>
        </div>
        <div className="thankyou-body">
          {
            finalRating > 3 ?
              <img src={smile} alt="smile" />
              : finalRating > 1 ?
                <img src={smileNormal} alt="smile" />
                : <img src={smileSad} alt="smile" />
          }
          <h5>Thank you</h5>
          {/* 5 star rating display this  */}
          {finalRating && finalRating > 3 ?
            <span>We are glad you loved our games</span>
            : finalRating > 1 ?
              <span>Hopefully, we can give you an even better experience next time</span>
              : <span>Sorry, we didn’t meet your expectations.</span>
          }
          <p className="review-to-reports"><Link to="#" onClick={() => {
            sessionStorage.setItem("gameReportId", encryptData(gameId));
            history.push(`/game-reports/${sessionId}`);
          }}> <span> View the leaderboard</span></Link></p>
          <button type="submit" className="btn btn-secondry" onClick={handleClick}>Explore More Games</button>

        </div>
      </div>
    </Modal>
  );
};
export default ThankyouModal;
