import * as ActionTypes from "../constants/adminApiConstants";

function getUsersCountReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GET_USERS_COUNT_REQUEST:
      return { loading: true };
    case ActionTypes.GET_USERS_COUNT_SUCCESS:
      return { loading: false, usersCount: action.payload };
    case ActionTypes.GET_USERS_COUNT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function downloadRegisteredUsersReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.DOWNLOAD_REGISTERED_USERS_REQUEST:
      return { loading: true };
    case ActionTypes.DOWNLOAD_REGISTERED_USERS_SUCCESS:
      return { loading: false, registeredUsersData: action.payload };
    case ActionTypes.DOWNLOAD_REGISTERED_USERS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function downloadSubscribedUsersReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.DOWNLOAD_SUBSCRIBED_USERS_REQUEST:
      return { loading: true };
    case ActionTypes.DOWNLOAD_SUBSCRIBED_USERS_SUCCESS:
      return { loading: false, subscribedUsersData: action.payload };
    case ActionTypes.DOWNLOAD_SUBSCRIBED_USERS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function updateSSOdetailsReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_SSO_DETAILS_REQUEST:
      return { loading: true };
    case ActionTypes.UPDATE_SSO_DETAILS_SUCCESS:
      return { loading: false, updatedSSODetails: action.payload };
    case ActionTypes.UPDATE_SSO_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
export {
  getUsersCountReducer,
  downloadRegisteredUsersReducer,
  downloadSubscribedUsersReducer,
  updateSSOdetailsReducer
}
