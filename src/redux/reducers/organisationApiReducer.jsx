import * as ActionTypes from "../constants/organisationApiConstants";

function organisationUpdateReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.ORGANISATION_UPDATE_REQUEST:
            return { loading: true };
        case ActionTypes.ORGANISATION_UPDATE_SUCCESS:
            return { loading: false, orgUpdateInfo: action.payload };
        case ActionTypes.ORGANISATION_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function organisationLeaveReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.ORGANISATION_LEAVE_REQUEST:
            return { loading: true };
        case ActionTypes.ORGANISATION_LEAVE_SUCCESS:
            return { loading: false, leaveOrgInfo: action.payload };
        case ActionTypes.ORGANISATION_LEAVE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function organisationDeleteReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.ORGANISATION_DELETE_REQUEST:
            return { loading: true };
        case ActionTypes.ORGANISATION_DELETE_SUCCESS:
            return { loading: false, deletedOrg: action.payload };
        case ActionTypes.ORGANISATION_DELETE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function organisationGetUsersReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.GET_ORGANISATION_USERS_REQUEST:
            return { loading: true };
        case ActionTypes.GET_ORGANISATION_USERS_SUCCESS:
            return { loading: false, orgUsers: action.payload };
        case ActionTypes.GET_ORGANISATION_USERS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function organisationDeleteUserReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.DELETE_ORGANISATION_USER_REQUEST:
            return { loading: true };
        case ActionTypes.DELETE_ORGANISATION_USER_SUCCESS:
            return { loading: false, deleteOrgUser: action.payload };
        case ActionTypes.DELETE_ORGANISATION_USER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function organisationAddUserReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.ORGANISATION_ADD_USER_REQUEST:
            return { loading: true };
        case ActionTypes.ORGANISATION_ADD_USER_SUCCESS:
            return { loading: false, addedUser: action.payload };
        case ActionTypes.ORGANISATION_ADD_USER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

function organisationEditUserReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.ORGANISATION_EDIT_USER_REQUEST:
            return { loading: true };
        case ActionTypes.ORGANISATION_EDIT_USER_SUCCESS:
            return { loading: false, editOrgUser: action.payload };
        case ActionTypes.ORGANISATION_EDIT_USER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
// EXTRAMILE ADMIN
function organisationGetAllOrganisationReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.ORGANISATION_GET_ALL_ORGANISATION_REQUEST:
            return { loading: true };
        case ActionTypes.ORGANISATION_GET_ALL_ORGANISATION_SUCCESS:
            return { loading: false, allOrganisationData: action.payload };
        case ActionTypes.ORGANISATION_GET_ALL_ORGANISATION_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

function organisationGetUserByOrganisationReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.ORGANISATION_GET_USER_BY_ORGANISATION_REQUEST:
            return { loading: true };
        case ActionTypes.ORGANISATION_GET_USER_BY_ORGANISATION_SUCCESS:
            return { loading: false, usersByOrganisation: action.payload };
        case ActionTypes.ORGANISATION_GET_USER_BY_ORGANISATION_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function organisationToggleOrganisationReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.ORGANISATION_TOGGLE_ORGANISATION_REQUEST:
            return { loading: true };
        case ActionTypes.ORGANISATION_TOGGLE_ORGANISATION_SUCCESS:
            return { loading: false, toggleOrganisation: action.payload };
        case ActionTypes.ORGANISATION_TOGGLE_ORGANISATION_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

function organisationToggleOrgUserReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.ORGANISATION_TOGGLE_ORG_USER_REQUEST:
            return { loading: true };
        case ActionTypes.ORGANISATION_TOGGLE_ORG_USER_SUCCESS:
            return { loading: false, toggleOrgUser: action.payload };
        case ActionTypes.ORGANISATION_TOGGLE_ORG_USER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function organisationContactAdminReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.ORGANISATION_CONTACT_ORG_ADMIN_REQUEST:
            return { loading: true };
        case ActionTypes.ORGANISATION_CONTACT_ORG_ADMIN_SUCCESS:
            return { loading: false, contactAdminDetails: action.payload };
        case ActionTypes.ORGANISATION_CONTACT_ORG_ADMIN_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function organisationCreateSampleCSV(state = {}, action) {
    switch (action.type) {
        case ActionTypes.ORGANISATION_CREATE_SAMPLE_CSV_REQUEST:
            return { loading: true };
        case ActionTypes.ORGANISATION_CREATE_SAMPLE_CSV_SUCCESS:
            return { loading: false, createSamplecsvData: action.payload };
        case ActionTypes.ORGANISATION_CREATE_SAMPLE_CSV_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

function addOrganisationByAdminReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.ADD_ORGANISATION_BY_ADMIN_REQUEST:
            return { loading: true };
        case ActionTypes.ADD_ORGANISATION_BY_ADMIN_SUCCESS:
            return { loading: false, addedOrganisation: action.payload };
        case ActionTypes.ADD_ORGANISATION_BY_ADMIN_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function updateMasterOtpReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.UPDATE_MASTER_OTP_REQUEST:
            return { loading: true };
        case ActionTypes.UPDATE_MASTER_OTP_SUCCESS:
            return { loading: false, setMasterOtp: action.payload };
        case ActionTypes.UPDATE_MASTER_OTP_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function getMasterOtpReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.GET_ORGANISATION_MASTER_OTP_REQUEST:
            return { loading: true };
        case ActionTypes.GET_ORGANISATION_MASTER_OTP_SUCCESS:
            return { loading: false, getMasterOtp: action.payload };
        case ActionTypes.GET_ORGANISATION_MASTER_OTP_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function addUserDummyEmailReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.ADD_USERS_WITH_DUMMY_EMAIL_REQUEST:
            return { loading: true };
        case ActionTypes.ADD_USERS_WITH_DUMMY_EMAIL_SUCCESS:
            return { loading: false, addedUsers: action.payload };
        case ActionTypes.ADD_USERS_WITH_DUMMY_EMAIL_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export {
    organisationUpdateReducer,
    organisationLeaveReducer,
    organisationGetUsersReducer,
    organisationDeleteUserReducer,
    organisationAddUserReducer,
    organisationEditUserReducer,
    organisationDeleteReducer,
    organisationGetAllOrganisationReducer,
    organisationGetUserByOrganisationReducer,
    organisationToggleOrganisationReducer,
    organisationToggleOrgUserReducer,
    organisationContactAdminReducer,
    organisationCreateSampleCSV,
    addOrganisationByAdminReducer,
    updateMasterOtpReducer,
    getMasterOtpReducer,
    addUserDummyEmailReducer
}
