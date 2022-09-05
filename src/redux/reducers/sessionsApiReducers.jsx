import * as ActionTypes from "../constants/sessionsApiConstants";

function getGameSessionsReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.GET_GAME_SESSIONS_REQUEST:
            return { loading: true };
        case ActionTypes.GET_GAME_SESSIONS_SUCCESS:
            return { loading: false, gameSessions: action.payload };
        case ActionTypes.GET_GAME_SESSIONS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function gameCreateSessionReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.GAME_CREATE_SESSION_REQUEST:
            return { loading: true };
        case ActionTypes.GAME_CREATE_SESSION_SUCCESS:
            return { loading: false, createdSession: action.payload };
        case ActionTypes.GAME_CREATE_SESSION_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function gameUpdateSessionReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.GAME_UPDATE_SESSION_REQUEST:
            return { loading: true };
        case ActionTypes.GAME_UPDATE_SESSION_SUCCESS:
            return { loading: false, updatedSession: action.payload };
        case ActionTypes.GAME_UPDATE_SESSION_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function gameDeleteSessionReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.GAME_DELETE_SESSION_REQUEST:
            return { loading: true };
        case ActionTypes.GAME_DELETE_SESSION_SUCCESS:
            return { loading: false, deletedSession: action.payload };
        case ActionTypes.GAME_DELETE_SESSION_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

function toggleCreateSessionAccessReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.TOGGLE_CREATE_SESSION_ACCESS_REQUEST:
            return { loading: true };
        case ActionTypes.TOGGLE_CREATE_SESSION_ACCESS_SUCCESS:
            return { loading: false, toggledSessionAccess: action.payload };
        case ActionTypes.TOGGLE_CREATE_SESSION_ACCESS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
export {
    getGameSessionsReducer,
    gameCreateSessionReducer,
    gameUpdateSessionReducer,
    gameDeleteSessionReducer,
    toggleCreateSessionAccessReducer
}