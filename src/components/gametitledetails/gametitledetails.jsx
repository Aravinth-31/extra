import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./gametitledetails.css";
import Rating from "../rating/rating";
//image
import like from "../../assets/images/like.svg";
import playButton from "../../assets/images/playButton.svg";
import download from "../../assets/images/download.svg";
import { useDispatch, useSelector } from "react-redux";
import { addToFavourite, removeFromFavourite } from "../../redux/actions/homepageActions";
import LikeShareModal from "../modal/likesharemodal";
import { useHistory } from "react-router-dom";

import LoginModal from "../../components/modal/loginmodal";
import GameBanner from "../gamebanner/gamebanner";
import PurchasePlanModal from '../modal/purchaseplan';
import { BASE_URL, encryptData } from "../../helpers/helper";
import { useEffect } from "react";
import ROLES, { OrgRoles } from "../../helpers/userTypes";
import { downloadFile } from "../../helpers/downloadFile";
import axios from "axios";

const playNowGames = [
  "Where's that Word",
  "Back to school",
  "Room to Escape"
];

const GameTitleDetails = (gameDetail) => {
  const dispatch = useDispatch();
  const orgRoles = ["ORG_SUPER_ADMIN", "ORG_ADMIN", "EMPLOYEE"];
  const { userInfo } = useSelector((state) => state.getUser);
  var role = ""
  if (userInfo && userInfo.data)
    role = userInfo.data.role;
  const [openShareModal, setOpenShareModal] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const { favGames } = useSelector((state) => state.getFavGames);
  const [openPurchasePlansModal, setOpenPurchasePlansModal] = useState(false);
  const { myPlanDetails } = useSelector(state => state.getMyPlans);
  const [purchaseModalType, setPurchaseModalType] = useState('');
  const [liked, setLiked] = useState(false);
  const [shareLink, setShareLink] = useState("");
  // const [answersPdf, setAnswersPdf] = useState();

  const history = useHistory();

  // useEffect(() => {
  //   const callBack = async () => {
  //     if (gameDetail?.gameDetail?.data) {
  //       const { status, data } = await axios.post(BASE_URL + "/php/API/pdf.php", { gameId: gameDetail.gameDetail.data.id });
  //       if (status === 200 && data?.response) {
  //         setAnswersPdf(data.response);
  //       }
  //     }
  //   }
  //   callBack()
  // }, [gameDetail]);

  useEffect(() => {
    if (userInfo && userInfo.data && OrgRoles.includes(userInfo.data.role)) {
      const { email, organizationId } = userInfo && userInfo.data;
      const obj = { from: email, organizationId: organizationId, onBoardType: "INVITE", redirectURL: history.location.pathname };
      const inviteToken = encryptData(obj);
      const shareLink = BASE_URL + "/join?inviteId=" + inviteToken;
      setShareLink(shareLink);
    }
    else
      setShareLink(BASE_URL + history.location.pathname);
  }, [userInfo, history]);

  const addFav = () => {
    setLiked(true);
    dispatch(addToFavourite(gameDetail?.gameDetail?.data?.id));
  };
  const removeFav = () => {
    setLiked(false);
    dispatch(removeFromFavourite(gameDetail?.gameDetail?.data?.id));
  };
  const purchasePlan = (value) => {
    setOpenPurchasePlansModal(true);
    setPurchaseModalType(value);
  }
  const handlePlayGame = async (e, flag) => {
    e.preventDefault();
    if (flag === "start" && gameDetail?.gameDetail?.data) {
      if (!gameDetail.gameDetail.data.isDefault && !gameDetail.gameDetail.data.isLive)
        return;
      if (myPlanDetails?.data?.planDetail && (myPlanDetails.data.planDetail?.validityPeriod > 0 || new Date(myPlanDetails.data.planDetail?.validityDate) > new Date()))
        gameDetail.history.push("/active-games/" + gameDetail.gameDetail.data.id)
    }
    else if (gameDetail?.gameDetail?.data?.demoLink) {
      if (gameDetail.gameDetail.data.demoLink.includes("?"))
        window.location.replace(gameDetail.gameDetail.data.demoLink + "&gameId=" + gameDetail.gameDetail.data.id);
      else
        window.location.replace(gameDetail.gameDetail.data.demoLink + "?gameId=" + gameDetail.gameDetail.data.id);
    }
  };

  useEffect(() => {
    if (favGames?.data && gameDetail?.gameDetail?.data) {
      favGames.data.forEach((game) => {
        if (game.id === gameDetail.gameDetail.data.id) {
          setLiked(true)
          return;
        }
      });
    }
  }, [favGames, gameDetail]);
  return (
    <div className="game-title-wrapper">
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
        {gameDetail && gameDetail.gameDetail && gameDetail.gameDetail.data && gameDetail.gameDetail.data.category[0]
          ? gameDetail.gameDetail.data.category[0].title + " Games"
          : ""}
      </div> */}
      <div className="game-subheader">
        <div className="game-subheader-left">
          <div className="game-subheader-topleft">
            <div className="game-heading-bg">
              <h5>
                {gameDetail &&
                  gameDetail.gameDetail &&
                  gameDetail.gameDetail.data
                  ? gameDetail.gameDetail.data.title
                  : ""}
              </h5>
            </div>
            <Rating />
          </div>
          <div className="like-share">
            {/* use active class on click Link tag for like*/}
            {/* Enable Only for admin and owner */}
            {(role === "ORG_SUPER_ADMIN" || role === "ORG_ADMIN") ? (
              liked ?
                <Link className="active" to={"#"} onClick={removeFav}>
                  {/* <img src={like} alt="info" style={{ marginRight: '11px' }} /> */}
                  <svg width="20" height="18" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.60011 15.8C8.70011 15.9 8.90011 16 9.00011 16C9.20011 16 9.30011 15.9 9.40011 15.8L16.6001 8.4C19.6001 5.3 17.5001 0 13.2001 0C10.6001 0 9.50011 1.9 9.00011 2.3C8.50011 1.9 7.40011 0 4.80011 0C0.600113 0 -1.59989 5.3 1.40011 8.4L8.60011 15.8Z" fill="var(--color-theme)" />
                  </svg>
                  Favourite
                </Link>
                :
                <Link onClick={addFav} to={"#"} className="favourite">
                  <svg width="18" height="16" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className="fav-child" d="M17.5003 9.57205L10.0003 17.0001L2.5003 9.57205C2.00561 9.09067 1.61594 8.51207 1.35585 7.87269C1.09575 7.23331 0.970863 6.54701 0.989039 5.85699C1.00721 5.16697 1.16806 4.48819 1.46146 3.86339C1.75485 3.23859 2.17444 2.68131 2.69379 2.22663C3.21314 1.77196 3.82101 1.42974 4.47911 1.22154C5.13722 1.01333 5.83131 0.943639 6.51767 1.01686C7.20403 1.09007 7.8678 1.30461 8.46718 1.64696C9.06655 1.98931 9.58855 2.45205 10.0003 3.00605C10.4138 2.45608 10.9364 1.99738 11.5354 1.65866C12.1344 1.31994 12.7968 1.1085 13.4812 1.03757C14.1657 0.966645 14.8574 1.03775 15.5131 1.24645C16.1688 1.45514 16.7743 1.79693 17.2919 2.25042C17.8094 2.70391 18.2277 3.25934 18.5207 3.88195C18.8137 4.50456 18.975 5.18094 18.9946 5.86876C19.0142 6.55659 18.8916 7.24105 18.6344 7.8793C18.3773 8.51756 17.9912 9.09588 17.5003 9.57805" stroke="var(--color-theme)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Favourite
                </Link>
            ) : null
            }

            {openLoginModal && (
              <LoginModal
                modalid="loginmodal"
                toggle={openLoginModal}
                setOpenLoginModal={setOpenLoginModal}
                gameDetailPage
              />
            )}
            {openPurchasePlansModal && <PurchasePlanModal toggle={openPurchasePlansModal} setOpenPurchasePlansModal={setOpenPurchasePlansModal} purchaseModalType={purchaseModalType} />}
            <Link onClick={() => (
              setOpenShareModal(true))} to={"#"}>
              <svg width="20" height="20" viewBox="0 0 24 25" fill="none">
                <path
                  d="M6.00012 15.2017C7.65698 15.2017 9.00012 13.8585 9.00012 12.2017C9.00012 10.5448 7.65698 9.20168 6.00012 9.20168C4.34327 9.20168 3.00012 10.5448 3.00012 12.2017C3.00012 13.8585 4.34327 15.2017 6.00012 15.2017Z"
                  stroke="#23282E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.9999 9.20163C19.6567 9.20163 20.9999 7.85848 20.9999 6.20163C20.9999 4.54478 19.6567 3.20163 17.9999 3.20163C16.343 3.20163 14.9999 4.54478 14.9999 6.20163C14.9999 7.85848 16.343 9.20163 17.9999 9.20163Z"
                  stroke="#23282E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.9999 21.2016C19.6567 21.2016 20.9999 19.8585 20.9999 18.2016C20.9999 16.5447 19.6567 15.2016 17.9999 15.2016C16.343 15.2016 14.9999 16.5447 14.9999 18.2016C14.9999 19.8585 16.343 21.2016 17.9999 21.2016Z"
                  stroke="#23282E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.69995 10.9016L15.2999 7.50159"
                  stroke="#23282E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.69995 13.5016L15.2999 16.9016"
                  stroke="#23282E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Share
            </Link>
          </div>
        </div>
        <GameBanner
          gameDetail={gameDetail.gameDetail}
          openFeedbackModal={gameDetail.openFeedbackModal}
          isAdmin={gameDetail.isAdmin}
          openThankyouModal={gameDetail.openThankyouModal}
          openShareModal={openShareModal}
          openLoginModal={openLoginModal}
          openPurchasePlansModal={openPurchasePlansModal}
        />
        {openShareModal && (
          <LikeShareModal
            toggle={openShareModal}
            setOpenShareModal={setOpenShareModal}
            shareLink={shareLink}
          />
        )}

        <div className="game-subheader-right">
          <div className="btn-detail">
            <div className={orgRoles.includes(role) ? "btn-group hide" : "btn-group"}>
              <div className="play-btn-conatiner">
                <button
                  type="submit"
                  className="btn btn-primary play-game-btn"
                  onClick={handlePlayGame}
                >
                  <img src={playButton} alt="info" />
                  {
                    gameDetail &&
                      gameDetail.gameDetail &&
                      gameDetail.gameDetail.data &&
                      gameDetail.gameDetail.data.title &&
                      playNowGames.includes(gameDetail.gameDetail.data.title) ?
                      "Play Now" : "Play Demo"}
                </button>
              </div>
              {
                !userInfo ?
                  <button
                    type="submit"
                    className={`btn btn-secondry invite margin0`}
                    data-toggle="tooltip"
                    // title="Some tooltip text!"
                    onClick={() => setOpenLoginModal(true)}
                  >
                    <span className='btn-icons'>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="margin0">
                        <path d="M8.10593 9.20385C7.7636 8.96501 7.39777 8.7704 7.01517 8.62172C7.52413 8.15912 7.86176 7.5111 7.9205 6.78563C8.69232 6.03357 9.70404 5.62128 10.7886 5.62128C11.6353 5.62128 12.4482 5.87624 13.1397 6.35849C13.3875 6.53131 13.7283 6.47064 13.9011 6.22284C14.0738 5.97515 14.0131 5.63431 13.7654 5.4616C13.4231 5.22276 13.0572 5.02826 12.6746 4.87947C13.2362 4.36902 13.5893 3.63298 13.5893 2.81609C13.5893 1.27832 12.3383 0.0273438 10.8006 0.0273438C9.26291 0.0273438 8.01193 1.27832 8.01193 2.81609C8.01193 3.62967 8.36217 4.36304 8.91994 4.87328C8.84357 4.90265 8.76762 4.93373 8.69243 4.96684C8.35021 5.11745 8.02849 5.30266 7.72931 5.52013C7.3167 4.49506 6.31214 3.76959 5.14116 3.76959C3.60351 3.76959 2.35242 5.02057 2.35242 6.55823C2.35242 7.36957 2.70074 8.10091 3.25551 8.61093C1.77222 9.16667 0.569527 10.3603 0.079903 11.8826C-0.0824504 12.3874 0.00353279 12.9227 0.315849 13.3513C0.628166 13.7799 1.11138 14.0256 1.64159 14.0256H6.39887C6.70082 14.0256 6.94563 13.7808 6.94563 13.4788C6.94563 13.1768 6.70082 12.932 6.39887 12.932H1.64159C1.46482 12.932 1.30375 12.8501 1.19961 12.7072C1.09547 12.5642 1.06684 12.3858 1.12089 12.2174C1.66135 10.5371 3.30967 9.36353 5.1292 9.36353C5.97579 9.36353 6.78884 9.61849 7.48033 10.1007C7.72803 10.2736 8.06886 10.2128 8.24168 9.96509C8.4144 9.71739 8.35373 9.37656 8.10593 9.20385ZM10.8006 1.12099C11.7353 1.12099 12.4957 1.88138 12.4957 2.81609C12.4957 3.75069 11.7353 4.51119 10.8006 4.51119C9.86597 4.51119 9.10547 3.75069 9.10547 2.81609C9.10547 1.88138 9.86597 1.12099 10.8006 1.12099ZM5.14116 4.86313C6.07587 4.86313 6.83626 5.62363 6.83626 6.55823C6.83626 7.49294 6.07587 8.25333 5.14116 8.25333C4.20646 8.25333 3.44607 7.49294 3.44607 6.55823C3.44607 5.62363 4.20646 4.86313 5.14116 4.86313ZM13.9995 11.4283C13.9995 11.7303 13.7547 11.9751 13.4526 11.9751H11.9489V13.4788C11.9489 13.7808 11.7041 14.0256 11.4021 14.0256C11.1001 14.0256 10.8553 13.7808 10.8553 13.4788V11.9751H9.35156C9.04961 11.9751 8.80479 11.7303 8.80479 11.4283C8.80479 11.1262 9.04961 10.8814 9.35156 10.8814H10.8553V9.37773C10.8553 9.07578 11.1001 8.83097 11.4021 8.83097C11.7041 8.83097 11.9489 9.07578 11.9489 9.37773V10.8814H13.4526C13.7547 10.8814 13.9995 11.1262 13.9995 11.4283Z" fill="white" />
                      </svg>
                    </span>
                    Invite Players
                  </button> :
                  <Link to={"#"}>
                    <div className="btn-tooltip">
                      {/* use disabled class to disabled the button */}
                      <button
                        type="submit"
                        className={`btn btn-secondry invite margin0`}
                        data-toggle="tooltip"
                        // title="Some tooltip text!"
                        onClick={() => purchasePlan('Invite Players')}
                      >
                        <span className='btn-icons'>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="margin0">
                            <path d="M8.10593 9.20385C7.7636 8.96501 7.39777 8.7704 7.01517 8.62172C7.52413 8.15912 7.86176 7.5111 7.9205 6.78563C8.69232 6.03357 9.70404 5.62128 10.7886 5.62128C11.6353 5.62128 12.4482 5.87624 13.1397 6.35849C13.3875 6.53131 13.7283 6.47064 13.9011 6.22284C14.0738 5.97515 14.0131 5.63431 13.7654 5.4616C13.4231 5.22276 13.0572 5.02826 12.6746 4.87947C13.2362 4.36902 13.5893 3.63298 13.5893 2.81609C13.5893 1.27832 12.3383 0.0273438 10.8006 0.0273438C9.26291 0.0273438 8.01193 1.27832 8.01193 2.81609C8.01193 3.62967 8.36217 4.36304 8.91994 4.87328C8.84357 4.90265 8.76762 4.93373 8.69243 4.96684C8.35021 5.11745 8.02849 5.30266 7.72931 5.52013C7.3167 4.49506 6.31214 3.76959 5.14116 3.76959C3.60351 3.76959 2.35242 5.02057 2.35242 6.55823C2.35242 7.36957 2.70074 8.10091 3.25551 8.61093C1.77222 9.16667 0.569527 10.3603 0.079903 11.8826C-0.0824504 12.3874 0.00353279 12.9227 0.315849 13.3513C0.628166 13.7799 1.11138 14.0256 1.64159 14.0256H6.39887C6.70082 14.0256 6.94563 13.7808 6.94563 13.4788C6.94563 13.1768 6.70082 12.932 6.39887 12.932H1.64159C1.46482 12.932 1.30375 12.8501 1.19961 12.7072C1.09547 12.5642 1.06684 12.3858 1.12089 12.2174C1.66135 10.5371 3.30967 9.36353 5.1292 9.36353C5.97579 9.36353 6.78884 9.61849 7.48033 10.1007C7.72803 10.2736 8.06886 10.2128 8.24168 9.96509C8.4144 9.71739 8.35373 9.37656 8.10593 9.20385ZM10.8006 1.12099C11.7353 1.12099 12.4957 1.88138 12.4957 2.81609C12.4957 3.75069 11.7353 4.51119 10.8006 4.51119C9.86597 4.51119 9.10547 3.75069 9.10547 2.81609C9.10547 1.88138 9.86597 1.12099 10.8006 1.12099ZM5.14116 4.86313C6.07587 4.86313 6.83626 5.62363 6.83626 6.55823C6.83626 7.49294 6.07587 8.25333 5.14116 8.25333C4.20646 8.25333 3.44607 7.49294 3.44607 6.55823C3.44607 5.62363 4.20646 4.86313 5.14116 4.86313ZM13.9995 11.4283C13.9995 11.7303 13.7547 11.9751 13.4526 11.9751H11.9489V13.4788C11.9489 13.7808 11.7041 14.0256 11.4021 14.0256C11.1001 14.0256 10.8553 13.7808 10.8553 13.4788V11.9751H9.35156C9.04961 11.9751 8.80479 11.7303 8.80479 11.4283C8.80479 11.1262 9.04961 10.8814 9.35156 10.8814H10.8553V9.37773C10.8553 9.07578 11.1001 8.83097 11.4021 8.83097C11.7041 8.83097 11.9489 9.07578 11.9489 9.37773V10.8814H13.4526C13.7547 10.8814 13.9995 11.1262 13.9995 11.4283Z" fill="white" />
                          </svg>
                        </span>
                        Invite Players
                      </button>
                      {/* before login in show this*/}
                      <div className="tooltip" role="tooltip">
                        <span>Subscribe to enable this feature</span>
                      </div>
                    </div>
                  </Link>
              }
            </div>
            <div className={orgRoles.includes(role) ? "btn-group org-roles" : "btn-group hide"}>
              {
                <div className="download-btns">
                  {
                    gameDetail?.gameDetail?.data?.answerSheet && role === ROLES.ORG_SUPER_ADMIN &&
                    <a className="download">
                      <div>
                        <button
                          type="submit"
                          className={`btn btn-primary play-game-btn`}
                          onClick={() => {
                            downloadFile(gameDetail?.gameDetail?.data?.answerSheet)
                          }}
                        >
                          <img src={download} alt="" />
                          Answer Sheet
                        </button>
                      </div>
                    </a>
                  }
                  {
                    gameDetail?.gameDetail?.data?.mailerTemplate && role === ROLES.ORG_SUPER_ADMIN &&
                    <a className="download">
                      <div>
                        <button
                          type="submit"
                          className={`btn btn-primary play-game-btn`}
                          onClick={() => {
                            downloadFile(gameDetail?.gameDetail?.data?.mailerTemplate)
                          }}
                        >
                          <img src={download} alt="" />
                          Mailer Template
                        </button>
                      </div>
                    </a>
                  }
                </div>
              }

              <Link className="show767" to={"#"}>
                <div className="btn-tooltip">
                  <button
                    type="submit"
                    className={`btn btn-primary play-game-btn ${myPlanDetails?.data?.planDetail && new Date(myPlanDetails.data.planDetail.validityDate) > new Date() ? "" : "disabled"} ${gameDetail?.gameDetail?.data && !gameDetail?.gameDetail?.data.isDefault && !gameDetail.gameDetail.data.isLive ? "disabled" : ""}`}
                    onClick={(e) => handlePlayGame(e, "start")}
                  >
                    <img src={playButton} alt="info" />
                    {
                      gameDetail &&
                        gameDetail.gameDetail &&
                        gameDetail.gameDetail.data &&
                        gameDetail.gameDetail.data.title &&
                        playNowGames.includes(gameDetail.gameDetail.data.title) ?
                        "Play Now" :
                        "Start/Join Game"
                    }
                  </button>
                  {/* tooltip */}
                  {
                    gameDetail?.gameDetail?.data && !gameDetail.gameDetail.data.isDefault && !gameDetail.gameDetail.data.isLive ?
                      <div className="tooltip" role="tooltip">
                        <span>Please make game live first.</span>
                      </div>
                      :
                      <div className={myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail && new Date(myPlanDetails.data.planDetail.validityDate) > new Date() ? "tooltip hide" : "tooltip "} role="tooltip">
                        <span>Your plan is not activated</span>
                      </div>
                  }
                </div>
              </Link>

              <Link className="hide767" to={"#"}>
                <div className="btn-tooltip">
                  <button type="submit"
                    className={`btn btn-primary play-game-btn ${myPlanDetails?.data?.planDetail && new Date(myPlanDetails.data.planDetail.validityDate) > new Date() ? "" : "disabled"} ${gameDetail?.gameDetail?.data && !gameDetail?.gameDetail?.data.isDefault && !gameDetail.gameDetail.data.isLive ? "disabled" : ""}`}
                    onClick={(e) => handlePlayGame(e, "start")}>
                    <img src={playButton} alt="info" />
                    {
                      gameDetail &&
                        gameDetail.gameDetail &&
                        gameDetail.gameDetail.data &&
                        gameDetail.gameDetail.data.title &&
                        playNowGames.includes(gameDetail.gameDetail.data.title) ?
                        "Play Now" :
                        "Start/Join Game"
                    }
                  </button>
                  {/* tooltip */}
                  {
                    gameDetail?.gameDetail?.data && !gameDetail.gameDetail.data.isDefault && !gameDetail.gameDetail.data.isLive ?
                      <div className="tooltip" role="tooltip">
                        <span>Please make game live first.</span>
                      </div>
                      : <div className={myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail && new Date(myPlanDetails.data.planDetail.validityDate) > new Date() ? "tooltip hide" : "tooltip "} role="tooltip">
                        <span>Your plan is not activated</span>
                      </div>
                  }
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTitleDetails;
