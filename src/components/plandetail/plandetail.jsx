import React, { useEffect, useState } from 'react';
import Progress from 'react-progressbar';
import { Link } from 'react-router-dom';
import '../reportstable/reportstable.css';
import './plandetail.css';
import TransactionTable from './transactiontable';
import { useDispatch, useSelector } from 'react-redux';
import { getMyPlans, getOrganisation } from '../../redux/actions/plansApiActions';
import PlanCard from '../plancard/plancard';
import userTypes, { OrgRoles } from '../../helpers/userTypes';
import SelectPaymentModal from '../modal/selectpaymentmodal';
import PaymentSuccessModal from "../../components/modal/paymentsuccess";
import LoadingComponent from '../loader/LoadingComponent';
import { SYMBOLS } from '../../constants';

const PlanDetail = (props) => {
  const dispatch = useDispatch();
  const MyPlanDetails = useSelector(state => state.getMyPlans);
  const { myPlanDetails } = MyPlanDetails;
  useEffect(() => {
    if (OrgRoles.includes(userInfo?.data?.role))
      dispatch(getMyPlans());
    if (userInfo && userInfo.data)
      dispatch(getOrganisation(userInfo.data.email));
  }, []);
  const priceFormatIndianLocale = Intl.NumberFormat('en-IN');
  const [openPaymentSuccessModal, setOpenPaymentSuccessModal] = useState(false);
  const [openSelectPaymentModal, setOpenSelectPaymentModal] = useState(false);
  const [isPlanValid, setIsPlanValid] = useState();;
  const [loaded, setLoaded] = useState(true);
  const [offlinePayment, setOfflinePayment] = useState(false);

  const UserInfo = useSelector((state) => state.getUser);
  const { userInfo } = UserInfo;
  const GetOrganisation = useSelector((state) => state.getOrganisation);
  const { orgDetailsByEmail } = GetOrganisation;

  useEffect(() => {

  }, [myPlanDetails]);
  var planId = "";
  if (myPlanDetails) {
    planId = myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail && myPlanDetails.data.planDetail.planId
  }

  useEffect(() => {
    if (myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail && myPlanDetails.data.planDetail.validityDate) {
      var date = new Date(myPlanDetails.data.planDetail.validityDate);
      var twoWeeksBefore = new Date(date.getTime() - (14 * 24 * 60 * 60 * 1000));
      setIsPlanValid(
        twoWeeksBefore > new Date())
    }
  }, [myPlanDetails]);

  useEffect(() => {
    if ((MyPlanDetails && MyPlanDetails.loading)) {
      setLoaded(false);
    }
    else
      setLoaded(true);
  }, [MyPlanDetails]);
  const handlePayNow=()=>{
    // setOpenSelectPaymentModal(true)
    props.history.push("/plans")
  }
  return (
    <div className="plandetail-card">
      <LoadingComponent loaded={loaded} />
      <div className="plandetail-premium">
        <h5>My Plan</h5>
        <div className="plandetail-premium-card">
          <div className="premium-card-top">
            <div className="pc-upgrade-plan">
              <h4>{myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail
                && myPlanDetails.data.planDetail.plan.title} Plan</h4>
              {props.userType === userTypes.ORG_SUPER_ADMIN &&
                <Link to={{
                  pathname: "/plans",
                  state: { fromMyPlans: true, isPlanValid: isPlanValid, planId: planId }
                }}>
                  <button className="btn btn-secondry" >View All Plans</button>
                </Link>
              }
            </div>
            <div className="pc-ammount">
              <h3><span>{orgDetailsByEmail?.data?.currency ? SYMBOLS[orgDetailsByEmail.data.currency] : ""}</span>{priceFormatIndianLocale.format(myPlanDetails?.data?.planDetail
                && orgDetailsByEmail?.data?.currency && myPlanDetails.data.planDetail.plan.prices[orgDetailsByEmail.data.currency])}</h3>
              {
                myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail
                && !myPlanDetails.data.planDetail.validityDate &&
                <span>for {
                  myPlanDetails.data.planDetail.plan.validityPeriod} Months</span>
              }
            </div>
          </div>
          <div className="premium-card-bottom">
            <div className="premium-progressbar">
              <span>{myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail
                && myPlanDetails.data.planDetail.currentUserCount} of {myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail
                  && myPlanDetails.data.planDetail.plan.userLimit} users</span>
              <Progress completed={myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail
                && parseInt(myPlanDetails.data.planDetail.currentUserCount / myPlanDetails.data.planDetail.plan.userLimit * 100)} />
            </div>
            <div className="manage-nextpayment">
              <div className="next-payment">
                <span>Next Payment</span>
                <h4>{myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail
                  && new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(
                    new Date(myPlanDetails.data.planDetail.validityDate)
                  )}</h4>
              </div>
              {props.userType === userTypes.ORG_SUPER_ADMIN && <div className={`${isPlanValid ? "btn-tooltip" : ""}`}> <button className={`btn btn-primary ${isPlanValid ? "disabled" : ""}`} disabled={isPlanValid} onClick={handlePayNow}>
                Pay now
              </button>
                {isPlanValid ? <div className="tooltip" role="tooltip">
                  <span>You have an Active plan.<br /> Please Contact Admin.</span>
                </div> : null} </div>}
            </div>
          </div>
        </div>

        {openSelectPaymentModal && (
          <SelectPaymentModal
            toggle={openSelectPaymentModal}
            modalid="payment"
            setOpenSelectPaymentModal={setOpenSelectPaymentModal}
            setOpenPaymentSuccessModal={setOpenPaymentSuccessModal}
            selectedPlanId={myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail
              && myPlanDetails.data.planDetail.plan.id}
            setOfflinePayment={setOfflinePayment}
          />
        )}
        {openPaymentSuccessModal && (
          <PaymentSuccessModal
            po
            toggle={openPaymentSuccessModal}
            setOpenPaymentSuccessModal={setOpenPaymentSuccessModal}
          />
        )}
      </div>
      {/* transaction history */}
      {props.userType === userTypes.ORG_SUPER_ADMIN && <div className="transaction-table-sect">
        <h4>Transaction History</h4>
        <TransactionTable myPlanDetails={myPlanDetails} />
      </div>}
      {props.userType === userTypes.ORG_ADMIN && <div className="transaction-table-sect">
        <h4>Plans Available</h4>
        <PlanCard userType={props.userType} myPlan={myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail} />
      </div>}
    </div>
  );
};

export default PlanDetail;
