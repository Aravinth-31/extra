import React, { useEffect, useState } from "react";

import "./bannerCarousel.css";
import profileImg from "../../assets/images/players.svg";
import countImg from "../../assets/images/count.svg";
import ROLES from "../../helpers/userTypes";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { customizeBanner, getBannerGames } from "../../redux/actions/homepageActions";
import { getAllWebinars, toggleWebinarAccess } from "../../redux/actions/commonActions";
import { useHistory } from "react-router-dom";
import { encryptData, monthNames, S3_BASE_URL } from "../../helpers/helper";

const BannerCarousel = ({ title, srcImage, redirectURL, mobileImage, setBannerCreateModal, customize, setCustomize, setOpenConfirmModal, role, setBannerEditGameDetails, isWebinar, id, startsAt }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.getUser)
  const [webinarAllowed, setWebinarAllowed] = useState(false);
  const history = useHistory();
  const [joinKey, setJoinKey] = useState(new Date().toISOString());
  let joinButtonMonitor = 0;
  useEffect(() => {
    if (startsAt && new Date(startsAt) > new Date()) {
      joinButtonMonitor = setInterval(() => {
        if (new Date(startsAt) <= new Date()) {
          setJoinKey(new Date().toISOString());
          clearInterval(joinButtonMonitor);
        }
      }, 10000)
    }
    return () => {
      clearInterval(joinButtonMonitor);
    }
  }, []);
  const redirect = () => {
    if (!isWebinar || (isWebinar && startsAt && new Date(startsAt) <= new Date()))
      if (redirectURL !== "" && redirectURL)
        if (isWebinar) {
          localStorage.setItem("streamURL", encryptData(redirectURL));
          history.push("/webinar/live");
        }
        else
          window.open(redirectURL);
  };
  useEffect(() => {
    if (isWebinar && userInfo && userInfo.data) {
      try {
        let list = JSON.parse(isWebinar) || [];
        if (list.includes(userInfo.data.organizationId))
          setWebinarAllowed(true);
        else
          setWebinarAllowed(false);
      } catch (err) {
        console.log(err);
      }
    }
  }, [isWebinar]);
  const customizeBannersFunction = async () => {
    if (userInfo && userInfo.data) {
      const response = await dispatch(customizeBanner(userInfo.data.organizationId));
      if (response && response.status === 200) {
        dispatch(getBannerGames());
        setCustomize(true);
      }
    }
  }
  const edit = () => {
    setBannerCreateModal(true);
    setBannerEditGameDetails();
  }
  const toggleAccess = async () => {
    setWebinarAllowed(prevState => !prevState);
    if (id && userInfo && userInfo.data) {
      const response = await dispatch(toggleWebinarAccess({ webinarId: id, organizationId: userInfo.data.organizationId }));
      // if (response === 200)
      //   dispatch(getAllWebinars());
    }
  }
  const formatToDate = (dateString) => {
    const date = new Date(dateString);
    const newDateString = `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}-${monthNames[date.getMonth()]}-${date.getFullYear()} 
    ${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
    return newDateString;
  }
  return (
    <React.Fragment>
      <div className="bannercard">
        {
          isWebinar &&
          <div className="toggle-container">
            <div className={`btn-tooltip ${(role === ROLES.ORG_SUPER_ADMIN || role === ROLES.ORG_ADMIN) ? "" : "hidden"}`}>
              <label className="switch">
                <input type="checkbox" checked={webinarAllowed} onChange={toggleAccess} />
                <span className="slider" ></span>
              </label>
              <div className="tooltip" role="tooltip">
                <span>Allow users to join.</span>
              </div>
            </div>
            <div className="btn-tooltip join" key={joinKey}>
              <button className={`btn btn-primary ${(startsAt && new Date(startsAt) > new Date()) ? "disabled" : ""}`} onClick={redirect}>Join</button>
              {
                (startsAt && new Date(startsAt) > new Date()) &&
                <div className="tooltip" role="tooltip">
                  <span>Starts At: {formatToDate(startsAt)}</span>
                </div>
              }
            </div>
          </div>
        }
        {
          (!isWebinar && (role === ROLES.ORG_SUPER_ADMIN || role === ROLES.ORG_ADMIN)) ?
            <div className="banner-btn-grp">
              <button className={`btn btn-primary ${customize ? "hide" : ""}`} onClick={customizeBannersFunction}> Customize</button>
              <div className={`${customize ? "" : "hide"}`}>
                <button className="btn btn-primary" onClick={edit}>
                  <img alt="" src="https://img.icons8.com/metro/52/ffffff/pencil.png" />
                </button>
                <button className="btn btn-primary" onClick={() => setOpenConfirmModal(true)}>To Default</button>
              </div>
            </div> : null
        }
        <div className="bannercard-img">
          <img src={S3_BASE_URL + srcImage}
            onClick={redirect}
            // key={srcImage} 
            alt="bannerimage" />
        </div>
        <div className={title ? "bannercard-content" : "bannercard-content hide"}>
          <div className="tag-label">
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
          </div>
          <h5>{title}</h5>
          <div className="banner-viewcount">
            <div className="banner-viewcount-card">
              <img src={profileImg} alt="profile" />
              <span>350</span>
            </div>
            <div className="banner-viewcount-card">
              <img src={countImg} alt="profile" />
              <span>5480</span>
            </div>
          </div>
        </div>
      </div>
      {/* // Mobile view */}
      <div className="mobile-bannercard">
        {
          isWebinar &&
          <div className="toggle-container">
            <div className={`btn-tooltip ${(role === ROLES.ORG_SUPER_ADMIN || role === ROLES.ORG_ADMIN) ? "" : "hidden"}`}>
              <label className="switch">
                <input type="checkbox" checked={webinarAllowed} onChange={toggleAccess} />
                <span className="slider" ></span>
              </label>
              <div className="tooltip" role="tooltip">
                <span>Allow users to join.</span>
              </div>
            </div>
            <div className="btn-tooltip join" key={joinKey}>
              <button className={`btn btn-primary ${(startsAt && new Date(startsAt) > new Date()) ? "disabled" : ""}`} onClick={redirect}>Join</button>
              {
                (startsAt && new Date(startsAt) > new Date()) &&
                <div className="tooltip" role="tooltip">
                  <span>Starts At: {formatToDate(startsAt)}</span>
                </div>
              }
            </div>
          </div>
        }
        <div className="mobile-bannercard-img">
          <img src={S3_BASE_URL + mobileImage} onClick={redirect} alt="mobile-bannerimage" />
        </div>

        {
          (!isWebinar && (role === ROLES.ORG_SUPER_ADMIN || role === ROLES.ORG_ADMIN)) ?
            <div className="banner-btn-grp">
              <button className={`btn btn-primary ${customize ? "hide" : ""}`} onClick={customizeBannersFunction}> Customize</button>
              <div className={`${customize ? "" : "hide"}`}>
                <button className="btn btn-primary" onClick={edit}>
                  <img alt="" src="https://img.icons8.com/metro/52/ffffff/pencil.png" />
                </button>
                <button className="btn btn-primary" onClick={() => setOpenConfirmModal(true)}>To Default</button>
              </div>
            </div> : null
        }
        <div className={title ? "mobile-bannercard-content" : "mobile-bannercard-content hide"}>
          <div className="tag-label">
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
          </div>
          <h5>{title}</h5>
          <div className="mobile-banner-viewcount">
            <div className="mobile-banner-viewcount-card">
              <img src={profileImg} alt="profile" />
              <span>350</span>
            </div>
            <div className="mobile-banner-viewcount-card">
              <img src={countImg} alt="profile" />
              <span>5480</span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BannerCarousel;
