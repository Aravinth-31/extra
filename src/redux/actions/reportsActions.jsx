import * as ActionTypes from "../constants/reportsConstants";
import { axiosApiInstance, BASE_URL } from "../../helpers/helper";


const getOverallReports = (body, page = 1) => async (dispatch) => {
    dispatch({ type: ActionTypes.REPORT_GET_OVERALL_REQUEST });
    try {
        let url = '/api/game-server/report?search=' + body.text;
        if (body.initiatedBy)
            url += '&name=' + body.initiatedBy;
        if (body.from && body.to)
            url += '&fromDate=' + body.from + '&toDate=' + body.to;
        if (body.min && body.max)
            url += '&minPlayers=' + body.min + '&maxPlayers=' + body.max;
        url += "&currPage=" + page;
        const { data, status } = await axiosApiInstance.get(BASE_URL + url);
        dispatch({ type: ActionTypes.REPORT_GET_OVERALL_SUCCESS, payload: data, });
        return status;
    } catch (error) {
        dispatch({ type: ActionTypes.REPORT_GET_OVERALL_FAIL, payload: error.message, });
    }
};

const getGameReport = (gameId) => async (dispatch) => {
    dispatch({ type: ActionTypes.REPORT_FOR_GAME_REQUEST });
    // const url = BASE_URL + "/api/report/" + gameId;
    const url = BASE_URL + "/api/game-server/report/" + gameId;
    try {
        const { data } = await axiosApiInstance.get(url);
        dispatch({ type: ActionTypes.REPORT_FOR_GAME_SUCCESS, payload: data, });
    } catch (error) {
        dispatch({ type: ActionTypes.REPORT_FOR_GAME_FAIL, payload: error.message, });
    }
};
const downloadOverallReport = () => async (dispatch) => {
    dispatch({ type: ActionTypes.REPORT_DOWNLOAD_OVERALL_REQUEST });
    try {
        const { data } = await axiosApiInstance.get(
            BASE_URL + "/api/game-server/report/download",
        );
        dispatch({
            type: ActionTypes.REPORT_DOWNLOAD_OVERALL_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ActionTypes.REPORT_DOWNLOAD_OVERALL_FAIL,
            payload: error.message,
        });
    }
};
const downloadGameReport = (gameId) => async (dispatch) => {
    dispatch({ type: ActionTypes.REPORT_DOWNLOAD_FOR_GAME_REQUEST });
    try {
        const { data } = await axiosApiInstance.get(
            BASE_URL + "/api/game-server/report/download/" + gameId ,
        );
        dispatch({
            type: ActionTypes.REPORT_DOWNLOAD_FOR_GAME_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ActionTypes.REPORT_DOWNLOAD_FOR_GAME_FAIL,
            payload: error.message,
        });
    }
};
//get Game Speicific reviews
const getGameReview = (gameId) => async (dispatch) => {
    dispatch({ type: ActionTypes.REVIEW_GET_BY_GAME_REQUEST });
    try {
        const { data } = await axiosApiInstance.get(BASE_URL + "/api/game-server/review/game/" + gameId);
        dispatch({ type: ActionTypes.REVIEW_GET_BY_GAME_SUCCESS, payload: data, });
    } catch (error) {
        dispatch({ type: ActionTypes.REVIEW_GET_BY_GAME_FAIL, payload: error.message, });
    }
};

export {
    getOverallReports,
    getGameReport,
    downloadOverallReport,
    downloadGameReport,
    getGameReview
}