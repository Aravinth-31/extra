import * as ActionTypes from "../constants/adminApiConstants";
import { axiosApiInstance, BASE_URL } from "../../helpers/helper";


const getUsersCount = () => async (dispatch) => {
    dispatch({ type: ActionTypes.GET_USERS_COUNT_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.get(BASE_URL + "/api/user/user-count");
        dispatch({ type: ActionTypes.GET_USERS_COUNT_SUCCESS, payload: data, });
        return { status, data };
    } catch (error) {
        dispatch({ type: ActionTypes.GET_USERS_COUNT_FAIL, payload: error.message, });
    }
};

const downloadRegisteredUsers = () => async (dispatch) => {
    dispatch({ type: ActionTypes.DOWNLOAD_REGISTERED_USERS_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.get(BASE_URL + "/api/user/download-registered-users");
        dispatch({ type: ActionTypes.DOWNLOAD_REGISTERED_USERS_SUCCESS, payload: data, });
        return { status, data };
    } catch (error) {
        dispatch({ type: ActionTypes.DOWNLOAD_REGISTERED_USERS_FAIL, payload: error.message, });
    }
};

const downloadSubscribedUsers = () => async (dispatch) => {
    dispatch({ type: ActionTypes.DOWNLOAD_SUBSCRIBED_USERS_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.get(BASE_URL + "/api/user/download-subscribed-users");
        dispatch({ type: ActionTypes.DOWNLOAD_SUBSCRIBED_USERS_SUCCESS, payload: data, });
        return { status, data };
    } catch (error) {
        dispatch({ type: ActionTypes.DOWNLOAD_SUBSCRIBED_USERS_FAIL, payload: error.message, });
    }
};

const updateSSODetails = (body) => async (dispatch) => {
    dispatch({ type: ActionTypes.UPDATE_SSO_DETAILS_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/sso/add", body);
        dispatch({ type: ActionTypes.UPDATE_SSO_DETAILS_SUCCESS, payload: data, });
        return { status, data };
    } catch (error) {
        dispatch({ type: ActionTypes.UPDATE_SSO_DETAILS_FAIL, payload: error.message, });
        return error;
    }
};

export {
    getUsersCount,
    downloadRegisteredUsers,
    downloadSubscribedUsers,
    updateSSODetails
}