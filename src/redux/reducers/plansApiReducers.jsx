import * as ActionTypes from "../constants/plansApiConstants";
import * as UserActionTypes from '../constants/userConstants';
function plansContactUsReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.PLANS_CONTACT_US_REQUEST:
      return { loading: true };
    case ActionTypes.PLANS_CONTACT_US_SUCCESS:
      return { loading: false, plansContactUsInfo: action.payload };
    case ActionTypes.PLANS_CONTACT_US_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function plansGetMyPlansReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.PLAN_GET_MY_PLAN_REQUEST:
      return { loading: true };
    case ActionTypes.PLAN_GET_MY_PLAN_SUCCESS:
      return { loading: false, myPlanDetails: action.payload };
    case ActionTypes.PLAN_GET_MY_PLAN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function plansDownloadTransactionByIdReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.PLAN_DOWNLOAD_TRANSACTION_REQUEST:
      return { loading: true };
    case ActionTypes.PLAN_DOWNLOAD_TRANSACTION_SUCCESS:
      return { loading: false, downloadTransactionDetails: action.payload };
    case ActionTypes.PLAN_DOWNLOAD_TRANSACTION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function addOrgDetailsReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_ORG_DETAILS_REQUEST:
      return { loading: true };
    case ActionTypes.ADD_ORG_DETAILS_SUCCESS:
      return { loading: false, organisationDetails: action.payload };
    case ActionTypes.ADD_ORG_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function getOrganisationByEmailReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GET_ORG_BY_EMAIL_REQUEST:
      return { loading: true };
    case ActionTypes.GET_ORG_BY_EMAIL_SUCCESS:
      return { loading: false, orgDetailsByEmail: action.payload };
    case ActionTypes.GET_ORG_BY_EMAIL_FAIL:
      return { loading: false, error: action.payload };
    case UserActionTypes.USER_LOGOUT:
      return {};
    default:
      return state;
  }
}

function getOrganisationByIdReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GET_ORG_BY_ID_REQUEST:
      return { loading: true };
    case ActionTypes.GET_ORG_BY_ID_SUCCESS:
      return { loading: false, orgDetailsById: action.payload };
    case ActionTypes.GET_ORG_BY_ID_FAIL:
      return { loading: false, error: action.payload };
    case UserActionTypes.USER_LOGOUT:
      return {};
    default:
      return state;
  }
}

function addPlanAdminReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADMIN_ADD_PLAN_REQUEST:
      return { loading: true };
    case ActionTypes.ADMIN_ADD_PLAN_SUCCESS:
      return { loading: false, addedPlan: action.payload };
    case ActionTypes.ADMIN_ADD_PLAN_FAIL:
      return { loading: false, error: action.payload };
    case UserActionTypes.USER_LOGOUT:
      return {};
    default:
      return state;
  }
}
function addPlanToOrgByAdminReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_PLAN_TO_ORGANISATION_BY_ADMIN_REQUEST:
      return { loading: true };
    case ActionTypes.ADD_PLAN_TO_ORGANISATION_BY_ADMIN_SUCCESS:
      return { loading: false, addedPlanToOrg: action.payload };
    case ActionTypes.ADD_PLAN_TO_ORGANISATION_BY_ADMIN_FAIL:
      return { loading: false, error: action.payload };
    case UserActionTypes.USER_LOGOUT:
      return {};
    default:
      return state;
  }
}

export {
  plansContactUsReducer,
  plansGetMyPlansReducer,
  plansDownloadTransactionByIdReducer,
  addOrgDetailsReducer,
  getOrganisationByEmailReducer,
  getOrganisationByIdReducer,
  addPlanAdminReducer,
  addPlanToOrgByAdminReducer
};
