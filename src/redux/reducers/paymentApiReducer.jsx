import * as ActionTypes from "../constants/paymentApiConstants";

function offlinePaymentCheckoutReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.OFFLINE_PAYMENT_CHECKOUT_REQUEST:
      return { loading: true };
    case ActionTypes.OFFLINE_PAYMENT_CHECKOUT_SUCCESS:
      return { loading: false, offlineCheckout: action.payload };
    case ActionTypes.OFFLINE_PAYMENT_CHECKOUT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function getAllPaymentAdminReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.PAYMENT_GET_ALL_PAYMENT_ADMIN_REQUEST:
      return { loading: true };
    case ActionTypes.PAYMENT_GET_ALL_PAYMENT_ADMIN_SUCCESS:
      return { loading: false, allPaymentForAdmin: action.payload };
    case ActionTypes.PAYMENT_GET_ALL_PAYMENT_ADMIN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function ofllinePaymentVerifyReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.PAYMENT_VERIFY_OFFLINE_PAYMENT_REQUEST:
      return { loading: true };
    case ActionTypes.PAYMENT_VERIFY_OFFLINE_PAYMENT_SUCCESS:
      return { loading: false, offlinePaymentVerify: action.payload };
    case ActionTypes.PAYMENT_VERIFY_OFFLINE_PAYMENT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
function offlienPaymentAdminReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADMIN_OFFLINE_PAYMENT_CHECKOUT_REQUEST:
      return { loading: true };
    case ActionTypes.ADMIN_OFFLINE_PAYMENT_CHECKOUT_SUCCESS:
      return { loading: false, offlinePaymentAdmin: action.payload };
    case ActionTypes.ADMIN_OFFLINE_PAYMENT_CHECKOUT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
export {
  offlinePaymentCheckoutReducer,
  getAllPaymentAdminReducer,
  ofllinePaymentVerifyReducer,
  offlienPaymentAdminReducer
};
