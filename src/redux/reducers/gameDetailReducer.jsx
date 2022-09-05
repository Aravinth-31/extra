import * as ActionTypes from "../constants/gameDetailConstants";

function gameDetailGetGameReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GAME_DETAIL_GET_GAME_REQUEST:
      return { loading: true };
    case ActionTypes.GAME_DETAIL_GET_GAME_SUCCESS:
      return { loading: false, gameDetail: action.payload };
    case ActionTypes.GAME_DETAIL_GET_GAME_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function gameGetAllCategoryReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GAME_ALL_CATEGORY_REQUEST:
      return { loading: true };
    case ActionTypes.GAME_ALL_CATEGORY_SUCCESS:
      return { loading: false, gameCategory: action.payload };
    case ActionTypes.GAME_ALL_CATEGORY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function getAllPlansReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.PLANS_GET_ALL_PLANS_REQUEST:
      return { loading: true };
    case ActionTypes.PLANS_GET_ALL_PLANS_SUCCESS:
      return { loading: false, planDetails: action.payload };
    case ActionTypes.PLANS_GET_ALL_PLANS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function getPlanDetailsReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.PLANS_GET_PLAN_DETAILS_REQUEST:
      return { loading: true };
    case ActionTypes.PLANS_GET_PLAN_DETAILS_SUCCESS:
      return { loading: false, selectedPlanDetails: action.payload };
    case ActionTypes.PLANS_GET_PLAN_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function getHRIdReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GAME_GET_HR_ID_REQUEST:
      return { loading: true };
    case ActionTypes.GAME_GET_HR_ID_SUCCESS:
      return { loading: false, hrIdDetails: action.payload };
    case ActionTypes.GAME_GET_HR_ID_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function addPurchaseOrderReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_PURCHASE_ORDER_REQUEST:
      return { loading: true };
    case ActionTypes.ADD_PURCHASE_ORDER_SUCCESS:
      return { loading: false, purchaseOrderDetails: action.payload };
    case ActionTypes.ADD_PURCHASE_ORDER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function addSubscribedGamesReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_SUBSCRIBED_GAMES_REQUEST:
      return { loading: true };
    case ActionTypes.ADD_SUBSCRIBED_GAMES_SUCCESS:
      return { loading: false, subscribedGames: action.payload };
    case ActionTypes.ADD_SUBSCRIBED_GAMES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function addPlanToUserReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_PLAN_TO_USER_REQUEST:
      return { loading: true };
    case ActionTypes.ADD_PLAN_TO_USER_SUCCESS:
      return { loading: false, planAddedToUser: action.payload };
    case ActionTypes.ADD_PLAN_TO_USER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function selectedGamesIdReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.SELECTED_GAMES_ID_REQUEST:
      return { loading: true };
    case ActionTypes.SELECTED_GAMES_ID_SUCCESS:
      return { loading: false, selectedGamesId: action.payload };
    case ActionTypes.SELECTED_GAMES_ID_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function selectedPlanIdReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.SELECTED_PLAN_ID_REQUEST:
      return { loading: true };
    case ActionTypes.SELECTED_PLAN_ID_SUCCESS:
      return { loading: false, selectedPlanId: action.payload };
    case ActionTypes.SELECTED_PLAN_ID_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function addFeedbackReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_FEEDBACK_REQUEST:
      return { loading: true };
    case ActionTypes.ADD_FEEDBACK_SUCCESS:
      return { loading: false, feedbackDetails: action.payload };
    case ActionTypes.ADD_FEEDBACK_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function organisationGetMyGamesReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ORGANISATION_GET_MY_GAMES_REQUEST:
      return { loading: true };
    case ActionTypes.ORGANISATION_GET_MY_GAMES_SUCCESS:
      return { loading: false, orgMyGames: action.payload };
    case ActionTypes.ORGANISATION_GET_MY_GAMES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function organisationToggleLiveGamesReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ORGANISATION_TOGGLE_LIVE_GAMES_REQUEST:
      return { loading: true };
    case ActionTypes.ORGANISATION_TOGGLE_LIVE_GAMES_SUCCESS:
      return { loading: false, toggledGame: action.payload };
    case ActionTypes.ORGANISATION_TOGGLE_LIVE_GAMES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function gamesScheduledByMeReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GAME_SCHEDULED_BY_ME_REQUEST:
      return { loading: true };
    case ActionTypes.GAME_SCHEDULED_BY_ME_SUCCESS:
      return { loading: false, gameSessionsByMe: action.payload };
    case ActionTypes.GAME_SCHEDULED_BY_ME_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function gamesScheduledByOthersReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GAME_SCHEDULED_BY_OTHERS_REQUEST:
      return { loading: true };
    case ActionTypes.GAME_SCHEDULED_BY_OTHERS_SUCCESS:
      return { loading: false, gameSessionsByOthers: action.payload };
    case ActionTypes.GAME_SCHEDULED_BY_OTHERS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function gameGetAllObjectivesReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GAME_GET_ALL_OBJECTIVES_REQUEST:
      return { loading: true };
    case ActionTypes.GAME_GET_ALL_OBJECTIVES_SUCCESS:
      return { loading: false, gameObjectives: action.payload };
    case ActionTypes.GAME_GET_ALL_OBJECTIVES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function gameGetServerOtpReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GAME_GET_SERVER_OTP_REQUEST:
      return { loading: true };
    case ActionTypes.GAME_GET_SERVER_OTP_SUCCESS:
      return { loading: false, gameServerOtp: action.payload };
    case ActionTypes.GAME_GET_SERVER_OTP_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function gameBulkUpdateReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GAME_BULK_UPDATE_REQUEST:
      return { loading: true };
    case ActionTypes.GAME_BULK_UPDATE_SUCCESS:
      return { loading: false, bulkUpdatedGames: action.payload };
    case ActionTypes.GAME_BULK_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function gameVerifyReviewExistReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GAME_VERIFY_REVIEW_EXIST_REQUEST:
      return { loading: true };
    case ActionTypes.GAME_VERIFY_REVIEW_EXIST_SUCCESS:
      return { loading: false, verifyReviewExist: action.payload };
    case ActionTypes.GAME_VERIFY_REVIEW_EXIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function addCategoryReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_CATEGORY_REQUEST:
      return { loading: true };
    case ActionTypes.ADD_CATEGORY_SUCCESS:
      return { loading: false, addedCategory: action.payload };
    case ActionTypes.ADD_CATEGORY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function updateCategoryReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_CATEGORY_REQUEST:
      return { loading: true };
    case ActionTypes.UPDATE_CATEGORY_SUCCESS:
      return { loading: false, updatedCategory: action.payload };
    case ActionTypes.UPDATE_CATEGORY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function deleteCategoryReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.DELETE_CATEGORY_REQUEST:
      return { loading: true };
    case ActionTypes.DELETE_CATEGORY_SUCCESS:
      return { loading: false, deletedCategory: action.payload };
    case ActionTypes.DELETE_CATEGORY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function addObjectiveReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_OBJECTIVE_REQUEST:
      return { loading: true };
    case ActionTypes.ADD_OBJECTIVE_SUCCESS:
      return { loading: false, addedObjective: action.payload };
    case ActionTypes.ADD_OBJECTIVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function updateObjectiveReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_OBEJCTIVE_REQUEST:
      return { loading: true };
    case ActionTypes.UPDATE_OBEJCTIVE_SUCCESS:
      return { loading: false, updatedObjective: action.payload };
    case ActionTypes.UPDATE_OBEJCTIVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function deleteObjectiveReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.DELETE_OBJECTIVE_REQUEST:
      return { loading: true };
    case ActionTypes.DELETE_OBJECTIVE_SUCCESS:
      return { loading: false, deletedObjective: action.payload };
    case ActionTypes.DELETE_OBJECTIVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
export {
  gameDetailGetGameReducer,
  gameGetAllCategoryReducer,
  getAllPlansReducer,
  getHRIdReducer,
  getPlanDetailsReducer,
  addPurchaseOrderReducer,
  addSubscribedGamesReducer,
  addPlanToUserReducer,
  selectedGamesIdReducer,
  selectedPlanIdReducer,
  addFeedbackReducer,
  organisationGetMyGamesReducer,
  organisationToggleLiveGamesReducer,
  gamesScheduledByMeReducer,
  gamesScheduledByOthersReducer,
  gameGetAllObjectivesReducer,
  gameGetServerOtpReducer,
  gameBulkUpdateReducer,
  gameVerifyReviewExistReducer,
  addCategoryReducer,
  updateCategoryReducer,
  addObjectiveReducer,
  updateObjectiveReducer,
  deleteCategoryReducer,
  deleteObjectiveReducer
};
