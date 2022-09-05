import * as ActionTypes from "../constants/commonApiConstants";

function uploadFileReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.FILE_UPLOAD_REQUEST:
      return { loading: true };
    case ActionTypes.FILE_UPLOAD_SUCCESS:
      return { loading: false, uploadedFile: action.payload };
    case ActionTypes.FILE_UPLOAD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function uploadEmployeeDetailsReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.EMPLOYEE_DATABASE_UPLOAD_REQUEST:
      return { loading: true };
    case ActionTypes.EMPLOYEE_DATABASE_UPLOAD_SUCCESS:
      return { loading: false, uploadedEmployeeDetails: action.payload };
    case ActionTypes.EMPLOYEE_DATABASE_UPLOAD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function downloadEmployeeDatabaseReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.EMPLOYEE_DATABASE_DOWNLOAD_REQUEST:
      return { loading: true };
    case ActionTypes.EMPLOYEE_DATABASE_DOWNLOAD_SUCCESS:
      return { loading: false, downloadedEmployeeDatabase: action.payload };
    case ActionTypes.EMPLOYEE_DATABASE_DOWNLOAD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function getAllWebinarReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.WEBINAR_GET_ALL_REQUEST:
      return { loading: true };
    case ActionTypes.WEBINAR_GET_ALL_SUCCESS:
      return { loading: false, allWebinars: action.payload };
    case ActionTypes.WEBINAR_GET_ALL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function toggleWebinarAccessReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.TOGGLE_WEBINAR_ACCESS_REQUEST:
      return { loading: true };
    case ActionTypes.TOGGLE_WEBINAR_ACCESS_SUCCESS:
      return { loading: false, toggleWebinarInfo: action.payload };
    case ActionTypes.TOGGLE_WEBINAR_ACCESS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function addWebinarReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_WEBINAR_REQUEST:
      return { loading: true };
    case ActionTypes.ADD_WEBINAR_SUCCESS:
      return { loading: false, addedWebinar: action.payload };
    case ActionTypes.ADD_WEBINAR_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function deleteWebinarReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.DELETE_WEBINAR_REQUEST:
      return { loading: true };
    case ActionTypes.DELETE_WEBINAR_SUCCESS:
      return { loading: false, deletedWebinar: action.payload };
    case ActionTypes.DELETE_WEBINAR_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function updateWebinarReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_WEBINAR_REQUEST:
      return { loading: true };
    case ActionTypes.UPDATE_WEBINAR_SUCCESS:
      return { loading: false, updatedWebinar: action.payload };
    case ActionTypes.UPDATE_WEBINAR_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function downloadChatsReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.DOWNLOAD_CHATS_REQUEST:
      return { loading: true };
    case ActionTypes.DOWNLOAD_CHATS_SUCCESS:
      return { loading: false, downloadedChats: action.payload };
    case ActionTypes.DOWNLOAD_CHATS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function downloadWebinarParticipantsReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.DOWNLOAD_WEBINAR_PARTICIPANTS_REQUEST:
      return { loading: true };
    case ActionTypes.DOWNLOAD_WEBINAR_PARTICIPANTS_SUCCESS:
      return { loading: false, downloadedParticipants: action.payload };
    case ActionTypes.DOWNLOAD_WEBINAR_PARTICIPANTS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function addDemoRequestReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_DEMO_REQUEST_REQUEST:
      return { loading: true };
    case ActionTypes.ADD_DEMO_REQUEST_SUCCESS:
      return { loading: false, addedDemoRequet: action.payload };
    case ActionTypes.ADD_DEMO_REQUEST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function downloadDemoRequestsReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.DOWNLOAD_DEMO_REQUESTS_REQUEST:
      return { loading: true };
    case ActionTypes.DOWNLOAD_DEMO_REQUESTS_SUCCESS:
      return { loading: false, downloadedDemoRequests: action.payload };
    case ActionTypes.DOWNLOAD_DEMO_REQUESTS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function actingOwnerChangeReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ACTING_OWNER_CHANGE_REQUEST:
      return { loading: true };
    case ActionTypes.ACTING_OWNER_CHANGE_SUCCESS:
      return { loading: false, actingOwnerChanged: action.payload };
    case ActionTypes.ACTING_OWNER_CHANGE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function webinarParticipantsBackupReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.WEBINAR_PARTICIPANTS_BACKUP_REQUEST:
      return { loading: true };
    case ActionTypes.WEBINAR_PARTICIPANTS_BACKUP_SUCCESS:
      return { loading: false, participantsBackup: action.payload };
    case ActionTypes.WEBINAR_PARTICIPANTS_BACKUP_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function webinarChatsBackupReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.WEBINAR_CHAT_BACKUP_REQUEST:
      return { loading: true };
    case ActionTypes.WEBINAR_CHAT_BACKUP_SUCCESS:
      return { loading: false, chatsBackup: action.payload };
    case ActionTypes.WEBINAR_CHAT_BACKUP_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function getNotificationsReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GET_NOTIFICATION_REQUEST:
      return { loading: true };
    case ActionTypes.GET_NOTIFICATION_SUCCESS:
      return { loading: false, notifications: action.payload };
    case ActionTypes.GET_NOTIFICATION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function getNewTokenReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GET_NEW_TOKEN_REQUEST:
      return { loading: true };
    case ActionTypes.GET_NEW_TOKEN_SUCCESS:
      return { loading: false, newToken: action.payload };
    case ActionTypes.GET_NEW_TOKEN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function getAllWebinarCategoriesReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.GET_ALL_WEBINAR_CATEGORIES_REQUEST:
      return { loading: true };
    case ActionTypes.GET_ALL_WEBINAR_CATEGORIES_SUCCESS:
      return { loading: false, allWebinarCategories: action.payload };
    case ActionTypes.GET_ALL_WEBINAR_CATEGORIES_SUCCESS:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

export {
  uploadFileReducer,
  uploadEmployeeDetailsReducer,
  downloadEmployeeDatabaseReducer,
  getAllWebinarReducer,
  toggleWebinarAccessReducer,
  addWebinarReducer,
  deleteWebinarReducer,
  updateWebinarReducer,
  downloadChatsReducer,
  downloadWebinarParticipantsReducer,
  addDemoRequestReducer,
  downloadDemoRequestsReducer,
  actingOwnerChangeReducer,
  webinarParticipantsBackupReducer,
  webinarChatsBackupReducer,
  getNotificationsReducer,
  getNewTokenReducer,
  getAllWebinarCategoriesReducer
}