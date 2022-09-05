import * as ActionTypes from "../constants/homepageConstants";
import * as UserActionTypes from "../constants/userConstants";

function homepageGetAllGamesReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_GET_ALL_GAMES_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_GET_ALL_GAMES_SUCCESS:
      return { loading: false, allGames: action.payload };
    case ActionTypes.HOME_GET_ALL_GAMES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function homepageGetMostPlayedGamesReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_GET_MOST_PLAYED_GAMES_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_GET_MOST_PLAYED_GAMES_SUCCESS:
      return { loading: false, mostPlayedGames: action.payload };
    case ActionTypes.HOME_GET_MOST_PLAYED_GAMES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function homepageAddNewGameReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_ADD_NEW_GAME_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_ADD_NEW_GAME_SUCCESS:
      return { loading: false, newGameInfo: action.payload };
    case ActionTypes.HOME_ADD_NEW_GAME_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function homepageGetBannerGamesReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_GET_BANNER_GAMES_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_GET_BANNER_GAMES_SUCCESS:
      return { loading: false, bannerGames: action.payload };
    case ActionTypes.HOME_GET_BANNER_GAMES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function homepageUpdateBannerReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_UPDATE_BANNER_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_UPDATE_BANNER_SUCCESS:
      return { loading: false, updateBannerInfo: action.payload };
    case ActionTypes.HOME_UPDATE_BANNER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function homepageUpdateBannerBulkReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_UPDATE_BANNER_GAME_BULK_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_UPDATE_BANNER_GAME_BULK_SUCCESS:
      return { loading: false, bulkUpdateBannerInfo: action.payload };
    case ActionTypes.HOME_UPDATE_BANNER_GAME_BULK_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function homepageAddToFavouriteReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_ADD_TO_FAVOURITE_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_ADD_TO_FAVOURITE_SUCCESS:
      return { loading: false, addToFavouriteInfo: action.payload };
    case ActionTypes.HOME_ADD_TO_FAVOURITE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function homepageRemoveFromFavouriteReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_REMOVE_FROM_FAVOURITE_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_REMOVE_FROM_FAVOURITE_SUCCESS:
      return { loading: false, removeFavouriteInfo: action.payload };
    case ActionTypes.HOME_REMOVE_FROM_FAVOURITE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function homepageUpdateGameReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_UPDATE_GAME_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_UPDATE_GAME_SUCCESS:
      return { loading: false, updateGameInfo: action.payload };
    case ActionTypes.HOME_UPDATE_GAME_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function homepageGetGamesByCategoryReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_GET_GAMES_BY_CATEGORY_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_GET_GAMES_BY_CATEGORY_SUCCESS:
      return { loading: false, gamesByCategory: action.payload };
    case ActionTypes.HOME_GET_GAMES_BY_CATEGORY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function homepageGetGamesByObjectiveReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_GET_GAMES_BY_OBJECTIVE_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_GET_GAMES_BY_OBJECTIVE_SUCCESS:
      return { loading: false, gamesByObjective: action.payload };
    case ActionTypes.HOME_GET_GAMES_BY_OBJECTIVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function homepageGetGamesByCategoryForBannerReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_GET_GAMES_BY_CATEGORY_FOR_BANNER_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_GET_GAMES_BY_CATEGORY_FOR_BANNER_SUCCESS:
      return { loading: false, gamesByCategoryForBanner: action.payload };
    case ActionTypes.HOME_GET_GAMES_BY_CATEGORY_FOR_BANNER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function homepageGetGamesBySloganReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_GET_GAMES_BY_SLOGAN_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_GET_GAMES_BY_SLOGAN_SUCCESS:
      return { loading: false, gamesBySlogan: action.payload };
    case ActionTypes.HOME_GET_GAMES_BY_SLOGAN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function homepageSearchReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_SEARCH_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_SEARCH_SUCCESS:
      return { loading: false, searchResults: action.payload };
    case ActionTypes.HOME_SEARCH_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function homepageGetSocialLinksReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_GET_SOCIAL_LINK_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_GET_SOCIAL_LINK_SUCCESS:
      return { loading: false, socialLinks: action.payload };
    case ActionTypes.HOME_GET_SOCIAL_LINK_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function homepageUpdateSocialLinksReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_UPDATE_SOCIAL_LINK_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_UPDATE_SOCIAL_LINK_SUCCESS:
      return { loading: false, updatedSocialLinks: action.payload };
    case ActionTypes.HOME_UPDATE_SOCIAL_LINK_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function homepageGetDescriptionsReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_GET_DESCRIPTION_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_GET_DESCRIPTION_SUCCESS:
      return { loading: false, descriptions: action.payload };
    case ActionTypes.HOME_GET_DESCRIPTION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function homepageUpdateDescriptionsReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_UPDATE_DESCRIPTION_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_UPDATE_DESCRIPTION_SUCCESS:
      return { loading: false, updatedDescriptions: action.payload };
    case ActionTypes.HOME_UPDATE_DESCRIPTION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function homepagecontactus(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_CONTACT_US_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_CONTACT_US_PASS:
      return { loading: false, contactUs: action.payload };
    case ActionTypes.HOME_CONTACT_US_FAIL:
      return { loading: false, error: action.payload };
    case ActionTypes.HOME_CONTACT_US_UPDATED:
      return { loading: false };
    default:
      return state;
  }
}

function homepageUpdateGamePosition(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_UPDATE_GAME_POSITION_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_UPDATE_GAME_POSITION_SUCCESS:
      return { loading: false, updatedPosition: action.payload };
    case ActionTypes.HOME_UPDATE_GAME_POSITION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function homepageDeleteBannerGame(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_DELETE_BANNER_GAME_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_DELETE_BANNER_GAME_SUCCESS:
      return { loading: false, deletedBannerGame: action.payload };
    case ActionTypes.HOME_DELETE_BANNER_GAME_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function homepageAddBannerGame(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_ADD_BANNER_GAME_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_ADD_BANNER_GAME_SUCCESS:
      return { loading: false, addedBannerGame: action.payload };
    case ActionTypes.HOME_ADD_BANNER_GAME_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function homepageAddBannerGameBulkReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_ADD_BULK_BANNER_GAME_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_ADD_BULK_BANNER_GAME_SUCCESS:
      return { loading: false, bulkAddedBannerGame: action.payload };
    case ActionTypes.HOME_ADD_BULK_BANNER_GAME_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function homepageUpdateBannerGame(state = {}, action) {
  switch (action.type) {
    case ActionTypes.HOME_UPDATE_BANNER_GAME_REQUEST:
      return { loading: true };
    case ActionTypes.HOME_UPDATE_BANNER_GAME_SUCCESS:
      return { loading: false, updatedBannerGame: action.payload };
    case ActionTypes.HOME_UPDATE_BANNER_GAME_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function getSubscribedGamesReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GET_SUBSCRIBED_GAMES_REQUEST:
      return { loading: true };
    case ActionTypes.GET_SUBSCRIBED_GAMES_SUCCESS:
      return { loading: false, subscribedGames: action.payload };
    case ActionTypes.GET_SUBSCRIBED_GAMES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function getCurrentlyPlayingGamesReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GET_CURRENTLY_PLAYING_GAMES_REQUEST:
      return { loading: true };
    case ActionTypes.GET_CURRENTLY_PLAYING_GAMES_SUCCESS:
      return { loading: false, currentlyPlayingGames: action.payload };
    case ActionTypes.GET_CURRENTLY_PLAYING_GAMES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function getPreviouslyPlayedGamesReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GET_PREVIOUSLY_PLAYED_GAMES_REQUEST:
      return { loading: true };
    case ActionTypes.GET_PREVIOUSLY_PLAYED_GAMES_SUCCESS:
      return { loading: false, previouslyPlayedGames: action.payload };
    case ActionTypes.GET_PREVIOUSLY_PLAYED_GAMES_FAIL:
      return { loading: false, error: action.payload };
    case UserActionTypes.USER_LOGOUT:
      return {}
    default:
      return state;
  }
}
function getAllSlogansReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GET_ALL_SLOGANS_REQUEST:
      return { loading: true };
    case ActionTypes.GET_ALL_SLOGANS_SUCCESS:
      return { loading: false, allSlogans: action.payload };
    case ActionTypes.GET_ALL_SLOGANS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function addSloganReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_SLOGAN_REQUEST:
      return { loading: true };
    case ActionTypes.ADD_SLOGAN_SUCCESS:
      return { loading: false, addedSlogan: action.payload };
    case ActionTypes.ADD_SLOGAN_FAIL:
      return { loading: false, error: action.payload };
    case UserActionTypes.USER_LOGOUT:
      return {}
    default:
      return state;
  }
}
function deleteSloganReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.DELETE_SLOGAN_REQUEST:
      return { loading: true };
    case ActionTypes.DELETE_SLOGAN_SUCCESS:
      return { loading: false, deletedSlogan: action.payload };
    case ActionTypes.DELETE_SLOGAN_FAIL:
      return { loading: false, error: action.payload };
    case UserActionTypes.USER_LOGOUT:
      return {}
    default:
      return state;
  }
}
function updateSloganBulkReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_SLOGAN_BULK_REQUEST:
      return { loading: true };
    case ActionTypes.UPDATE_SLOGAN_BULK_SUCCESS:
      return { loading: false, updatedSlogans: action.payload };
    case ActionTypes.ADD_SLOGAN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function customizeBannerReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.BANNER_CUSTOMIZE_REQUEST:
      return { loading: true };
    case ActionTypes.BANNER_CUSTOMIZE_SUCCESS:
      return { loading: false, customizedSlogan: action.payload };
    case ActionTypes.BANNER_CUSTOMIZE_FAIL:
      return { loading: false, error: action.payload };
    case UserActionTypes.USER_LOGOUT:
      return {}
    default:
      return state;
  }
}
function backToDefaultBannerReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.BANNER_BACK_TO_DEFAULT_REQUEST:
      return { loading: true };
    case ActionTypes.BANNER_BACK_TO_DEFAULT_SUCCESS:
      return { loading: false, backToDefaultBanner: action.payload };
    case ActionTypes.BANNER_BACK_TO_DEFAULT_FAIL:
      return { loading: false, error: action.payload };
    case UserActionTypes.USER_LOGOUT:
      return {}
    default:
      return state;
  }
}

export {
  homepageGetAllGamesReducer,
  homepageGetMostPlayedGamesReducer,
  homepageAddNewGameReducer,
  homepageGetBannerGamesReducer,
  homepageUpdateBannerReducer,
  homepageUpdateBannerBulkReducer,
  homepageAddToFavouriteReducer,
  homepageRemoveFromFavouriteReducer,
  homepageUpdateGameReducer,
  homepageGetGamesByCategoryReducer,
  homepageGetGamesByObjectiveReducer,
  homepageGetGamesByCategoryForBannerReducer,
  homepageGetGamesBySloganReducer,
  homepageSearchReducer,
  homepageGetSocialLinksReducer,
  homepageUpdateSocialLinksReducer,
  homepageGetDescriptionsReducer,
  homepageUpdateDescriptionsReducer,
  homepagecontactus,
  homepageUpdateGamePosition,
  homepageDeleteBannerGame,
  homepageAddBannerGame,
  homepageAddBannerGameBulkReducer,
  homepageUpdateBannerGame,
  getSubscribedGamesReducer,
  getCurrentlyPlayingGamesReducer,
  getPreviouslyPlayedGamesReducer,
  getAllSlogansReducer,
  addSloganReducer,
  deleteSloganReducer,
  updateSloganBulkReducer,
  customizeBannerReducer,
  backToDefaultBannerReducer
};
