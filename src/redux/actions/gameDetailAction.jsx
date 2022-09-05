import * as ActionTypes from "../constants/gameDetailConstants";
import { axiosApiInstance, BASE_URL, decryptData, encryptData, GetUserType } from "../../helpers/helper";
import { OrgRoles } from "../../helpers/userTypes";


//Get Game details
const getGameDetail = (gameId) => async (dispatch) => {
  let url = "/api/game/" + gameId;
  const otpVerified = decryptData(localStorage.getItem("otpVerified") || encryptData(false));
  if (OrgRoles.includes(GetUserType()) && otpVerified)
    url = "/api/organization-game/" + gameId;
  dispatch({ type: ActionTypes.GAME_DETAIL_GET_GAME_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(BASE_URL + url);
    dispatch({ type: ActionTypes.GAME_DETAIL_GET_GAME_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ActionTypes.GAME_DETAIL_GET_GAME_FAIL,
      payload: error.message
    });
  }
};

const gameAllCategory = () => async (dispatch) => {
  dispatch({ type: ActionTypes.GAME_ALL_CATEGORY_REQUEST });
  try {
    let url = BASE_URL + "/api/category/all";
    const otpVerified = decryptData(localStorage.getItem("otpVerified") || encryptData(false));
    if (OrgRoles.includes(GetUserType()) && otpVerified)
      url = BASE_URL + "/api/category/organization/all"
    const { data } = await axiosApiInstance.get(url);
    dispatch({ type: ActionTypes.GAME_ALL_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ActionTypes.GAME_ALL_CATEGORY_FAIL,
      payload: error.message
    });
  }
};

const getAllObjectives = () => async (dispatch) => {
  dispatch({ type: ActionTypes.GAME_GET_ALL_OBJECTIVES_REQUEST });
  try {
    let url = BASE_URL + "/api/objectives/all";
    const otpVerified = decryptData(localStorage.getItem("otpVerified") || encryptData(false));
    if (OrgRoles.includes(GetUserType()) && otpVerified)
      url = BASE_URL + "/api/objectives/organization/all"
    const { data } = await axiosApiInstance.get(url);
    dispatch({ type: ActionTypes.GAME_GET_ALL_OBJECTIVES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ActionTypes.GAME_GET_ALL_OBJECTIVES_FAIL,
      payload: error.message
    });
  }
};

const getAllPlans = () => async (dispatch) => {
  dispatch({ type: ActionTypes.PLANS_GET_ALL_PLANS_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(BASE_URL + "/api/plan/all");
    dispatch({ type: ActionTypes.PLANS_GET_ALL_PLANS_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({
      type: ActionTypes.PLANS_GET_ALL_PLANS_FAIL,
      payload: error.message
    });
  }
};

const getPlanDetails = (planId) => async (dispatch) => {
  dispatch({ type: ActionTypes.PLANS_GET_PLAN_DETAILS_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(BASE_URL + "/api/plan/" + planId);
    dispatch({
      type: ActionTypes.PLANS_GET_PLAN_DETAILS_SUCCESS,
      payload: data
    });
    return data;
  } catch (error) {
    dispatch({
      type: ActionTypes.PLANS_GET_PLAN_DETAILS_FAIL,
      payload: error.message
    });
  }
};

const getHRId = (gameName) => async (dispatch) => {
  dispatch({ type: ActionTypes.GAME_GET_HR_ID_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.get(
      BASE_URL + `/api/${gameName}/play-game`);
    dispatch({ type: ActionTypes.GAME_GET_HR_ID_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.GAME_GET_HR_ID_FAIL, payload: error.message });
  }
};

const addPurchaseOrder = (orderDetails) => async (dispatch) => {
  dispatch({ type: ActionTypes.ADD_PURCHASE_ORDER_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(
      BASE_URL + "/api/purchase-order/add",
      orderDetails,
    );
    dispatch({ type: ActionTypes.ADD_PURCHASE_ORDER_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({
      type: ActionTypes.ADD_PURCHASE_ORDER_FAIL,
      payload: error.message
    });
  }
};

const addSubscribedGames = (games) => async (dispatch) => {
  dispatch({ type: ActionTypes.ADD_SUBSCRIBED_GAMES_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(
      BASE_URL + "/api/game/subscribe",
      { games },
    );
    dispatch({ type: ActionTypes.ADD_SUBSCRIBED_GAMES_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({
      type: ActionTypes.ADD_SUBSCRIBED_GAMES_FAIL,
      payload: error.message
    });
  }
};

const addFeedback = (gameId, rating, comments, review) => async (dispatch) => {
  dispatch({ type: ActionTypes.ADD_FEEDBACK_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(
      BASE_URL + "/api/game-server/review/add",
      { gameId, rating, comments, review },
    );
    dispatch({ type: ActionTypes.ADD_FEEDBACK_SUCCESS, payload: data });
    localStorage.setItem("feedbackDetails", encryptData(data));
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.ADD_FEEDBACK_FAIL, payload: error.message });
  }
};
const checkReviewExist = (id) => async (dispatch) => {
  dispatch({ type: ActionTypes.GAME_VERIFY_REVIEW_EXIST_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(
      BASE_URL + '/api/game/verify/review', { gameId: id },
    );
    dispatch({ type: ActionTypes.GAME_VERIFY_REVIEW_EXIST_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.GAME_VERIFY_REVIEW_EXIST_FAIL, payload: error.message });
  }
}

const addPlanToUser = (planId) => async (dispatch) => {
  dispatch({ type: ActionTypes.ADD_PLAN_TO_USER_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.put(
      BASE_URL + "/api/plan/" + planId,
      {},
    );
    dispatch({ type: ActionTypes.ADD_PLAN_TO_USER_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({
      type: ActionTypes.ADD_PLAN_TO_USER_FAIL,
      payload: error.message
    });
  }
};

const selectedPlanId = (data) => async (dispatch) => {
  dispatch({ type: ActionTypes.SELECTED_PLAN_ID_REQUEST });
  try {
    dispatch({ tyep: ActionTypes.SELECTED_PLAN_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ActionTypes.SELECTED_PLAN_ID_FAIL,
      payload: error.message
    });
  }
};
const selectedGamesId = (data) => async (dispatch) => {
  dispatch({ type: ActionTypes.SELECTED_GAMES_ID_REQUEST });
  try {
    dispatch({ type: ActionTypes.SELECTED_GAMES_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ActionTypes.SELECTED_GAMES_ID_FAIL,
      payload: error.message
    });
  }
};

//Get Organisation My Games
const getOrganisationMyGames = (searchText, isDefault) => async (dispatch) => {
  dispatch({ type: ActionTypes.ORGANISATION_GET_MY_GAMES_REQUEST });
  try {
    var url = "";
    if (isDefault)
      url = "/api/organization-game/my-games?search=" + searchText + "&isDefault=true";
    else
      url = "/api/organization-game/my-games?search=" + searchText;
    const { data } = await axiosApiInstance.get(
      BASE_URL + url,
    );
    dispatch({
      type: ActionTypes.ORGANISATION_GET_MY_GAMES_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: ActionTypes.ORGANISATION_GET_MY_GAMES_FAIL,
      payload: error.message
    });
  }
};
//Orgnaisation Toggle live games
const toggleLiveGames = (gameId) => async (dispatch) => {
  dispatch({ type: ActionTypes.ORGANISATION_TOGGLE_LIVE_GAMES_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.get(
      BASE_URL + "/api/organization-game/live-toggle/" + gameId,
    );
    dispatch({
      type: ActionTypes.ORGANISATION_TOGGLE_LIVE_GAMES_SUCCESS,
      payload: data
    });
    return status;
  } catch (error) {
    dispatch({
      type: ActionTypes.ORGANISATION_TOGGLE_LIVE_GAMES_FAIL,
      payload: error.message
    });
  }
};

//Scheduled Games/Seesions

const gamesScheduledByMe = (searchString, page = 1) => async (dispatch) => {
  dispatch({ type: ActionTypes.GAME_SCHEDULED_BY_ME_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(BASE_URL + "/api/session/user/created?search=" + searchString + "&currPage=" + page);
    dispatch({ type: ActionTypes.GAME_SCHEDULED_BY_ME_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ActionTypes.GAME_SCHEDULED_BY_ME_FAIL,
      payload: error.message
    });
  }
};

const gamesScheduledByOthers = (searchString, page = 1) => async (dispatch) => {
  dispatch({ type: ActionTypes.GAME_SCHEDULED_BY_OTHERS_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(BASE_URL + "/api/session/others/created?search=" + searchString + "&currPage=" + page);
    dispatch({ type: ActionTypes.GAME_SCHEDULED_BY_OTHERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ActionTypes.GAME_SCHEDULED_BY_OTHERS_FAIL,
      payload: error.message
    });
  }
};

const getGameServerOtp = (gameId, sessionId) => async (dispatch) => {
  dispatch({ type: ActionTypes.GAME_GET_SERVER_OTP_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/game-server/otp", { gameId, sessionId });
    dispatch({ type: ActionTypes.GAME_GET_SERVER_OTP_SUCCESS, payload: data });
    return { data, status }
  } catch (error) {
    dispatch({ type: ActionTypes.GAME_GET_SERVER_OTP_FAIL, payload: error.message });
  }
};
const bulkUpdateGame = (games, slogan) => async (dispatch) => {
  dispatch({ type: ActionTypes.GAME_BULK_UPDATE_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/game/update/bulk", { games, slogan });
    dispatch({ type: ActionTypes.GAME_BULK_UPDATE_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.GAME_BULK_UPDATE_FAIL, payload: error.message });
  }
};
const addCategory = (body) => async (dispatch) => {
  dispatch({ type: ActionTypes.ADD_CATEGORY_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/category/add", body);
    dispatch({ type: ActionTypes.ADD_CATEGORY_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.ADD_CATEGORY_FAIL, payload: error.message });
  }
};
const updateCategory = (id, body) => async (dispatch) => {
  dispatch({ type: ActionTypes.UPDATE_CATEGORY_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.put(BASE_URL + "/api/category/" + id, body);
    dispatch({ type: ActionTypes.UPDATE_CATEGORY_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.UPDATE_CATEGORY_FAIL, payload: error.message });
  }
};
const deleteCategory = (id) => async (dispatch) => {
  dispatch({ type: ActionTypes.DELETE_CATEGORY_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.delete(BASE_URL + "/api/category/" + id);
    dispatch({ type: ActionTypes.DELETE_CATEGORY_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.DELETE_CATEGORY_FAIL, payload: error.message });
  }
};
const addObjective = (body) => async (dispatch) => {
  dispatch({ type: ActionTypes.ADD_OBJECTIVE_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/objectives/add", body);
    dispatch({ type: ActionTypes.ADD_OBJECTIVE_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.ADD_OBJECTIVE_FAIL, payload: error.message });
  }
};
const updateObjective = (id, body) => async (dispatch) => {
  dispatch({ type: ActionTypes.UPDATE_OBEJCTIVE_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.put(BASE_URL + "/api/objectives/" + id, body);
    dispatch({ type: ActionTypes.UPDATE_OBEJCTIVE_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.UPDATE_OBEJCTIVE_FAIL, payload: error.message });
  }
};
const deleteObjective = (id) => async (dispatch) => {
  dispatch({ type: ActionTypes.DELETE_OBJECTIVE_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.delete(BASE_URL + "/api/objectives/" + id);
    dispatch({ type: ActionTypes.DELETE_OBJECTIVE_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.DELETE_OBJECTIVE_FAIL, payload: error.message });
  }
};

export {
  getGameDetail,
  gameAllCategory,
  getAllPlans,
  getHRId,
  getPlanDetails,
  addPurchaseOrder,
  addSubscribedGames,
  addPlanToUser,
  selectedGamesId,
  selectedPlanId,
  addFeedback,
  getOrganisationMyGames,
  toggleLiveGames,
  gamesScheduledByMe,
  gamesScheduledByOthers,
  getAllObjectives,
  getGameServerOtp,
  bulkUpdateGame,
  checkReviewExist,
  addCategory,
  updateCategory,
  addObjective,
  updateObjective,
  deleteCategory,
  deleteObjective
};
