import * as ActionTypes from "../constants/reportsConstants";

function reportsGetOverallReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.REPORT_GET_OVERALL_REQUEST:
            return { loading: true };
        case ActionTypes.REPORT_GET_OVERALL_SUCCESS:
            return { loading: false, overallReports: action.payload };
        case ActionTypes.REPORT_GET_OVERALL_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function reportForGameReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.REPORT_FOR_GAME_REQUEST:
            return { loading: true };
        case ActionTypes.REPORT_FOR_GAME_SUCCESS:
            return { loading: false, gameReport: action.payload };
        case ActionTypes.REPORT_FOR_GAME_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function downloadOverallReportReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.REPORT_DOWNLOAD_OVERALL_REQUEST:
            return { loading: true };
        case ActionTypes.REPORT_DOWNLOAD_OVERALL_SUCCESS:
            return { loading: false, overAllReportFile: action.payload };
        case ActionTypes.REPORT_DOWNLOAD_OVERALL_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function downloadGameReportReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.REPORT_DOWNLOAD_FOR_GAME_REQUEST:
            return { loading: true };
        case ActionTypes.REPORT_DOWNLOAD_FOR_GAME_SUCCESS:
            return { loading: false, gameReportFile: action.payload };
        case ActionTypes.REPORT_DOWNLOAD_FOR_GAME_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
function getGameReviewReducer(state = {}, action) {
    switch (action.type) {
        case ActionTypes.REVIEW_GET_BY_GAME_REQUEST:
            return { loading: true };
        case ActionTypes.REVIEW_GET_BY_GAME_SUCCESS:
            return { loading: false, gameReviews: action.payload };
        case ActionTypes.REVIEW_GET_BY_GAME_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}
export {
    reportsGetOverallReducer,
    reportForGameReducer,
    downloadOverallReportReducer,
    downloadGameReportReducer,
    getGameReviewReducer
}