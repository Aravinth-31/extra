import * as ActionTypes from "../constants/homepageConstants";
import { getFavGames } from "./userAction";
import { axiosApiInstance, BASE_URL, decryptData, encryptData, GetToken, GetUserType } from "../../helpers/helper";
import ROLES, { OrgRoles } from "../../helpers/userTypes";


//Get All Games
const homeSearch = (searchString) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_SEARCH_REQUEST });
  var url = "/api/game/all?search=" + searchString;
  // if (OrgRoles.includes(GetUserType()))
  const otpVerified = decryptData(localStorage.getItem("otpVerified") || encryptData(false));
  if (otpVerified && GetToken() && GetUserType() === ROLES.EMPLOYEE || GetUserType() === ROLES.ORG_ADMIN)
    url = "/api/organization-game/all?search=" + searchString;
  try {
    const { data } = await axiosApiInstance.get(
      BASE_URL + url
    );
    dispatch({ type: ActionTypes.HOME_SEARCH_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ActionTypes.HOME_SEARCH_FAIL, payload: error.message });
  }
};

//Get All Social links
const getAllSocialLinks = () => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_GET_SOCIAL_LINK_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(BASE_URL + "/api/sociallink/all");
    dispatch({ type: ActionTypes.HOME_GET_SOCIAL_LINK_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_GET_SOCIAL_LINK_FAIL,
      payload: error.message,
    });
  }
};

const updateSocialLinks = (id, value) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_UPDATE_SOCIAL_LINK_REQUEST });
  try {
    const { data } = await axiosApiInstance.put(
      BASE_URL + `/api/sociallink/${id}`,
      {
        ...value,
      }
    );
    dispatch({
      type: ActionTypes.HOME_UPDATE_SOCIAL_LINK_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_UPDATE_SOCIAL_LINK_FAIL,
      payload: error.message,
    });
  }
};

//Get All Description
const getAllDescriptions = () => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_GET_DESCRIPTION_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(BASE_URL + "/api/description/all");
    dispatch({ type: ActionTypes.HOME_GET_DESCRIPTION_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_GET_DESCRIPTION_FAIL,
      payload: error.message,
    });
  }
};

const updateDescriptions = (id, value) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_UPDATE_DESCRIPTION_REQUEST });
  try {
    const { data } = await axiosApiInstance.put(
      BASE_URL + `/api/description/${id}`,
      {
        ...value,
      },
    );
    dispatch({
      type: ActionTypes.HOME_UPDATE_DESCRIPTION_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_UPDATE_DESCRIPTION_FAIL,
      payload: error.message,
    });
  }
};

//Get All Games
const getAllGames = (isDefault, searchText, getAll = true, currPage) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_GET_ALL_GAMES_REQUEST });
  var url = "/api/game/all";
  const otpVerified = decryptData(localStorage.getItem("otpVerified") || encryptData(false));
  if (isDefault)
    url = "/api/game/default/all";
  else if (GetUserType() === ROLES.EMPLOYEE && otpVerified)
    url = "/api/organization-game/all";
  let params = [];
  if (searchText)
    params.push("search=" + searchText);
  if (getAll)
    params.push("getAll=" + getAll);
  if (currPage)
    params.push("currPage=" + currPage);
  url = url + "?" + params.join("&");
  try {
    const { data } = await axiosApiInstance.get(BASE_URL + url);
    dispatch({ type: ActionTypes.HOME_GET_ALL_GAMES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_GET_ALL_GAMES_FAIL,
      payload: error.message,
    });
  }
};

//Get Most Played Games
const getMostPlayedGames = () => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_GET_MOST_PLAYED_GAMES_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(BASE_URL + "/api/game/most-played");
    dispatch({
      type: ActionTypes.HOME_GET_MOST_PLAYED_GAMES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_GET_MOST_PLAYED_GAMES_FAIL,
      payload: error.message,
    });
  }
};

//Add New Game
const addNewGame = (body) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_ADD_NEW_GAME_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/game/add", body);
    dispatch({ type: ActionTypes.HOME_ADD_NEW_GAME_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_ADD_NEW_GAME_FAIL,
      payload: error.message,
    });
  }
};
// Get All Banner Games
const getBannerGames = () => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_GET_BANNER_GAMES_REQUEST });
  try {
    let url = BASE_URL + "/api/game/banner/all";
    const otpVerified = decryptData(localStorage.getItem("otpVerified") || encryptData(false));
    if (OrgRoles.includes(GetUserType()) && otpVerified && GetToken())
      url = BASE_URL + "/api/game/banner/org/"
    const { data } = await axiosApiInstance.get(url);
    dispatch({ type: ActionTypes.HOME_GET_BANNER_GAMES_SUCCESS, payload: data, });
  } catch (error) {
    dispatch({ type: ActionTypes.HOME_GET_BANNER_GAMES_FAIL, payload: error.message, });
  }
};
// Update Banner
const updateBanner = (id, games) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_UPDATE_BANNER_REQUEST });
  try {
    const { data } = await axiosApiInstance.put(BASE_URL + "/api/game/banner/" + id, games);
    dispatch({ type: ActionTypes.HOME_UPDATE_BANNER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ActionTypes.HOME_UPDATE_BANNER_FAIL, payload: error.message, });
  }
};
// Add To Favourite
const addToFavourite = (gameId) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_ADD_TO_FAVOURITE_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(
      BASE_URL + "/api/game/add-favourite/" + gameId
    );
    dispatch({
      type: ActionTypes.HOME_ADD_TO_FAVOURITE_SUCCESS,
      payload: data,
    });
    dispatch(getFavGames());
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_ADD_TO_FAVOURITE_FAIL,
      payload: error.message,
    });
  }
};

// Remove from favourite

const removeFromFavourite = (gameId) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_REMOVE_FROM_FAVOURITE_REQUEST });
  try {
    const { data } = await axiosApiInstance.post(
      BASE_URL + "/api/game/remove-favourite/" + gameId,
      {},
    );
    dispatch({
      type: ActionTypes.HOME_REMOVE_FROM_FAVOURITE_SUCCESS,
      payload: data,
    });
    dispatch(getFavGames());
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_REMOVE_FROM_FAVOURITE_FAIL,
      payload: error.message,
    });
  }
};

// Update Game
/**
 *
 * @param {string} gameId
 * @param {{"title":string,"coverMedia":string,"description":string,"features":string,"objectives":string,"category":string,"slogan":string,"link":string}} gameInfo
 * @returns
 */
const updateGame = (gameId, gameInfo) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_UPDATE_GAME_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.put(BASE_URL + "/api/game/" + gameId, gameInfo);
    dispatch({ type: ActionTypes.HOME_UPDATE_GAME_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.HOME_UPDATE_GAME_FAIL, payload: error.message, });
  }
};
//Get Games By Category
const getGamesByCategory = (categoryId, fromManageGames, searchText, page = 1) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_GET_GAMES_BY_CATEGORY_REQUEST });
  var url = "/api/game/category/" + categoryId + "?currPage=" + page;
  const otpVerified = decryptData(localStorage.getItem("otpVerified") || encryptData(false));
  if (otpVerified && GetUserType() === ROLES.EMPLOYEE || GetUserType() === ROLES.ORG_ADMIN)
    url = "/api/organization-game/category/" + categoryId + "?currPage=" + page;
  if (fromManageGames)
    url = "/api/organization-game/my-games?categoryId=" + categoryId + "&currPage=" + page;
  if (searchText) {
    if (fromManageGames) {
      // url = url + "&search=" + searchText;
      // url = "/api/game/all?search=" + searchText;
      url = "/api/organization-game/my-games?search=" + searchText + "&currPage=" + page;
    }
    else
      url = url + "&search=" + searchText;
  }
  try {
    const { data } = await axiosApiInstance.get(
      BASE_URL + url
    );
    dispatch({
      type: ActionTypes.HOME_GET_GAMES_BY_CATEGORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_GET_GAMES_BY_CATEGORY_FAIL,
      payload: error.message,
    });
  }
};

// Get Games by objective
const getGamesByObjective = (ObjectiveId, fromManageGames, searchText, page = 1) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_GET_GAMES_BY_OBJECTIVE_REQUEST });
  var url = "/api/game/objectives/" + ObjectiveId + "?currPage=" + page;
  const otpVerified = decryptData(localStorage.getItem("otpVerified") || encryptData(false));
  if (otpVerified && GetUserType() === ROLES.EMPLOYEE || GetUserType() === ROLES.ORG_ADMIN)
    url = "/api/organization-game/objectives/" + ObjectiveId + "?currPage=" + page;
  if (fromManageGames)
    url = "/api/organization-game/my-games?objectiveId=" + ObjectiveId + "&currPage=" + page;
  if (searchText) {
    if (fromManageGames) {
      url = "/api/organization-game/my-games?search=" + searchText + "&currPage=" + page;
      // url = "/api/game/all?search=" + searchText;
      // url = url + "&search=" + searchText;
    }
    else
      url = url + "&search=" + searchText;
  }
  try {
    const { data } = await axiosApiInstance.get(BASE_URL + url);
    dispatch({ type: ActionTypes.HOME_GET_GAMES_BY_OBJECTIVE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ActionTypes.HOME_GET_GAMES_BY_OBJECTIVE_FAIL, payload: error.message });
  }
};

//Get Games By Category
const getGamesByCategoryForBanner = (gameCategory) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_GET_GAMES_BY_CATEGORY_FOR_BANNER_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(
      BASE_URL + "/api/game/banner/category/" + gameCategory,
    );
    dispatch({
      type: ActionTypes.HOME_GET_GAMES_BY_CATEGORY_FOR_BANNER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_GET_GAMES_BY_CATEGORY_FOR_BANNER_FAIL,
      payload: error.message,
    });
  }
};

//Get Games By Slogan
const getGamesBySlogan = (gameSlogan) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_GET_GAMES_BY_SLOGAN_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(
      BASE_URL + "/api/game/slogan/" + gameSlogan,
    );
    dispatch({
      type: ActionTypes.HOME_GET_GAMES_BY_SLOGAN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_GET_GAMES_BY_SLOGAN_FAIL,
      payload: error.message,
    });
  }
};

//Get Contact
const getContactUs = () => async (dispatch) => {
  try {
    const { data } = await axiosApiInstance.get(BASE_URL + "/api/contact/all");
    dispatch({ type: ActionTypes.HOME_CONTACT_US_PASS, payload: data });
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_CONTACT_US_FAIL,
      payload: error.message,
    });
  }
};

const updateContactUs = (contactUs, Ids) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_UPDATE_GAME_REQUEST });
  try {
    await axiosApiInstance.put(
      BASE_URL + "/api/contact/" + Ids.address,
      { value: contactUs.address },
    );
    dispatch({ type: ActionTypes.HOME_CONTACT_US_UPDATED });
    await axiosApiInstance.put(
      BASE_URL + "/api/contact/" + Ids.phone,
      { value: contactUs.phone },
    );
    dispatch({ type: ActionTypes.HOME_CONTACT_US_UPDATED });
    await axiosApiInstance.put(
      BASE_URL + "/api/contact/" + Ids.email,
      { value: contactUs.mail },
    );
    dispatch({ type: ActionTypes.HOME_CONTACT_US_UPDATED });
    await axiosApiInstance.put(
      BASE_URL + "/api/contact/" + Ids.map,
      { value: contactUs.map },
    );
    dispatch({ type: ActionTypes.HOME_CONTACT_US_UPDATED });
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_UPDATE_GAME_FAIL,
      payload: error.message,
    });
  }
};

//Update games Position
const updatePosition = (games) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_UPDATE_GAME_POSITION_REQUEST });
  try {
    const { data } = await axiosApiInstance.put(
      BASE_URL + "/api/game/position/update",
      { games },
    );
    dispatch({
      type: ActionTypes.HOME_UPDATE_GAME_POSITION_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_UPDATE_GAME_POSITION_FAIL,
      payload: error.message,
    });
  }
};

// To add Banner game
const addBannerGame = (game) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_ADD_BANNER_GAME_REQUEST });
  try {
    const { data } = await axiosApiInstance.post(BASE_URL + "/api/game/banner/add", game,);
    dispatch({ type: ActionTypes.HOME_ADD_BANNER_GAME_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_ADD_BANNER_GAME_FAIL,
      payload: error.message,
    });
  }
};
// To add Banner game
const addBannerGameBulk = (games) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_ADD_BULK_BANNER_GAME_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/game/banner/add/all", games,);
    dispatch({ type: ActionTypes.HOME_ADD_BULK_BANNER_GAME_SUCCESS, payload: data });
    return status
  } catch (error) {
    dispatch({ type: ActionTypes.HOME_ADD_BULK_BANNER_GAME_FAIL, payload: error.message, });
  }
};

//To delete Banner game
const deleteBannerGame = (gameId) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_DELETE_BANNER_GAME_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.delete(BASE_URL + "/api/game/banner/" + gameId);
    dispatch({ type: ActionTypes.HOME_DELETE_BANNER_GAME_SUCCESS, payload: data, });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.HOME_DELETE_BANNER_GAME_FAIL, payload: error.message, });
  }
};
const updateBannerGame = (bannerGameId, bannerGameInfo) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_UPDATE_BANNER_GAME_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.put(BASE_URL + "/api/game/banner/" + bannerGameId, bannerGameInfo,);
    dispatch({ type: ActionTypes.HOME_UPDATE_BANNER_GAME_SUCCESS, payload: data, });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.HOME_UPDATE_BANNER_GAME_FAIL, payload: error.message, });
  }
};
const updateBannerGameBulk = (bannerGamesInfo) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_UPDATE_BANNER_GAME_BULK_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.put(BASE_URL + "/api/game/banner/bulkUpdate", bannerGamesInfo,);
    dispatch({ type: ActionTypes.HOME_UPDATE_BANNER_GAME_BULK_SUCCESS, payload: data, });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.HOME_UPDATE_BANNER_GAME_BULK_FAIL, payload: error.message, });
  }
};

//Get Subscribed Games
const getSubscribedGames = () => async (dispatch) => {
  dispatch({ type: ActionTypes.GET_SUBSCRIBED_GAMES_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(BASE_URL + "/api/subscribe/games",);
    dispatch({
      type: ActionTypes.GET_SUBSCRIBED_GAMES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ActionTypes.GET_SUBSCRIBED_GAMES_FAIL,
      payload: error.message,
    });
  }
};
//Get Currently Playinh Games
const getCurrentlyPlayingGames = () => async (dispatch) => {
  dispatch({ type: ActionTypes.GET_CURRENTLY_PLAYING_GAMES_REQUEST });
  const otpVerified = decryptData(localStorage.getItem("otpVerified") || encryptData(false));
  if (otpVerified) {
    try {
      const { data } = await axiosApiInstance.get(BASE_URL + "/api/session/user/active",);
      dispatch({
        type: ActionTypes.GET_CURRENTLY_PLAYING_GAMES_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_CURRENTLY_PLAYING_GAMES_FAIL,
        payload: error.message,
      });
    }
  }
  else
    dispatch({
      type: ActionTypes.GET_CURRENTLY_PLAYING_GAMES_FAIL,
      payload: "User not verified",
    });
};
//Get Previously Played Games
const getPreviouslyPlayedGames = () => async (dispatch) => {
  dispatch({ type: ActionTypes.GET_PREVIOUSLY_PLAYED_GAMES_REQUEST });
  const otpVerified = decryptData(localStorage.getItem("otpVerified") || encryptData(false));
  if (otpVerified) {
    try {
      const { data } = await axiosApiInstance.get(BASE_URL + "/api/game/previously-played",);
      dispatch({
        type: ActionTypes.GET_PREVIOUSLY_PLAYED_GAMES_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_PREVIOUSLY_PLAYED_GAMES_FAIL,
        payload: error.message,
      });
    }
  }
  else
    dispatch({
      type: ActionTypes.GET_CURRENTLY_PLAYING_GAMES_FAIL,
      payload: "User not verified",
    });
};
//Get All Slogans
const getAllSlogans = () => async (dispatch) => {
  dispatch({ type: ActionTypes.GET_ALL_SLOGANS_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(BASE_URL + "/api/slogan/slogan/all",);
    dispatch({
      type: ActionTypes.GET_ALL_SLOGANS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ActionTypes.GET_ALL_SLOGANS_FAIL,
      payload: error.message,
    });
  }
};
const addSlogan = (body) => async (dispatch) => {
  dispatch({ type: ActionTypes.ADD_SLOGAN_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/slogan/slogan", body);
    dispatch({ type: ActionTypes.ADD_SLOGAN_SUCCESS, payload: data });
    return { status, data };
  } catch (error) {
    dispatch({ type: ActionTypes.ADD_SLOGAN_FAIL, payload: error.message, });
  }
};
const deleteSlogan = (sloganId) => async (dispatch) => {
  dispatch({ type: ActionTypes.DELETE_SLOGAN_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.delete(BASE_URL + "/api/slogan/slogan/" + sloganId);
    dispatch({ type: ActionTypes.DELETE_SLOGAN_SUCCESS, payload: data });
    return { status, data };
  } catch (error) {
    dispatch({ type: ActionTypes.DELETE_SLOGAN_FAIL, payload: error.message, });
  }
};
const updateSloganBulk = (body) => async (dispatch) => {
  dispatch({ type: ActionTypes.UPDATE_SLOGAN_BULK_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.put(BASE_URL + "/api/slogan/slogan/updateBulk", body);
    dispatch({ type: ActionTypes.UPDATE_SLOGAN_BULK_SUCCESS, payload: data });
    return { status, data };
  } catch (error) {
    dispatch({ type: ActionTypes.UPDATE_SLOGAN_BULK_FAIL, payload: error.message, });
  }
};

const customizeBanner = (orgId) => async (dispatch) => {
  dispatch({ type: ActionTypes.BANNER_CUSTOMIZE_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.put(BASE_URL + "/api/game/banner/updateDefaultGamesForOrg/" + orgId);
    dispatch({ type: ActionTypes.BANNER_CUSTOMIZE_SUCCESS, payload: data });
    return { status, data };
  } catch (error) {
    dispatch({ type: ActionTypes.BANNER_CUSTOMIZE_FAIL, payload: error.message, });
  }
};
const backToDefaultBanners = (orgId) => async (dispatch) => {
  dispatch({ type: ActionTypes.BANNER_BACK_TO_DEFAULT_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.put(BASE_URL + "/api/game/banner/backToDefaultOrg/" + orgId);
    dispatch({ type: ActionTypes.BANNER_BACK_TO_DEFAULT_SUCCESS, payload: data });
    return { status, data };
  } catch (error) {
    dispatch({ type: ActionTypes.BANNER_BACK_TO_DEFAULT_FAIL, payload: error.message, });
  }
};

export {
  getAllGames,
  getMostPlayedGames,
  homeSearch,
  addNewGame,
  getBannerGames,
  updateBanner,
  addToFavourite,
  removeFromFavourite,
  updateGame,
  getGamesByCategory,
  getGamesByObjective,
  getGamesByCategoryForBanner,
  getGamesBySlogan,
  getAllSocialLinks,
  updateSocialLinks,
  getAllDescriptions,
  updateDescriptions,
  getContactUs,
  updateContactUs,
  updatePosition,
  deleteBannerGame,
  addBannerGame,
  addBannerGameBulk,
  updateBannerGame,
  updateBannerGameBulk,
  getSubscribedGames,
  getCurrentlyPlayingGames,
  getPreviouslyPlayedGames,
  getAllSlogans,
  addSlogan,
  deleteSlogan,
  updateSloganBulk,
  customizeBanner,
  backToDefaultBanners
};
