import React, { useEffect, useState } from 'react';

import './account.css';
import '../gametitledetails/gametitledetails.css';
import '../customedesigntab/customedesigntab.css';
// image
import remove from '../../assets/images/remove.svg';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, update, logOut } from '../../redux/actions/userAction';
import { changeActingOwner, uploadFile } from '../../redux/actions/commonActions';
import { Link } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getOrganisation } from '../../redux/actions/plansApiActions';
import ExtraMilePlay from '../../assets/images/ExtramilPlay.png';
import ROLES, { OrgRoles } from '../../helpers/userTypes';
import { getAllOrganisations, leaveOrganisation, updateOrganisation } from '../../redux/actions/organisationActions';
import SaveAccountChanges from '../modal/saveAccountChanges';
import * as ActionTypes from "../../redux/constants/commonApiConstants";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { failureAlert, S3_BASE_URL, successAlert } from '../../helpers/helper';
import LoadingComponent from '../loader/LoadingComponent';
import Select from "react-select";
import { COLOR_OPTIONS } from '../../helpers/colorsoptions';


const SelectItem = ({ data }) => {
  if (true)
    return (
      <div className="select-item">
        <span style={{ color: data.code }}>{data.label}</span>
        <div className="color-box" style={{ background: data.code }}></div>
      </div>
    )
  else
    return (
      <div />
    )
}

const Account = (props) => {
  const UserInfo = useSelector(state => state.getUser)
  const { userInfo } = UserInfo;
  const OrgDetailsByEmail = useSelector(state => state.getOrganisation);
  const { orgDetailsByEmail } = OrgDetailsByEmail;
  const fileUpload = useSelector(state => state.uploadedFile);
  const { uploadedFile } = fileUpload;
  const userUpdate = useSelector(state => state.userUpdate);
  const UpdateOrganisation = useSelector(state => state.updateOrganisation);
  const LeaveOrganisation = useSelector(state => state.leaveOrganisation);
  const AllOrganisationData = useSelector(state => state.allOrganisationData);
  const { allOrganisationData } = AllOrganisationData;
  const ChangedActingOwner = useSelector(state => state.actingOwnerChanged);

  const [loaded, setLoaded] = useState(true);
  const [role, setRole] = useState("");
  const [openSaveAccountChangesModal, setOpenSaveAccountChangesModal] = useState(false);
  const [enableSave, setEnableSave] = useState(false);
  const [validPhone, setValidPhone] = useState(true);
  const [prevDetails, setPrevDetails] = useState({
    fname: "",
    lname: "",
    organizationName: "",
    email: "",
    phoneNumber: "",
    companyLogo: ""

  });
  const [touched, setTouched] = useState({
    fname: false, lname: false, phoneNumber: false
  })
  const [userDetails, setUserDetails] = useState({
    fname: "",
    lname: "",
    organizationName: "",
    email: "",
    phoneNumber: "",
    companyLogo: "",
    colourAccent: null
  });
  const [organisationOptions, setOrganisationOptions] = useState([]);
  const [selectedOrganisation, setSelectedOrganisation] = useState("");
  const [previousSelectedOrganisation, setPreviousSelectedOrganisation] = useState("");

  useEffect(() => {
    if (JSON.stringify(prevDetails) !== JSON.stringify(userDetails)) {
      setEnableSave(true)
    }
    else {
      setEnableSave(false)
    }
  }, [userDetails, prevDetails]);

  useEffect(() => {
    if (orgDetailsByEmail && orgDetailsByEmail.data) {
      let colourAccent = null;
      if (orgDetailsByEmail.data.colourAccent) {
        COLOR_OPTIONS.forEach(item => {
          if (item.code === orgDetailsByEmail.data.colourAccent)
            colourAccent = item;
        })
      }
      setUserDetails(prevState => ({
        ...prevState,
        organizationName: orgDetailsByEmail.data.name || "",
        companyLogo: orgDetailsByEmail.data.companyLogo || "",
        colourAccent: colourAccent
      }))
      setPrevDetails(prevState => ({
        ...prevState,
        organizationName: orgDetailsByEmail.data.name || "",
        companyLogo: orgDetailsByEmail.data.companyLogo || "",
        colourAccent: colourAccent
      }))
      setSelectedOrganisation({ value: orgDetailsByEmail.data.name, label: orgDetailsByEmail.data.name, id: orgDetailsByEmail.data.id });
      setPreviousSelectedOrganisation({ value: orgDetailsByEmail.data.name, label: orgDetailsByEmail.data.name, id: orgDetailsByEmail.data.id });
    }
  }, [orgDetailsByEmail]);

  useEffect(() => {
    if (
      (userUpdate && userUpdate.loading) ||
      (fileUpload && fileUpload.loading) ||
      (UserInfo && UserInfo.loading) ||
      (UpdateOrganisation && UpdateOrganisation.loading) ||
      (LeaveOrganisation && LeaveOrganisation.loading) ||
      (AllOrganisationData && AllOrganisationData.loading) ||
      (ChangedActingOwner && ChangedActingOwner.loading)
    )
      setLoaded(false)
    else {
      setLoaded(true);
    }
  }, [userUpdate, fileUpload, UserInfo, UpdateOrganisation, LeaveOrganisation, AllOrganisationData, ChangedActingOwner]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!userInfo)
      dispatch(getUser());
    return (() => {
      dispatch({ type: ActionTypes.FILE_UPLOAD_SUCCESS, payload: null, });
    })
  }, []);

  useEffect(() => {
    if (role === ROLES.EXTRAMILE_SUPERADMIN) {
      dispatch(getAllOrganisations(""));
      dispatch(getOrganisation("mihir@extramile.in"));
    }
  }, [role])
  useEffect(() => {
    if (allOrganisationData && allOrganisationData.data && allOrganisationData.data.allOrganisationDetails) {
      const list = allOrganisationData.data.allOrganisationDetails.map(org => {
        return { label: org.organizationName, value: org.organizationName, id: org.organizationId }
      })
      setOrganisationOptions(list);
    }
  }, [allOrganisationData])
  useEffect(() => {
    if (uploadedFile && uploadedFile.data) {
      setUserDetails(prevState => ({
        ...prevState,
        companyLogo: uploadedFile.data.path
      }))
    }
  }, [uploadedFile]);
  useEffect(() => {
    if (userInfo && userInfo.data) {
      const { email, firstName, lastName, phoneNumber, role } = userInfo.data;
      setUserDetails(prevState => ({
        ...prevState,
        fname: firstName || "",
        lname: lastName || "",
        email,
        phoneNumber: phoneNumber || ""
      }));
      setPrevDetails(prevState => ({
        ...prevState,
        fname: firstName || "",
        lname: lastName || "",
        email,
        phoneNumber: phoneNumber || ""
      }));
      setRole(role);
      if (OrgRoles.includes(role)) {
        dispatch(getOrganisation(email));
      }
    }
  }, [userInfo]);

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
    else {
      failureAlert("File Format Not Allowed");
    }
  }
  const removeLogo = () => {
    if (!userDetails.companyLogo)
      return;
    setUserDetails(prevState => ({
      ...prevState,
      companyLogo: null
    }));
    dispatch({
      type: ActionTypes.FILE_UPLOAD_SUCCESS,
      payload: null
    })
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    const format = /^[A-Z]+$/i;
    if (
      value !== "" &&
      (((name === "fname" || name === "lname") && !format.test(value)) ||
        (value.length > 20))
    )
      return;
    setUserDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  }
  const handleBlur = (e) => {
    setTouched(prevState => ({ ...prevState, [e.target.name]: true }))
  }
  const updateChanges = async (e) => {
    e.preventDefault();
    if (JSON.stringify(validateDetails()) !== JSON.stringify({ fname: "", lname: "", phoneNumber: "" }))
      return;
    const { lname, fname, phoneNumber, companyLogo, colourAccent } = userDetails;
    const details = { firstName: fname, lastName: lname, phoneNumber };
    const { email } = userInfo.data;
    const responsecode = await dispatch(update(details.email, details));
    if (responsecode === 200) {
      if ((role === ROLES.ORG_ADMIN || role === ROLES.ORG_SUPER_ADMIN) && orgDetailsByEmail && orgDetailsByEmail.data) {
        const reponseUpdate = await dispatch(updateOrganisation(orgDetailsByEmail.data.id, { companyLogo, colourAccent: colourAccent && colourAccent.code }));
        if (reponseUpdate && reponseUpdate.status === 200) {
          dispatch(getUser());
          dispatch(getOrganisation(email));
          successAlert('Profile Updated Successfully !');
        }
      }
      else {
        dispatch(getUser());
        successAlert('Profile Updated Successfully !');
      }
      setOpenSaveAccountChangesModal(false);
    }
  }
  const LeaveOrganisationFunction = async (e) => {
    e.preventDefault();
    const responsecode = await dispatch(leaveOrganisation());
    if (responsecode === 200) {

      await dispatch(getUser());
      // successAlert("'Leaved Organization Successfully !'")
      await dispatch(logOut());
      await props.history.push('/');
    }
  }

  const validateDetails = () => {
    const inputErrors = {
      fname: "", lname: "", phoneNumber: ""
    }
    if (touched.fname && userDetails.fname === "")
      inputErrors.fname = "Please enter valid first name"
    if (touched.lname && userDetails.lname === "")
      inputErrors.lname = "Please enter valid last name"
    if (touched.phoneNumber && !validPhone)
      inputErrors.phoneNumber = "Please enter valid phone number";

    return inputErrors;

  }

  const submitActingOwnerChange = async () => {
    if (JSON.stringify(previousSelectedOrganisation) === JSON.stringify(selectedOrganisation))
      return;
    const response = await dispatch(changeActingOwner(selectedOrganisation.id));
    if (response === 200)
      successAlert("Updated Successfully");
    else
      failureAlert("Something went wrong!");
  }

  var errors = validateDetails();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (JSON.stringify(validateDetails()) === JSON.stringify({ fname: "", lname: "", phoneNumber: "" })) {
      setOpenSaveAccountChangesModal(true);
    }
  }
  const changetheme = (e) => {
    setUserDetails(prevState => ({
      ...prevState,
      colourAccent: e
    }));
  }
  return (
    <div className={loaded ? "myaccount-wrapper" : "myaccount-wrapper loading"} id="myaccount-element">
      <ToastContainer position="bottom-center" />
      <LoadingComponent loaded={loaded} />
      {openSaveAccountChangesModal && <SaveAccountChanges toggle={openSaveAccountChangesModal} modalId="Account changes" updateChanges={updateChanges} setOpenSaveAccountChangesModal={setOpenSaveAccountChangesModal} />}
      <div className="myaccount-heading">
        <h5>My {role === ROLES.EMPLOYEE || role === ROLES.USER ? "Account" : "Details"}</h5>

        <div className={role === "ORG_SUPER_ADMIN" || role === "ORG_ADMIN" ? "account-upload" : "account-upload hide"}>
          <div className='upload-group'>
            <div className="account-profile-name">
              <div className="account-profile">
                <img src={userDetails.companyLogo ? S3_BASE_URL + userDetails.companyLogo : ExtraMilePlay} alt="logo" />
              </div>
              <span>Company Logo</span>
            </div>
            <div className="cstm-upload-btn">
              <label className="upload-btn">
                <input type="file" onChange={fileChanged} accept="image/x-png,image/jpg,image/jpeg" />
                <span>
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.66797 11.8333V13.1666C2.66797 13.5202 2.80844 13.8593 3.05849 14.1094C3.30854 14.3594 3.64768 14.4999 4.0013 14.4999H12.0013C12.3549 14.4999 12.6941 14.3594 12.9441 14.1094C13.1942 13.8593 13.3346 13.5202 13.3346 13.1666V11.8333" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.66797 6.50011L8.0013 3.16678L11.3346 6.50011" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 3.16678V11.1668" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Update New Pic
                </span>
              </label>
              <button type="submit" className={`btn btn-remove ${userDetails.companyLogo ? "" : "disabled"}`} onClick={removeLogo}>
                <img src={remove} alt="remove" />
                Remove
              </button>
            </div>
          </div>
          {
            role === ROLES.ORG_SUPER_ADMIN &&
            <div className="color-change">
              <div className="form-group">
                <label htmlFor="">Change Color Accent</label>
                <Select
                  classNamePrefix="react-select"
                  className="form-select"
                  options={COLOR_OPTIONS}
                  onChange={(e) => changetheme(e)}
                  menuPlacement={"auto"}
                  placeholder="Select Color"
                  value={userDetails.colourAccent}
                  formatOptionLabel={function (data) {
                    return (
                      <SelectItem data={data} />
                    );
                  }} />
              </div>
            </div>
          }
        </div>
      </div>
      {/* form */}
      <form>
        <div className="account-form">
          <div className="form-group form-50">
            <label htmlFor="firstName">First Name *</label>
            <input type="text" className="form-control" name="fname" onChange={handleChange} onBlur={handleBlur} value={userDetails.fname} id="firstName" required />
            <div className="error-message">{errors.fname}</div>
          </div>
          <div className="form-group form-50">
            <label htmlFor="lastName">Last Name *</label>
            <input type="text" className="form-control" name="lname" onChange={handleChange} onBlur={handleBlur} value={userDetails.lname} id="lastName" required />
            <div className="error-message">{errors.lname}</div>
          </div>
          <div className="form-group form-50">
            <label htmlFor="emailId">Email Id</label>
            <input type="email" className="form-control" name="email" onChange={handleChange} disabled value={userDetails.email} id="emailId" />
          </div>
          <div className="form-group form-50">
            <label htmlFor="phoneNo">Phone Number</label>
            <PhoneInput
              type="numbers"
              className="form-control"
              name="phoneNumber"
              enableLongNumbers
              placeholder="+91 98765-43210"
              country="in"
              onChange={(val, country, e, formattedValue) => {
                if (country && ((country.format && formattedValue && formattedValue.length === country.format.length) || (val.length <= country.dialCode.length)))
                  setValidPhone(true);
                else
                  setValidPhone(false);
                setUserDetails((prevState) => ({
                  ...prevState,
                  phoneNumber: val
                }))
              }}
              onBlur={() => handleBlur({ target: { name: "phoneNumber" } })} value={userDetails.phoneNumber} id="phoneNo" />
            <div className="error-message">{errors.phoneNumber}</div>
          </div>
          <div className={role === "EMPLOYEE" ? "form-group form-fit" : "form-group form-fit hide"}>
            <label htmlFor="orgName">Organisation Name</label>
            <input type="text" className="form-control" name="organizationName"
              onBlur={handleBlur}
              onChange={handleChange}
              value={userDetails.organizationName}
              disabled
              id="orgName"
            />
          </div>
          <div className="account-btn-group">
            <Link to="/"><button type="submit" className="btn btn-outline">Cancel</button></Link>
            <Link to={"#"} onClick={(e) => (enableSave && handleSubmit(e))}><button type="submit" className={enableSave ? "btn btn-primary" : "btn btn-primary disabled"}>Save Changes</button></Link>
          </div>
          <div className={role === "EMPLOYEE" ? "leave-container" : "leave-container hide"}>
            <hr /><br />
            <div className="leave">
              <h4>Exiting the platform</h4>
              <button className="btn btn-outline" onClick={(e) => LeaveOrganisationFunction(e)}>Leave Organisation</button>
            </div>
          </div>
        </div>
      </form>
      {
        role === ROLES.EXTRAMILE_SUPERADMIN &&
        <div className="common-owner-container">
          <h5>Acting Owner</h5>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="">mihir@extramile.in</label>
              <Select
                classNamePrefix="react-select"
                className="form-select"
                options={organisationOptions}
                onChange={(e) => setSelectedOrganisation(e)}
                menuPlacement={"auto"}
                placeholder="Select Organisation"
                value={selectedOrganisation}
              />
            </div>
            <button className={`btn btn-primary ${JSON.stringify(previousSelectedOrganisation) === JSON.stringify(selectedOrganisation) ? "disabled" : ""}`} onClick={submitActingOwnerChange}>Change</button>
          </form>
        </div>
      }
    </div>
  );
};

export default Account;
