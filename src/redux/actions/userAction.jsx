import * as ActionTypes from "../constants/userConstants";
import { abortController, axiosApiInstance, BASE_URL, decryptData, deleteCookie, encryptData, getCookie, GetToken, setCookie } from "../../helpers/helper";



//user Get All
const getAllUsers = () => async (dispatch) => {
  dispatch({ type: ActionTypes.USER_GET_ALL_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(BASE_URL + "/api/user/all",);
    dispatch({ type: ActionTypes.USER_GET_ALL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ActionTypes.USER_GET_ALL_FAIL, payload: error.response });
  }
};

//user Signin
const signin = (body) => async (dispatch) => {
  localStorage.setItem("fromOtpPage", encryptData(false));
  dispatch({
    type: ActionTypes.USER_SIGNIN_REQUEST,
    payload: body,
  });
  let url = "/api/user/login";
  if (!body.otp && GetToken() && !body.accessToken) {
    url = "/api/user/sign-in-with-token";
  }
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + url, body);
    const { rfToken, ...remData } = data;
    var dataWithUserDetail = { ...remData, ...body };
    dispatch({ type: ActionTypes.USER_SIGNIN_SUCCESS, payload: dataWithUserDetail });
    localStorage.setItem("userSignInInfo", encryptData(dataWithUserDetail));
    if (data.role === "EXTRAMILE_SUPERADMIN")
      localStorage.setItem("isAdmin", encryptData(true));
    else
      localStorage.setItem("isAdmin", encryptData(false));
    // setCookie("x-auth-token", rfToken);
    localStorage.setItem("df-code", encryptData(rfToken));
    return { data: remData, status };
  } catch (error) {
    dispatch({ type: ActionTypes.USER_SIGNIN_FAIL, payload: error.response });
    return error.response;
  }
};

// //user signup
const register = (email, password) => async (dispatch) => {
  dispatch({
    type: ActionTypes.USER_REGISTER_REQUEST,
    payload: { email, password },
  });
  try {
    const { data } = await axiosApiInstance.post(BASE_URL + "/api/user/update", {
      email,
      password,
    });
    dispatch({ type: ActionTypes.USER_REGISTER_SUCCESS, payload: data });
    localStorage.setItem("userSignUpInfo", encryptData(data));
  } catch (error) {
    dispatch({ type: ActionTypes.USER_REGISTER_FAIL, payload: error.message });
  }
};
//user update
/**
 * @param {String} userId
 * @param {{name:String,organizationName:String,email:String,phoneNumber:String,country:string,city:String}} userDetail
 */
const update = (userId, userDetail) => async (dispatch) => {
  dispatch({
    type: ActionTypes.USER_UPDATE_REQUEST,
    payload: { userId, userDetail },
  });
  try {
    const { data, status } = await axiosApiInstance.put(
      BASE_URL + "/api/user/update",
      userDetail,
    );
    dispatch({ type: ActionTypes.USER_UPDATE_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.USER_UPDATE_FAIL, payload: error.response });
  }
};

//test
// const update = (userId, userDetail) => async (dispatch) => {
//   dispatch({ type: ActionTypes.USER_UPDATE_REQUEST, payload: { userDetail } });
//   const { token } = decryptData(localStorage.getItem('userInfo') || encryptData({ token: '' }));
//   try {
//     const { data } = await fetch({
//       method: 'put',
//       url: BASE_URL + "/api/user/update",
//       data: userDetail,
//       config: { headers: {
//         "Authorization": `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       'Accept-Encoding':'gzip, deflate, br' ,
//     'Accept':'*/*'}}
//     })
//     dispatch({ type: ActionTypes.USER_UPDATE_SUCCESS, payload: data });
//     localStorage.setItem("userInfo", encryptData(data));
//   } catch (error) {
//     dispatch({ type: ActionTypes.USER_UPDATE_FAIL, payload: error.message });
//   }
// }
//test 2
// const update = (userId, userDetail) => async (dispatch) => {
//   dispatch({ type: ActionTypes.USER_UPDATE_REQUEST, payload: { userDetail } });
//   const { token } = decryptData(localStorage.getItem('userInfo') || encryptData({ token: '' }));
//   try {
//     const { data } = await fetch(BASE_URL + "/api/user/update", {
//       method: "PUT", // POST, PUT, DELETE, etc.
//       headers: {

//         "Authorization": `Bearer ${token}`,
//         'Content-Type': 'application/json'

//       },
//       body: userDetail // string, FormData, Blob, BufferSource, or URLSearchParams

//     })
//     dispatch({ type: ActionTypes.USER_UPDATE_SUCCESS, payload: data });
//     localStorage.setItem("userInfo", encryptData(data));
//   } catch (error) {
//     dispatch({ type: ActionTypes.USER_UPDATE_FAIL, payload: error.message });
//   }
// }

//user Forgot Password
const forgotPassword = (userEmail) => async (dispatch) => {
  dispatch({ type: ActionTypes.USER_FORGOT_PASSWORD_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(
      BASE_URL + "/api/user/forgot-password",
      { email: userEmail },
    );
    dispatch({ type: ActionTypes.USER_FORGOT_PASSWORD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ActionTypes.USER_FORGOT_PASSWORD_FAIL,
      payload: error.response,
    });
  }
};
//user Change Password
const changePassword = (secret, newPassword) => async (dispatch) => {
  dispatch({ type: ActionTypes.USER_CHANGE_PASSWORD_REQUEST });
  try {
    const { data } = await axiosApiInstance.patch(
      BASE_URL + "/api/user/change-password?secret=" + secret,
      {
        password: newPassword,
      },
    );
    dispatch({ type: ActionTypes.USER_CHANGE_PASSWORD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ActionTypes.USER_CHANGE_PASSWORD_FAIL,
      payload: error.response,
    });
  }
};

//Get User Details
const getUser = () => async (dispatch) => {
  dispatch({ type: ActionTypes.USER_GET_USER_REQUEST });
  const otpVerified = decryptData(localStorage.getItem("otpVerified") || encryptData(false));
  const token = GetToken();
  try {
    if (!token) {
      dispatch({ type: ActionTypes.USER_GET_USER_FAIL, payload: "Token Not Available" });
      throw new Error("Failed");
    }
    else if (otpVerified) {
      const { data } = await axiosApiInstance.get(BASE_URL + "/api/user/profile",);
      dispatch({ type: ActionTypes.USER_GET_USER_SUCCESS, payload: data });
      if (data.data.role === "EXTRAMILE_SUPERADMIN")
        localStorage.setItem("isAdmin", encryptData(true));
      else
        localStorage.setItem("isAdmin", encryptData(false));
      return data;
    }
    else {
      dispatch({ type: ActionTypes.USER_GET_USER_FAIL, payload: "User Not Verified" });
      throw new Error("Failed");
    }
  } catch (error) {
    localStorage.setItem("isAdmin", encryptData(false));
    localStorage.setItem("isAuthenticated", encryptData(false));
    localStorage.setItem("userSignInInfo", encryptData(""));
    localStorage.setItem("userSignUpInfo", encryptData(""));
    dispatch({ type: ActionTypes.USER_GET_USER_FAIL, payload: error.message });
  }
};
const getFavGames = (getAll, page = 1) => async (dispatch) => {
  dispatch({ type: ActionTypes.USER_GET_FAV_GAMES_REQUEST });
  try {
    const token = GetToken();
    if (token) {
      let url = "/api/user/fav-games?currPage=" + page;
      if (getAll)
        url = url + "&getAll=" + getAll
      const { data } = await axiosApiInstance.get(BASE_URL + url);
      dispatch({ type: ActionTypes.USER_GET_FAV_GAMES_SUCCESS, payload: data });
    }
    else
      dispatch({ type: ActionTypes.USER_GET_FAV_GAMES_FAIL, payload: "Token Not Available", });
  } catch (error) {
    dispatch({
      type: ActionTypes.USER_GET_FAV_GAMES_FAIL,
      payload: error.message,
    });
  }
};
const logOut = () => async (dispatch) => {
  dispatch({ type: ActionTypes.USER_LOGOUT_REQUEST });
  abortController.abort();
  try {
    localStorage.setItem("otpVerified", encryptData(false));
    localStorage.setItem("isAuthenticated", encryptData(false));

    const rfToken = decryptData(localStorage.getItem("df-code") || encryptData(false));
    // const rfToken = getCookie("x-auth-token");
    if (!rfToken && ["undefined", "null"].includes(rfToken) && !GetToken()) {
      throw ("No Tokens Found");
    }
    const { data } = await axiosApiInstance.get(BASE_URL + "/api/user/logout", {
      headers: {
        "x-auth-token": rfToken
      },
    });
    // deleteCookie("x-auth-token");
    localStorage.setItem("df-code", encryptData(null));
    localStorage.setItem("userSignInInfo", encryptData(""));
    localStorage.setItem("userSignUpInfo", encryptData(""));
    localStorage.setItem("isAdmin", encryptData(false));
    if (window.socket)
      window.socket.disconnect();
    const element = document.querySelector(":root");
    element.style.setProperty('--color-theme', "#E25569");
    element.style.setProperty('--color-theme_1', "#E255691A");
    element.style.setProperty('--color-theme_2', "#E255692A");
    element.style.setProperty('--color-theme_5', "#E255695A");
    element.style.setProperty('--background-theme', `linear-gradient(85.42deg, #E25569 0%, #FB9946 100%)`);
    dispatch({ type: ActionTypes.USER_LOGOUT_SUCCESS, payload: data });
    dispatch({ type: ActionTypes.USER_LOGOUT });
  } catch (error) {
    localStorage.setItem("userSignInInfo", encryptData(""));
    localStorage.setItem("userSignUpInfo", encryptData(""));
    localStorage.setItem("isAdmin", encryptData(false));
    localStorage.setItem("isAuthenticated", encryptData(false));
    localStorage.setItem("otpVerified", encryptData(false));
    const element = document.querySelector(":root");
    element.style.setProperty('--color-theme', "#E25569");
    element.style.setProperty('--color-theme_1', "#E255691A");
    element.style.setProperty('--color-theme_2', "#E255692A");
    element.style.setProperty('--color-theme_5', "#E255695A");
    element.style.setProperty('--background-theme', `linear-gradient(85.42deg, #E25569 0%, #FB9946 100%)`);
    dispatch({ type: ActionTypes.USER_LOGOUT });
    dispatch(getUser());
    dispatch({ type: ActionTypes.USER_LOGOUT_FAIL, payload: error.message });
  }
};

//user Signin
const adminSignin = (email, password) => async (dispatch) => {
  dispatch({
    type: ActionTypes.USER_SIGNIN_REQUEST,
    payload: { email, password },
  });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/user/admin-login", {
      email,
      password,
    });
    const { rfToken, ...remData } = data;
    dispatch({ type: ActionTypes.USER_SIGNIN_SUCCESS, payload: remData });
    localStorage.setItem("userSignInInfo", encryptData(remData));
    if (remData.role === "EXTRAMILE_SUPERADMIN") {
      localStorage.setItem("isAdmin", encryptData(true));
      localStorage.setItem("otpVerified", encryptData(true));
      localStorage.setItem("isAuthenticated", encryptData(true));
    }
    else
      localStorage.setItem("isAdmin", encryptData(false));
    // setCookie("x-auth-token", rfToken);
    localStorage.setItem("df-code", encryptData(rfToken));
    return { data: remData, status }
  } catch (error) {
    dispatch({ type: ActionTypes.USER_SIGNIN_FAIL, payload: error.response });
    return error.response
  }
};
// OTP send and verify 
const sendOtpToUser = (email) => async (dispatch) => {
  dispatch({ type: ActionTypes.USER_SEND_OTP_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/user/send-otp", {
      email
    });
    dispatch({ type: ActionTypes.USER_SEND_OTP_SUCCESS, payload: data });
    return { status, data };
  } catch (error) {
    dispatch({ type: ActionTypes.USER_SEND_OTP_FAIL, payload: error.message });
    return error.message;
  }

}
const verifyOtp = (email, otp) => async (dispatch) => {
  dispatch({ type: ActionTypes.USER_VERIFY_OTP_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/user/verify-otp", {
      email,
      otp
    });
    dispatch({ type: ActionTypes.USER_VERIFY_OTP_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.USER_VERIFY_OTP_FAIL, payload: error.message });
  }
}
const deleteUsersBulk = (body) => async (dispatch) => {
  dispatch({ type: ActionTypes.USER_DELETE_BULK_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/user/deleteUsers", body);
    dispatch({ type: ActionTypes.USER_DELETE_BULK_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.USER_DELETE_BULK_FAIL, payload: error.message });
  }
}
const downloadOrgUsers = () => async (dispatch) => {
  dispatch({ type: ActionTypes.DOWNLOAD_ORGANISATION_USERS_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.get(BASE_URL + "/api/organization/download-users");
    dispatch({ type: ActionTypes.DOWNLOAD_ORGANISATION_USERS_SUCCESS, payload: data });
    return { status, data };
  } catch (error) {
    dispatch({ type: ActionTypes.DOWNLOAD_ORGANISATION_USERS_FAIL, payload: error.message });
  }
}

export {
  getAllUsers,
  signin,
  adminSignin,
  register,
  update,
  forgotPassword,
  changePassword,
  getUser,
  getFavGames,
  logOut,
  sendOtpToUser,
  verifyOtp,
  deleteUsersBulk,
  downloadOrgUsers
};
