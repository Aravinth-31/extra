import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import '../plancard/plancard.css';
import '../premiumplancard/premiumplancard.css';
import '../../containers/organisationDetails/organisationDetails.css';
import '../account/account.css';
import "./purchaseordercard.css";

import arrowback from "../../assets/images/arrow-left.svg";
import premiumplan from "../../assets/images/premiumplan.svg";
import { useSelector, useDispatch } from "react-redux";
import { addPlanToUser, addPurchaseOrder, addSubscribedGames } from '../../redux/actions/gameDetailAction';
import PaymentSuccessModal from '../../components/modal/paymentsuccess';
import PaymentFailModal from '../../components/modal/paymentfailed';

const PurchaseOrderCard = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const handleBackClick = () => {
    history.push("/plan-selected/" + props.selectedPlanDetails.data.id);
  };
  const { userInfo } = useSelector((state) => state.getUser);
  const { selectedPlanDetails } = useSelector(state => state.getPlanDetails);
  const { selectedGamesId } = useSelector(state => state.selectedGamesId);
  const [openPaymentSuccessModal, setOpenPaymentSuccessModal] = useState(false);
  const [openPaymentFailedModal, setOpenPaymentFailedModal] = useState(false);


  const [inputDetails, SetInputDetails] = useState({
    organizationName: "",
    PONumber: "",
    GSTIN: "",
    contactPerson: "",
    email: "",
    mobileNumber: "",
    plan: selectedPlanDetails.data,
  });
  const [disbaleData, setDisableData] = useState({
    organizationName: false,
    email: false,
    phoneNumber: false,
    contactPerson: false,
  });
  const handleChange = (e) => {

    const { name, value } = e.target;
    SetInputDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    var statusPO = await dispatch(addPurchaseOrder(inputDetails));
    if (statusPO === 200 && selectedPlanDetails) {
      var statusGames = await dispatch(addPlanToUser(selectedPlanDetails.data.id));
      if (statusGames === 200 && selectedGamesId) {
        var statusPlan = await dispatch(addSubscribedGames(selectedGamesId));
        if (statusPlan === 200) { setOpenPaymentSuccessModal(true); }

      } else {
        setOpenPaymentFailedModal(true);
      }
    }
    else {
      setOpenPaymentFailedModal(true);
    }

  }

  useEffect(() => {
    if (userInfo) {
      SetInputDetails((prevState) => ({
        ...prevState,
        email: userInfo.data.email,
        phoneNumber: userInfo.data.phoneNumber,
        organizationName: userInfo.data.organizationName,
        contactPerson: userInfo.data.firstName
      }));
      // setDisableData((prevState) => ({
      //   ...prevState,
      //   organizationName: true,
      //   email: true,
      //   contactPerson:true,
      //   phoneNumber: true,
      // }));
    }
  }, [userInfo]);

  return (
    <div className="plans-wrapper premium-wrapper">
      {/* {openPaymentSuccessModal && <PaymentSuccessModal po toggle={openPaymentSuccessModal} setOpenPaymentSuccessModal={setOpenPaymentSuccessModal} />}
      {openPaymentFailedModal && <PaymentFailModal toggle={openPaymentFailedModal} setOpenPaymentFailedModal={setOpenPaymentFailedModal} />}
      <div className="plans-heading">
        <div className="premium-plan">
          <div className="back-arrow">
            <img src={arrowback} alt="back" onClick={handleBackClick} />
          </div>
          <div className="premium-desc">
            <h5>Purchase Order</h5>
            <span>Fill the below details</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="purchaseorder">

          <div className="purchaseorder-left">

            <div className="form-group">
              <label htmlFor="orgname">Organisation Name</label>
              <input
                type="text"
                className="form-control"
                id="orgname"
                name="organizationName"
                disabled={disbaleData.organizationName}
                value={inputDetails.organizationName}
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="ponum">PO Number</label>
              <input
                type="text"
                className="form-control"
                id="ponum"
                name="PONumber"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="gstin">GSTIN Details</label>
              <input
                type="text"
                className="form-control"
                id="gstin"
                name="GSTIN"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactperson">Contact Person</label>
              <input
                type="text"
                className="form-control"
                id="contactperson"
                name="contactPerson"
                disabled={disbaleData.contactPerson}
                value={inputDetails.contactPerson}
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group form-fit">
              <label htmlFor="emailid">Email Id</label>
              <input
                type="text"
                className="form-control"
                id="emailid"
                name="email"
                disabled={disbaleData.email}
                value={inputDetails.email}
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group form-fit">
              <label htmlFor="mobilenumber">Mobile Number</label>
              <input
                type="text"
                className="form-control"
                id="mobilenumber"
                name="mobileNumber"
                disabled={disbaleData.phoneNumber}
                value={inputDetails.phoneNumber}
                required
                onChange={handleChange}
              />
            </div>

          </div>
          <div className="purchaseorder-right">
            <div className="premium-plan-card">
              <div className="premium-plan-heading">
                <div className="premium-plan-left">
                  <h5>
                    {props.selectedPlanDetails &&
                      props.selectedPlanDetails.data.title}{" "}
                  Plan
                </h5>
                  <span>
                    {props.selectedPlanDetails &&
                      props.selectedPlanDetails.data.validityPeriod}{" "}
                  Months
                </span>
                </div>
                <div className="premium-plan-right">
                  <img src={premiumplan} alt="img" />
                </div>
              </div>
              <div className="premium-review">
                <div className="premium-review-group">
                  <div className="premium-review-card">
                    <span>Total Games Selected</span>
                    <h5>30</h5>
                  </div>
                  <div className="premium-review-card">
                    <span>No of Users</span>
                    <h5>
                      {props.selectedPlanDetails &&
                        props.selectedPlanDetails.data.userLimit}
                    </h5>
                  </div>
                </div>
                <div className="premium-review-group subtotal">
                  <div className="premium-review-card">
                    <span>Sub-total</span>
                    <h5>
                      ₹{" "}
                      {props.selectedPlanDetails &&
                        props.selectedPlanDetails.data.pricePerMonth}
                    </h5>
                  </div>
                  <div className="premium-review-card">
                    <span>GST 18%</span>
                    <h5>
                      ₹{" "}
                      {props.selectedPlanDetails &&
                        parseFloat(props.selectedPlanDetails.data.pricePerMonth) *
                        0.18}
                    </h5>
                  </div>
                </div>
                <div className="premium-total">
                  <span>Total to be paid</span>
                  <h5>
                    ₹{" "}
                    {props.selectedPlanDetails &&
                      parseFloat(props.selectedPlanDetails.data.pricePerMonth) *
                      1.18}
                  </h5>
                </div>
                <div className="premium-button">

                  <button type="submit" className="btn btn-primary" >
                    Pay Securely
                </button>

                  <span>
                    Payment request will be sent lorem ipsum is a dummy text
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form> */}
    </div>
  );
};
export default PurchaseOrderCard;
