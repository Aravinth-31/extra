import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, Redirect } from "react-router-dom";

import './otpverification.css';

import OnBoard from '../../components/onboard/onboard';
import Header from '../../components/header/header';
import { useDispatch, useSelector } from 'react-redux';
import { signin, verifyOtp, sendOtpToUser } from '../../redux/actions/userAction';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getGameServerOtp } from '../../redux/actions/gameDetailAction';
import { decryptData, encryptData, failureAlert, preventNonNumericalInput, SOCKET_URL, successAlert } from '../../helpers/helper';
import LoadingComponent from '../../components/loader/LoadingComponent';

import * as ActionTypes from "../../redux/constants/commonApiConstants";
import { io } from 'socket.io-client';

const OtpVerification = (props) => {
  const [loaded, setLoaded] = useState(true);
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [inviteId, setInviteId] = useState("");
  const dispatch = useDispatch();
  const [isMasterOtp, setIsMasterOtp] = useState(false);
  const [resendCounter, setResendCounter] = useState(30);
  const [retryCount, setRetryCount] = useState(0);

  const UserSignin = useSelector((state) => state.userSignin);
  let { userInfo } = UserSignin;
  const VerifyOtp = useSelector(state => state.verifyOtp);
  const GameServerOtp = useSelector(state => state.gameServerOtp);
  const SendOtpToUser = useSelector(state => state.sendOtpToUser);

  let email = ""
  if (props && props.location && props.location.state && props.location.state.email) {
    email = props.location.state.email
  }
  useEffect(() => {
    if (props?.location?.state?.masterOtp)
      setIsMasterOtp(true);
    else
      setIsMasterOtp(false);
  }, [props.location])

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const inviteid = decryptData(sessionStorage.getItem("inviteId") || encryptData(""));
    setInviteId(inviteid);
  }, []);
  // useEffect(() => {
  //   return () => {
  //     sessionStorage.setItem("inviteId", encryptData(null));
  //   }
  // }, []);

  const counterinterval = useRef();

  useEffect(() => {
    if (resendCounter === 30) {
      let count = 30;
      counterinterval.current = setInterval(() => {
        if (count === 0)
          clearInterval(counterinterval.current);
        else {
          count -= 1;
          setResendCounter(count);
        }
      }, 1000);
    }
  }, [resendCounter]);
  useEffect(() => {
    if (retryCount === 5) {
      setTimeout(() => {
        setRetryCount(0);
        setErrorMessage("");
      }, 30000);
    }
  }, [retryCount]);
  useEffect(() => {
    return () => {
      if (counterinterval.current)
        clearInterval(counterinterval.current);
    }
  }, [])

  const resendOtp = async (e) => {
    e.preventDefault();
    if (resendCounter > 0)
      return;
    const resStatus = await dispatch(sendOtpToUser(email));
    if (resStatus?.status === 200) {
      setResendCounter(30);
      successAlert('OTP sent Successfully!')
      setErrorMessage("")
    } else {
      failureAlert('Resend OTP failed. Try Again!')
    }
  }
  const verifyOTP = async (e) => {
    e.preventDefault();
    if (retryCount === 5)
      return;
    if (otp && otp.length === 6) {
      const resStatus = await dispatch(signin({ email, otp, inviteId }));
      if (resStatus && resStatus.status === 200) {
        localStorage.setItem("otpVerified", encryptData(true));

        if (!window.socket && resStatus.data?.token) {
          window.socket = io.connect(SOCKET_URL, {
            transports: ["websocket", "polling", "flashsocket"],
            reconnect: true,
            auth: {
              token: resStatus.data.token
            }
          });
          window.socket?.on("notification", (notifications) => {
            dispatch({ type: ActionTypes.GET_NOTIFICATION_SUCCESS, payload: notifications, });
          })
          window.socket?.on("connect_error", (err) => {
            console.log(err instanceof Error); // true
            console.log(err.message); // not authorized
            console.log(err.data); // { content: "Please retry later" }
          });
          window.socket?.on("disconnect", (reason) => {
            console.log({ reason });
          })
        }
      }
      else if (resStatus && resStatus.data) {
        if (resStatus.data.message === 'USER_IS_DELETED')
          setErrorMessage("User is Deleted.")
        else if (resStatus.data.message === "USER EXISTS IN OTHER ORGANIZATION")
          setErrorMessage("You are already linked with some other organisation.")
        else if (resStatus.data.message === "ACCESS DENIED")
          setErrorMessage("You are not allowed to join");
        else if (resStatus.data.message === "Rate limit exceeded, retry in 15 minutes") {
          // setErrorMessage("You have made maximum unsuccessful attempts, please try again after some time!")
        }
        else if (retryCount === 4) {
          setErrorMessage("You have made maximum unsuccessful attempts, please try again after 30 seconds!");
        }
        else
          setErrorMessage(resStatus.data.message);
        setRetryCount(prevState => prevState + 1);
      }
      else {
        setErrorMessage("Please enter a valid OTP")
      }
    }
    else
      setErrorMessage("Please enter a valid OTP")
    setOtp("");
  }

  const redirectToGame = async (gameId, sessionId) => {
    const response = await dispatch(getGameServerOtp(gameId, sessionId));
    if (response && response.status === 200) {
      if (response.data && response.data.data && response.data.data.redirectUrl)
        window.location.replace(response.data.data.redirectUrl);
    }
    else {
      failureAlert("You are not allowed to access this game");
      setTimeout(() => {
        const redirectToHome = "/";
        const redirectToPlans = "/plans";
        if (userInfo && !userInfo.isNewUser && userInfo.role === 'USER') {
          props.history.replace(redirectToPlans);
        } else if (userInfo && !userInfo.isNewUser) {
          props.history.replace(redirectToHome);
        }
      }, 2000);
    }
  }

  useEffect(() => {
    if (userInfo) {
      const redirectToHome = "/";
      const redirectToUserDetail = "/user-detail";
      const redirectToPlans = "/plans";
      const gameId = decryptData(sessionStorage.getItem("gameId") || encryptData(""));
      const sessionId = decryptData(sessionStorage.getItem("sessionId") || encryptData(""));
      if (userInfo && userInfo.isNewUser) {
        window.gtag("event", "Users Registered", {
          event_category: "USER",
          event_label: "Users registered to the ExtramilePlay platform"
        });
        props.history.replace(redirectToUserDetail);
      }
      else {
        localStorage.setItem("isAuthenticated", encryptData(true));
        var obj = null
        if (inviteId)
          obj = decryptData(inviteId);
        if (obj && obj.redirectURL) {
          props.history.replace(obj.redirectURL);
        }
        else if (userInfo && gameId && sessionId) {
          sessionStorage.setItem("gameId", encryptData(""));
          sessionStorage.setItem("sessionId", encryptData(""));
          redirectToGame(gameId, sessionId);
        }
        else if (userInfo && userInfo.role === 'USER' && !inviteId) {
          props.history.replace(redirectToPlans);
        } else {
          props.history.replace(redirectToHome);
        }
        sessionStorage.setItem("inviteId", encryptData(null));
      }
      localStorage.setItem("fromOtpPage", encryptData(false));
    }
  }, [userInfo]);

  const handleChange = (e) => {
    if (e.target.value.length === 6)
      setErrorMessage("");
    if (e.target.value && e.target.value.length > 6)
      return
    setOtp(e.target.value);
  }
  useEffect(() => {
    if (
      (UserSignin && UserSignin.loading) ||
      (VerifyOtp && VerifyOtp.loading) ||
      (GameServerOtp && GameServerOtp.loading) ||
      (SendOtpToUser && SendOtpToUser.loading)
    ) {
      setLoaded(false);
    }
    else {
      setLoaded(true);
    }
  }, [UserSignin, VerifyOtp, GameServerOtp, SendOtpToUser])


  return (
    email ?
      <div>
        <Header {...props} onboard inviteId={inviteId} />
        <ToastContainer position="bottom-center" />
        <LoadingComponent loaded={loaded} />
        <OnBoard>
          <div className={loaded ? "auth-flow otp login" : "auth-flow otp login loading"}>
            <h5 className="login-heading">OTP Verification</h5>
            <div className="auth-form">
              {
                isMasterOtp ?
                  <div className="otp-edit">
                    Enter the master otp for the given <br /> {
                      "mail Id - " + email
                    }<Link to={"#"} onClick={() => {
                      localStorage.setItem("fromOtpPage", encryptData(true));
                      props.history.goBack();
                    }}>Edit</Link>
                  </div>
                  : <div className="otp-edit">
                    We have sent a verification code to your<br /> {
                      "mail Id " + email
                    }<Link to={"#"} onClick={() => {
                      localStorage.setItem("fromOtpPage", encryptData(true));
                      props.history.goBack();
                    }}>Edit</Link>
                  </div>
              }
              <form action="">
                <div className="form-group">
                  <div className="error-message">{errorMessage}</div>
                  <input type="number" onKeyDown={e => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown")
                      e.preventDefault();
                  }} className={`form-control ${retryCount === 5 ? "disabled" : ""}`} id="otpfield" autoComplete='off' value={otp} onChange={handleChange} name="email" placeholder={isMasterOtp ? "Enter Master OTP" : "Enter OTP"} onKeyPress={preventNonNumericalInput}
                    disabled={retryCount === 5}
                  />
                  {
                    !isMasterOtp &&
                    <div className="otp-resend">
                      Didn’t receive code yet?
                      <Link to={"#"} className={`${resendCounter > 0 ? "disabled" : ""}`} onClick={resendOtp}>Resend</Link>
                      <span className={`resend-counter ${resendCounter > 0 ? "" : "invisible"}`}>{` in 00:${resendCounter > 9 ? resendCounter : "0" + resendCounter}`}</span>
                    </div>
                  }
                </div>
                <button type="submit" onClick={verifyOTP} className={`btn btn-primary ${retryCount === 5 ? "disabled" : ""}`} >Verify</button>
              </form>
            </div>
          </div>
        </OnBoard>
      </div>
      : <Redirect to={'/signin'} />
  );
};

export default OtpVerification;