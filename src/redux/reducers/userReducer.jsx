import * as ActionTypes from "../constants/userConstants";

function userGetAllReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.USER_GET_ALL_REQUEST:
      return { loading: true };
    case ActionTypes.USER_GET_ALL_SUCCESS:
      return { loading: false, allUsers: action.payload };
    case ActionTypes.USER_GET_ALL_FAIL:
      return { loading: false, error: action.payload };
    default: return state;
  }
}

function userSigninReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.USER_SIGNIN_REQUEST:
      return { loading: true };
    case ActionTypes.USER_SIGNIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case ActionTypes.USER_SIGNIN_FAIL:
      return { loading: false, error: action.payload };
    case ActionTypes.USER_LOGOUT:
      return {};
    default: return state;
  }
}

function userUpdateReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.USER_UPDATE_REQUEST:
      return { loading: true };
    case ActionTypes.USER_UPDATE_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case ActionTypes.USER_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case ActionTypes.USER_LOGOUT:
      return {};
    default: return state;
  }
}

function userRegisterReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.USER_REGISTER_REQUEST:
      return { loading: true };
    case ActionTypes.USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case ActionTypes.USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    case ActionTypes.USER_LOGOUT:
      return {};
    default: return state;
  }
}
function userForgotPasswordReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.USER_FORGOT_PASSWORD_REQUEST:
      return { loading: true };
    case ActionTypes.USER_FORGOT_PASSWORD_SUCCESS:
      return { loading: false, forgotPasswordInfo: action.payload };
    case ActionTypes.USER_FORGOT_PASSWORD_FAIL:
      return { loading: false, error: action.payload };
    default: return state;
  }
}
function userChangePasswordReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.USER_CHANGE_PASSWORD_REQUEST:
      return { loading: true };
    case ActionTypes.USER_CHANGE_PASSWORD_SUCCESS:
      return { loading: false, changePasswordInfo: action.payload };
    case ActionTypes.USER_CHANGE_PASSWORD_FAIL:
      return { loading: false, error: action.payload };
    default: return state;
  }
}
function getUserReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.USER_GET_USER_REQUEST:
      return { loading: true };
    case ActionTypes.USER_GET_USER_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case ActionTypes.USER_GET_USER_FAIL:
      return { loading: false, error: action.payload };
    case ActionTypes.USER_LOGOUT:
      return {};
    default: return state;
  }
}
function getFavGamesReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.USER_GET_FAV_GAMES_REQUEST:
      return { loading: true };
    case ActionTypes.USER_GET_FAV_GAMES_SUCCESS:
      return { loading: false, favGames: action.payload };
    case ActionTypes.USER_GET_FAV_GAMES_FAIL:
      return { loading: false, error: action.payload };
    case ActionTypes.USER_LOGOUT:
      return {};
    default: return state;
  }
}
function logOutReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.USER_LOGOUT_REQUEST:
      return { loading: true };
    case ActionTypes.USER_LOGOUT_SUCCESS:
      return { loading: false, logOutInfo: action.payload };
    case ActionTypes.USER_LOGOUT_FAIL:
      return { loading: false, error: action.payload };
    default: return state;
  }
}
function sendOtpReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.USER_SEND_OTP_REQUEST:
      return { loading: true };
    case ActionTypes.USER_SEND_OTP_SUCCESS:
      return { loading: false, sendOtpDetails: action.payload };
    case ActionTypes.USER_SEND_OTP_FAIL:
      return { loading: false, error: action.payload };
    default: return state;
  }
}
function verifyOtpReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.USER_VERIFY_OTP_REQUEST:
      return { loading: true };
    case ActionTypes.USER_VERIFY_OTP_SUCCESS:
      return { loading: false, verifyOtpDetails: action.payload };
    case ActionTypes.USER_VERIFY_OTP_FAIL:
      return { loading: false, error: action.payload };
    default: return state;
  }
}
function deleteUserBulkReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.USER_DELETE_BULK_REQUEST:
      return { loading: true };
    case ActionTypes.USER_DELETE_BULK_SUCCESS:
      return { loading: false, deletedUsers: action.payload };
    case ActionTypes.USER_DELETE_BULK_FAIL:
      return { loading: false, error: action.payload };
    default: return state;
  }
}
function downloadOrgUsersReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.DOWNLOAD_ORGANISATION_USERS_REQUEST:
      return { loading: true };
    case ActionTypes.DOWNLOAD_ORGANISATION_USERS_SUCCESS:
      return { loading: false, downloadedOrgUsers: action.payload };
    case ActionTypes.DOWNLOAD_ORGANISATION_USERS_FAIL:
      return { loading: false, error: action.payload };
    default: return state;
  }
}

export {
  userGetAllReducer,
  userSigninReducer,
  userRegisterReducer,
  userUpdateReducer,
  userForgotPasswordReducer,
  userChangePasswordReducer,
  getUserReducer,
  getFavGamesReducer,
  logOutReducer,
  sendOtpReducer,
  verifyOtpReducer,
  deleteUserBulkReducer,
  downloadOrgUsersReducer
}