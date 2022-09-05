import React, { useEffect, useLayoutEffect, useState } from "react";

import OnBoard from "../../components/onboard/onboard";
import Header from "../../components/header/header";
import { useDispatch, useSelector } from "react-redux";
import { update } from "../../redux/actions/userAction";
import "react-dropdown/style.css";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { getGameServerOtp } from "../../redux/actions/gameDetailAction";
import { ToastContainer } from "react-toastify";
import { getOrganisation } from "../../redux/actions/plansApiActions";
import { decryptData, encryptData, failureAlert } from "../../helpers/helper";
import LoadingComponent from "../../components/loader/LoadingComponent";

const UserDetail = (props) => {
  const [loaded, setLoaded] = useState(true);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [validPhone, setValidPhone] = useState(true);
  const [inviteId, setInviteId] = useState("");
  const [userDetail, setUserDetail] = useState({
    fname: "",
    lname: "",
    email: "",
    phoneNumber: "",
  });
  const [touched, setTouched] = useState({
    fname: false,
    lname: false,
    email: false,
    phoneNumber: false,
  });

  const { email } = decryptData(localStorage.getItem("userSignInInfo") || encryptData({}));
  const [disableEmail, setDisableEmail] = useState(false);

  const dispatch = useDispatch();
  const { loading, userInfo } = useSelector((state) => state.userUpdate);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const inviteid = decryptData(sessionStorage.getItem("inviteId") || encryptData(""));
    setInviteId(inviteid);
  }, []);

  useEffect(() => {
    dispatch(getOrganisation(email))
  }, [email]);
  const GetOrganisation = useSelector((state) => state.getOrganisation);
  const { orgDetailsByEmail } = GetOrganisation;

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const nameFormat = /^[A-Z]+$/i;
    const numberFormat = /^[0-9]+$/;
    if (
      value !== "" &&
      ((name === "fname" || name === "lname") && (!nameFormat.test(value))) ||
      value.length > 20
    )
      return;
    if (value != "" &&
      (name === "phoneNumber" && !numberFormat.test(value))
    )
      return;
    if (touched[name])
      setTouched(prevState => ({ ...prevState, [name]: false }));
    setUserDetail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prevState) => ({
      ...prevState,
      [name]: true,
    }));
    return false;
  };
  const handleClick = async (e) => {
    e.preventDefault();
    setSubmitClicked(true);
    setTouched({ fname: true, lname: true, email: true, phoneNumber: true });
    // const errors = validateInput(userDetail);
    // if (
    //   (JSON.stringify(errors) ===
    //     JSON.stringify({
    //       fname: "",
    //       lname: "",
    //       email: "",
    //       phoneNumber: ""
    //     }))
    // ) {
    //   let statusResponse = await dispatch(update(userDetail.email, { firstName: userDetail.fname, lastName: userDetail.lname, phoneNumber: userDetail.phoneNumber }));
    //   if (statusResponse === 200) props.history.push(redirectToHome);
    // }
  };
  useEffect(async () => {
    if (touched.email && touched.fname && touched.lname && touched.phoneNumber && submitClicked) {
      const errors = validateInput(userDetail);
      if (
        (JSON.stringify(errors) ===
          JSON.stringify({
            fname: "",
            lname: "",
            email: "",
            phoneNumber: ""
          }))
      ) {
        dispatch(update(userDetail.email, { firstName: userDetail.fname, lastName: userDetail.lname, phoneNumber: userDetail.phoneNumber }));
      }
      else {
        window.scrollTo({ left: 0, top: 20, behavior: 'smooth' });
      }
      setSubmitClicked(false);
    }
  }, [touched])

  const redirectToGame = async (gameId, sessionId) => {

    const response = await dispatch(getGameServerOtp(gameId, sessionId));
    if (response && response.status === 200) {

      if (response.data && response.data.data && response.data.data.redirectUrl)
        window.location.replace(response.data.data.redirectUrl);
    }
    else if (userInfo && orgDetailsByEmail && orgDetailsByEmail.data) {
      props.history.push('/');

    }
    else {
      failureAlert("You are not allowed to access this game");
      setTimeout(() => {
        const redirectToPlans = "/plans";
        props.history.replace(redirectToPlans);
      }, 2000);
    }
  }

  // Redirect to HOME
  const redirectToHome = props.location.search
    ? props.location.search.split("=")[1]
    : "/";
  const redirectToPlans = props.location.search
    ? props.location.search.split("=")[1]
    : "/plans";
  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("isAuthenticated", encryptData(true));
      const gameId = decryptData(sessionStorage.getItem("gameId") || encryptData(""));
      const sessionId = decryptData(sessionStorage.getItem("sessionId") || encryptData(""));
      var obj = null
      if (inviteId)
        obj = decryptData(inviteId);
      if (obj && obj.redirectURL) {
        props.history.replace(obj.redirectURL);
      }
      else if (gameId && sessionId) {
        sessionStorage.setItem("gameId", encryptData(""));
        sessionStorage.setItem("sessionId", encryptData(""));
        redirectToGame(gameId, sessionId);
      }
      else if (userInfo && orgDetailsByEmail && orgDetailsByEmail.data) {
        props.history.push(redirectToHome);
      } else {
        props.history.push(redirectToPlans);
      }
    }
  }, [userInfo]);

  useEffect(() => {
    if (email) {
      setUserDetail((prevState) => ({ ...prevState, email: email }));
      setDisableEmail(true);
    }
  }, [email]);

  const validateInput = (user) => {
    const errors = {
      fname: "",
      lname: "",
      email: "",
      phoneNumber: ""
    };
    const emailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})/;
    if (touched.lname && user.lname.length === 0) {
      errors.lname = "Last Name should be valid";
    }
    if (touched.fname && user.fname.length < 3) {
      errors.fname = "First Name should contain minimum 3 characters";
    }
    if (touched.email && !emailFormat.test(user.email)) {
      errors.email = "Enter valid email id";
    }
    if (touched.phoneNumber && !validPhone) {
      errors.phoneNumber = "Enter valid phone number";
    }
    return errors;
  };
  let errorMessage = validateInput(userDetail);

  useEffect(() => {
    setLoaded(!loading);
  }, [loading]);

  return (
    <div>
      <Header {...props} onboard disableHomepageButton inviteId={email} />
      <LoadingComponent loaded={loaded} />
      <ToastContainer position="bottom-center" />
      <OnBoard>
        <div className={loaded ? "auth-flow" : "auth-flow loading"}>
          <h5 className="login-heading">Please fill in the details</h5>
          <form onSubmit={handleClick}>
            <div className="auth-form">
              <div className="form-group">
                <label htmlFor="fname">First Name *</label>
                <input
                  type="text"
                  className="form-control"
                  id="fname"
                  value={userDetail.fname}
                  name="fname"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="error-message">{errorMessage.fname}</div>
              </div>
              <div className="form-group">
                <label htmlFor="lname">Last Name *</label>
                <input
                  type="text"
                  className="form-control"
                  id="lname"
                  value={userDetail.lname}
                  name="lname"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="error-message">{errorMessage.lname}</div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Id *</label>
                <input
                  type="email"
                  disabled={disableEmail}
                  className="form-control"
                  value={userDetail.email}
                  id="email"
                  name="email"
                  placeholder="mathew@gmail.com"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="error-message">{errorMessage.email}</div>
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <PhoneInput
                  type="numbers"
                  className="form-control"
                  id="phoneNumber"
                  value={userDetail.phoneNumber}
                  name="phoneNumber"
                  enableLongNumbers
                  placeholder="+91 98765-43210"
                  // country="in"
                  onChange={(val, country, e, formattedValue) => {
                    if (
                      ((formattedValue?.length === country?.format?.length) && val.startsWith(country?.dialCode))
                      || (val === country?.dialCode) || val.length === 0)
                      setValidPhone(true);
                    else
                      setValidPhone(false);
                    setUserDetail((prevState) => ({
                      ...prevState,
                      phoneNumber: val
                    }));
                  }
                  }
                  isValid={(value, country) => {
                    // var formatData = country && country.format.replace(" ", "").replace("+", "").replace("-", "").replace("(", "").replace(")", "").replace(" ", "");
                    // if (value && value.length != 0 && (value && value.length) != formatData.length) {
                    //   setValidPhone(false)
                    //   return false;
                    // } else if (value && value.length === 0) {
                    //   setValidPhone(true)
                    //   return true;
                    // } else {
                    //   setValidPhone(true)
                    //   return true;
                    // }
                  }}
                  onBlur={() => handleBlur({ target: { name: "phoneNumber" } })}
                />

                <div className="error-message">{errorMessage.phoneNumber}</div>
              </div>

              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </OnBoard>
    </div>
  );
};

export default UserDetail;
