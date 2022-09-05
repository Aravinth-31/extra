import React, { useState } from "react";
import "./modal.css";
import Modal from "./modal";
import arrowback from "../../assets/images/arrow-left.svg";
import { useDispatch, useSelector } from "react-redux";

import { offlinePaymentCheckout } from "../../redux/actions/paymentApiActions";
import { axiosApiInstance, BASE_URL, RAZOR_PAY_API_KEY } from "../../helpers/helper";
import { getUser, signin } from "../../redux/actions/userAction";
import { ToastContainer } from 'react-toastify';
import LoadingComponent from "../loader/LoadingComponent";

const SelectPaymentModal = ({
  modalid,
  toggle,
  setOpenSelectPaymentModal,
  setOpenPaymentSuccessModal,
  selectedPlanId,
  orgName,
  phoneNumber,
  amount,
  setOfflinePayment
}) => {
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loaded, setLoaded] = useState(true);

  const GetUser = useSelector(state => state.getUser);
  const { userInfo } = GetUser;

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    })
  }

  const displayRazorpay = async () => {
    setLoaded(false);
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    setLoaded(true)
    if (!res) {
      console.log("Razorpay SDK failed to load. Are you online?");
      return;
    }
    // creating a new order
    setLoaded(false);
    const result = await axiosApiInstance.post(BASE_URL + "/api/payment/razor/checkout", { planId: selectedPlanId, totalAmount: Math.round(amount) });
    setLoaded(true)
    if (!result) {
      console.log("Server error. Are you online?");
      return;
    }
    const { order_id, transactionId } = result && result.data && result.data.data
    const currency = "INR";
    const options = {
      key: RAZOR_PAY_API_KEY,
      // amount: amount.toString(),
      currency: currency,
      name: orgName,
      description: "Purchase Plan",
      order_id: order_id,
      handler: async function (response) {
        const data = {
          planId: selectedPlanId,
          transactionId: transactionId,
          payId: response.razorpay_payment_id
        };
        setLoaded(false)
        const result = await axiosApiInstance.post(BASE_URL + "/api/payment/razor/verify", data);
        setLoaded(true)
        if (result.status === 200) {
          window.gtag("event", "Users Subscribed", {
            event_category: "USER",
            event_label: "Users subscribed to the ExtramilePlay platform"
          });
          if (userInfo && userInfo.data) {
            await dispatch(signin({ email: userInfo.data.email }))
          }
          dispatch(getUser());
          setOpenSelectPaymentModal(false);
          setOpenPaymentSuccessModal(true);
        }
      },
      prefill: {
        name: userInfo && userInfo.data && userInfo.data.firstName + " " + userInfo.data.lastName,
        email: userInfo && userInfo.data && userInfo.data.email,
        contact: phoneNumber,
      },
      notes: {
        address: "Gaurav Kumar Corporate Office",
      },
      theme: {
        color: "#e25569",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  const handleClick = async () => {
    if (paymentMethod === "offline") {
      setOfflinePayment(true);
      let resStatus = await dispatch(offlinePaymentCheckout(selectedPlanId));
      if (resStatus === 200) {
        dispatch(getUser());
        setOpenSelectPaymentModal(false);
        setOpenPaymentSuccessModal(true);
      }
    }
    else if (paymentMethod === "online") {
      setOfflinePayment(false);
      displayRazorpay()
    }
  };
  const handleChange = (e) => {
    const { value } = e.target;
    setPaymentMethod(value);
  };

  return (
    <Modal modalid={modalid} toggle={toggle}>
      <LoadingComponent loaded={loaded} />
      <ToastContainer position="bottom-center" />
      <div className="modal-body payment-wrapper">
        <div className="close-icon" data-dismiss="modal" aria-label="Close" onClick={() => setOpenSelectPaymentModal(false)}>
          <div
            className="close-btn-icon"
          ></div>
        </div>
        <div className="contact-modal paymentmodal">
          <div className="contact-heading">
            <div
              className="payment-back"
              data-dismiss="modal"
              aria-label="Close"
            >
              <img src={arrowback} alt="back" />
            </div>
            <h6>Select Payment option</h6>
          </div>
          <div className="contact-form">
            <div className="paymentmodal-group">
              <div className="form-group">
                <label className="payment-label">
                  <input
                    style={{ width: "auto" }}
                    type="radio"
                    name="payment"
                    value="online"
                    onChange={handleChange}
                  />
                  &nbsp;Online Mode
                </label>
                <p className="payment-p">Debit, Credit, NetBanking</p>
              </div>
              <div className="form-group">
                <label className="payment-label">
                  <input
                    style={{ width: "auto" }}
                    type="radio"
                    name="payment"
                    value="offline"
                    onChange={handleChange}
                  />
                  &nbsp;Offline Mode
                </label>
              </div>
            </div>

            <div className="payment-btn">
              <button
                type="submit"
                className="btn btn-secondry"
                onClick={() => setOpenSelectPaymentModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={paymentMethod ? "btn btn-primary" : "btn btn-primary disabled"}
                onClick={handleClick}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SelectPaymentModal;
