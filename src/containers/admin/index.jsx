import React, { useState, useEffect } from "react";

import OnBoard from "../../components/onboard/onboard";

import Logo from '../../assets/images/image.png';
//Redux
import { adminSignin } from "../../redux/actions/userAction";
import { useSelector, useDispatch } from "react-redux";
import LoadingComponent from "../../components/loader/LoadingComponent";
import { decryptData, encryptData, SOCKET_URL } from "../../helpers/helper";

import * as ActionTypes from "../../redux/constants/commonApiConstants";
import { io } from 'socket.io-client';

const AdminSignUp = (props) => {
  const [inputValue, setInputValue] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const userSignin = useSelector((state) => state.userSignin);
  var { loading, userInfo, error } = userSignin;
  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(adminSignin(inputValue.email, inputValue.password));
    if (response && response.data.message === "Rate limit exceeded, retry in 1 hour")
      setLoginError("You have made maximum unsuccessfull attempts, please try again after an hour");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prevState) => ({
      ...prevState,
      [name]: true,
    }));
    return false;
  };
  const redirectToHome = props.location.search
    ? props.location.search.split("=")[1]
    : "/";
  const redirectToUserDetail = props.location.search
    ? props.location.search.split("=")[1]
    : "/user-detail";

  useEffect(() => {
    const whatsappContainer = document.querySelector("#whatsapp-container");
    const chatBotContainer = document.querySelector("#chat-bot-launcher-container");
    chatBotContainer && (chatBotContainer.style.display = "none");
    whatsappContainer && (whatsappContainer.style.display = "none");
  }, []);

  useEffect(() => {
    const { token } = decryptData(localStorage.getItem("userSignInInfo") || encryptData({ token: false }));

    if (token || userSignin.userInfo) {
      if (!window.socket && token) {
        window.socket = io.connect(SOCKET_URL, {
          transports: ["websocket", "polling", "flashsocket"],
          reconnect: true,
          auth: {
            token: token
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
      props.history.push(redirectToHome);
    }
  }, [userInfo]);
  useEffect(() => {
    if (
      error &&
      error.data &&
      error.data.message &&
      error.data.message === "User Not Exist"
    ) {
      props.history.push(redirectToUserDetail);
    }
  }, [error]);

  const validateInput = (input) => {
    const errors = {
      email: "",
      password: "",
    };

    const inputFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/;

    if (
      touched.email &&
      (!inputFormat.test(input.email) || input.email === "")
    ) {
      errors.email =
        "Invalid Email Address / Phone number, Please provide a valid Email or phone number";
    }
    if (touched.password && input.password === "") {
      errors.password = "Password should not be empty";
    }
    return errors;
  };

  var errorMessage = validateInput(inputValue);
  return (
    <div className="outer-container">
      <OnBoard isAdmin>
        <LoadingComponent loaded={!loading} />
        <div className="auth-flow">
          <div className='login-header'>
            <div className='login-header-content'>
              <img src={Logo} alt="logo" />
            </div>
            <br />
            <div className='login-header-content'>
              <h5 className="login-heading">Admin Login</h5>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="auth-form">
              <div className="form-group">
                <div
                  style={{
                    color: "#F2545B",
                    "fontFamily": "Fira Sans",
                    "fontStyle": "normal",
                    "fontWeight": "normal",
                    "fontSize": "13px",
                  }}
                >
                  {loginError ? loginError : userSignin && userSignin.error
                    ? userSignin.error.data.message
                    : ""}
                </div>
                <label htmlFor="email">Email ID *</label>

                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter email id/mobile number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <div
                  className="invalid-feedback"
                  style={{
                    color: "#F2545B",
                    "fontFamily": "Fira Sans",
                    "fontStyle": "normal",
                    "fontWeight": "normal",
                    "fontSize": "13px",
                  }}
                >
                  {errorMessage.email}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password *</label>

                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Enter password.."
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <div
                  className="invalid-feedback"
                  style={{
                    color: "#F2545B",
                    "fontFamily": "Fira Sans",
                    "fontStyle": "normal",
                    "fontWeight": "normal",
                    "fontSize": "13px",
                  }}
                >
                  {errorMessage.password}
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </OnBoard>
    </div>
  );
};

export default AdminSignUp;
