import React from 'react';

import './modal.css';
import Modal from './modal';
import { useState } from 'react';
import submit from '../../assets/images/submit.gif';
import PhoneInput from 'react-phone-input-2';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addDemoRequest } from '../../redux/actions/commonActions';
import { failureAlert } from '../../helpers/helper';
import { ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const DemoRequestModal = ({ modalid, toggle, setOpenDemoRequestModal, thankonly }) => {
    const dispatch = useDispatch();
    let query = useQuery();

    const [details, setDetails] = useState({
        email: "",
        phoneNumber: ""
    })
    const [touched, setTouched] = useState({
        email: false,
        phoneNumber: false
    })
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [validPhone, setValidPhone] = useState(true);
    const [dialCodeLength, setDialCodeLength] = useState(0);
    const [submitClicked, setSubmitClicked] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prevState => ({
            ...prevState,
            [name]: true
        }));
    }
    const confirmHandler = () => {
        setTouched({ email: true, phoneNumber: true });
        setSubmitClicked(true);
    }
    useEffect(() => {
        const callback = async () => {
            if (submitClicked) {
                if (JSON.stringify(validate()) === JSON.stringify({ email: "", phoneNumber: "" })) {
                    let phone = "";
                    if (details.phoneNumber !== "" && details.phoneNumber.length > dialCodeLength)
                        phone = details.phoneNumber;
                    let source = "";
                    if (query.get("utm_source"))
                        source = query.get("utm_source")
                    const response = await dispatch(addDemoRequest({ emailId: details.email, phone, source }));
                    if (response === 200) {
                        setFormSubmitted(true);
                        localStorage.setItem("demoRequest", JSON.stringify("success"));
                    }
                    else
                        failureAlert("Something went wrong! Try again later.");
                }
                setSubmitClicked(false);
            }
        }
        callback();
    }, [submitClicked])
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    const validate = () => {
        const error = {
            email: "",
            phoneNumber: ""
        }
        if (touched.email && !validateEmail(details.email))
            error.email = "Please enter valid email";
        if (touched.phoneNumber && !validPhone)
            error.phoneNumber = "Please enter valid phone number";
        return error;
    }
    const errors = validate();

    return (
        <Modal modalid={modalid} toggle={toggle}>
            <div className="modal-body">
                <ToastContainer position='bottom-center' />
                <div className="demo-modal-body">
                    <div className="close-icon" data-dismiss="modal" aria-label="Close">
                        <div className="close-btn-icon" onClick={() => setOpenDemoRequestModal(false)}></div>
                    </div>
                    {
                        formSubmitted || thankonly ?
                            <div className="contact-extramile">
                                <img src={submit} alt="msg" />
                                <h5>Thank you for sharing your details. </h5>
                                <span>Our team will connect with you asap. If you would like to reach us directly, call us at <a className='phone' href='tel:+919137514336'>+91 9137514336</a></span>
                            </div>
                            :
                            <>
                                <p>Would you like to understand PLAY better? Schedule a DEMO or request a callback now.</p>
                                <form onSubmit={(e) => { e.preventDefault() }}>
                                    <div className="form-group">
                                        <label htmlFor="">Official Email Id *</label>
                                        <input type="email" className="form-field" name='email' placeholder='Enter your official email ID' onChange={handleChange} value={details.email} onBlur={handleBlur} />
                                        <div className="error-message">{errors.email}</div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">Phone Number</label>
                                        <PhoneInput
                                            type="numbers"
                                            name="phoneNumber"
                                            enableLongNumbers
                                            placeholder="Enter your phone number"
                                            country="in"
                                            onChange={(val, country, e, formattedValue) => {
                                                if (country && country.dialCode)
                                                    setDialCodeLength(country.dialCode.length);
                                                if (country && ((country.format && formattedValue && formattedValue.length === country.format.length) || (val.length <= country.dialCode.length)))
                                                    setValidPhone(true);
                                                else
                                                    setValidPhone(false);
                                                setDetails((prevState) => ({
                                                    ...prevState,
                                                    phoneNumber: val
                                                }))
                                            }}
                                            onBlur={() => handleBlur({ target: { name: "phoneNumber" } })} value={details.phoneNumber} id="phoneNo" />
                                        <div className="error-message">{errors.phoneNumber}</div>
                                    </div>
                                    <div className="btn-grp">
                                        <button className="btn btn-secondry" onClick={() => setOpenDemoRequestModal(false)}>Cancel</button>
                                        <button className="btn btn-primary" onClick={confirmHandler}>Request a callback</button>
                                    </div>
                                </form>
                            </>
                    }
                </div>
            </div>
        </Modal>
    );
};
export default DemoRequestModal;
