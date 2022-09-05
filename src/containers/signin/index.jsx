import React, { useState, useEffect, useRef } from "react";

import OnBoard from "../../components/onboard/onboard";
import Header from "../../components/header/header";
// image
// import facebook from "../../assets/images/facebook.svg";
// import linkedin from "../../assets/images/linkedin.svg";
// import google from "../../assets/images/google.svg";

//Redux
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { sendOtpToUser, signin } from "../../redux/actions/userAction";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { AZURE_CLIENT_ID, decryptData, encryptData, EXTRAMILE_SUPERADMIN_EMAIL, failureAlert } from "../../helpers/helper";
import LoadingComponent from "../../components/loader/LoadingComponent";
// //Social media login
// import GoogleLogin from "react-google-login";
// //import FacebookLogin from "react-facebook-login";
// import { LinkedIn } from "react-linkedin-login-oauth2";
// import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

// import Axios from "axios";
import azureAd from "../../assets/images/azure.svg";
import peopleStrong from "../../assets/images/peoplestrong.svg";
import MicrosoftLogin from "react-microsoft-login";
import { getGameServerOtp } from "../../redux/actions/gameDetailAction";

const SignIn = (props) => {
  const [loaded, setLoaded] = useState(false);
  const [inputValue, setInputValue] = useState({ email: "" });
  const [touched, setTouched] = useState({ email: false });
  //const userSignin = useSelector((state) => state.userSignin);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [loginType, setLoginType] = useState("OTP");
  const [authMSData, setAuthMSData] = useState(null);

  const sendOtpDetails = useSelector(state => state.sendOtpToUser);
  let { loading, error } = sendOtpDetails;
  const dispatch = useDispatch();
  //const UserInfo = useSelector((state) => state.userSignin) || { userInfo: {} };
  // const { orgDetailsByEmail } = useSelector((state) => state.getOrganisation);
  const { orgDetailsById } = useSelector(state => state.getOrganisationById);
  // let { inviteId } = useParams();
  let inviteId = new URLSearchParams(props.location.search).get('inviteId');

  const userInfo = useRef(null);

  // if (UserInfo && UserInfo.userInfo && UserInfo.userInfo.email)
  //   var email = UserInfo.userInfo.email;
  // else var email = "";
  // useEffect(() => {
  //   setInputValue((prevState) => ({ ...prevState, email: email }));
  // }, [email]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const sessionid = new URLSearchParams(props.location.search).get('sessionId');
    const gameId = new URLSearchParams(props.location.search).get('gameId');
    if (sessionid && gameId) {
      sessionStorage.setItem("sessionId", encryptData(sessionid));
      sessionStorage.setItem("gameId", encryptData(gameId));
    }
    if (inviteId)
      sessionStorage.setItem("inviteId", encryptData(inviteId));
    else
      sessionStorage.setItem("inviteId", encryptData(""));
  }, [inviteId]);

  const fromOtpPage = decryptData(localStorage.getItem("fromOtpPage") || encryptData(false));

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (touched[name]) {
      setTouched(prevState => ({ ...prevState, [name]: false }));
    }
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = (e, msFlag) => {
    e.preventDefault();
    setLoginType(msFlag);
    setSubmitClicked(true);
    setTouched({ email: true });
  };
  const redirectToOtpVerification = "/otp-verification";

  useEffect(async () => {
    if (touched.email && submitClicked) {
      const errors = validateInput(inputValue);
      if (inputValue.email.length > 0 && errors.email === "") {
        if (loginType === "AZUREAD") {
          if (inputValue.email.toLowerCase() === EXTRAMILE_SUPERADMIN_EMAIL) {
            failureAlert("Email not allowed");
          }
          else {
            let url = `/api/user/login/sso?email=${inputValue.email}`;
            if (inviteId)
              url = url + "&inviteId=" + inviteId;
            window.location.replace(url);
          }
        }
        else if (loginType === "PEOPLESTRONG") {
          if (inputValue.email.toLowerCase() === EXTRAMILE_SUPERADMIN_EMAIL) {
            failureAlert("Email not allowed");
          }
          else {
            let url = `api/user/login/peoplestrong-sso?email=${inputValue.email}`;
            if (inviteId)
              url = url + "&inviteId=" + inviteId;
            window.location.replace(url);
          }
        }
        else {
          const resStatus = await dispatch(sendOtpToUser(inputValue.email));
          // const resStatus = { status: 200 };
          if (resStatus?.data?.status === false)
            failureAlert(resStatus?.data?.message);
          else if (resStatus?.status === 200) {
            const statevalue = { email: inputValue.email };
            if (inviteId)
              statevalue.inviteId = inviteId;
            if (resStatus?.data?.masterOtp)
              statevalue.masterOtp = true;
            props.history.push(redirectToOtpVerification, statevalue);
          }
        }
      }
      setSubmitClicked(false);
    }
  }, [touched])
  useEffect(() => {
    if (error)
      failureAlert('OTP Not sent.Try Again');
  }, [error]);

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const validateInput = (input) => {
    const errors = {
      email: "",
    };
    if (
      touched.email &&
      (!validateEmail(input.email) || input.email === "")
    ) {
      errors.email =
        "Invalid Email Address, Please provide a valid Email";
    }
    return errors;
  };

  let errorMessage = validateInput(inputValue);

  // //Google Authentication
  // const responseGoogle = (response) => {
  //   // To add the user to the DB
  //   if (!response.error) {
  //     var email = response.profileObj.email;
  //     Axios.post(BASE_URL + "/api/user/third-party-login", {
  //       email: response.profileObj.email,
  //       name: response.profileObj.name,
  //     }).then((response) => {
  //       let userData = { ...response.data, email };
  //       localStorage.setItem("userSignInInfo", encryptData(userData));
  //       if (!response.data.isNewUser) {
  //         props.history.push("/");
  //       } else {
  //         props.history.push("/user-detail");
  //       }
  //     });
  //   }
  // };

  // //Facebook Authentication
  // const responseFacebook = (response) => {
  //   // To add the user to the DB
  //   if (response) {
  //     var email = response.email;
  //     Axios.post(BASE_URL + "/api/user/third-party-login", {
  //       email: response.email,
  //       name: response.name,
  //     })
  //       .then((response) => {
  //         let userData = { ...response.data, email };
  //         localStorage.setItem("userSignInInfo", encryptData(userData));
  //         if (!response.data.isNewUser) {
  //           props.history.push("/");
  //         } else {
  //           props.history.push("/user-detail");
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // };
  // //Linkedin Authentication
  // const responseLinkedin = (response) => {
  //   const clientID = "781hl6t14llqdk";
  //   const clientSecret = "ungau7BPxHyhpDa5";
  //   const redirectURI = BASE_URL"/linkedin";
  //   const token = response.code;

  //   var name = "";
  //   var email = "";
  //   Axios.get(
  //     `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&client_id=${clientID}&client_secret=${clientSecret}&code=${response.code}&redirect_uri=${redirectURI}`
  //   )
  //     .then((response) => {
  //       const access_token = response.data.access_token;
  //       //To get the Name of the user
  //       Axios.get("https://api.linkedin.com/v2/me", {
  //         headers: {
  //           Authorization: `Bearer ${access_token}`,
  //           "Access-Control-Allow-Origin": "*",
  //         },
  //       }).then((response) => {
  //         name =
  //           response.data.firstName.localized.en_US +
  //           " " +
  //           response.data.lastName.localized.en_US;

  //         // To get the Email address of the user
  //         Axios.get(
  //           "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
  //           {
  //             headers: {
  //               Authorization: `Bearer ${access_token}`,
  //               "Access-Control-Allow-Origin": "*",
  //             },
  //           }
  //         ).then((response) => {
  //           email = response.data.elements[0]["handle~"].emailAddress;

  //           // To add the user to the DB
  //           Axios.post(BASE_URL + "/api/user/third-party-login", {
  //             email: email,
  //             name: name,
  //           }).then((response) => {
  //             let email = email;
  //             let userData = { ...response.data, email };
  //             localStorage.setItem("userSignInInfo", encryptData(userData));
  //             if (!response.data.isNewUser) {
  //               props.history.push("/");
  //             } else {
  //               props.history.push("/user-detail");
  //             }
  //           });
  //         });
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  var isPopupBlockerActivated = function (popupWindow) {
    if (popupWindow) {
      if (/chrome/.test(navigator.userAgent.toLowerCase())) {
        try {
          popupWindow.focus();
        } catch (e) {
          return true;
        }
      } else {
        popupWindow.onload = function () {
          return (popupWindow.innerHeight > 0) === false;
        };
      }
    } else {
      return true;
    }
    return false;
  };

  useEffect(() => {
    // var popup = window.open('http://localhost:3000/signin', '_blank');
    // if (isPopupBlockerActivated(popup)) {
    //   // Do what you want.
    //   alert("Popupeed Blocked")
    // } else {
    //   alert('Popp')
    // }
    setLoaded(!loading);
  }, [loading])

  const getOrgIdFromInviteId = () => {
    if (inviteId) {
      try {
        const { organizationId } = decryptData(inviteId);
        return organizationId;
      } catch (err) {
        console.log(err)
      }
    }
    return null;
  }
  const invitedOrgId = getOrgIdFromInviteId();

  const authHandler = async (err, data, msalInstance) => {
    if (err && err.errorCode === "popup_window_error")
      failureAlert("Please allow popups in settings and try again!");
    if (data?.accessToken) {
      if (authMSData && authMSData.accessToken !== data.accessToken)
        setAuthMSData(data);
      else if (!authMSData)
        setAuthMSData(data);
    }
  };

  useEffect(() => {
    const callBack = async () => {
      if (authMSData?.accessToken && authMSData?.mail) {
        setLoaded(false);
        // const response = {}
        const response = await dispatch(signin({ accessToken: authMSData.accessToken, inviteId, email: authMSData.mail }));
        if (response && response.status === 200) {
          localStorage.setItem("otpVerified", encryptData(true));
          userInfo.current = response.data
          const redirectToHome = "/";
          const redirectToUserDetail = "/user-detail";
          const redirectToPlans = "/plans";
          const gameId = decryptData(sessionStorage.getItem("gameId") || encryptData(""));
          const sessionId = decryptData(sessionStorage.getItem("sessionId") || encryptData(""));
          if (userInfo.current && userInfo.current.isNewUser) {
            window.gtag("event", "Users Registered", {
              event_category: "USER",
              event_label: "Users registered to the ExtramilePlay platform"
            });
            // props.history.replace(redirectToUserDetail);
            window.location.href = redirectToUserDetail;
          }
          else {
            localStorage.setItem("isAuthenticated", encryptData(true));
            sessionStorage.clear();
            var obj = null
            if (inviteId)
              obj = decryptData(inviteId);
            if (obj && obj.redirectURL) {
              // props.history.replace(obj.redirectURL);
              window.location.href = obj.redirectURL;
            }
            else if (userInfo.current && gameId && sessionId) {
              sessionStorage.setItem("gameId", encryptData(""));
              sessionStorage.setItem("sessionId", encryptData(""));
              redirectToGame(gameId, sessionId);
            }
            else if (userInfo.current && userInfo.current.role === 'USER' && !inviteId) {
              // props.history.replace(redirectToPlans);
              window.location.href = redirectToPlans;
            } else {
              // props.history.replace(redirectToHome);
              window.location.href = redirectToHome;
            }
            sessionStorage.setItem("inviteId", encryptData(null));
          }
          localStorage.setItem("fromOtpPage", encryptData(false));
        }
        else {
          failureAlert("Something went wrong!");
        }
        setLoaded(true);
        setLoginType("OTP");
      }
    }
    callBack();
  }, [loginType, authMSData])

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
        if (userInfo.current && !userInfo.current.isNewUser && userInfo.current.role === 'USER') {
          props.history.replace(redirectToPlans);
          window.location.href = redirectToPlans;
        } else if (userInfo.current && !userInfo.current.isNewUser) {
          props.history.replace(redirectToHome);
          window.location.href = redirectToHome;
        }
      }, 2000);
    }
  }

  return (
    <div>
      <Header {...props} disableHomepageButton={fromOtpPage} onboard inviteId={invitedOrgId} />
      <ToastContainer position="bottom-center" />
      <LoadingComponent loaded={loaded} />
      <OnBoard>
        <div className={loaded ? "auth-flow login" : "auth-flow login loading"}>
          <h5 className="login-heading">Login/Sign Up On ExtraMile {inviteId && orgDetailsById?.organization ? `Play to join ${orgDetailsById.organization.name} team` : ""}</h5>
          <form onSubmit={(e) => handleSubmit(e, "OTP")}>
            <div className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email ID *</label>

                <input
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="An OTP will be sent for verification"
                  onChange={handleChange}
                  onBlur={() => setTouched({ email: true })}
                  value={inputValue.email}
                  required
                />
                {errorMessage.email && <div className="error-message">{errorMessage.email}</div>}
              </div>
              <button type="submit" className="btn btn-primary">
                Sign In
              </button>
            </div>
          </form>
          <h4 className="or">Sign in with one of the following</h4>
          <div className="btn-group-sso">
            <button className="btn btn-secondry-sso" onClick={(e) => { handleSubmit(e, "AZUREAD") }}>
              <img src={azureAd} alt="" />
            </button>
            <button className="btn btn-secondry-sso" onClick={(e) => { handleSubmit(e, "PEOPLESTRONG") }}>
              <img src={peopleStrong} alt="" />
            </button>
          </div>
          {/* <MicrosoftLogin className="ms-auth" withUserData clientId={AZURE_CLIENT_ID} authCallback={authHandler}  >
            <button className="btn btn-secondry" onClick={() => setLoginWithMsClicked(true)} >Login With MS</button>
          </MicrosoftLogin> */}

          {/* <div className="login-option">
            <div className="login-divider">
              <span>or</span>
            </div>
            <div className="login-withaccount">
              <GoogleLogin
                clientId="874126450915-998pghgdq3a71s6d7pqovq7fanm8jevn.apps.googleusercontent.com"
                buttonText="Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
                render={(renderProps) => (
                  <button
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #23282E",
                      "box-sizing": "border-box",
                      "border-radius": "6px",
                    }}
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <img src={google} alt="google" />
                  </button>
                )}
              ></GoogleLogin>

              <FacebookLogin
                appId="763056201270294"
                //autoLoad={true}
                fields="name,email,picture"
                callback={responseFacebook}
                icon="fa-facebook"
                render={(renderProps) => (
                  <button
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #23282E",
                      "box-sizing": "border-box",
                      "border-radius": "6px",
                    }}
                    onClick={renderProps.onClick}
                  >
                    <img src={facebook} alt="facebook" />
                  </button>
                )}
              ></FacebookLogin>

              <LinkedIn
                clientId="781hl6t14llqdk"
                scope="r_liteprofile,r_emailaddress"
                onFailure={responseLinkedin}
                onSuccess={responseLinkedin}
                redirectUri={BASE_URL"/linkedin"}
                redirectPath="/linkedin"
                renderElement={({ onClick }) => (
                  <button
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #23282E",
                      "box-sizing": "border-box",
                      "border-radius": "6px",
                    }}
                    onClick={onClick}
                  >
                    <img src={linkedin} alt="linkedin" />
                  </button>
                )}
              />
            </div>
          </div> */}
        </div>
      </OnBoard>
    </div>
  );
};

export default SignIn;
