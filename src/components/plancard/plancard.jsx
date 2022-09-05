import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import "./plancard.css";
import ContactUsModal from "../modal/contactus";
// image
import mini from "../../assets/images/plans/basic.svg";
import medium from "../../assets/images/plans/standard.svg";
import mega from "../../assets/images/plans/premium.svg";
import enterprise from "../../assets/images/plans/enterprise.svg";
import { useDispatch, useSelector } from "react-redux";
import { getAllPlans } from "../../redux/actions/gameDetailAction";
import LoginModal from '../../components/modal/loginmodal';
import saveicon from '../../assets/images/saveicon.svg';
import ThankyouModal from "../modal/thankyoucontacting";
import Roles from '../../helpers/userTypes';
import currentPlan from '../../assets/images/plan.svg';
import arrowback from "../../assets/images/arrow-back.svg";
import LoadingComponent from "../loader/LoadingComponent";
import Select from "react-select";
import axios from "axios";
import { SYMBOLS } from "../../constants";

const PlanCard = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const GetAllPlans = useSelector((state) => state.getAllPlans);
  const { planDetails } = GetAllPlans;
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const { userInfo } = useSelector(state => state.getUser);
  const [loaded, setLoaded] = useState(false);

  var role = "";
  if (userInfo && userInfo.data) {
    role = userInfo.data.role;
  }
  useEffect(() => {
    dispatch(getAllPlans());
    const callBack = async () => {
      // try {
      //   const response = await axios.get('https://api.exchangerate.host/latest?base=INR&symbols=USD,EUR,CAD')
      //   if (response && response.data && response.data.rates) {
      //     setExchangeRates({ ...response.data.rates, INR: 1 });
      //   }
      // } catch (err) {
      //   console.log(err);
      // }
      try {
        const response = await axios.get('https://api.ipgeolocation.io/ipgeo?apiKey=e1a29c31b72d4a4a9d0ce93be30400ee')
        if (response?.data?.country_name) {
          if (response?.data?.country_name === "India")
            setSelectedCurrency("INR");
          else
            setSelectedCurrency("USD");
        }
      } catch (err) {
        console.log(err);
      }
    }
    callBack();

  }, []);
  const [openContactModal, setOpenContactModal] = useState(false);
  const [openThanyouModal, setOpenThankyouModal] = useState(false);
  const [fromMyPlans, setFromMyPlans] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  // const [exchangeRates, setExchangeRates] = useState({ CAD: 1, EUR: 1, USD: 1, INR: 1 })
  const handleContact = () => {
    setOpenContactModal(true);
  };
  const handlePurchase = (e, plan) => {
    if (userInfo) {
      history.push({
        pathname: '/purchase/' + plan.id,
        state: { selectedCurrency: selectedCurrency }
      });
    }
    else {
      setOpenLoginModal(true);
    }
  }
  const [planValidity, setPlanValidity] = useState(12);
  const [disbleSelect, setDisableSelect] = useState(false);
  const [myPlanId, setMyPlanId] = useState('');
  const updateValidity = (e, value) => {
    setPlanValidity(value);
  }

  useEffect(() => {
    if (
      props.location &&
      props.location.state &&
      props.location.state.fromMyPlans
    ) {
      setFromMyPlans(true);
    }
    // else {
    //   setFromManageGames(false);
    // }
    if (props.location &&
      props.location.state &&
      props.location.state.isPlanValid) {
      setDisableSelect(props.location.state.isPlanValid);
    }
    if (props.location && props.location.state && props.location.state.planId) {
      setMyPlanId(props.location.state.planId)
    }
  }, [props.location]);
  const handleBackClick = () => {
    history.push("/account/plan-details");
  };
  useEffect(() => {
    if (props && props.userType === Roles.ORG_ADMIN && props.myPlan && props.myPlan.plan) {
      setPlanValidity(props.myPlan.plan.validityPeriod);
    }
  }, [])
  useEffect(() => {
    if (GetAllPlans && GetAllPlans.loading) {
      setLoaded(false)
    }
    else {
      setLoaded(true)
    }
  }, [GetAllPlans])
  var removeRecommendedFlag = false;
  const removeRecommended = () => {
    // if (!removeRecommendedFlag) {
    //   const el = document.querySelectorAll(".plans-card");
    //   for (let i = 0; i < el.length; i++) {
    //     el[i].classList.remove("recommended");
    //   }
    //   removeRecommendedFlag = true;
    // }
  }
  const calculateYearlySavings = (plan) => {
    let equivalent1MonthPlanPrice;
    planDetails.data.forEach(p => {
      if (p.userLimit === plan.userLimit && p.validityPeriod === 1) {
        equivalent1MonthPlanPrice = p.prices[selectedCurrency] * 12 - plan.prices[selectedCurrency];
      }
    })
    return equivalent1MonthPlanPrice.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }
  return (
    <React.Fragment>
      <LoadingComponent loaded={loaded} />
      <div className="plans-wrapper">
        {
          fromMyPlans &&
          <div className="back-arrow">
            <img src={arrowback} alt="back" onClick={handleBackClick} />
            <br /><br />
          </div>
        }
        {props.userType !== Roles.ORG_ADMIN && <div className="plans-heading">
          <h5>Plans</h5>
          <span>Choose plans that best fit your requirement</span>
          {/* <div className="currency-container">
            <h4>Choose Currency</h4>
            <Select
              classNamePrefix="react-select"
              className="form-select"
              options={[
                { label: 'INR', value: 'INR' },
                { label: 'USD', value: 'USD' },
              ]}
              onChange={(e) => setSelectedCurrency(e.value)}
              value={{ label: selectedCurrency, value: selectedCurrency }}
              styles={{
                control: (base => ({
                  ...base,
                  width: "100px",
                  minHeight: 35,
                  height: 35
                }))
              }}
            />
          </div> */}

        </div>}
        <div className="plans-tab">
          <ul>
            <li className={planValidity === 1 ? "active" : ""} onClick={(e) => updateValidity(e, 1)} key={'3months'}>
              <Link to={"#"}>
                1 Month
              </Link>
            </li>
            {/* <li className={planValidity === 6 ? "active" : ""} onClick={(e) => updateValidity(e, 6)} key={'6months'}>
              <Link to={"#"}>
                6 Months
              </Link>
            </li> */}
            <li className={planValidity === 12 ? "active" : ""} onClick={(e) => updateValidity(e, 12)} key={'12months'}>
              <Link to={"#"}>
                Annual Plan
              </Link>
              {props && props.userType !== Roles.ORG_ADMIN && <div className="save annual">
                <img src={saveicon} alt="" />
                <div>Save</div>
              </div>}
            </li>
          </ul>
        </div>
        <div className="plans-detail">
          {planDetails && planDetails.data ? (
            <>
              {
                planDetails.data.sort((a, b) => a.prices?.["INR"] - b.prices?.["INR"]).map((plan, key = { plan }) => {
                  if (
                    plan.id === "84291aef-1cc6-481b-b1b0-aeed7b9b7793" ||
                    plan.id === "92c92eb6-c4d1-4540-b907-b7eb4d9d5478" ||
                    plan.id === "be66de0e-8c20-4116-a0fe-254f489f7202" ||
                    (plan.validityPeriod === 3 && plan.prices?.["INR"] === 75000 && plan.userLimit === 3000) ||
                    (plan.validityPeriod === 3 && plan.prices?.["INR"] === 15000 && plan.userLimit === 4000) ||
                    (plan.validityPeriod === 12 && plan.prices?.["INR"] === 36000 && plan.userLimit === 500)
                  )
                    return <div key={JSON.stringify(plan)}></div>
                  if (plan.validityPeriod === planValidity) {
                    return (<>
                      <div key={JSON.stringify(plan)} className={`plans-card ${((props && props.userType && props.userType === Roles.ORG_ADMIN) || (role === Roles.ORG_SUPER_ADMIN && disbleSelect)) ? (plan.id === (props.myPlan && props.myPlan.plan && props.myPlan.plan.id) || plan.id === myPlanId ? "recommended" : "") : plan.title === 'Mega' ? "recommended" : ""}`} onMouseEnter={removeRecommended}>
                        <div className="recommended-text">{((props.userType && (props.userType === Roles.ORG_ADMIN)) || (role === Roles.ORG_SUPER_ADMIN && disbleSelect)) ? <><img src={currentPlan} alt="plan" /> My Current Plan</> : "Recommended"}</div>
                        <div className="plans-content">
                          <div className="plans-img">
                            <span className="hide767">{plan.title}</span>
                            <img src={plan.title === 'Mega' ? mega : plan.title === 'Medium' ? medium : mini} alt="plans" />
                            <span className="show767">{plan.title}</span>
                          </div>
                          <div className="plans-data">
                            <h4>{plan.userLimit} Users</h4>
                            <h5><span className="price">{SYMBOLS[selectedCurrency]}</span>{" " + (plan.prices?.[selectedCurrency] / plan.validityPeriod).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}<span>/month</span></h5>
                            <h6>{SYMBOLS[selectedCurrency] + " " + (plan.prices?.[selectedCurrency] / plan.userLimit / plan.validityPeriod).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 3 })}/user up to {plan.userLimit} users</h6>
                            {
                              planValidity === 12 &&
                              <h6 className="savings">Yearly savings {SYMBOLS[selectedCurrency] + " " + calculateYearlySavings(plan)}</h6>
                            }
                          </div>
                          {props && props.userType !== Roles.ORG_ADMIN && <div className="plans-desc">
                            <div className={`${disbleSelect ? "btn-tooltip" : ""}`}>
                              <button type="submit" className={`btn btn-secondry ${disbleSelect ? "disabled" : ""}`} disabled={disbleSelect} onClick={(e) => handlePurchase(e, plan)}>
                                Select
                              </button>
                              {disbleSelect ? <div className="tooltip" role="tooltip">
                                <span>You have an Active plan.<br /> Please Contact Admin.</span>
                              </div> : null}
                            </div>
                          </div>}
                        </div>
                      </div>
                    </>
                    );
                  }
                })}
            </>
          ) : null}

          <div className="plans-card" onMouseEnter={removeRecommended}>
            <div className="recommended-text">Recommended</div>
            <div className="plans-content">
              <div className="plans-img">
                <span>Jumbo</span>
                <img src={enterprise} alt="plans" />
              </div>
              <div className="plans-data connect-detail">
                <h4>1000+ Users</h4>
                <h5>
                  Customised packages
                </h5>
              </div>
              <div className="plans-desc">
                <button
                  type="submit"
                  className="btn btn-secondry"
                  data-toggle="modal"
                  data-target="#contactus"
                  onClick={handleContact}
                >
                  Contact us
                </button>
              </div>
            </div>
          </div>
        </div>
        {openLoginModal && (
          <LoginModal
            modalid="loginmodal"
            toggle={openLoginModal}
            setOpenLoginModal={setOpenLoginModal}
            plan
          />
        )}
        {openContactModal ? (
          <ContactUsModal
            modalid="contactus"
            toggle={openContactModal}
            setOpenContactModal={setOpenContactModal}
            setOpenThankyouModal={setOpenThankyouModal}
          />
        ) : null}
        {
          openThanyouModal && <ThankyouModal toggle={openThanyouModal} setOpenThankyouModal={setOpenThankyouModal} modalid="thankyoucontact" />
        }
      </div>
      <div style={{ paddingTop: '10px' }}>
        <div >* All Prices are in {selectedCurrency}.</div>
        <div>* All Plans provide access to available games. </div>
      </div>

    </React.Fragment>
  );
};

export default React.memo(PlanCard);
