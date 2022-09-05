import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "./header.css";

import ExtraMilePlay from '../../assets/images/ExtramilPlay.png';
import homepage from '../../assets/images/homepage.svg';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from "../../redux/actions/userAction";
import { gameAllCategory, getAllObjectives } from "../../redux/actions/gameDetailAction";
import { getOrganisation, getOrganisationDetailsById } from "../../redux/actions/plansApiActions";
import ContactUsModal from "../modal/contactus";
import ThankyouModal from "../modal/thankyoucontacting";
import LoadingComponent from "../loader/LoadingComponent";
import DemoRequestModal from "../../components/modal/demorequestmodal";
import ROLES, { OrgRoles } from "../../helpers/userTypes";
import SampleAvatar from "../svgIcon/SampleAvatar";
import ServerClosed from "../modal/ServerClosedModal";
import { setMasterOtpOrganisation } from "../../redux/actions/organisationActions";
import notification_icon from "../../assets/images/notification_icon.svg";
import { monthNames, S3_BASE_URL } from "../../helpers/helper";
const Header = (props) => {
  const [loaded, setLoaded] = useState(false);
  const [headerProfile, setHeaderProfile] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);
  const [openThanyouModal, setOpenThankyouModal] = useState(false);
  const [headerCenterToggler, setHeaderCenterToggler] = useState(false);
  const [openDemoRequestModal, setOpenDemoRequestModal] = useState(false);
  const [upgradeKey, setUpgradeKey] = useState(1);
  const [allRead, setAllRead] = useState(true);

  const GetOrganisation = useSelector((state) => state.getOrganisation);
  const { orgDetailsByEmail } = GetOrganisation;
  const GetOrganisationById = useSelector(state => state.getOrganisationById);
  const { orgDetailsById } = GetOrganisationById;
  const { gameCategory } = useSelector((state) => state.gameAllCategory);
  const { gameObjectives } = useSelector(state => state.getAllObjectives);
  const UserInfo = useSelector(state => state.getUser);
  const { loading } = useSelector(state => state.logOut);
  const { userInfo } = UserInfo;
  const AddDemoRequest = useSelector(state => state.addedDemoRequest);
  const { notifications } = useSelector(state => state.notifications);

  var role = ""
  if (userInfo && userInfo.data) {
    role = userInfo.data.role;
  }
  const dispatch = useDispatch();
  const headerCenterRef = React.createRef();
  const signOut = () => {
    props.signOut();
  };
  useEffect(() => {
    if (
      (UserInfo && UserInfo.loading) ||
      loading ||
      (GetOrganisation && GetOrganisation.loading) ||
      (AddDemoRequest && AddDemoRequest.loading)
    )
      setLoaded(false);
    else
      setLoaded(true);
  }, [UserInfo, loading, GetOrganisation, AddDemoRequest])
  useEffect(() => {
    if (!props.onboard) {
      if (!gameCategory)
        dispatch(gameAllCategory());
      if (!gameObjectives)
        dispatch(getAllObjectives());
    }
  }, []);
  useEffect(() => {
    if (!props.onboard && !userInfo) dispatch(getUser());
    return () => {
      if (getNotificationRef.current)
        clearInterval(getNotificationRef.current);
    }
  }, []);
  // const flag = localStorage.getItem("upgrade-alert-flag");
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     const flag1 = JSON.parse(localStorage.getItem("demoRequest") || JSON.stringify(false));
  //     const flag2 = JSON.parse(sessionStorage.getItem("popupShown") || JSON.stringify(false));
  //     const userSigninInfo = decryptData(localStorage.getItem("userSignInInfo") || encryptData(null));
  //     const userSignupInfo = decryptData(localStorage.getItem("userSignUpInfo") || encryptData(null));
  //     if (!flag1 && flag1 !== "success" && !flag2 && !props.onboard && !userSigninInfo && !userSignupInfo) {
  //       setOpenDemoRequestModal(true);
  //       sessionStorage.setItem("popupShown", JSON.stringify(true));
  //     }
  //   }, 7000);
  //   return () => {
  //     clearTimeout(timeout);
  //   }
  // }, [])

  const getNotificationRef = useRef();

  useEffect(() => {
    if (props.inviteId) {
      dispatch(getOrganisationDetailsById(props.inviteId));
    }
    if (userInfo && !orgDetailsByEmail) {
      dispatch(getOrganisation(userInfo.data.email));
    }
    if (userInfo?.data) {
      if (getNotificationRef.current)
        clearInterval(getNotificationRef.current);
      window.socket?.emit("getNotification", { userId: userInfo.data.id });
      getNotificationRef.current = setInterval(() => {
        window.socket?.emit("getNotification", { userId: userInfo.data.id });
      }, 30000);
    }
  }, [userInfo]);
  useEffect(() => {
    const whatsappContainer = document.querySelector("#whatsapp-container");
    const chatBotContainer = document.querySelector("#chat-bot-launcher-container");
    if (orgDetailsByEmail && orgDetailsByEmail.data) {
      if (orgDetailsByEmail.data.colourAccent && role !== ROLES.EXTRAMILE_SUPERADMIN) {
        const code = orgDetailsByEmail.data.colourAccent;
        const element = document.querySelector(":root");
        element.style.setProperty('--color-theme', code);
        element.style.setProperty('--color-theme_1', code + "1A");
        element.style.setProperty('--color-theme_2', code + "2A");
        element.style.setProperty('--color-theme_5', code + "5A");
        // element.style.setProperty('--background-theme', `linear-gradient(85.42deg, ${code} 0%, ${code + "6A"} 100%)`);
        element.style.setProperty('--background-theme', code);
      }
      whatsappContainer && (whatsappContainer.style.display = "none");
      if (role !== ROLES.EXTRAMILE_SUPERADMIN)
        chatBotContainer && (chatBotContainer.style.display = "block");
    }
    else {
      if (role !== ROLES.EXTRAMILE_SUPERADMIN)
        whatsappContainer && (whatsappContainer.style.display = "flex");
      chatBotContainer && (chatBotContainer.style.display = "none");
    }
  }, [orgDetailsByEmail, role])
  useEffect(() => {
    if (role === ROLES.EXTRAMILE_SUPERADMIN) {
      const whatsappContainer = document.querySelector("#whatsapp-container");
      whatsappContainer && (whatsappContainer.style.display = "none");
    }
  }, [role]);
  const toggleProfile = () => {
    if (document.body.clientWidth <= 991) {
      setHeaderProfile(prevState => !prevState);
    }
  };
  const toggleHeaderCenter = () => {
    setHeaderProfile(false);
    if (!headerCenterToggler) {
      headerCenterRef.current.classList.add("show");
    } else {
      headerCenterRef.current.classList.remove("show");
    }
    setHeaderCenterToggler(prevState => !prevState);
  };

  // const [notifications, setNotifications] = useState(
  //   [
  //     {
  //       message: "Your password has been successfully changed.",
  //       read: false,
  //       date: "Jul 23,2021 at 09:15 AM"
  //     },
  //     {
  //       message: "Thank you for booking a meeting with us.",
  //       read: true,
  //       date: "Jul 23,2021 at 09:15 AM"
  //     },
  //     {
  //       message: "Great news we are launching our 5th fund:DLE senior living.",
  //       read: false,
  //       date: "Jul 23,2021 at 09:15 AM"
  //     },
  //     {
  //       message: "Your password has been successfullyyyyyyyyyyyyyy changed.",
  //       read: true,
  //       date: "Jul 23,2021 at 09:15 AM"
  //     },
  //     {
  //       message: "Thank you for booking a meeting with usssssss.",
  //       read: true,
  //       date: "Jul 23,2021 at 09:15 AM"
  //     },
  //     {
  //       message: "Great news we are launching our 5th fund:DLE senior livinggggg.",
  //       read: true,
  //       date: "Jul 23,2021 at 09:15 AM"
  //     },
  //   ]);

  useEffect(() => {
    if (notifications) {
      let flag = notifications.some(notification => !notification.read);
      setAllRead(!flag);
    }
  }, [notifications]);
  const markAllRead = () => {
    if (notifications.length > 0 && userInfo?.data) {
      window.socket?.emit("markAsRead", { all: true, userId: userInfo.data.id });
    }
  }
  const notificationClicked = (notification) => {
    if (notification.redirectLink) {
      if (notification.redirectLink.includes(".com"))
        props.history.push(notification.redirectLink.split(".com")[1]);
      else
        props.history.push(notification.redirectLink);
    }
    if (userInfo?.data) {
      window.socket?.emit("markAsRead", { all: false, userId: userInfo.data.id, id: notification.id });
    }
  }
  const formatToDate = (dateString) => {
    const date = new Date(dateString);
    const newDateString = `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}-${monthNames[date.getMonth()]}-${date.getFullYear()} 
    ${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
    return newDateString;
  }

  return (
    <div id="header-element" className={loaded ? "" : "loading"}>
      <LoadingComponent loaded={loaded} />
      {openThanyouModal && <ThankyouModal toggle={openThanyouModal} setOpenThankyouModal={setOpenThankyouModal} modalid="thankyoucontact" />}
      {openContactModal && <ContactUsModal modalid="contactAdmin" toggle={openContactModal} setOpenContactModal={setOpenContactModal} setOpenThankyouModal={setOpenThankyouModal} admin orgId={orgDetailsByEmail && orgDetailsByEmail.data && orgDetailsByEmail.data.id} />}
      {
        openDemoRequestModal &&
        <DemoRequestModal modalid={"demo-request-modal"} toggle={openDemoRequestModal} setOpenDemoRequestModal={setOpenDemoRequestModal} />
      }
      {/* <ServerClosed setUpgradeKey={setUpgradeKey} toggle={!flag} modalid="server-closed" /> */}

      <header className="header">
        <div className="header-left">
          {/* click on this show header-center on mobile view only */}
          {!props.isAdmin && !props.onboard && (
            <div className="mobileHamburger" onClick={toggleHeaderCenter}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <Link to="/" onClick={() => {
            if (props.location && props.location.pathname === "/")
              window.location.reload();
            if (props.history)
              props.history.push("/")
          }}>
            {(userInfo || props.inviteId) && ((orgDetailsByEmail && orgDetailsByEmail.data?.companyLogo) || (orgDetailsById && orgDetailsById.organization?.companyLogo)) && role !== ROLES.EXTRAMILE_SUPERADMIN ? (
              <img src={S3_BASE_URL + (orgDetailsByEmail?.data?.companyLogo || orgDetailsById?.organization?.companyLogo)} alt="logo" />
            ) : (
              <img src={ExtraMilePlay} alt="logo" />
            )}
          </Link>
        </div>
        {/* click on hamburger show this on mobile use show className*/}
        {!props.onboard && !props.isAdmin ? (
          <div
            className="header-center"
            ref={headerCenterRef}
            id="header-center"
          >
            <ul>
              <li className={props.location && props.location.pathname === "/" ? "active" : ""} key={'header-home'}>
                <Link to="/" onClick={() => {
                  if (props.location && props.location.pathname === "/")
                    window.location.reload();
                  if (props.history)
                    props.history.push("/")
                }} >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M12.25 15.9988H3.75C1.68225 15.9988 0 14.3166 0 12.2488V6.99037C0 5.82815 0.551719 4.7135 1.47581 4.00865L5.72581 0.767121C7.06484 -0.254161 8.93516 -0.254161 10.2742 0.767121L11.625 1.7965V0.998839C11.658 0.169589 12.8423 0.170214 12.875 0.998839V3.05856C12.875 3.29615 12.7403 3.51318 12.5273 3.61865C12.3144 3.72409 12.0601 3.69965 11.8712 3.55568L9.51631 1.76121C8.62344 1.08021 7.3765 1.08021 6.48384 1.76106L2.23384 5.00259C1.61781 5.47243 1.25 6.21553 1.25 6.99037V12.2488C1.25 13.6273 2.3715 14.7488 3.75 14.7488H12.25C13.6285 14.7488 14.75 13.6273 14.75 12.2488V6.99037C14.75 6.20603 14.3863 5.4604 13.7772 4.99578C13.5028 4.78643 13.45 4.39425 13.6593 4.11981C13.8687 3.84534 14.2609 3.79256 14.5353 4.0019C15.4524 4.7014 16 5.81859 16 6.99037V12.2488C16 14.3166 14.3177 15.9988 12.25 15.9988ZM6.75 7.21759C6.31853 7.21759 5.96875 7.56737 5.96875 7.99884C6.01003 9.0354 7.49034 9.03462 7.53125 7.99884C7.53125 7.56734 7.18147 7.21759 6.75 7.21759ZM10.0312 7.99881C9.98997 9.03537 8.50966 9.03459 8.46875 7.99881C8.51003 6.96225 9.99034 6.96306 10.0312 7.99881ZM7.53125 10.4988C7.48997 11.5354 6.00966 11.5346 5.96875 10.4988C6.01003 9.46225 7.49034 9.46306 7.53125 10.4988ZM10.0312 10.4988C9.98997 11.5354 8.50966 11.5346 8.46875 10.4988C8.51003 9.46225 9.99034 9.46306 10.0312 10.4988Z"
                      fill="#919397"
                    />
                  </svg>
                  <span >Home</span>
                </Link>
              </li>
              <li className={props.location && /^\/category/.test(props.location.pathname) ? "nav-item dropdown active" : "nav-item dropdown"} key={'header-category'}>
                {/* on click this , show dropdown*/}
                <Link
                  to={"#"}
                  onClick={() => {
                    if (props.location && props.location.pathname.startsWith("/category"))
                      return;
                    else if (gameCategory?.data?.[0].title)
                      props.history.push("/category/" + gameCategory.data[0].title.replace("/", "-"));
                  }}
                  className="nav-link dropdown-toggle">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12.3119 15.9987C11.3235 15.9987 10.3941 15.6099 9.69478 14.9038C8.99627 14.1986 8.61642 13.2665 8.62514 12.2789L8.62499 9.24984C8.62499 8.99707 8.77721 8.7692 9.01074 8.67247C9.24413 8.57567 9.513 8.62919 9.69178 8.80791L9.74255 8.85869C9.9847 9.1009 10.349 9.16257 10.6492 9.01219C11.1619 8.7552 11.7162 8.62488 12.2967 8.62488C12.2979 8.62491 12.2991 8.62491 12.3004 8.62488C13.2802 8.62488 14.2037 9.00241 14.9003 9.68805C15.5992 10.3759 15.9892 11.2948 15.9986 12.2757C16.0586 14.2776 14.3163 16.0402 12.3119 15.9987ZM9.87484 10.2979L9.87494 12.2817C9.87494 12.2837 9.87494 12.2857 9.87491 12.2877C9.86863 12.9404 10.12 13.5571 10.5828 14.0243C12.1221 15.5753 14.7712 14.4717 14.7489 12.2877C14.7361 10.9569 13.6375 9.87471 12.2997 9.87471C12.2989 9.87474 12.2981 9.87474 12.2972 9.87471C11.9124 9.87471 11.5465 9.96044 11.2091 10.1295C10.7864 10.3414 10.3162 10.3934 9.87484 10.2979ZM3.68758 15.9987C0.402617 15.9985 -1.23543 12.0074 1.09628 9.69471C1.79361 9.00404 2.71293 8.62491 3.68817 8.62491H6.75026C7.3028 8.62307 7.58397 9.30249 7.19219 9.69171L7.14142 9.74248C6.89921 9.98466 6.8375 10.349 6.98791 10.6491C7.24512 11.1624 7.37544 11.7173 7.37522 12.2984C7.41615 14.2716 5.69969 16.0196 3.72442 15.9985C3.71211 15.9986 3.69979 15.9987 3.68758 15.9987ZM3.68855 9.87471C3.04468 9.87471 2.43728 10.1255 1.97576 10.5827C1.01627 11.491 1.01808 13.139 1.96905 14.0446C2.43397 14.505 3.05165 14.7558 3.71239 14.7488C5.04354 14.736 6.12602 13.6368 6.1254 12.2984C6.12555 11.9131 6.03982 11.5467 5.87056 11.209C5.65869 10.7862 5.60679 10.316 5.70222 9.87477C5.70222 9.87477 3.71439 9.87486 3.71236 9.87483C3.70445 9.87477 3.69645 9.87471 3.68855 9.87471ZM6.75042 7.37515C6.58782 7.37515 6.42797 7.31163 6.30843 7.19212L6.25766 7.14134C6.01548 6.89913 5.65119 6.83742 5.35102 6.98784C4.83826 7.24483 4.28398 7.37515 3.70354 7.37515C3.70239 7.37518 3.70114 7.37518 3.69986 7.37515C2.72002 7.37515 1.79648 6.99762 1.09988 6.31198C0.401055 5.62415 0.0109623 4.70518 0.00158884 3.72434C-0.0582451 1.72245 1.68378 -0.0401979 3.68833 0.00135783C5.67531 -0.0411352 7.43503 1.73442 7.37504 3.72115L7.37519 6.75019C7.37519 7.00296 7.22297 7.23083 6.98944 7.32756C6.91214 7.35959 6.83094 7.37515 6.75042 7.37515ZM3.70167 6.12532C4.08689 6.12551 4.45333 6.03977 4.79108 5.87049C5.21386 5.65865 5.684 5.60672 6.12533 5.70214L6.12524 3.71834C6.12524 3.71634 6.12524 3.71431 6.12527 3.71234C6.13152 3.05964 5.88012 2.44289 5.41739 1.97569C3.87805 0.424757 1.22901 1.52839 1.25132 3.71231C1.26407 5.04347 2.36348 6.12601 3.70167 6.12532ZM9.24992 7.37512C8.99721 7.37512 8.76934 7.22292 8.67257 6.98946C8.57581 6.75597 8.6292 6.48723 8.80786 6.30848L8.8586 6.25771C9.10097 6.01537 9.16265 5.65102 9.01227 5.35095C8.755 4.8376 8.6247 4.28269 8.62495 3.70159C8.62449 2.72107 9.00205 1.79684 9.68812 1.0998C10.3759 0.40098 11.2949 0.0108875 12.2758 0.00151405C15.5787 -0.0308244 17.2477 3.9798 14.9039 6.30532C14.2066 6.99599 13.2873 7.37512 12.312 7.37512C12.3009 7.37512 9.24992 7.37512 9.24992 7.37512ZM12.3116 6.12532C12.9555 6.12532 13.5629 5.87449 14.0244 5.41734C14.9839 4.50902 14.9821 2.86108 14.0311 1.95547C13.5662 1.49502 12.948 1.24506 12.2878 1.25125C10.9566 1.26403 9.87412 2.36325 9.87478 3.70159C9.87459 4.08691 9.96033 4.45322 10.1296 4.79101C10.3415 5.21378 10.3934 5.68399 10.2979 6.12526C10.2979 6.12526 12.3037 6.12532 12.3116 6.12532ZM12.9368 4.31312H11.687C10.8579 4.28013 10.8585 3.09604 11.687 3.06332H12.9368C13.7659 3.09632 13.7653 4.28044 12.9368 4.31312ZM4.93809 3.68822C4.93809 3.34309 4.65833 3.06332 4.31319 3.06332H3.0634C2.23429 3.09632 2.23491 4.28041 3.0634 4.31312H4.31319C4.65833 4.31312 4.93809 4.03335 4.93809 3.68822ZM4.93809 12.3431C4.93809 11.9979 4.65833 11.7182 4.31319 11.7182H3.0634C2.23429 11.7511 2.23491 12.9352 3.0634 12.9679H4.31319C4.65833 12.9679 4.93809 12.6882 4.93809 12.3431ZM13.5617 12.3431C13.5617 11.9979 13.2819 11.7182 12.9368 11.7182H11.687C10.8579 11.7511 10.8585 12.9352 11.687 12.9679H12.9368C13.2819 12.9679 13.5617 12.6882 13.5617 12.3431Z" fill="#919397" />
                  </svg>
                  <span>Category</span>
                  <div className="dropdown-arrow">
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path
                        d="M1 1.5L4 4.5L7 1.5"
                        stroke="#919397"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Link>
                {/* show this on click category and remove class hdie*/}
                <div className="dropdown-content">
                  {gameCategory &&
                    gameCategory.data &&
                    gameCategory.data.map((category) => {
                      return (
                        <Link
                          to={{
                            pathname: `/category/${category.title.replace("/", "-")}`,
                            state: { fromManageGames: false }
                          }}
                          onClick={toggleHeaderCenter}
                          key={JSON.stringify(category)}
                        >
                          {category.title}
                        </Link>
                      );
                    })}
                </div>
              </li>
              <li className={props.location && /^\/objective/.test(props.location.pathname) ? "nav-item dropdown active" : "nav-item dropdown"} key={'header-obj'}>
                {/* on click this , show dropdown*/}
                <Link
                  to={"#"}
                  onClick={() => {
                    if (props.location && props.location.pathname.startsWith("/objective"))
                      return;
                    else if (gameObjectives?.data?.[0].title)
                      props.history.push("/objective/" + gameObjectives.data[0].title.replace("/", "-"));
                  }}
                  className="nav-link dropdown-toggle">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M14.5068 12.6784C13.005 14.7583 10.5726 16 8 16C5.86312 16 3.85416 15.1678 2.34313 13.6569C0.832156 12.1459 0 10.1369 0 8C0 5.86312 0.832156 3.85416 2.34313 2.34313C3.85416 0.832156 5.86312 0 8 0C10.5726 0 13.005 1.24172 14.5068 3.32162C14.7088 3.6015 14.6457 3.99216 14.3658 4.19422C14.086 4.39628 13.6953 4.33319 13.4932 4.05334C12.2259 2.298 10.1723 1.25 8 1.25C4.27803 1.25 1.25 4.27806 1.25 8C1.25 11.7219 4.27803 14.75 8 14.75C10.1723 14.75 12.2259 13.702 13.4932 11.9466C13.6953 11.6668 14.086 11.6037 14.3658 11.8057C14.6457 12.0078 14.7088 12.3985 14.5068 12.6784ZM8 5.03125C8.79859 5.03125 9.54919 5.35216 10.1136 5.93484C10.3537 6.18278 10.7494 6.18909 10.9973 5.94897C11.2453 5.70881 11.2516 5.31313 11.0114 5.06519C10.2095 4.23722 9.14 3.78125 8 3.78125C5.67378 3.78125 3.78125 5.67378 3.78125 8C3.78125 10.3262 5.67378 12.2188 8 12.2188C9.14003 12.2188 10.2095 11.7628 11.0114 10.9348C11.2516 10.6869 11.2453 10.2912 10.9973 10.0511C10.7493 9.81091 10.3537 9.81725 10.1136 10.0652C9.54919 10.6478 8.79859 10.9688 8 10.9688C6.36303 10.9688 5.03125 9.63697 5.03125 8C5.03125 6.36303 6.36303 5.03125 8 5.03125ZM15.0777 8.63562C14.9067 8.46562 14.8125 8.23991 14.8125 8C14.8125 7.76009 14.9067 7.53438 15.0777 7.36438L15.8156 6.63075C16.0604 6.38738 16.0616 5.99166 15.8182 5.74687C15.5748 5.50203 15.1791 5.50091 14.9343 5.74425L14.1964 6.47791C13.9403 6.73244 13.7564 7.03966 13.6547 7.37503H8C7.65481 7.37503 7.375 7.65484 7.375 8.00003C7.375 8.34522 7.65481 8.62503 8 8.62503H13.6547C13.7564 8.96041 13.9403 9.26763 14.1964 9.52216L14.9343 10.2558C15.0563 10.377 15.2156 10.4375 15.375 10.4375C15.5356 10.4375 15.6961 10.376 15.8182 10.2531C16.0616 10.0083 16.0604 9.61259 15.8157 9.36925L15.0777 8.63562Z"
                      fill="#919397"
                    />
                  </svg>
                  <span>Objectives</span>
                  <div className="dropdown-arrow">
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path
                        d="M1 1.5L4 4.5L7 1.5"
                        stroke="#919397"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Link>
                {/* show this on objective click and remove class hide*/}
                <div className="dropdown-content">
                  {gameObjectives && gameObjectives.data && gameObjectives.data.map((objective) => {
                    return (
                      <Link
                        to={{ pathname: `/objective/${objective.title.replace("/", "-")}`, state: { fromManageGames: false } }}
                        onClick={toggleHeaderCenter}
                        key={JSON.stringify(objective)}
                      >{objective.title}</Link>
                    );
                  })}

                </div>
              </li>
              {
                !OrgRoles.includes(role) &&
                <li className={props.location && /^\/webinar\/history/.test(props.location.pathname) ? "active" : ""} key={'header-playstream'}>
                  <Link to="/webinar/history">
                    <svg width="22" height="16" xmlns="http://www.w3.org/2000/svg" version="1.1">
                      <g stroke="null" id="svg_1">
                        <path stroke="null" fill="#919397" clip-rule="evenodd" fill-rule="evenodd" d="m10.89107,3.99687c2.24721,0 4.07045,1.80452 4.07045,4.02865c0,2.22413 -1.82324,4.02865 -4.07045,4.02865s-4.07045,-1.80279 -4.07045,-4.02865c0,-2.22413 1.8215,-4.02865 4.07045,-4.02865l0,0l0,0zm7.73612,11.53338c-0.09422,0.10879 -0.22333,0.1675 -0.35592,0.17786c-0.13434,0.01036 -0.27567,-0.03108 -0.38907,-0.12433c-0.11341,-0.09325 -0.17447,-0.22276 -0.18494,-0.354l0,-0.00173c-0.00872,-0.13296 0.03141,-0.27111 0.12562,-0.38335c0.90726,-1.04818 1.59468,-2.16197 2.0518,-3.30857c0.45886,-1.14833 0.68568,-2.3312 0.67347,-3.51579c-0.00872,-1.17251 -0.25299,-2.35192 -0.73628,-3.51061c-0.47282,-1.12934 -1.1742,-2.23968 -2.11287,-3.30166c-0.09422,-0.10879 -0.13783,-0.24521 -0.12737,-0.37817c0.00872,-0.13296 0.06804,-0.2642 0.17622,-0.3609l0.00349,-0.00345c0.10817,-0.09325 0.24601,-0.13296 0.38035,-0.12433c0.13434,0.00863 0.26694,0.06907 0.36465,0.17613c1.02241,1.16042 1.7866,2.37264 2.3013,3.61249c0.5304,1.27611 0.79734,2.58158 0.80955,3.88187c0.01221,1.31756 -0.23903,2.62648 -0.73976,3.89396c-0.50074,1.26057 -1.24923,2.4797 -2.23849,3.62113l-0.00174,0.00345l0,0zm-2.38504,-2.18442c-0.0977,0.10706 -0.2303,0.1675 -0.36639,0.17441c-0.13434,0.00863 -0.27392,-0.03626 -0.3821,-0.13124c-0.10817,-0.0967 -0.16924,-0.22794 -0.17622,-0.36263c-0.00872,-0.13296 0.03489,-0.27111 0.1326,-0.37817l0.00174,-0.00173c0.67695,-0.75634 1.18642,-1.52996 1.52315,-2.30875c0.33499,-0.77707 0.49899,-1.56104 0.48678,-2.34501c-0.01221,-0.77016 -0.19715,-1.54722 -0.56355,-2.31911c-0.35941,-0.76152 -0.89505,-1.52132 -1.61038,-2.27076l-0.00349,-0.00518c-0.09945,-0.10361 -0.14481,-0.23657 -0.13958,-0.36781c0.00523,-0.13296 0.06107,-0.26593 0.164,-0.36436l0.00698,-0.00691c0.10468,-0.09843 0.23903,-0.14333 0.37163,-0.13987c0.13434,0.00345 0.26869,0.06044 0.36988,0.16232l0.00174,0.00173c0.80606,0.84614 1.408,1.71127 1.81452,2.58676l0.00174,0.00518c0.41525,0.89276 0.62636,1.79761 0.64206,2.70246c0.0157,0.91694 -0.17098,1.82869 -0.55133,2.72491c-0.37861,0.88931 -0.95088,1.7648 -1.70809,2.61267c-0.00174,0.01036 -0.00698,0.02072 -0.0157,0.03108l0,0zm-9.90482,-0.69072c0.09596,0.10706 0.13958,0.24348 0.13085,0.37472c-0.00872,0.13296 -0.06804,0.26593 -0.17622,0.36263c-0.10817,0.0967 -0.24601,0.13987 -0.38035,0.13296c-0.13434,-0.00863 -0.26869,-0.06735 -0.36639,-0.17441c-0.76594,-0.85823 -1.34519,-1.74235 -1.72903,-2.64202c-0.38035,-0.89449 -0.56878,-1.80452 -0.55308,-2.71973c0.0157,-0.90485 0.22856,-1.81143 0.6438,-2.70764l0.00174,-0.00518c0.40652,-0.87377 1.00845,-1.7389 1.81103,-2.58158l0.00523,-0.00518c0.10119,-0.10188 0.23554,-0.15541 0.36988,-0.16059c0.13434,-0.00345 0.27043,0.04317 0.37512,0.14333c0.10643,0.10016 0.16226,0.23485 0.16575,0.36781c0.00349,0.13296 -0.04362,0.26766 -0.14481,0.37126c-0.71359,0.75289 -1.24923,1.51441 -1.61038,2.27594c-0.36465,0.77189 -0.55133,1.54722 -0.56529,2.31393c-0.01221,0.78225 0.15354,1.56622 0.48852,2.33983c0.33324,0.77361 0.83747,1.54032 1.50047,2.28803c0.01047,0.00345 0.02094,0.00863 0.02792,0.01727l0.00523,0.00863l0,0zm-2.38155,2.1896l0.00523,0.00518c0.09247,0.11052 0.1326,0.24693 0.12388,0.3799c-0.01047,0.13296 -0.07153,0.26075 -0.18145,0.354l-0.00872,0.00691c-0.11166,0.09152 -0.2495,0.13124 -0.38384,0.12088c-0.13434,-0.01036 -0.2652,-0.07253 -0.35941,-0.18304c-0.98926,-1.14315 -1.73949,-2.36228 -2.23849,-3.62285c-0.50248,-1.26575 -0.75372,-2.57468 -0.74151,-3.89223c0.01396,-1.30202 0.27916,-2.60749 0.80955,-3.8836c0.51644,-1.23985 1.27889,-2.4538 2.3013,-3.61076c0.09422,-0.10706 0.22507,-0.1675 0.36116,-0.17613c0.13434,-0.00863 0.27392,0.03281 0.38558,0.12606l0.00174,0.00173c0.10817,0.09325 0.16924,0.22276 0.17796,0.35745c0.00872,0.13296 -0.03315,0.27111 -0.12737,0.38163l-0.00174,0.00173c-0.93692,1.06026 -1.64004,2.16888 -2.11112,3.29821c-0.48329,1.15869 -0.72755,2.3381 -0.73628,3.51061c-0.00872,1.18977 0.21984,2.37437 0.67695,3.52442c0.45712,1.14488 1.1428,2.25349 2.04657,3.29994l0,0zm8.38342,-6.56879c0.20762,-0.13296 0.20588,-0.27974 0,-0.39717l-2.14078,-1.21913c-0.16924,-0.10534 -0.34546,-0.04317 -0.34022,0.17441l0.00698,2.46243c0.01396,0.23657 0.15179,0.30219 0.35244,0.19168l2.12159,-1.21222l0,0l0,0zm-1.44812,-3.46053c1.79184,0 3.24345,1.43671 3.24345,3.21014c0,1.77344 -1.45161,3.21014 -3.24345,3.21014c-1.79184,0 -3.24345,-1.43671 -3.24345,-3.21014c0,-1.77344 1.45161,-3.21014 3.24345,-3.21014l0,0l0,0z" />
                      </g>
                    </svg>
                    <span>PlayStream</span>
                  </Link>
                </li>
              }
              {
                !OrgRoles.includes(role) ?
                  <>
                    <li className={props.location && /^\/how-it-works/.test(props.location.pathname) ? "nav-item dropdown active" : "nav-item dropdown"} key={'header-HIW'}>
                      {/* on click this , show dropdown*/}
                      <Link to='/how-it-works' className="nav-link dropdown-toggle" >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.25 0.4375H3.75C1.68225 0.4375 0 2.11975 0 4.1875V9.31316C0 11.3805 1.68194 13.0625 3.74934 13.0625H12.25C14.3177 13.0625 16 11.3802 16 9.3125V4.1875C16 2.11975 14.3177 0.4375 12.25 0.4375ZM14.75 9.3125C14.75 10.691 13.6285 11.8125 12.25 11.8125H3.74934C2.37122 11.8125 1.25 10.6913 1.25 9.31316V4.1875C1.25 2.809 2.3715 1.6875 3.75 1.6875H12.25C13.6285 1.6875 14.75 2.809 14.75 4.1875V9.3125ZM11.625 14.9375C11.625 15.2827 11.3452 15.5625 11 15.5625H5C4.65481 15.5625 4.375 15.2827 4.375 14.9375C4.375 14.5923 4.65481 14.3125 5 14.3125H11C11.3452 14.3125 11.625 14.5923 11.625 14.9375ZM11.0091 7.90156L10.5927 7.65175C10.6743 7.39681 10.7188 7.12541 10.7188 6.84375C10.7188 6.56209 10.6743 6.29069 10.5927 6.03575L11.0091 5.78594C11.3051 5.60834 11.401 5.22444 11.2234 4.92844C11.0458 4.63244 10.6618 4.5365 10.3659 4.71406L9.94191 4.9685C9.602 4.62784 9.17019 4.37934 8.6875 4.26247V3.71875C8.6875 3.37356 8.40769 3.09375 8.0625 3.09375C7.71731 3.09375 7.4375 3.37356 7.4375 3.71875V4.26247C6.94381 4.38203 6.50372 4.63969 6.16038 4.99234L5.69656 4.71406C5.40066 4.5365 5.01669 4.63244 4.83909 4.92844C4.66147 5.22444 4.75747 5.60834 5.05344 5.78594L5.52231 6.06725C5.44703 6.313 5.40625 6.57369 5.40625 6.84375C5.40625 7.11381 5.44703 7.3745 5.52231 7.62025L5.05344 7.90156C4.75744 8.07916 4.66147 8.46306 4.83906 8.75903C4.95628 8.95434 5.16328 9.06256 5.37559 9.06256C5.48503 9.06256 5.59591 9.03381 5.69656 8.97341L6.16038 8.69512C6.50372 9.04778 6.94381 9.30544 7.4375 9.425V9.96875C7.4375 10.3139 7.71731 10.5938 8.0625 10.5938C8.40769 10.5938 8.6875 10.3139 8.6875 9.96875V9.42503C9.17019 9.30816 9.602 9.05966 9.94188 8.719L10.3659 8.97344C10.4666 9.03384 10.5775 9.06259 10.6869 9.06259C10.8992 9.06259 11.1062 8.95438 11.2234 8.75906C11.401 8.46306 11.3051 8.07916 11.0091 7.90156ZM8.0625 8.25C7.28709 8.25 6.65625 7.61916 6.65625 6.84375C6.65625 6.06834 7.28709 5.4375 8.0625 5.4375C8.83791 5.4375 9.46875 6.06834 9.46875 6.84375C9.46875 7.61916 8.83791 8.25 8.0625 8.25Z" fill="#919397" />
                        </svg>
                        <span>How it Works</span>
                      </Link>
                    </li>
                    <li className={props.location && /^\/plans/.test(props.location.pathname) ? "active" : ""} key={'header-plans'}>
                      <Link to="/plans">
                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                          <path
                            d="M0.765977 2.6965C0.519352 2.45497 0.515258 2.05925 0.756789 1.81266L1.98995 0.553625C1.99123 0.552312 1.99254 0.551 1.99382 0.549688C2.3472 0.19525 2.81726 0 3.31729 0C3.81732 0 4.28732 0.19525 4.64073 0.549719L5.89591 1.80875C6.1396 2.05322 6.13901 2.44894 5.89454 2.69263C5.65016 2.93628 5.25438 2.93575 5.01066 2.69128L3.75548 1.43225C3.63832 1.31472 3.4827 1.25 3.31729 1.25C3.15257 1.25 2.9976 1.31412 2.8806 1.43066L1.64979 2.68734C1.52738 2.81231 1.36535 2.875 1.20326 2.875C1.04545 2.875 0.88757 2.81562 0.765977 2.6965ZM3.26579 2.46875C2.9206 2.46875 2.64079 2.74856 2.64079 3.09375V5.0625C2.64079 5.40769 2.9206 5.6875 3.26579 5.6875C3.61098 5.6875 3.89079 5.40769 3.89079 5.0625V3.09375C3.89079 2.74856 3.61098 2.46875 3.26579 2.46875ZM7.64079 3.75C7.64079 2.52338 9.01344 1.5625 10.7658 1.5625C12.5181 1.5625 13.8908 2.52338 13.8908 3.75C13.8908 4.97662 12.5181 5.9375 10.7658 5.9375C9.01344 5.9375 7.64079 4.97662 7.64079 3.75ZM8.89079 3.75C8.89079 3.94116 9.0506 4.15069 9.32926 4.32487C9.69801 4.55534 10.2216 4.6875 10.7658 4.6875C11.31 4.6875 11.8336 4.55534 12.2023 4.32487C12.481 4.15072 12.6408 3.94119 12.6408 3.75C12.6408 3.55881 12.481 3.34931 12.2023 3.17512C11.8336 2.94466 11.31 2.8125 10.7658 2.8125C10.2216 2.8125 9.69801 2.94466 9.32926 3.17512C9.0506 3.34931 8.89079 3.55884 8.89079 3.75ZM12.8679 14.1188C11.7115 14.9564 9.75757 14.9564 8.60113 14.1188C8.3216 13.9163 7.93082 13.9788 7.72832 14.2584C7.52585 14.5379 7.58835 14.9287 7.86791 15.1312C8.64148 15.6914 9.65951 16 10.7345 16C11.8096 16 12.8276 15.6914 13.6011 15.1312C13.8807 14.9287 13.9432 14.538 13.7407 14.2584C13.5383 13.9788 13.1475 13.9163 12.8679 14.1188ZM12.8679 11.6188C11.7115 12.4564 9.75757 12.4564 8.60113 11.6188C8.3216 11.4163 7.93082 11.4788 7.72832 11.7584C7.52585 12.0379 7.58835 12.4287 7.86791 12.6312C8.64148 13.1914 9.65951 13.5 10.7345 13.5C11.8096 13.5 12.8276 13.1914 13.6011 12.6312C13.8807 12.4287 13.9432 12.038 13.7407 11.7584C13.5383 11.4788 13.1475 11.4163 12.8679 11.6188ZM12.8679 9.08756C11.7115 9.92513 9.75757 9.92513 8.60113 9.08756C8.3216 8.88506 7.93082 8.94756 7.72832 9.22713C7.52585 9.50669 7.58835 9.89744 7.86791 10.0999C8.64148 10.6602 9.65951 10.9688 10.7345 10.9688C11.8096 10.9688 12.8276 10.6602 13.6011 10.0999C13.8807 9.89747 13.9432 9.50672 13.7407 9.22716C13.5383 8.94759 13.1475 8.88509 12.8679 9.08756ZM12.8679 6.55631C11.7115 7.39388 9.75757 7.39388 8.60113 6.55631C8.3216 6.35384 7.93082 6.41631 7.72832 6.69588C7.52585 6.97544 7.58835 7.36619 7.86791 7.56866C8.64148 8.12894 9.65951 8.4375 10.7345 8.4375C11.8096 8.4375 12.8276 8.12894 13.6011 7.56869C13.8807 7.36622 13.9432 6.97547 13.7407 6.69591C13.5383 6.41634 13.1475 6.35381 12.8679 6.55631ZM6.39079 8.8125C6.39079 10.0391 5.01813 11 3.26579 11C1.51345 11 0.140789 10.0391 0.140789 8.8125C0.140789 7.58588 1.51345 6.625 3.26579 6.625C5.01813 6.625 6.39079 7.58588 6.39079 8.8125ZM5.14079 8.8125C5.14079 8.62134 4.98098 8.41181 4.70232 8.23763C4.33357 8.00716 3.80998 7.875 3.26579 7.875C2.7216 7.875 2.19801 8.00716 1.82926 8.23763C1.5506 8.41178 1.39079 8.62131 1.39079 8.8125C1.39079 9.00369 1.5506 9.21319 1.82926 9.38737C2.19801 9.61784 2.7216 9.75 3.26579 9.75C3.80998 9.75 4.33357 9.61784 4.70232 9.38737C4.98095 9.21319 5.14079 9.00366 5.14079 8.8125ZM5.36791 14.1188C4.21148 14.9564 2.25757 14.9564 1.10113 14.1188C0.821602 13.9163 0.430852 13.9788 0.22832 14.2584C0.0258516 14.5379 0.0883517 14.9287 0.367914 15.1312C1.14148 15.6914 2.15951 16 3.23454 16C4.30957 16 5.3276 15.6914 6.10113 15.1312C6.3807 14.9287 6.44316 14.538 6.24073 14.2584C6.03826 13.9788 5.64751 13.9163 5.36791 14.1188ZM5.36791 11.6188C4.21148 12.4564 2.25757 12.4564 1.10113 11.6188C0.821602 11.4163 0.430852 11.4788 0.22832 11.7584C0.0258516 12.0379 0.0883517 12.4287 0.367914 12.6312C1.14148 13.1914 2.15951 13.5 3.23454 13.5C4.30957 13.5 5.3276 13.1914 6.10113 12.6312C6.3807 12.4287 6.44316 12.038 6.24073 11.7584C6.03829 11.4788 5.64751 11.4163 5.36791 11.6188Z"
                            fill="#919397"
                          />
                        </svg>
                        <span>Plans</span>
                      </Link>
                    </li>
                  </>
                  :
                  <> <li className={props.location && /^\/my-games/.test(props.location.pathname) ? "active" : ""} key={'header-mygames'}>
                    <Link to="/my-games">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5478 15.9986C1.20264 15.9986 0.922852 15.7188 0.922852 15.3736C0.922852 12.2378 3.47403 9.68663 6.60984 9.68663H7.54726C7.98753 9.68663 8.4263 9.73722 8.85136 9.83699C9.18736 9.91586 9.39584 10.2522 9.31694 10.5882C9.2381 10.9242 8.90167 11.1327 8.56573 11.0538C8.23416 10.976 7.89148 10.9365 7.54726 10.9365H6.60984C4.16322 10.9365 2.17274 12.927 2.17274 15.3736C2.17274 15.7187 1.89295 15.9986 1.5478 15.9986ZM11.2344 4.21837C11.2344 1.89236 9.34206 0 7.01605 0C4.69004 0 2.79768 1.89236 2.79768 4.21837C2.79768 6.54438 4.69004 8.43674 7.01605 8.43674C9.34206 8.43674 11.2344 6.54438 11.2344 4.21837ZM9.98454 4.21837C9.98454 5.85519 8.65288 7.18685 7.01605 7.18685C5.37923 7.18685 4.04757 5.85519 4.04757 4.21837C4.04757 2.58155 5.37923 1.24989 7.01605 1.24989C8.65288 1.24989 9.98454 2.58155 9.98454 4.21837ZM15.0352 14.5091C14.9322 14.1344 14.5779 13.6999 13.9606 12.9641C13.643 12.5854 13.1338 11.9784 12.9842 11.6879H13.2029C13.5481 11.6879 13.8279 11.4081 13.8279 11.063C13.8279 10.7178 13.5481 10.438 13.2029 10.438H12.8347C13.1165 10.2089 13.2967 9.85949 13.2967 9.4679C13.2967 8.77762 12.7371 8.21801 12.0468 8.21801C11.3565 8.21801 10.7969 8.77762 10.7969 9.4679C10.7969 9.85946 10.9771 10.2088 11.2589 10.438H10.9531C10.608 10.438 10.3282 10.7178 10.3282 11.063C10.3282 11.4081 10.608 11.6879 10.9531 11.6879H11.1712C11.0208 11.9777 10.515 12.581 10.1992 12.9576C9.57957 13.6967 9.22392 14.1332 9.12068 14.5095C9.02247 14.8676 9.09518 15.2421 9.32013 15.5371C9.54455 15.8313 9.88552 16 10.2556 16H13.9005C14.2708 16 14.6119 15.8311 14.8363 15.5366C15.0612 15.2415 15.1337 14.867 15.0352 14.5091ZM10.3769 14.7501C10.5239 14.5159 10.897 14.0708 11.1571 13.7606C11.5477 13.2947 11.8583 12.9184 12.0774 12.5951C12.2973 12.9202 12.6098 13.2985 13.0031 13.7674C13.2614 14.0753 13.6319 14.5169 13.7788 14.7501H10.3769Z" fill="#919397" />
                      </svg>
                      <span>My Games</span>
                    </Link>
                  </li>
                    <li className={props.location && /^\/webinar\/history/.test(props.location.pathname) ? "active" : ""} key={'header-playstream'}>
                      <Link to="/webinar/history">
                        <svg width="22" height="16" xmlns="http://www.w3.org/2000/svg" version="1.1">
                          <g stroke="null" id="svg_1">
                            <path stroke="null" fill="#919397" clip-rule="evenodd" fill-rule="evenodd" d="m10.89107,3.99687c2.24721,0 4.07045,1.80452 4.07045,4.02865c0,2.22413 -1.82324,4.02865 -4.07045,4.02865s-4.07045,-1.80279 -4.07045,-4.02865c0,-2.22413 1.8215,-4.02865 4.07045,-4.02865l0,0l0,0zm7.73612,11.53338c-0.09422,0.10879 -0.22333,0.1675 -0.35592,0.17786c-0.13434,0.01036 -0.27567,-0.03108 -0.38907,-0.12433c-0.11341,-0.09325 -0.17447,-0.22276 -0.18494,-0.354l0,-0.00173c-0.00872,-0.13296 0.03141,-0.27111 0.12562,-0.38335c0.90726,-1.04818 1.59468,-2.16197 2.0518,-3.30857c0.45886,-1.14833 0.68568,-2.3312 0.67347,-3.51579c-0.00872,-1.17251 -0.25299,-2.35192 -0.73628,-3.51061c-0.47282,-1.12934 -1.1742,-2.23968 -2.11287,-3.30166c-0.09422,-0.10879 -0.13783,-0.24521 -0.12737,-0.37817c0.00872,-0.13296 0.06804,-0.2642 0.17622,-0.3609l0.00349,-0.00345c0.10817,-0.09325 0.24601,-0.13296 0.38035,-0.12433c0.13434,0.00863 0.26694,0.06907 0.36465,0.17613c1.02241,1.16042 1.7866,2.37264 2.3013,3.61249c0.5304,1.27611 0.79734,2.58158 0.80955,3.88187c0.01221,1.31756 -0.23903,2.62648 -0.73976,3.89396c-0.50074,1.26057 -1.24923,2.4797 -2.23849,3.62113l-0.00174,0.00345l0,0zm-2.38504,-2.18442c-0.0977,0.10706 -0.2303,0.1675 -0.36639,0.17441c-0.13434,0.00863 -0.27392,-0.03626 -0.3821,-0.13124c-0.10817,-0.0967 -0.16924,-0.22794 -0.17622,-0.36263c-0.00872,-0.13296 0.03489,-0.27111 0.1326,-0.37817l0.00174,-0.00173c0.67695,-0.75634 1.18642,-1.52996 1.52315,-2.30875c0.33499,-0.77707 0.49899,-1.56104 0.48678,-2.34501c-0.01221,-0.77016 -0.19715,-1.54722 -0.56355,-2.31911c-0.35941,-0.76152 -0.89505,-1.52132 -1.61038,-2.27076l-0.00349,-0.00518c-0.09945,-0.10361 -0.14481,-0.23657 -0.13958,-0.36781c0.00523,-0.13296 0.06107,-0.26593 0.164,-0.36436l0.00698,-0.00691c0.10468,-0.09843 0.23903,-0.14333 0.37163,-0.13987c0.13434,0.00345 0.26869,0.06044 0.36988,0.16232l0.00174,0.00173c0.80606,0.84614 1.408,1.71127 1.81452,2.58676l0.00174,0.00518c0.41525,0.89276 0.62636,1.79761 0.64206,2.70246c0.0157,0.91694 -0.17098,1.82869 -0.55133,2.72491c-0.37861,0.88931 -0.95088,1.7648 -1.70809,2.61267c-0.00174,0.01036 -0.00698,0.02072 -0.0157,0.03108l0,0zm-9.90482,-0.69072c0.09596,0.10706 0.13958,0.24348 0.13085,0.37472c-0.00872,0.13296 -0.06804,0.26593 -0.17622,0.36263c-0.10817,0.0967 -0.24601,0.13987 -0.38035,0.13296c-0.13434,-0.00863 -0.26869,-0.06735 -0.36639,-0.17441c-0.76594,-0.85823 -1.34519,-1.74235 -1.72903,-2.64202c-0.38035,-0.89449 -0.56878,-1.80452 -0.55308,-2.71973c0.0157,-0.90485 0.22856,-1.81143 0.6438,-2.70764l0.00174,-0.00518c0.40652,-0.87377 1.00845,-1.7389 1.81103,-2.58158l0.00523,-0.00518c0.10119,-0.10188 0.23554,-0.15541 0.36988,-0.16059c0.13434,-0.00345 0.27043,0.04317 0.37512,0.14333c0.10643,0.10016 0.16226,0.23485 0.16575,0.36781c0.00349,0.13296 -0.04362,0.26766 -0.14481,0.37126c-0.71359,0.75289 -1.24923,1.51441 -1.61038,2.27594c-0.36465,0.77189 -0.55133,1.54722 -0.56529,2.31393c-0.01221,0.78225 0.15354,1.56622 0.48852,2.33983c0.33324,0.77361 0.83747,1.54032 1.50047,2.28803c0.01047,0.00345 0.02094,0.00863 0.02792,0.01727l0.00523,0.00863l0,0zm-2.38155,2.1896l0.00523,0.00518c0.09247,0.11052 0.1326,0.24693 0.12388,0.3799c-0.01047,0.13296 -0.07153,0.26075 -0.18145,0.354l-0.00872,0.00691c-0.11166,0.09152 -0.2495,0.13124 -0.38384,0.12088c-0.13434,-0.01036 -0.2652,-0.07253 -0.35941,-0.18304c-0.98926,-1.14315 -1.73949,-2.36228 -2.23849,-3.62285c-0.50248,-1.26575 -0.75372,-2.57468 -0.74151,-3.89223c0.01396,-1.30202 0.27916,-2.60749 0.80955,-3.8836c0.51644,-1.23985 1.27889,-2.4538 2.3013,-3.61076c0.09422,-0.10706 0.22507,-0.1675 0.36116,-0.17613c0.13434,-0.00863 0.27392,0.03281 0.38558,0.12606l0.00174,0.00173c0.10817,0.09325 0.16924,0.22276 0.17796,0.35745c0.00872,0.13296 -0.03315,0.27111 -0.12737,0.38163l-0.00174,0.00173c-0.93692,1.06026 -1.64004,2.16888 -2.11112,3.29821c-0.48329,1.15869 -0.72755,2.3381 -0.73628,3.51061c-0.00872,1.18977 0.21984,2.37437 0.67695,3.52442c0.45712,1.14488 1.1428,2.25349 2.04657,3.29994l0,0zm8.38342,-6.56879c0.20762,-0.13296 0.20588,-0.27974 0,-0.39717l-2.14078,-1.21913c-0.16924,-0.10534 -0.34546,-0.04317 -0.34022,0.17441l0.00698,2.46243c0.01396,0.23657 0.15179,0.30219 0.35244,0.19168l2.12159,-1.21222l0,0l0,0zm-1.44812,-3.46053c1.79184,0 3.24345,1.43671 3.24345,3.21014c0,1.77344 -1.45161,3.21014 -3.24345,3.21014c-1.79184,0 -3.24345,-1.43671 -3.24345,-3.21014c0,-1.77344 1.45161,-3.21014 3.24345,-3.21014l0,0l0,0z" />
                          </g>
                        </svg>
                        <span>PlayStream</span>
                      </Link>
                    </li>

                  </>
              }
              {
                !OrgRoles.includes(role) &&
                <li className="request-demo" key={'header-requestdemo'}>
                  <Link to={"/demorequest"}>
                    <span>Request Demo</span>
                  </Link>
                </li>
              }
            </ul>
          </div>
        ) : null}
        {!props.isAdmin && (
          <div className="header-right">
            {/* singn in or sign out header option */}
            {props.onboard ? (
              !props.disableHomepageButton && !props.adminLogin ? (
                <Link to="/">
                  <button type="submit" className="btn btn-secondry home-btn">
                    Go to Homepage
                  </button>
                  <img src={homepage} alt="" className="home-icon" />
                </Link>
              ) : null
            ) : userInfo && userInfo.data ? (
              /* after login , show profile section */
              <>
                <div className="notifications">
                  <div className="notification-container">
                    <img src={notification_icon} className='notification-icon' data-toggle="collapse" data-target="#notification-items" alt="" />
                    {
                      !allRead &&
                      <h4 className="notification-icon-sub"></h4>
                    }
                  </div>
                  <div className="items collapse" id="notification-items" >
                    <div className="top">
                      <h3>Notifications</h3>
                      <h4 className="mark" onClick={markAllRead}><i className="fa fa-check" aria-hidden="true"></i> Mark as read</h4>
                    </div>
                    <div className="notification-items">
                      {
                        notifications && notifications.length > 0 ?
                          notifications.map((notification, index) => (
                            <div onClick={() => notificationClicked(notification)} className={`notification-item ${notification.read ? "" : "unread"}`} key={JSON.stringify(notification)}>
                              <span className="status"></span>
                              <h4 className="content">{notification.message}</h4>
                              <span className="date">{formatToDate(notification.createdAt)}</span>
                            </div>
                          )) : <div className="no-notification">
                            <h4>Notifications Empty</h4>
                          </div>
                      }
                    </div>
                  </div>
                  <div className="background" data-toggle="collapse" data-target="#notification-items"></div>
                </div>
                <div className="profile-detail nav-item dropdown">
                  {/* on click this , show dropdown on mobile*/}
                  <div
                    className={headerProfile ? "header-content hide" : "header-content"}
                    id="header-profile"
                    onClick={toggleProfile}
                  // onMouseDownCapture={toggleProfile}
                  >
                    <div className="profile-photo">
                      <SampleAvatar />
                    </div>
                    <h4>
                      {userInfo && userInfo.data ? userInfo.data.firstName : ""}
                    </h4>
                    <svg className="drop-down" width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path
                        d="M1 1.5L4 4.5L7 1.5"
                        stroke="#23282E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="dropdown-content">
                    <div className="dropdown-background">
                      <div className="profile-detail">
                        <div className="profile-photo show">
                          <SampleAvatar />
                        </div>
                        <h4>{userInfo && userInfo.data ? userInfo.data.firstName : ""}</h4>
                        {/* <h4>{userInfo && userInfo.data ? userInfo.data.name : ""}</h4> */}
                      </div>
                      <Link to="/account">My Account</Link>
                      {
                        (role === "ORG_ADMIN" || role === "ORG_SUPER_ADMIN") &&
                        <Link to="/account/plan-details">My Plans</Link>
                      }
                      {
                        (role === "ORG_ADMIN" || role === "ORG_SUPER_ADMIN") &&
                        <Link to="/manage-team">Manage Team</Link>
                      }
                      {
                        (
                          // role === "ORG_ADMIN" || 
                          role === "ORG_SUPER_ADMIN") &&
                        <Link to="/manage-games">Manage Games</Link>
                      }
                      {
                        role === "EMPLOYEE" &&
                        <Link to="#" onClick={() => setOpenContactModal(true)}>Contact Admin</Link>

                      }
                      <Link to="" onClick={signOut}>Sign Out</Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* if login is not there in header option */
              <Link to="/signin">
                <button type="submit" className="btn btn-primary login-signup">
                  Login/Sign Up
                </button>
              </Link>
            )}
            {/* closeicon for mobile view when click on show dropdown, remove hide class*/}
            {
              userInfo && userInfo.data &&
              <div
                className={!headerProfile ? "mobileHamburger close hide" : "mobileHamburger close"}
                id="mobilehamburger-close"
                onClick={toggleProfile}
              >
                <span></span>
                <span></span>
              </div>
            }
          </div>
        )}
      </header>
    </div>
  );
};

export default React.memo(Header);
