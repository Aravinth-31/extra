import * as ActionTypes from "../constants/commonApiConstants";
import { axiosApiInstance, BASE_URL, getCookie, encryptData, setCookie, GetToken, decryptData } from "../../helpers/helper";
import { logOut } from "./userAction";


//Upload File
const uploadFile = (fileData, privateFlag = false) => async (dispatch) => {
  dispatch({ type: ActionTypes.FILE_UPLOAD_REQUEST });
  try {
    let url = "/api/file/upload";
    if (privateFlag)
      url = "/api/file/private/upload";
    const { data, status } = await axiosApiInstance.post(BASE_URL + url, fileData,);
    dispatch({ type: ActionTypes.FILE_UPLOAD_SUCCESS, payload: data, });
    return { status, data };
  } catch (error) {
    dispatch({ type: ActionTypes.FILE_UPLOAD_FAIL, payload: error.message, });
    return { status: error.message };
  }
};
//upload employee details File
const uploadEmployeeDetails = (filePath, email) => async (dispatch) => {
  dispatch({ type: ActionTypes.EMPLOYEE_DATABASE_UPLOAD_REQUEST });
  try {
    let options = {};
    if (email)
      options = {
        headers: {
          'user-type': 'admin'
        }
      }
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/employee-database/upload", { filePath, email }, options);
    dispatch({ type: ActionTypes.EMPLOYEE_DATABASE_UPLOAD_SUCCESS, payload: data });
    return { status, data };
  } catch (error) {
    dispatch({ type: ActionTypes.EMPLOYEE_DATABASE_UPLOAD_FAIL, payload: error.response, });
    return error.response;
  }
};
//download employee details File
const downloadEmployeeDatabase = (filePath) => async (dispatch) => {
  dispatch({ type: ActionTypes.EMPLOYEE_DATABASE_DOWNLOAD_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.get(BASE_URL + "/api/employee-database/download");
    dispatch({ type: ActionTypes.EMPLOYEE_DATABASE_DOWNLOAD_SUCCESS, payload: data, });
    return { status, data };
  } catch (error) {
    dispatch({ type: ActionTypes.EMPLOYEE_DATABASE_DOWNLOAD_FAIL, payload: error.message, });
  }
};
const getAllWebinars = (getAllWebinar, getAll, page = 1) => async (dispatch) => {
  dispatch({ type: ActionTypes.WEBINAR_GET_ALL_REQUEST });
  try {
    let url = "/api/webinar/all?currPage=" + page;
    if (getAllWebinar)
      url += "&getAllWebinar=" + true;
    if (getAll)
      url += "&getAll=" + true;
    const { data } = await axiosApiInstance.get(BASE_URL + url);
    dispatch({ type: ActionTypes.WEBINAR_GET_ALL_SUCCESS, payload: data, });
  } catch (error) {
    dispatch({ type: ActionTypes.WEBINAR_GET_ALL_FAIL, payload: error.message, });
  }
};
const toggleWebinarAccess = (body) => async (dispatch) => {
  dispatch({ type: ActionTypes.TOGGLE_WEBINAR_ACCESS_REQUEST });
  try {
    const { status, data } = await axiosApiInstance.put(BASE_URL + "/api/webinar/toggle", body);
    dispatch({ type: ActionTypes.TOGGLE_WEBINAR_ACCESS_SUCCESS, payload: data, });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.TOGGLE_WEBINAR_ACCESS_FAIL, payload: error.message, });
  }
};
const addWebinar = (body) => async (dispatch) => {
  dispatch({ type: ActionTypes.ADD_WEBINAR_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/webinar/add", body);
    dispatch({ type: ActionTypes.ADD_WEBINAR_SUCCESS, payload: data, });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.ADD_WEBINAR_FAIL, payload: error.message, });
    return error.message;
  }
};
const deleteWebinar = (id) => async (dispatch) => {
  dispatch({ type: ActionTypes.DELETE_WEBINAR_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.delete(BASE_URL + "/api/webinar/delete/" + id);
    dispatch({ type: ActionTypes.DELETE_WEBINAR_SUCCESS, payload: data, });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.DELETE_WEBINAR_FAIL, payload: error.message, });
  }
};
const updateWebinar = (body) => async (dispatch) => {
  dispatch({ type: ActionTypes.UPDATE_WEBINAR_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.put(BASE_URL + "/api/webinar/update", body);
    dispatch({ type: ActionTypes.UPDATE_WEBINAR_SUCCESS, payload: data, });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.UPDATE_WEBINAR_FAIL, payload: error.message, });
  }
};
const downloadChats = () => async (dispatch) => {
  dispatch({ type: ActionTypes.DOWNLOAD_CHATS_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/webinar/download", { type: "chat" });
    dispatch({ type: ActionTypes.DOWNLOAD_CHATS_SUCCESS, payload: data, });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.DOWNLOAD_CHATS_FAIL, payload: error.message, });
  }
};
const downloadWebinarParticipants = () => async (dispatch) => {
  dispatch({ type: ActionTypes.DOWNLOAD_WEBINAR_PARTICIPANTS_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/webinar/download", { type: "user" });
    dispatch({ type: ActionTypes.DOWNLOAD_WEBINAR_PARTICIPANTS_SUCCESS, payload: data, });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.DOWNLOAD_WEBINAR_PARTICIPANTS_FAIL, payload: error.message, });
  }
};
const addDemoRequest = (body) => async (dispatch) => {
  dispatch({ type: ActionTypes.ADD_DEMO_REQUEST_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/demo-request/add", body);
    dispatch({ type: ActionTypes.ADD_DEMO_REQUEST_SUCCESS, payload: data, });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.ADD_DEMO_REQUEST_FAIL, payload: error.message, });
  }
};
const downloadDemoRequests = () => async (dispatch) => {
  dispatch({ type: ActionTypes.DOWNLOAD_DEMO_REQUESTS_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/demo-request/download", {});
    dispatch({ type: ActionTypes.DOWNLOAD_DEMO_REQUESTS_SUCCESS, payload: data, });
    return { status, data };
  } catch (error) {
    dispatch({ type: ActionTypes.DOWNLOAD_DEMO_REQUESTS_FAIL, payload: error.message, });
  }
};
const changeActingOwner = (id) => async (dispatch) => {
  dispatch({ type: ActionTypes.ACTING_OWNER_CHANGE_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/user/actingowner/" + id, {});
    dispatch({ type: ActionTypes.ACTING_OWNER_CHANGE_SUCCESS, payload: data, });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.ACTING_OWNER_CHANGE_FAIL, payload: error.message, });
  }
};
const backUpParticipants = (body) => async (dispatch) => {
  dispatch({ type: ActionTypes.WEBINAR_PARTICIPANTS_BACKUP_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/webinar/participantsBackup", body);
    dispatch({ type: ActionTypes.WEBINAR_PARTICIPANTS_BACKUP_SUCCESS, payload: data, });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.WEBINAR_PARTICIPANTS_BACKUP_FAIL, payload: error.message, });
  }
};
const backUpWebinarChats = (body) => async (dispatch) => {
  dispatch({ type: ActionTypes.WEBINAR_CHAT_BACKUP_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/webinar/chatsBackup", body);
    dispatch({ type: ActionTypes.WEBINAR_CHAT_BACKUP_SUCCESS, payload: data, });
    return { status, data };
  } catch (error) {
    dispatch({ type: ActionTypes.WEBINAR_CHAT_BACKUP_FAIL, payload: error.message, });
  }
};
const getNewToken = () => async (dispatch) => {
  dispatch({ type: ActionTypes.GET_NEW_TOKEN_REQUEST });
  try {
    // const rfToken = getCookie("x-auth-token");
    const rfToken = decryptData(localStorage.getItem("df-code") || encryptData(false));
    const token = GetToken();
    if (rfToken && !["undefined", "null"].includes(rfToken)) {
      let headers = {}
      if (rfToken)
        headers["x-auth-token"] = rfToken;
      const { data, status } = await axiosApiInstance.get(BASE_URL + "/api/auth/rf-token?fromdispatch", { headers });
      const { rfToken: newRFToken, ...remData } = data;
      dispatch({ type: ActionTypes.GET_NEW_TOKEN_SUCCESS, payload: remData, });
      localStorage.setItem("userSignInInfo", encryptData(remData));
      localStorage.setItem("otpVerified", encryptData(true));
      // setCookie("x-auth-token", newRFToken);
      localStorage.setItem("df-code", encryptData(newRFToken));
      return { status, data: remData };
    }
    else {
      dispatch({ type: ActionTypes.GET_NEW_TOKEN_FAIL, payload: "Tokens Not Found", });
    }
  } catch (error) {
    if (error?.response?.data?.pushLogout) {
      await dispatch(logOut());
    }
    dispatch({ type: ActionTypes.GET_NEW_TOKEN_FAIL, payload: error.message, });
  }
};
const getAllWebinarCategories = () => async (dispatch) => {
  dispatch({ type: ActionTypes.GET_ALL_WEBINAR_CATEGORIES_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.get(BASE_URL + "/api/webinar/category/all");
    dispatch({ type: ActionTypes.GET_ALL_WEBINAR_CATEGORIES_SUCCESS, payload: data, });
    return { status, data };
  } catch (error) {
    dispatch({ type: ActionTypes.GET_ALL_WEBINAR_CATEGORIES_FAIL, payload: error.message, });
  }
};

export {
  uploadFile,
  uploadEmployeeDetails,
  downloadEmployeeDatabase,
  getAllWebinars,
  toggleWebinarAccess,
  addWebinar,
  deleteWebinar,
  updateWebinar,
  downloadChats,
  downloadWebinarParticipants,
  addDemoRequest,
  downloadDemoRequests,
  changeActingOwner,
  backUpParticipants,
  backUpWebinarChats,
  getNewToken,
  getAllWebinarCategories
}