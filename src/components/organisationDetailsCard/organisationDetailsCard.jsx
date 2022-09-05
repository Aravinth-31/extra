import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import arrowback from "../../assets/images/arrow-left.svg";
import upload from "../../assets/images/upload.svg";
import remove from "../../assets/images/remove.svg";
import premiumplan from "../../assets/images/premiumplan.svg";
import countries from "countries-cities";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../../redux/actions/commonActions";
import { addOrgDetails } from "../../redux/actions/plansApiActions";
import { getOrganisation } from "../../redux/actions/plansApiActions";
import PaymentSuccessModal from "../../components/modal/paymentsuccess";
import SelectPaymentModal from "../../components/modal/selectpaymentmodal";
import * as ActionTypes from "../../redux/constants/commonApiConstants";
import ExtraMilePlay from '../../assets/images/ExtramilPlay.png';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import LoadingComponent from "../loader/LoadingComponent";
import { failureAlert, S3_BASE_URL } from "../../helpers/helper";
import { updateOrganisation } from "../../redux/actions/organisationActions";
import { SYMBOLS } from "../../constants";


const OrganisationDetailsCard = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const fileUpload = useSelector((state) => state.uploadedFile);
  const { uploadedFile } = fileUpload;
  const UserInfo = useSelector((state) => state.getUser);
  const { userInfo } = UserInfo;
  const GetOrganisation = useSelector((state) => state.getOrganisation);
  const { orgDetailsByEmail } = GetOrganisation;
  const AddOrgDetails = useSelector(state => state.addOrgDetails);
  const GetPlanDetails = useSelector(state => state.getPlanDetails);
  const userSignin = useSelector((state) => state.userSignin);
  const OfflinePaymentCheckout = useSelector(state => state.offlinePaymentCheckout);
  const UpdateOrganisation = useSelector(state => state.updateOrganisation);

  const [orgNameError, setOrgNameError] = useState("");
  const [validPhone, setValidPhone] = useState(true);
  const handleBackClick = () => {
    history.push("/plans");
  };
  const [disabledOrg, setDisabledOrg] = useState(false);
  const [disablePhone, setDisablePhone] = useState(false);
  const [openPaymentSuccessModal, setOpenPaymentSuccessModal] = useState(false);
  const [openSelectPaymentModal, setOpenSelectPaymentModal] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [loaded, setLoaded] = useState(true);
  const [offlinePayment, setOfflinePayment] = useState(false);
  const priceFormatIndianLocale = Intl.NumberFormat('en-IN');
  const [selectedCurrency, setSelectedCurrency] = useState("INR");


  var countriesData = countries.getCountries().map((data) => {
    return { value: data, label: data };
  });
  useEffect(() => {
    if (userInfo && !orgDetailsByEmail) {
      dispatch(getOrganisation(userInfo.data.email));
    }
  }, [userInfo]);

  useEffect(() => {
    if (props?.location?.state?.selectedCurrency)
      setSelectedCurrency(props?.location?.state?.selectedCurrency);
    else
      setSelectedCurrency("INR");
  }, [props.location])

  const [orgDetails, setOrgDetails] = useState({
    name: "",
    country: "",
    GSTIN: "",
    phoneNumber: "",
    companyLogo: ""
  });
  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.phoneNumber && orgDetailsByEmail && !orgDetailsByEmail.data) {
      if (userInfo.data.phoneNumber.length > 0) {
        setOrgDetails((prevState) => ({
          ...prevState,
          phoneNumber: userInfo.data.phoneNumber,
        }));
        setDisablePhone(true);
      }
    }
  }, [userInfo]);
  useEffect(() => {
    if (orgDetailsByEmail && orgDetailsByEmail.data) {
      setOrgDetails((prevState) => ({
        ...prevState,
        name: orgDetailsByEmail.data.name,
        country: orgDetailsByEmail.data.country,
        GSTIN: orgDetailsByEmail.data.GSTIN,
        phoneNumber: orgDetailsByEmail.data.phoneNumber,
        companyLogo: orgDetailsByEmail.data.companyLogo
      }));
      setDisabledOrg(true);
    }
  }, [orgDetailsByEmail]);
  const [touched, setTouched] = useState({
    name: false,
    country: false,
    GSTIN: false,
    phoneNumber: false,
  });
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "name") {
      setOrgNameError("")
    }
    const numberFormat = /^[0-9]+$/
    if (name === "phoneNumber" && value !== "" && !numberFormat.test(value))
      return;
    setOrgDetails((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSelector = (e, name) => {
    setOrgDetails((prevState) => ({
      ...prevState,
      [name]: e.value
    }));
  };
  const fileChanged = async (e) => {
    const file = e.target.files[0];
    e.target.value = [];
    if (file && file.type && file.type.startsWith("image/")) {
      const data = new FormData();
      data.append("company-logos", file);
      const response = await dispatch(uploadFile(data));
      if (response?.status?.includes?.("417"))
        failureAlert("Uploaded file contains some malware!");
      else if (response?.status?.includes?.("500"))
        failureAlert("File Format Not supported");
    }
  };
  const removeLogo = () => {
    if (!orgDetails.companyLogo)
      return;
    setOrgDetails((prevState) => ({
      ...prevState,
      companyLogo: ""
    }));
    dispatch({ type: ActionTypes.FILE_UPLOAD_SUCCESS, payload: null })
  };
  useEffect(() => {
    return (() => {
      dispatch({ type: ActionTypes.FILE_UPLOAD_SUCCESS, payload: null, });
    })
  }, [])
  useEffect(() => {
    if (uploadedFile && uploadedFile.data)
      setOrgDetails((prevState) => ({
        ...prevState,
        companyLogo: uploadedFile.data.path
      }));
  }, [uploadedFile]);

  const validate = () => {
    const inputErrors = {
      name: "",
      country: "",
      GSTIN: "",
      phoneNumber: "",
    };
    // const nameFormat = /^[a-zA-Z ]+$/;
    // if (touched.name && (orgDetails.name === "" || (orgDetails.name.length > 0 && !nameFormat.test(orgDetails.name))))
    //   inputErrors.name = "Please enter valid Organisation name";
    if (touched.name && orgDetails.name === "")
      inputErrors.name = "Please enter valid Organisation name";
    if (touched.country && orgDetails.country === "")
      inputErrors.country = "Please enter valid country name";
    const gstinFormat = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (touched.GSTIN && orgDetails.GSTIN !== "" && !gstinFormat.test(orgDetails.GSTIN)) {
      inputErrors.GSTIN = "Please enter valid GSTIN/Tax Identification Number"
    }
    if (touched.phoneNumber && !validPhone) {
      inputErrors.phoneNumber = "Please enter valid phone number"
    }
    return inputErrors;
  };
  const errors = validate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (orgDetailsByEmail && orgDetailsByEmail.data) {
      if (orgDetailsByEmail.data.currency !== selectedCurrency) {
        const response = await dispatch(updateOrganisation(orgDetailsByEmail.data.id, { currency: selectedCurrency }))
        if (userInfo && userInfo.data)
          dispatch(getOrganisation(userInfo.data.email));
        if (response.status === 200)
          setOpenSelectPaymentModal(true);
        else
          failureAlert("Something went wrong!");
      }
      else
        setOpenSelectPaymentModal(true);
    } else {
      setTouched({ GSTIN: true, country: true, name: true, phoneNumber: true });
      setSubmitClicked(true);
    }
  };
  useEffect(() => {
    const callBack = async () => {
      if (submitClicked && JSON.stringify(validate()) === JSON.stringify({ name: "", country: "", GSTIN: "", phoneNumber: "", })) {
        setSubmitClicked(false);
        var resStatus = await dispatch(addOrgDetails({ ...orgDetails, currency: selectedCurrency }));

        if (resStatus === 200) {
          setOpenSelectPaymentModal(true);
          dispatch(getOrganisation(userInfo.data.email));

        }
        if (resStatus && resStatus.status === 400 && resStatus.data.message === 'ORGANIZATION_ALREADY_EXIST') {
          setOrgNameError("Organisation Name Already Exists.");
          setOpenSelectPaymentModal(false);
        }
        if (resStatus && resStatus.status === 400 && resStatus.data.message === 'ORGANIZATION_IS_DELETED') {
          setOrgNameError("Organisation is Deleted.");
          setOpenSelectPaymentModal(false);
        }

      } else {
        setSubmitClicked(false);
      }
    }
    callBack();
  }, [touched, submitClicked]);

  useEffect(() => {
    if (
      (GetOrganisation && GetOrganisation.loading) ||
      (fileUpload && fileUpload.loading) ||
      (UserInfo && UserInfo.loading) ||
      (AddOrgDetails && AddOrgDetails.loading) ||
      (GetPlanDetails && GetPlanDetails.loading) ||
      (userSignin && userSignin.loading) ||
      (OfflinePaymentCheckout && OfflinePaymentCheckout.loading) ||
      (UpdateOrganisation && UpdateOrganisation.loading)
    ) {
      setLoaded(false);
    }
    else {
      setLoaded(true);
    }
  }, [GetOrganisation, fileUpload, UserInfo, GetPlanDetails, userSignin, OfflinePaymentCheckout, AddOrgDetails, UpdateOrganisation])

  return (
    <div className="plans-wrapper premium-wrapper">
      <LoadingComponent loaded={loaded} />
      <div className="plans-heading">
        <div className="premium-plan">
          <div className="back-arrow">
            <img src={arrowback} alt="back" onClick={handleBackClick} />
          </div>
          <div className="premium-desc">
            <h5>Organisation Details</h5>
            <span>Fill the below details</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="organisationdetail">
          <div className="organisationdetail-left">
            <div className="account-upload">
              <div className="account-profile-name">
                <div className="account-profile">
                  <img
                    src={orgDetails.companyLogo ? S3_BASE_URL + orgDetails.companyLogo : ExtraMilePlay}
                    alt="profile"
                  />
                </div>
              </div>
              {!disabledOrg && <div className="cstm-upload-btn">
                <label className="upload-btn">
                  <input
                    type="file"
                    onChange={fileChanged}
                    disabled={disabledOrg}
                    accept="image/x-png,image/jpg,image/jpeg"
                  />
                  <span>
                    <img src={upload} alt="upload" />
                    Update New Pic
                  </span>
                </label>
                <button
                  type="button"
                  className={`btn btn-remove ${orgDetails.companyLogo ? "" : "disabled"}`}
                  onClick={removeLogo}
                  disabled={disabledOrg}
                >
                  <img src={remove} alt="remove" />
                  Remove
                </button>
              </div>}
            </div>
            <div className="form-group">
              <label htmlFor="orgname">Organisation Name *</label>
              <input
                type="text"
                className="form-control"
                id="orgname"
                name="name"
                value={orgDetails.name}
                required
                disabled={disabledOrg}
                onBlur={() => {
                  setTouched((prevState) => ({ ...prevState, name: true }));
                }}
                onChange={handleChange}
              />
              <div className="error-message">{errors.name}</div>
              <div className="error-message">{orgNameError}</div>
            </div>
            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <Select
                placeholder="Choose a Country"
                classNamePrefix="react-select"
                className="form-select"
                options={countriesData}
                name="country"
                isDisabled={disabledOrg}
                value={{ value: orgDetails.country, label: orgDetails.country }}
                onBlur={() => {
                  setTouched((prevState) => ({ ...prevState, country: true }));
                }}
                onChange={(e) => handleSelector(e, "country")}
              ></Select>
              <div className="error-message">{errors.country}</div>
            </div>
            <div className="form-group">
              <label htmlFor="gstin">
                {orgDetails.country !== ""
                  ? orgDetails.country === "India"
                    ? "GSTIN/ Tax Identification Number"
                    : "Tax Identification Number"
                  : "GSTIN/ Tax Identification Number"}
              </label>
              <input
                type="text"
                className="form-control"
                id="gstin"
                disabled={disabledOrg}
                value={orgDetails.GSTIN}
                name="GSTIN"
                placeholder="Ex: 06BZAHM6385P6Z2"
                onBlur={() => {
                  setTouched((prevState) => ({ ...prevState, GSTIN: true }));
                }}
                onChange={handleChange}
              />
              <div className="error-message">{errors.GSTIN}</div>
            </div>

            <div className="form-group form-fit">
              <label htmlFor="mobilenumber">Mobile Number *</label>
              <PhoneInput
                type="text"
                className="form-control"
                id="mobilenumber"
                disabled={disabledOrg || disablePhone}
                value={orgDetails.phoneNumber}
                name="phoneNumber"
                enableLongNumbers
                placeholder="+91 98765-43210"
                country="in"
                onChange={(val, country, e, formattedValue) => {
                  if (country && (country.format && formattedValue && formattedValue.length === country.format.length) || (val.length <= country.dialCode.length))
                    setValidPhone(true);
                  else
                    setValidPhone(false);
                  if (val.length <= country.dialCode.length)
                    setDisablePhone(false);
                  setOrgDetails((prevState) => ({
                    ...prevState,
                    phoneNumber: val
                  }))
                }}
                isValid={(value, country) => {
                  // var formatData = country && country.format.replace(" ", "").replace("+", "").replace("-", "").replace("(", "").replace(")", "").replace(" ", "");
                  // if (value && value.length != 0 && (value && value.length) != formatData.length) {
                  //   setValidPhone(false)
                  //   return false;
                  // } else if (value && value.length === 0) {
                  //   setValidPhone(true)
                  //   return true;
                  // } else {
                  //   setValidPhone(true)
                  //   return true;
                  // }
                }}
                inputProps={{

                  required: true,

                }}
                onBlur={() => {
                  setTouched((prevState) => ({ ...prevState, phoneNumber: true }));
                }}
              />
              <div className="error-message">{errors.phoneNumber}</div>
            </div>
          </div>
          <div className="organisationdetail-right">
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
                      {SYMBOLS[selectedCurrency] + " "}
                      {props.selectedPlanDetails &&
                        priceFormatIndianLocale.format(Math.round(props.selectedPlanDetails.data.prices?.[selectedCurrency]))}
                    </h5>
                  </div>
                  {/* <div className="premium-review-card">
                    <span>GST 18%</span>
                    <h5>
                      {SYMBOLS[selectedCurrency] + " "}
                      {props.selectedPlanDetails &&
                        priceFormatIndianLocale.format(Math.round(parseFloat(props.selectedPlanDetails.data.prices?.[selectedCurrency]) * 0.18))}
                    </h5>
                  </div> */}
                </div>
                <div className="premium-total">
                  <span>Total to be paid</span>
                  <h5>
                    {SYMBOLS[selectedCurrency] + " "}
                    {props.selectedPlanDetails &&
                      // priceFormatIndianLocale.format(Math.round(parseFloat(props.selectedPlanDetails.data.prices?.[selectedCurrency]) * 1.18))}
                      priceFormatIndianLocale.format(Math.round(parseFloat(props.selectedPlanDetails.data.prices?.[selectedCurrency])))}
                  </h5>
                </div>
                <div className="premium-button">
                  <button
                    type="submit"
                    className={`btn btn-primary ${orgDetails.name === "" || orgDetails.country === "" || orgDetails.phoneNumber === ""
                      ? "disabled"
                      : ""
                      }`}
                    disabled={
                      orgDetails.name === "" || orgDetails.country === "" || orgDetails.phoneNumber === ""
                        ? true
                        : false
                    }
                  >
                    Pay Securely
                  </button>

                  <span>You agree with our <Link to={"/terms"} style={{ display: "inline-block" }}>T&C</Link> and <Link to={"/privacy-policy"} style={{ display: "inline-block" }}>TP</Link>.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      {openSelectPaymentModal && (
        <SelectPaymentModal
          toggle={openSelectPaymentModal}
          modalid="payment"
          setOpenSelectPaymentModal={setOpenSelectPaymentModal}
          setOpenPaymentSuccessModal={setOpenPaymentSuccessModal}
          selectedPlanId={
            props.selectedPlanDetails && props.selectedPlanDetails.data.id
          }
          orgName={orgDetails.name}
          phoneNumber={orgDetails.phoneNumber}
          // amount={props.selectedPlanDetails && Math.round(parseFloat(props.selectedPlanDetails.data.prices?.[selectedCurrency] * 1.18))}
          amount={props.selectedPlanDetails && Math.round(parseFloat(props.selectedPlanDetails.data.prices?.[selectedCurrency]))}
          setOfflinePayment={setOfflinePayment}
          orgDetails={orgDetailsByEmail}
        />
      )}
      {openPaymentSuccessModal && (
        <PaymentSuccessModal
          po
          toggle={openPaymentSuccessModal}
          setOpenPaymentSuccessModal={setOpenPaymentSuccessModal}
          offlinePayment={offlinePayment}
        />
      )}
    </div>
  );
};

export default OrganisationDetailsCard;
