import React from "react";
import Modal from "./modal";
import "./tablemodal.css";
import "./modal.css"
import { useState } from "react";
import { useEffect } from "react";
import { BASE_URL } from "../../helpers/helper";

const PaymentDetailsModal = ({ details, toggle, setOpenDetailsModal, verify, verifyPayment }) => {

    const [touched, setTouched] = useState({ GSTIN: false });
    const [transactionDetails, setTransactionDetails] = useState({
        transactionId: "",
        comments: "",
        GSTIN: ""
    });
    useEffect(() => {
        setTransactionDetails((prevState) => ({ ...prevState, transactionId: details.transactionId }));
        if (details.GSTIN) {
            setTransactionDetails((prevState) => ({ ...prevState, GSTIN: details.GSTIN }));
        } else {
            setTransactionDetails((prevState) => ({ ...prevState, GSTIN: "" }));
        }

    }, [details]);
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setTransactionDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prevState) => ({
            ...prevState,
            [name]: true,
        }));
    };
    const validateInput = (payment) => {
        const error = {
            GSTIN: "",
        };
        if (touched.GSTIN && payment.GSTIN.length === 0)
            error.GSTIN = "*GSTIN should be Provided";
        const gstinFormat = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (touched.GSTIN && payment.GSTIN.length > 0 && !gstinFormat.test(payment.GSTIN)) {
            error.GSTIN = "Please enter valid GSTIN"
        }

        return error;
    }
    let errorMessage = validateInput(transactionDetails);

    return (
        <Modal modalid={"payment-details-modal"} toggle={toggle}>
            <div className="modal-body payment-details-modal">
                <div className="thankyou-body failer payment-details">
                    <div className={verify ? "details-section-wrapper verify" : "details-section-wrapper"}>
                        <div className="title">
                            <h4>Payment Details</h4>
                            <img src={BASE_URL + "/public/uploads/company-logos/2021-05-18_05:55:46_JPEG-gold.png"} alt="" />
                        </div>
                        <div className="details">
                            <ul>
                                <li key={'name'}>
                                    <span className="label">Name</span>
                                    <span className='value'>{details.name}</span>
                                </li>
                                <li key={'email'}>
                                    <span className="label">Email Id</span>
                                    <span className='value'>{details.email}</span>
                                </li>
                                <li key={'phone'}>
                                    <span className="label">Phone Number</span>
                                    <span className='value'>{details.phoneNumber}</span>
                                </li>
                                <li key={'companyname'}>
                                    <span className="label">Company Name</span>
                                    <span className='value'>{details.companyName}</span>
                                </li>
                                <li key={'allowedusers'}>
                                    <span className="label">Allowed Users</span>
                                    <span className='value'>{details.users}</span>
                                </li>
                                <li key={'optedplan'}>
                                    <span className="label">Opted Plan</span>
                                    <span className='value'>{details.plan}</span>
                                </li>
                                <li key={'modeofpayment'}>
                                    <span className="label">Mode Of Payment</span>
                                    <span className='value'>{details.mode}</span>
                                </li>
                                <li key={'paymentstatus'}>
                                    <span className="label">Payment Status</span>
                                    <span className='value'>{details.status}</span>
                                </li>
                                <li key={'gstin'}>
                                    <span className="label">GSTIN</span>
                                    <span className='value'>{details.GSTIN}</span>
                                </li>
                                {
                                    details.reasonForFailed &&
                                    <li key={'reasonforfailed'}>
                                        <span className="label">Reason for Failed</span>
                                        <span className='value'>{details.reasonForFailed}</span>
                                    </li>
                                }
                                {
                                    details.reasonForPending &&
                                    <li key={'reasonforpending'}>
                                        <span className="label">Reason for Pending</span>
                                        <span className='value'>{details.reasonForPending}</span>
                                    </li>
                                }
                                <li key={'paidamount'}>
                                    <span className="label">Amount Paid</span>
                                    <span className='value'>{details.Amount}</span>
                                </li>
                                <li key={'time'}>
                                    <span className="label">Time</span>
                                    <span className='value'>{details.timeStamp}</span>
                                </li>
                                {details.comments && details.mode === "OFFLINE" &&
                                    <li key={'comments'}>
                                        <span className="label">Comments</span>
                                        <span className='value'>{details.comments}</span>
                                    </li>}
                            </ul>
                        </div>
                        <div className={verify ? "close hide" : "close"}>
                            <button data-dismiss="modal" onClick={() => setOpenDetailsModal(false)}>Close</button>
                        </div>
                    </div>
                    <div className={verify ? "details-section-wrapper-form" : "details-section-wrapper-form hide"}>
                        <div className="title">
                            <h4>Verify Payment</h4>
                        </div>
                        <form action="">
                            <div className="form-group">
                                <label htmlFor="gstIn">GSTIN *</label>
                                <input type="text" id="GSTIN" name="GSTIN" value={transactionDetails.GSTIN} onChange={handleChange} onBlur={handleBlur} required />
                                <div className="error-warning">{touched.GSTIN && errorMessage.GSTIN}</div>

                            </div>
                            <div className="form-group">
                                <label htmlFor="gstIn">Comment</label>
                                <input type="text" id="comments" name="comments" onChange={handleChange} />
                            </div>
                            <div className="close">
                                <button data-dismiss="modal" onClick={() => setOpenDetailsModal(false)}>Close</button>
                                <button data-dismiss="modal" className={transactionDetails.GSTIN.length > 0 ? "" : "disabled"}
                                    disabled={transactionDetails.GSTIN.length === 0}
                                    onClick={() => verifyPayment(transactionDetails)}>Verify</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
export default PaymentDetailsModal;