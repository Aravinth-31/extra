import * as ActionTypes from "../constants/sessionsApiConstants";
import { axiosApiInstance, BASE_URL, GetToken } from "../../helpers/helper";


//get game sessions
const getAllGameSessions = (gameId, page = 1) => async (dispatch) => {
    dispatch({ type: ActionTypes.GET_GAME_SESSIONS_REQUEST });
    try {
        const token = GetToken();
        if (token) {
            const { data } = await axiosApiInstance.get(BASE_URL + "/api/session/game/" + gameId + "?currPage=" + page);
            dispatch({ type: ActionTypes.GET_GAME_SESSIONS_SUCCESS, payload: data });
        }
        else
            dispatch({ type: ActionTypes.GET_GAME_SESSIONS_FAIL, payload: "Token Not Available" });
    } catch (error) {
        dispatch({ type: ActionTypes.GET_GAME_SESSIONS_FAIL, payload: error.response });
    }
};
//create game session
const createGameSession = (sessionDetails) => async (dispatch) => {
    dispatch({ type: ActionTypes.GAME_CREATE_SESSION_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/session/add", sessionDetails);
        dispatch({ type: ActionTypes.GAME_CREATE_SESSION_SUCCESS, payload: data });
        return status
    } catch (error) {
        dispatch({ type: ActionTypes.GAME_CREATE_SESSION_FAIL, payload: error.response });
    }
};
//update game session
const updateGameSession = (sessionId, sessionDetails) => async (dispatch) => {
    dispatch({ type: ActionTypes.GAME_UPDATE_SESSION_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.put(BASE_URL + "/api/session/" + sessionId, sessionDetails);
        dispatch({ type: ActionTypes.GAME_UPDATE_SESSION_SUCCESS, payload: data });
        return status
    } catch (error) {
        dispatch({ type: ActionTypes.GAME_UPDATE_SESSION_FAIL, payload: error.response });
    }
};
//delete game session
const deleteGameSession = (sessionId) => async (dispatch) => {
    dispatch({ type: ActionTypes.GAME_DELETE_SESSION_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.delete(BASE_URL + "/api/session/delete", { data: { sessionId } });
        dispatch({ type: ActionTypes.GAME_DELETE_SESSION_SUCCESS, payload: data });
        return status
    } catch (error) {
        dispatch({ type: ActionTypes.GAME_DELETE_SESSION_FAIL, payload: error.response });
    }
};
const toggleCreateSessionAccess = (gameId) => async (dispatch) => {
    dispatch({ type: ActionTypes.TOGGLE_CREATE_SESSION_ACCESS_REQUEST });
    try {
        const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/organization-game/allowEmployee-toggle/" + gameId, {});
        dispatch({ type: ActionTypes.TOGGLE_CREATE_SESSION_ACCESS_SUCCESS, payload: data });
        return status
    } catch (error) {
        dispatch({ type: ActionTypes.TOGGLE_CREATE_SESSION_ACCESS_FAIL, payload: error.response });
    }
};



export {
    getAllGameSessions,
    createGameSession,
    updateGameSession,
    deleteGameSession,
    toggleCreateSessionAccess
}
