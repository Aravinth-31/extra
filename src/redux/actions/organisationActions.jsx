import * as ActionTypes from "../constants/organisationApiConstants";
import { axiosApiInstance, BASE_URL, GetUserType } from "../../helpers/helper";
import ROLES from "../../helpers/userTypes";


const updateOrganisation = (orgId, orgInfo) => async (dispatch) => {
    dispatch({ type: ActionTypes.ORGANISATION_UPDATE_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.put(BASE_URL + "/api/organization/" + orgId, orgInfo);
        dispatch({ type: ActionTypes.ORGANISATION_UPDATE_SUCCESS, payload: data, });
        return { status, data };
    } catch (error) {
        dispatch({ type: ActionTypes.ORGANISATION_UPDATE_FAIL, payload: error.message, });
        return error.response;
    }
};
// Leave Organisation
const leaveOrganisation = () => async (dispatch) => {
    dispatch({ type: ActionTypes.ORGANISATION_LEAVE_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.get(BASE_URL + "/api/organization/leave");
        dispatch({ type: ActionTypes.ORGANISATION_LEAVE_SUCCESS, payload: data, });
        return status;
    } catch (error) {
        dispatch({ type: ActionTypes.ORGANISATION_LEAVE_FAIL, payload: error.message, });
    }
};
//Delete Organisation
const deleteOrganisation = (orgId) => async (dispatch) => {
    dispatch({ type: ActionTypes.ORGANISATION_DELETE_REQUEST });
    try {
        let url = BASE_URL + "/api/organization/" + orgId;
        if (GetUserType() === ROLES.EXTRAMILE_SUPERADMIN)
            url = BASE_URL + "/api/organization/byAdmin/" + orgId;
        const { data, status } = await axiosApiInstance.delete(url);
        dispatch({ type: ActionTypes.ORGANISATION_DELETE_SUCCESS, payload: data, });
        return status;
    } catch (error) {
        dispatch({ type: ActionTypes.ORGANISATION_DELETE_FAIL, payload: error.message, });
    }
};
//get organisation users
const getOrganisationUsers = (searchText, exceptEmployee, page = 1) => async (dispatch) => {
    dispatch({ type: ActionTypes.GET_ORGANISATION_USERS_REQUEST });
    var url = "/api/organization/user?email=" + searchText + "&limit";
    if (exceptEmployee)
        url = "/api/organization/user?email=" + searchText + "&limit&exceptEmployee=true"
    url += "&currPage=" + page
    try {
        const { data } = await axiosApiInstance.get(BASE_URL + url);
        dispatch({ type: ActionTypes.GET_ORGANISATION_USERS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: ActionTypes.GET_ORGANISATION_USERS_FAIL, payload: error.response });
    }
};

const deleteOrganisationUser = (userId) => async (dispatch) => {
    dispatch({ type: ActionTypes.DELETE_ORGANISATION_USER_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.delete(BASE_URL + "/api/organization/user/" + userId);
        dispatch({ type: ActionTypes.DELETE_ORGANISATION_USER_SUCCESS, payload: data });
        return status;
    } catch (error) {
        dispatch({ type: ActionTypes.DELETE_ORGANISATION_USER_FAIL, payload: error.message });
    }
};


const organisationAdduser = (userInfo) => async (dispatch) => {
    dispatch({ type: ActionTypes.ORGANISATION_ADD_USER_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/organization/add-user", userInfo);
        dispatch({ type: ActionTypes.ORGANISATION_ADD_USER_SUCCESS, payload: data, });
        return { status, data };
    } catch (error) {
        dispatch({ type: ActionTypes.ORGANISATION_ADD_USER_FAIL, payload: error.message, });
        return error.response?.data;
    }
};

const organisationEdituser = (userId, userInfo) => async (dispatch) => {
    dispatch({ type: ActionTypes.ORGANISATION_EDIT_USER_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.put(BASE_URL + "/api/organization/user/" + userId, userInfo);
        dispatch({ type: ActionTypes.ORGANISATION_EDIT_USER_SUCCESS, payload: data, });
        return status;
    } catch (error) {
        dispatch({ type: ActionTypes.ORGANISATION_EDIT_USER_FAIL, payload: error.message, });
    }
};

//Database for Extramile Admin

const getAllOrganisations = (searchText, sendAll) => async (dispatch) => {
    dispatch({ type: ActionTypes.ORGANISATION_GET_ALL_ORGANISATION_REQUEST });
    try {
        let url = BASE_URL + "/api/organization/all?search=" + searchText;
        if (sendAll)
            url = BASE_URL + "/api/organization/all?search=" + searchText + "&sendAll=true"
        const { data } = await axiosApiInstance.get(url);
        dispatch({ type: ActionTypes.ORGANISATION_GET_ALL_ORGANISATION_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: ActionTypes.ORGANISATION_GET_ALL_ORGANISATION_FAIL, payload: error.message });
    }
}

const getUserByOrganisation = (orgId, searchText, page = 1) => async (dispatch) => {
    dispatch({ type: ActionTypes.ORGANISATION_GET_USER_BY_ORGANISATION_REQUEST });
    try {
        const { data } = await axiosApiInstance.get(BASE_URL + "/api/organization/all-users/" + orgId + "?search=" + searchText + "&currPage=" + page);
        dispatch({ type: ActionTypes.ORGANISATION_GET_USER_BY_ORGANISATION_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: ActionTypes.ORGANISATION_GET_USER_BY_ORGANISATION_FAIL, payload: error.message });
    }
}

const toggleOrganisationByAdmin = (organizationId, isActive) => async (dispatch) => {
    dispatch({ type: ActionTypes.ORGANISATION_TOGGLE_ORGANISATION_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.post(BASE_URL + '/api/organization/toggle-active-status', { organizationId, isActive });
        dispatch({ type: ActionTypes.ORGANISATION_TOGGLE_ORGANISATION_SUCCESS, payload: data });
        return status;
    } catch (error) {
        dispatch({ type: ActionTypes.ORGANISATION_TOGGLE_ORGANISATION_FAIL, payload: error.message });
    }

}
const toggleOrgUserByAdmin = (userId, isActive) => async (dispatch) => {
    dispatch({ type: ActionTypes.ORGANISATION_TOGGLE_ORG_USER_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.post(BASE_URL + '/api/organization/user/toggle-active-status', { userId, isActive });
        dispatch({ type: ActionTypes.ORGANISATION_TOGGLE_ORG_USER_SUCCESS, payload: data });
        return status;
    } catch (error) {
        dispatch({ type: ActionTypes.ORGANISATION_TOGGLE_ORG_USER_FAIL, payload: error.message });
    }

}
const contactOrgAdmin = (orgId, details) => async (dispatch) => {
    dispatch({ type: ActionTypes.ORGANISATION_CONTACT_ORG_ADMIN_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.post(BASE_URL + '/api/user/contact-us', {
            organizationId: orgId,
            name: details.name,
            email: details.email,
            message: details.message
        });
        dispatch({ type: ActionTypes.ORGANISATION_CONTACT_ORG_ADMIN_SUCCESS, payload: data });
        return status;
    } catch (error) {
        dispatch({ type: ActionTypes.ORGANISATION_CONTACT_ORG_ADMIN_FAIL, payload: error.message });
    }
}
const createSamplecsv = (csvData, dummyUsers, usersData) => async (dispatch) => {
    dispatch({ type: ActionTypes.ORGANISATION_CREATE_SAMPLE_CSV_REQUEST });
    try {
        const { data } = await axiosApiInstance.post(BASE_URL + '/api/organization/download/sampleCsv',
            { data: csvData, dummyUsers, usersData });
        dispatch({ type: ActionTypes.ORGANISATION_CREATE_SAMPLE_CSV_SUCCESS, payload: data });
        return data;
    } catch (error) {
        dispatch({ type: ActionTypes.ORGANISATION_CREATE_SAMPLE_CSV_FAIL, payload: error.message });
    }
}

const addOrganisationByAdmin = (body) => async (dispatch) => {
    dispatch({ type: ActionTypes.ADD_ORGANISATION_BY_ADMIN_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/organization/addAdmin", body);
        dispatch({ type: ActionTypes.ADD_ORGANISATION_BY_ADMIN_SUCCESS, payload: data, });
        return { status, data };
    } catch (error) {
        dispatch({ type: ActionTypes.ADD_ORGANISATION_BY_ADMIN_FAIL, payload: error.message, });
        return error.response?.data;
    }
};
const getMasterOtpOrganisation = (id) => async (dispatch) => {
    dispatch({ type: ActionTypes.GET_ORGANISATION_MASTER_OTP_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.get(BASE_URL + "/api/organization/masterotp/" + id);
        dispatch({ type: ActionTypes.GET_ORGANISATION_MASTER_OTP_SUCCESS, payload: data, });
        return { status, data };
    } catch (error) {
        dispatch({ type: ActionTypes.GET_ORGANISATION_MASTER_OTP_FAIL, payload: error.message, });
        return error.response?.data;
    }
};
const setMasterOtpOrganisation = (id, body) => async (dispatch) => {
    dispatch({ type: ActionTypes.UPDATE_MASTER_OTP_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.put(BASE_URL + "/api/organization/masterotp/" + id, body);
        dispatch({ type: ActionTypes.UPDATE_MASTER_OTP_SUCCESS, payload: data, });
        return { status, data };
    } catch (error) {
        dispatch({ type: ActionTypes.UPDATE_MASTER_OTP_FAIL, payload: error.message, });
        return error.response?.data;
    }
};
const addUsersWithDummyEmailOrg = (body, byUploadingFile) => async (dispatch) => {
    dispatch({ type: ActionTypes.ADD_USERS_WITH_DUMMY_EMAIL_REQUEST });
    try {
        let url = BASE_URL + "/api/organization/add-user-by-admin";
        if (byUploadingFile)
            url = BASE_URL + "/api/organization/add-user-by-sheet"
        const { data, status } = await axiosApiInstance.post(url, body);
        dispatch({ type: ActionTypes.ADD_USERS_WITH_DUMMY_EMAIL_SUCCESS, payload: data, });
        return { status, data };
    } catch (error) {
        dispatch({ type: ActionTypes.ADD_USERS_WITH_DUMMY_EMAIL_FAIL, payload: error.message, });
        return error.response?.data;
    }
};

export {
    updateOrganisation,
    leaveOrganisation,
    getOrganisationUsers,
    deleteOrganisationUser,
    organisationAdduser,
    organisationEdituser,
    deleteOrganisation,
    getAllOrganisations,
    getUserByOrganisation,
    toggleOrganisationByAdmin,
    toggleOrgUserByAdmin,
    contactOrgAdmin,
    createSamplecsv,
    addOrganisationByAdmin,
    setMasterOtpOrganisation,
    getMasterOtpOrganisation,
    addUsersWithDummyEmailOrg
}