import * as ActionTypes from "../constants/plansApiConstants";
import { axiosApiInstance, BASE_URL } from "../../helpers/helper";


const plansContactUs = (body) => async (dispatch) => {
  dispatch({ type: ActionTypes.PLANS_CONTACT_US_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(
      BASE_URL + "/api/plan/contact-us",
      body,
    );
    dispatch({ type: ActionTypes.PLANS_CONTACT_US_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({
      type: ActionTypes.PLANS_CONTACT_US_FAIL,
      payload: error.message
    });
  }
};

const getMyPlans = () => async (dispatch) => {
  dispatch({ type: ActionTypes.PLAN_GET_MY_PLAN_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(BASE_URL + "/api/my-plan/history");
    dispatch({ type: ActionTypes.PLAN_GET_MY_PLAN_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ActionTypes.PLAN_GET_MY_PLAN_FAIL,
      payload: error.message
    });
  }
};

const downloadTransactionById = (transID) => async (dispatch) => {
  dispatch({ type: ActionTypes.PLAN_DOWNLOAD_TRANSACTION_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(
      BASE_URL + "/api/my-plan/history/" + transID + "/download"
    );
    dispatch({
      type: ActionTypes.PLAN_DOWNLOAD_TRANSACTION_SUCCESS,
      payload: data
    });
    dispatch({
      type: ActionTypes.PLAN_DOWNLOAD_TRANSACTION_SUCCESS,
      payload: data
    });
    return data;
  } catch (error) {
    dispatch({
      type: ActionTypes.PLAN_DOWNLOAD_TRANSACTION_FAIL,
      payload: error.message
    });
  }
};

const addOrgDetails = (orgDetails) => async (dispatch) => {
  dispatch({ type: ActionTypes.ADD_ORG_DETAILS_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(
      BASE_URL + "/api/organization/add",
      {
        name: orgDetails.name,
        country: orgDetails.country,
        GSTIN: orgDetails.GSTIN,
        phoneNumber: orgDetails.phoneNumber,
        companyLogo: orgDetails.companyLogo,
        currency:orgDetails.currency
      },
    );
    dispatch({ type: ActionTypes.ADD_ORG_DETAILS_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({
      type: ActionTypes.ADD_ORG_DETAILS_FAIL,
      payload: error.response
    });
    return error.response;
  }
};
const getOrganisation = (email) => async (dispatch) => {
  dispatch({ type: ActionTypes.GET_ORG_BY_EMAIL_REQUEST });
  try {
    const { data } = await axiosApiInstance.post(BASE_URL + "/api/user/organization", { email });
    dispatch({ type: ActionTypes.GET_ORG_BY_EMAIL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ActionTypes.GET_ORG_BY_EMAIL_FAIL,
      payload: error.message
    });
  }
};
const getOrganisationDetailsById = (orgId) => async (dispatch) => {
  dispatch({ type: ActionTypes.GET_ORG_BY_ID_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(BASE_URL + "/api/organization/" + orgId);
    dispatch({ type: ActionTypes.GET_ORG_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ActionTypes.GET_ORG_BY_ID_FAIL, payload: error.message });
  }
};

const addPlanAdmin = (body) => async (dispatch) => {
  dispatch({ type: ActionTypes.ADMIN_ADD_PLAN_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/plan/addsingle", body);
    dispatch({ type: ActionTypes.ADMIN_ADD_PLAN_SUCCESS, payload: data });
    return { status, data };
  } catch (error) {
    dispatch({ type: ActionTypes.ADMIN_ADD_PLAN_FAIL, payload: error.message });
  }
};

const addPlanToOrgByAdmin = (body) => async (dispatch) => {
  dispatch({ type: ActionTypes.ADD_PLAN_TO_ORGANISATION_BY_ADMIN_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/plan/addPlanToOrgByAdmin", body);
    dispatch({ type: ActionTypes.ADD_PLAN_TO_ORGANISATION_BY_ADMIN_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.ADD_PLAN_TO_ORGANISATION_BY_ADMIN_FAIL, payload: error.message });
  }
};

export {
  plansContactUs,
  getMyPlans,
  downloadTransactionById,
  addOrgDetails,
  getOrganisation,
  getOrganisationDetailsById,
  addPlanAdmin,
  addPlanToOrgByAdmin
};
