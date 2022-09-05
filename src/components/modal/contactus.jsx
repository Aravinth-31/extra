import React, { useEffect, useState } from 'react';

import './modal.css';
import Modal from './modal';
import contactusimg from '../../assets/images/contactus.svg';
import { useDispatch, useSelector } from 'react-redux';
import { plansContactUs } from '../../redux/actions/plansApiActions';
import { contactOrgAdmin } from '../../redux/actions/organisationActions';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import LoadingComponent from '../loader/LoadingComponent';

const ContactUsModal = ({ modalid, setOpenContactModal, setOpenThankyouModal, toggle, admin, orgId }) => {
  const [details, setDetails] = useState({
    name: "",
    email: "",
    mobile: "",
    organizationName: "",
    message: ""
  })
  const [disabled, setDisabled] = useState({
    name: false,
    email: false,
    mobile: false,
    organizationName: false,
  })
  const dispatch = useDispatch();
  const [touched, setTouched] = useState({ name: false, organizationName: false, email: false, mobile: false });
  const [submitClicked, setSubmitClicked] = useState(false);
  const [validPhone, setValidPhone] = useState(true);
  const [loaded, setLoaded] = useState(true);

  const UserInfo = useSelector(state => state.getUser);
  const { userInfo } = UserInfo;
  const OrgDetailsByEmail = useSelector(state => state.getOrganisation);
  const { orgDetailsByEmail } = OrgDetailsByEmail;
  const ContactOrgAdmin = useSelector(state => state.contactOrgAdmin);
  const PlansContactUsInfo = useSelector(state => state.plansContactUsInfo);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const format = /^[0-9]+$/
    if (name === "mobile" && value !== "" && !format.test(value))
      return;
    setDetails(prevState => ({
      ...prevState,
      [name]: name === "name" || name === "organizationName" ? value.replace(/  +/g, ' ') : value
    }));
  }
  const handleBlur = (e) => {
    setTouched(prevState => ({
      ...prevState,
      [e.target.name]: true
    }));
  }

  useEffect(() => {
    if (userInfo && userInfo.data) {

      const { email, firstName, phoneNumber } = { firstName: "", email: "", phoneNumber: "" };
      setDetails(prevState => ({
        ...prevState,
        name: firstName,
        email: email,
      }));
      setDisabled(prevState => ({
        ...prevState,
        name: firstName ? true : false,
        email: email ? true : false,

      }))
      if (phoneNumber && phoneNumber !== '') {
        setDetails(prevState => ({
          ...prevState,

          mobile: phoneNumber
        }));
        setDisabled(prevState => ({
          ...prevState,

          mobile: phoneNumber ? true : false
        }))
      }
    }
  }, [userInfo]);
  useEffect(() => {

    if (orgDetailsByEmail && orgDetailsByEmail.data) {
      setDetails(prevState => ({
        ...prevState,
        organizationName: orgDetailsByEmail.data.name,
      }))
      setDisabled(prevState => ({
        ...prevState,
        organizationName: orgDetailsByEmail?.data?.name ? true : false,
      }))
    }
  }, [orgDetailsByEmail])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (admin) {
      setTouched({ name: true, email: true, });
      setSubmitClicked(true);
    } else {
      setTouched({ name: true, organizationName: true, email: true, mobile: true });
      setSubmitClicked(true);
    }
  }

  //handling contact us submit
  useEffect(() => {
    async function callBack() {
      const closeBtn = document.getElementById("close-icon");
      if (submitClicked && JSON.stringify(validate()) === JSON.stringify({ name: "", organizationName: "", email: "", mobile: "" })) {
        setSubmitClicked(false);
        if (admin) {
          await dispatch(contactOrgAdmin(orgId, details));
        } else {
          await dispatch(plansContactUs(details));
        }
        setDetails({ name: "", email: "", mobile: "", organizationName: "", message: "" });
        setTouched({ name: false, organizationName: false, email: false });
        setOpenThankyouModal(true);
        closeBtn.click();
      }
    }
    callBack();
  }, [touched, submitClicked]);

  useEffect(() => {
    if (
      (PlansContactUsInfo && PlansContactUsInfo.loading) ||
      (ContactOrgAdmin && ContactOrgAdmin.loading)
    ) {
      setLoaded(false);
    }
    else
      setLoaded(true);
  }, [PlansContactUsInfo, ContactOrgAdmin]);

  const validate = () => {
    const error = { name: "", organizationName: "", email: "", mobile: "" }
    const nameFormat = /^[a-zA-Z][a-zA-Z\. ]{2,14}$/;
    if (touched.name && !nameFormat.test(details.name))
      error.name = "Please enter valid name";
    const emailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})$/;
    if (touched.email && !emailFormat.test(details.email))
      error.email = "Please enter valid email";
    const orgNameFormat = /^[a-zA-Z][a-zA-Z0-9\'\@\$\&\. ]{2,19}$/;
    if (touched.organizationName && !orgNameFormat.test(details.organizationName))
      error.organizationName = "Please enter valid organization name";
    if (touched.mobile && !validPhone)
      error.mobile = "Please enter valid mobile number";
    return error
  }
  const errors = validate();
  return (
    <Modal modalid={modalid} toggle={toggle}>
      <div className={`modal-body contact-wrapper ${loaded ? "" : "loading"}`}>
        <LoadingComponent loaded={loaded} />
        <div className="close-icon" id='close-icon' data-dismiss="modal" aria-label="Close" onClick={() => setOpenContactModal(false)}>
          <div className="close-btn-icon"></div>
        </div>
        <div className="contact-modal contact-us">
          <div className="contact-heading">
            <h5>Contact Us</h5>
            <span style={{ marginBottom: "10px" }}>Let’s get in touch today</span>
          </div>
          <div className="contact-form-wrapper">
            <div className="contact-left">
              <img src={contactusimg} alt="contact us" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="contact-form">
                <div className="form-group form-50">
                  <label htmlFor="name">Name *</label>
                  <input type="text" className={`form-control ${disabled.name ? "disabled" : ""}`} value={details.name} required disabled={disabled.name} onChange={handleChange} onBlur={handleBlur} id="name" name="name" />
                  <div className="error-message">{errors && errors.name}</div>
                </div>
                <div className="form-group form-50">
                  <label htmlFor="email">Email Id *</label>
                  <input type="email" className={`form-control ${disabled.email ? "disabled" : ""}`} value={details.email} required disabled={disabled.email} onChange={handleChange} onBlur={handleBlur} id="email" name="email" />
                  <div className="error-message">{errors && errors.email}</div>
                </div>
                {!admin ? <><div className="form-group form-50">
                  <label htmlFor="mobilenumber">Phone Number</label>
                  <PhoneInput
                    type="numbers"
                    id="mobilenumber"
                    value={details.mobile}
                    disabled={disabled.mobile}
                    name="mobile"
                    enableLongNumbers
                    placeholder="+91 98765-43210"
                    country="in"
                    onChange={(val, country, e, formattedValue) => {
                      if (country && (country.format && formattedValue && formattedValue.length === country.format.length) || (val.length <= country.dialCode.length))
                        setValidPhone(true);
                      else
                        setValidPhone(false);
                      setDetails(prevState => ({
                        ...prevState,
                        mobile: val
                      }))
                    }}
                  />
                  <div className="error-message">{errors && errors.mobile}</div>
                </div>
                  <div className="form-group form-50">
                    <label htmlFor="orgname">Organisation Name *</label>
                    <input type="text" className={`form-control ${disabled.organizationName ? "disabled" : ""}`} id="orgname" required disabled={disabled.organizationName} value={details.organizationName} onChange={handleChange} onBlur={handleBlur} name="organizationName" />
                    <div className="error-message">{errors && errors.organizationName}</div>
                  </div></> : null}
                <div className="form-group form-fit">
                  <label htmlFor="msg">Message</label>
                  <textarea className="form-control" value={details.message} onChange={handleChange} placeholder={"Enter a message less than 300 characters"} id="msg" name="message" maxLength={300} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default ContactUsModal;