import * as ActionTypes from "../constants/paymentApiConstants";
import { axiosApiInstance, BASE_URL, encryptData } from "../../helpers/helper";


const offlinePaymentCheckout = (planId) => async (dispatch) => {
  dispatch({ type: ActionTypes.OFFLINE_PAYMENT_CHECKOUT_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(
      BASE_URL + "/api/payment/offline/checkout",
      { planId }
    );
    dispatch({
      type: ActionTypes.OFFLINE_PAYMENT_CHECKOUT_SUCCESS,
      payload: data
    });
    localStorage.setItem("offlineCheckout", encryptData(data));
    return status;
  } catch (error) {
    dispatch({
      type: ActionTypes.OFFLINE_PAYMENT_CHECKOUT_FAIL,
      payload: error.message
    });
  }
};

const getAllPaymentForAdmin = (searchText) => async (dispatch) => {
  dispatch({ type: ActionTypes.PAYMENT_GET_ALL_PAYMENT_ADMIN_REQUEST });
  try {
    const { data } = await axiosApiInstance.get(
      BASE_URL + "/api/payment/transaction-history/all?search=" + searchText
    );
    dispatch({
      type: ActionTypes.PAYMENT_GET_ALL_PAYMENT_ADMIN_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: ActionTypes.PAYMENT_GET_ALL_PAYMENT_ADMIN_FAIL,
      payload: error.message
    });
  }
};

const verifyOfflinePayment = (transactionDetails) => async (dispatch) => {
  dispatch({ type: ActionTypes.PAYMENT_VERIFY_OFFLINE_PAYMENT_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(
      BASE_URL + "/api/payment/offline/verify",
      transactionDetails
    );
    dispatch({
      type: ActionTypes.PAYMENT_VERIFY_OFFLINE_PAYMENT_SUCCESS,
      payload: data
    });
    return status;
  } catch (error) {
    dispatch({
      type: ActionTypes.PAYMENT_VERIFY_OFFLINE_PAYMENT_FAIL,
      payload: error.message
    });
  }
};

const offlinePaymentByAdmin = (body) => async (dispatch) => {
  dispatch({ type: ActionTypes.ADMIN_OFFLINE_PAYMENT_CHECKOUT_REQUEST });
  try {
    const { data, status } = await axiosApiInstance.post(BASE_URL + "/api/payment/offline/checkoutByAdmin", body);
    dispatch({ type: ActionTypes.ADMIN_OFFLINE_PAYMENT_CHECKOUT_SUCCESS, payload: data });
    return status;
  } catch (error) {
    dispatch({ type: ActionTypes.ADMIN_OFFLINE_PAYMENT_CHECKOUT_FAIL, payload: error.message });
  }
};

export { offlinePaymentCheckout, getAllPaymentForAdmin, verifyOfflinePayment, offlinePaymentByAdmin };
