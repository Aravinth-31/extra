import React from "react";
import { Link } from "react-router-dom";
import "./playCard.css";
// image
import quesImg from "../../assets/images/questions.svg";
import playImg from "../../assets/images/plays.svg";
import diyImg from "../../assets/images/diy.svg";
import playicon from "../../assets/images/playicon.svg";

const PlayCardHover = ({ title, srcImage }) => {
  return (
    <div className="playcard">
      <div className="playcard-hover">
        <div className="playcard-hover-img">
          <img src={srcImage} alt="img" />
          {/* <div className="tag-label">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M6.41667 1.75L11.6667 7C11.8102 7.16042 11.8895 7.3681 11.8895 7.58333C11.8895 7.79857 11.8102 8.00625 11.6667 8.16667L8.16667 11.6667C8.00625 11.8102 7.79857 11.8895 7.58333 11.8895C7.3681 11.8895 7.16042 11.8102 7 11.6667L1.75 6.41667V4.08333C1.75 3.4645 1.99583 2.871 2.43342 2.43342C2.871 1.99583 3.4645 1.75 4.08333 1.75H6.41667Z"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.24998 6.41671C5.89431 6.41671 6.41665 5.89437 6.41665 5.25004C6.41665 4.60571 5.89431 4.08337 5.24998 4.08337C4.60565 4.08337 4.08331 4.60571 4.08331 5.25004C4.08331 5.89437 4.60565 6.41671 5.24998 6.41671Z"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Sport Games
          </div> */}
          <div className="play-icon">
            <img src={playicon} alt="play icon" />
          </div>
        </div>
        <div className="playcard-content">
          <h5>{title}</h5>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry
          </p>
          <div className="playcard-review">
            <div className="playcard-review-content">
              <img src={quesImg} alt="play" />
              <h4 className="questions">
                10
                <span>Questions</span>
              </h4>
            </div>
            <div className="playcard-review-content">
              <img src={playImg} alt="play" />
              <h4>
                <span>Plays</span>
                3k
              </h4>
            </div>
            {/* <div className="playcard-review-content">
              <img src={diyImg} alt="diy" />
              <h4>DIY</h4>
            </div> */}
          </div>
          <div className="playcard-bottom">
            <div className="playcard-social">
              <Link to=" ">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect
                    width="32"
                    height="32"
                    rx="6"
                    fill="#E25569"
                    fillOpacity="0.08"
                  />
                  <path
                    d="M21.8334 17.4963L16 23.5323L10.1667 17.4963C9.78194 17.1051 9.47887 16.6349 9.27657 16.1154C9.07428 15.5958 8.97714 15.0381 8.99128 14.4774C9.00541 13.9167 9.13052 13.3651 9.35872 12.8574C9.58691 12.3497 9.91325 11.8968 10.3172 11.5274C10.7211 11.1579 11.1939 10.8798 11.7058 10.7106C12.2176 10.5414 12.7575 10.4848 13.2913 10.5443C13.8252 10.6038 14.3414 10.7781 14.8076 11.0563C15.2738 11.3345 15.6798 11.7105 16 12.1607C16.3217 11.7138 16.7281 11.3411 17.194 11.0658C17.6599 10.7906 18.1751 10.6188 18.7074 10.5611C19.2398 10.5035 19.7778 10.5613 20.2878 10.7309C20.7977 10.9004 21.2687 11.1782 21.6712 11.5467C22.0738 11.9152 22.3991 12.3665 22.627 12.8725C22.8549 13.3784 22.9804 13.928 22.9956 14.487C23.0108 15.0459 22.9155 15.6021 22.7155 16.1207C22.5155 16.6394 22.2152 17.1093 21.8334 17.5012"
                    stroke="#E25569"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link to=" ">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect
                    width="32"
                    height="32"
                    rx="6"
                    fill="#E25569"
                    fillOpacity="0.08"
                  />
                  <path
                    d="M11.3333 17.6568C12.622 17.6568 13.6667 16.5653 13.6667 15.219C13.6667 13.8726 12.622 12.7812 11.3333 12.7812C10.0447 12.7812 9 13.8726 9 15.219C9 16.5653 10.0447 17.6568 11.3333 17.6568Z"
                    stroke="#E25569"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.6667 12.7812C21.9554 12.7812 23 11.6897 23 10.3433C23 8.99698 21.9554 7.90553 20.6667 7.90553C19.378 7.90553 18.3334 8.99698 18.3334 10.3433C18.3334 11.6897 19.378 12.7812 20.6667 12.7812Z"
                    stroke="#E25569"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.6667 22.5324C21.9554 22.5324 23 21.4409 23 20.0946C23 18.7482 21.9554 17.6568 20.6667 17.6568C19.378 17.6568 18.3334 18.7482 18.3334 20.0946C18.3334 21.4409 19.378 22.5324 20.6667 22.5324Z"
                    stroke="#E25569"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.4333 14.1626L18.5667 11.3997"
                    stroke="#E25569"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.4333 16.2753L18.5667 19.0382"
                    stroke="#E25569"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
            <button type="submit" className="btn btn-primary">
              View Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayCardHover;
