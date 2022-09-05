import React, { useEffect, useState } from "react";
import "./addneworganisationadmin.css";

import Select from "react-select";
import PhoneInput from 'react-phone-input-2'
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/style.css';

import PageLayout from "../../components/pagelayout/pagelayout";
import sidebarContentAdmin from "../../helpers/sidebarContentAdmin";
import LoadingComponent from "../../components/loader/LoadingComponent";
import { ToastContainer } from "react-toastify";
import { logOut } from "../../redux/actions/userAction";
import { useDispatch } from "react-redux";
import { axiosApiInstance, BASE_URL, failureAlert, IsAdmin, RAZOR_PAY_API_KEY, successAlert } from "../../helpers/helper";
import AddDomainmodal from "../../components/modal/addDomainmodal";
import { addOrganisationByAdmin, updateOrganisation } from "../../redux/actions/organisationActions";
import { getAllPlans } from "../../redux/actions/gameDetailAction";
import { useSelector } from "react-redux";
import { addPlanAdmin, getOrganisation } from "../../redux/actions/plansApiActions"
import { offlinePaymentByAdmin } from "../../redux/actions/paymentApiActions";
import axios from "axios";
import Confirm from "../../components/modal/confirm";
import { uploadEmployeeDetails, uploadFile } from "../../redux/actions/commonActions";
const AddNewOrganisationAdmin = (props) => {
    const dispatch = useDispatch();
    const isAdmin = IsAdmin();

    const [loaded, setLoaded] = useState(true);
    const [orgAdded, setOrgAdded] = useState(false);
    const [paid, setPaid] = useState(false);
    const [validPhone, setValidPhone] = useState(true);
    const [openAddDomainModal, setOpenAddDomainModal] = useState(false);
    const [emails, setEmails] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState("");
    const [addSubmitClicked, setAddSubmitClicked] = useState(false);
    const [paymentStarted, setPaymentStarted] = useState(false);
    const [paymentMode, setPaymentMode] = useState("");
    const [owner, setOwner] = useState();
    const [organisation, setOrganisation] = useState();
    const [openConfirmUploadModal, setOpenConfirmUploadModal] = useState(false);
    const [uploadFlag, setUploadFlag] = useState(false);
    const [file, setFile] = useState(null);

    const GetAllPlans = useSelector((state) => state.getAllPlans);
    const { planDetails } = GetAllPlans;
    const AddedOrganisationByAdmin = useSelector((state) => state.addedOrganisationByAdmin);
    const { addedOrganisation } = AddedOrganisationByAdmin;
    const OfflinePaymentAdmin = useSelector(state => state.offlinePaymentAdmin);
    const OrgDetailsByEmail = useSelector(state => state.getOrganisation);
    const { orgDetailsByEmail } = OrgDetailsByEmail;
    const AddedPlan = useSelector(state => state.addedPlan);


    const [orgDetails, setOrgDetails] = useState({
        name: "",
        users: [],
        phoneNumber: "",
        country: ""
    })
    const [touched, setTouched] = useState({
        name: false,
        users: false,
        phoneNumber: false
    })
    const [planDetail, setPlanDetail] = useState({
        planName: "",
        planDuration: "",
        from: "",
        to: "",
        noOfUsers: null,
        amount: null
    });
    const [touchedPayment, setTouchedPayment] = useState({
        plan: false,
        duration: false,
        noOfUsers: false,
        amount: false
    });
    const selectStyles = {
        control: (base => ({
            ...base,
            height: 45,
            background: '#f6f7f9',
            border: 0,
            fontSize: 14
        })),
        valueContainer: (base => ({
            ...base,
            height: 45
        })),
        input: (base => ({
            ...base,
            height: 45
        })),
        indicatorsContainer: (base => ({
            ...base,
            height: 45
        })),
        placeholder: (base => ({
            ...base,
            fontSize: 13
        }))
    }

    useEffect(() => {
        dispatch(getAllPlans());
    }, []);
    useEffect(() => {
        if (
            (GetAllPlans && GetAllPlans.loading) ||
            (AddedOrganisationByAdmin && AddedOrganisationByAdmin.loading) ||
            (OfflinePaymentAdmin && OfflinePaymentAdmin.loading)
        )
            setLoaded(false);
        else
            setLoaded(true);
    }, [GetAllPlans, AddedOrganisationByAdmin, OfflinePaymentAdmin, AddedPlan]);

    const signOut = async () => {
        await dispatch(logOut());
        if (isAdmin) props.history.push("/admin");
        else props.history.push("/");
    };
    const getTodayDate = () => {
        const date = new Date();
        const newDate = `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
        return newDate;
    }

    const handleOrgDetailsChange = (e) => {
        const { name, value } = e.target;
        setOrgDetails(prevState => ({
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
    const addOrganisation = (e) => {
        e.preventDefault();
        setTouched({ name: true, users: true, phoneNumber: true });
        setAddSubmitClicked(true);
    }
    const combineEmails = (data) => {
        let str = "";
        if (data.length > 1) {
            str = "Users " + data[0].email;
            for (var i = 1; i < data.length - 1; i++) {
                str += ", " + data[i].email;
            }
            str += " and " + data[data.length - 1].email + " are present in some other organisation";
        }
        else {
            str = "User " + data[0].email + " present in some other organisation";
        }
        return str;
    }
    useEffect(() => {
        const callback = async () => {
            if (addSubmitClicked) {
                const errors = validateOrgDetails(orgDetails);
                if (JSON.stringify(errors) === JSON.stringify({ name: "", users: "", phoneNumber: "" })) {
                    const { users, ...rest } = orgDetails
                    const body = {
                        ...rest,
                        users: {
                            create: users.map(user => ({
                                role: "ORG_SUPER_ADMIN",
                                firstName: user.split('@')[0],
                                lastName: "",
                                email: user
                            })
                            )
                        }
                    }
                    const response = await dispatch(addOrganisationByAdmin(body));
                    if (response && response.status === 200) {
                        if (response.data && response.data.users && response.data.users.length > 0) {
                            setOwner(response.data.users[0]);
                            dispatch(getOrganisation(response.data.users[0].email));
                        }
                        if (response.data)
                            setOrganisation(response.data.organization);
                        setOrgAdded(true);
                    }
                    else if (response && response.msg === "USER_CONNECTED_TO_OTHER_ORG") {
                        failureAlert(combineEmails(response.userWithOtherOrg));
                    }
                    else if (response && response.message === "ORGANIZATION_ALREADY_EXIST") {
                        failureAlert("Organisation name already exists!");
                    }
                    failureAlert(response.message)
                }
                else
                    setOrgAdded(false);
                setAddSubmitClicked(false);
            }
        }
        callback();
    }, [addSubmitClicked, touched]);
    const validateOrgDetails = () => {
        const error = {
            name: "",
            users: "",
            phoneNumber: ""
        };
        if (touched.name && orgDetails.name === "")
            error.name = "Please enter valid company name.";
        if (touched.phoneNumber && (orgDetails.phoneNumber === "" || !validPhone))
            error.phoneNumber = 'Please enter valid phone number.';
        if (touched.users && orgDetails.users.length === 0)
            error.users = 'Please add atleaset one email id';
        return error;
    }
    const errors = validateOrgDetails();

    const handlePlanDetailsChange = (e) => {
        const { name, value } = e.target;
        setPlanDetail(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    useEffect(() => {
        if (planDetail.planName === "Jumbo")
            setSelectedPlan("Jumbo");
        else if (planDetails) {
            planDetails.data.forEach(plan => {
                if (plan.title === planDetail.planName && plan.validityPeriod === planDetail.planDuration) {
                    setSelectedPlan(plan);
                    setPlanDetail(prevState => ({
                        ...prevState,
                        noOfUsers: plan.userLimit,
                        amount: plan.prices["INR"]
                    }))
                    return;
                }
            })
            if (selectedPlan === "Jumbo")
                setSelectedPlan(null);
        }
    }, [planDetail.planName, planDetail.planDuration]);
    const handleBlurPayment = (e) => {
        const { name } = e.target;
        setTouchedPayment(prevState => ({
            ...prevState,
            [name]: true
        }))
    }
    const startPayment = (e, mode) => {
        setTouchedPayment({
            amount: true,
            duration: true,
            noOfUsers: true,
            plan: true
        })
        setPaymentMode(mode);
        setPaymentStarted(true);
    }
    useEffect(() => {
        const callback = async () => {
            if (paymentStarted && JSON.stringify(validatePaymentDetails()) === JSON.stringify({ plan: "", duration: "", noOfUsers: "", amount: "" })) {
                var planToPurchase;
                if (selectedPlan === "Jumbo") {
                    const body = {
                        plan: {
                            title: planDetail.planName,
                            prices: { INR: parseFloat(planDetail.amount) },
                            userLimit: parseFloat(planDetail.noOfUsers),
                            from: planDetail.from,
                            to: planDetail.to,
                            isCustom: true
                        }
                    }
                    const response = await dispatch(addPlanAdmin(body));
                    if (response && response.data && response.data.data)
                        planToPurchase = response.data.data;
                }
                else
                    planToPurchase = selectedPlan;
                if (paymentMode === "offline") {
                    const body = {
                        planId: planToPurchase && planToPurchase.id,
                        userId: owner.id,
                        organizationId: organisation.id
                    }
                    const response = await dispatch(offlinePaymentByAdmin(body));
                    if (response === 200) {
                        successAlert("Payment Success!");
                        setPaid(true);
                    }
                }
                else {
                    displayRazorpay(planToPurchase, planToPurchase.prices["INR"]);
                }
                setPaymentStarted(false);
            }
        }
        callback();
    }, [paymentStarted, touchedPayment])

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
    const displayRazorpay = async (planToPurchase, amount) => {
        setLoaded(false);
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        setLoaded(true)
        if (!res) {
            console.log("Razorpay SDK failed to load. Are you online?");
            return;
        }
        // creating a new order
        setLoaded(false);
        // const result = await axiosApiInstance.post(BASE_URL + "/api/payment/razor/checkoutByAdmin", { planId: planToPurchase.id, userId: owner.id, organizationId: organisation.id, totalAmount: amount * 1.18 });
        const result = await axiosApiInstance.post(BASE_URL + "/api/payment/razor/checkoutByAdmin", { planId: planToPurchase.id, userId: owner.id, organizationId: organisation.id, totalAmount: amount });
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
            name: orgDetailsByEmail && orgDetailsByEmail.data && orgDetailsByEmail.data.name,
            description: "Purchase Plan",
            order_id: order_id,
            handler: async function (response) {
                const data = {
                    planId: planToPurchase.id,
                    transactionId: transactionId,
                    payId: response.razorpay_payment_id,
                    customUser: {
                        ...owner,
                        organization: {
                            id: owner.organizationId
                        }
                    }
                };
                setLoaded(false)
                try {
                    const result = await axiosApiInstance.post(BASE_URL + "/api/payment/razor/verifyByAdmin", data);
                } catch (err) {
                    console.log(err);
                }
                setLoaded(true)
                if (result.status === 200) {
                    setPaid(true);
                    successAlert("Payment Success");
                }
                else {
                    failureAlert("Something went wrong!");
                }
            },
            prefill: {
                name: owner.firstName + " " + owner.lastName,
                email: owner.email,
                contact: organisation.phoneNumber,
            },
            // notes: {
            //     address: "Gaurav Kumar Corporate Office",
            // },
            theme: {
                color: "#e25569",
            },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    const validatePaymentDetails = () => {
        const error = {
            plan: "",
            duration: "",
            noOfUsers: "",
            amount: ""
        };
        if (touchedPayment.plan && planDetail.planName === "")
            error.plan = "Please select any plan."
        if (touchedPayment.duration) {
            if (planDetail.planName === "Jumbo") {
                if (planDetail.from === "" && planDetail.to === "")
                    error.duration = "Please select from and to date";
                else if (planDetail.from === "")
                    error.duration = "Please select from date";
                else if (planDetail.to === "")
                    error.duration = "Please select to date";
                else if (new Date(planDetail.from) > new Date(planDetail.to))
                    error.duration = "To date should be greater than from date";
            }
            else if (planDetail.planDuration === "") {
                error.duration = "Please select any duration.";
            }
        }
        if (touchedPayment.noOfUsers && planDetail.planName === "Jumbo" && (planDetail.noOfUsers === null || planDetail.noOfUsers === ""))
            error.noOfUsers = "Please enter valid no of users value."
        if (touchedPayment.amount && planDetail.planName === "Jumbo" && (planDetail.amount === null || planDetail.amount === ""))
            error.amount = "Please enter valid amount value."
        return error;
    }
    const paymentErrors = validatePaymentDetails();

    const removeDomain = async (domainName) => {
        if (orgDetailsByEmail) {
            const { data } = orgDetailsByEmail
            if (data.allowedDomains) {
                setLoaded(false);
                const allowedDomain = []
                data.allowedDomains.forEach((domain) => {
                    if (domain && domain.name !== domainName)
                        allowedDomain.push({ name: domain.name, createdAt: domain.createdAt });
                });
                await dispatch(updateOrganisation(data.id, { allowedDomains: allowedDomain }));
                dispatch(getOrganisation(owner.email));
                setLoaded(true);
            }
        }
    }
    const fileChanged = (e) => {
        const inputFile = e.target.files[0];
        e.target.value = [];
        setFile(inputFile);
        setOpenConfirmUploadModal(true);
    };
    useEffect(() => {
        async function callBack() {
            if (uploadFlag) {
                if (file) {
                    setLoaded(false);
                    try {
                        const fileData = new FormData();
                        fileData.append("sheets", file);
                        const { status, data } = await dispatch(uploadFile(fileData, true));
                        if (status === 200) {
                            if (data && data.data && data.data.path) {
                                const { path } = data.data;
                                const response = await dispatch(uploadEmployeeDetails(path.replace(BASE_URL + "/", ""), owner.email));
                                // const response = await dispatch(uploadEmployeeDetails(path.replace(BASE_URL + "/", "")));
                                const responsecode = response.status;
                                if (responsecode === 200) {
                                    const { data } = response
                                    successAlert(`File Uploaded Successfully, ${data.userCount && data.userCount} ${data.userCount && data.userCount <= 1 ? "user" : "users"} invited.`)
                                    dispatch(getOrganisation(owner.email));
                                    // setCsvError("");
                                } else if (
                                    response?.status === 500 &&
                                    response?.data?.message ===
                                    "USER EXISTS IN OTHER ORGANIZATION"
                                ) {
                                    // setCsvError("* Duplicate Entry in file, Some Users already exists in some other organisation");
                                }
                                else {
                                    failureAlert("File upload failed due to an error in the file");
                                }
                            }
                        }
                        else if (status?.includes?.("417"))
                            failureAlert("Uploaded file contains some malware!");
                        else if (status?.includes?.("500"))
                            failureAlert("File Format Not supported");
                    } catch (err) {
                        console.log(err);
                    }
                    setLoaded(true);
                    setFile(null);
                }
                setUploadFlag(false);
            }
        }
        callBack();
    }, [uploadFlag]);

    return (
        <div className='admin-homepage'>
            <PageLayout
                sidebartitle=""
                active={"Add New Organisation"}
                sideBarContents={sidebarContentAdmin}
                profile
                {...props}
                signOut={signOut}
                isAdmin={isAdmin}
            >
                <LoadingComponent loaded={loaded} />
                <ToastContainer position="bottom-center" />
                <div className="add-new-organisation-admin">
                    <div className="title">
                        <h4>Add New Organisation</h4>
                    </div>
                    <br />
                    <form onSubmit={addOrganisation} className={`add-org ${orgAdded ? 'faded03' : ""}`}>
                        <div className="form-group">
                            <label htmlFor="name">Company Name*</label>
                            <input type="text" className="form-field" value={orgDetails.name} onChange={handleOrgDetailsChange} onBlur={handleBlur} name="name" placeholder="Enter company name" />
                            <div className="error-message">{errors.name}</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Id*</label>
                            <ReactMultiEmail
                                placeholder="Enter email id"
                                emails={orgDetails.users}
                                onChange={(_emails) => {
                                    setOrgDetails(prevState => ({ ...prevState, users: _emails }));
                                }}
                                validateEmail={email => {
                                    return isEmail(email); // return boolean
                                }}
                                getLabel={(
                                    email,
                                    index,
                                    removeEmail,
                                ) => {
                                    return (
                                        <div data-tag key={index}>
                                            {email}
                                            <span data-tag-handle onClick={() => removeEmail(index)}>
                                                ×
                                            </span>
                                        </div>
                                    );
                                }}
                            />
                            <div className="error-message">{errors.users}</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number*</label>
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
                                    setOrgDetails((prevState) => ({
                                        ...prevState,
                                        phoneNumber: val,
                                        country: country.name
                                    }))
                                }}
                                onBlur={() => handleBlur({ target: { name: "phoneNumber" } })}
                                value={orgDetails.phoneNumber}
                                id="phoneNo" />
                            <div className="error-message">{errors.phoneNumber}</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Invite Owner <span>(via email)</span></label>
                            <div className="invite-check-box">
                                <input type="checkbox" className="checkbox disabled" checked readOnly />
                                <span className="invite-message">*Notification via email will be sent to owner's email id.</span>
                            </div>
                        </div>
                        <div className="submit-group">
                            <div className="btn-group">
                                <button className="btn btn-gradientgreen" >Add New Organisation</button>
                            </div>
                        </div>
                        {
                            orgAdded &&
                            <div className="envelope"></div>
                        }
                    </form>
                    <br />
                    <div className={orgAdded ? "" : "hide"}>
                        <hr className='faded03' />
                        <div className={`payment-group ${paid ? "faded03" : ""}`}>
                            <h4>Payment</h4>
                            <br />
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group">
                                    <label htmlFor="plan">Plan</label>
                                    <Select
                                        className="form-select-orgs"
                                        options={[{ value: 'Mini', label: "Mini" }, { value: 'Medium', label: "Medium" }, { value: 'Mega', label: "Mega" }, { value: 'Jumbo', label: "Jumbo" }]}
                                        placeholder="Select Plan"
                                        onChange={(e) => handlePlanDetailsChange({ target: { name: "planName", value: e.value } })}
                                        styles={selectStyles}
                                        onBlur={() => handleBlurPayment({ target: { name: "plan" } })}
                                    />
                                    <div className="error-message">{paymentErrors.plan}</div>
                                </div>
                                <div className="form-group duration">
                                    <label htmlFor="duration">Duration</label>
                                    {
                                        selectedPlan !== "Jumbo" ?
                                            <Select
                                                className="form-select-orgs"
                                                options={[{ value: 1, label: "1 Month" }, { value: 12, label: "12 Months" }]}
                                                placeholder="Select Duration"
                                                onChange={(e) => handlePlanDetailsChange({ target: { name: "planDuration", value: e.value } })}
                                                styles={selectStyles}
                                                value={planDetail.planDuration && { label: `${planDetail.planDuration} Months`, value: planDetail.planDuration }}
                                            /> :
                                            <>
                                                <input placeholder="From date" className="form-field" type="text" min={getTodayDate()} onFocus={(e) => e.target.type = "date"} onChange={handlePlanDetailsChange} name="from" value={planDetail.from} />
                                                <input placeholder="To date" className="form-field" type="text" min={planDetail.from} onFocus={(e) => e.target.type = "date"} onChange={handlePlanDetailsChange} name="to" value={planDetail.to} />
                                            </>
                                    }
                                    <div className="error-message">{paymentErrors.duration}</div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="noofusers">No Of Users</label>
                                    <input type="number" placeholder="Enter no of users" onBlur={() => handleBlurPayment({ target: { name: "noOfUsers" } })} className={`form-field ${selectedPlan !== "Jumbo" ? "disabled" : ""}`} disabled={selectedPlan !== "Jumbo"} onChange={handlePlanDetailsChange} name="noOfUsers" value={planDetail.noOfUsers} />
                                    <div className="error-message">{paymentErrors.noOfUsers}</div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="amount">Amount</label>
                                    <input type="number" placeholder="Enter the amount" onBlur={() => handleBlurPayment({ target: { name: "amount" } })} className={`form-field ${selectedPlan !== "Jumbo" ? "disabled" : ""}`} disabled={selectedPlan !== "Jumbo"} onChange={handlePlanDetailsChange} name="amount" value={planDetail.amount} />
                                    <div className="error-message">{paymentErrors.amount}</div>
                                </div>
                                <div className="btn-group">
                                    <h4 className="pay-now-title">Pay Now</h4>
                                    <button className="btn btn-grey" onClick={(e) => { startPayment(e, "offline") }}>Offline</button>
                                    <button className="btn btn-gradientgreen" onClick={(e) => { startPayment(e, "online") }}>Online</button>
                                </div>
                            </form>
                            {
                                paid &&
                                <div className="envelope"></div>
                            }
                        </div>
                        <hr className='faded03' />
                        <div className="upload-group">
                            <h4>Upload Database</h4>
                            <h4 className="payment-message">*Payment method should be online to enable this.</h4>
                            <div className={`btn-group ${paid && paymentMode === "online" ? "" : "faded03"}`}>
                                <div className="upload-file-group">
                                    <button className="btn btn-grey">Upload File</button>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={fileChanged}
                                    />
                                </div>
                                <button className="btn btn-gradientgreen" onClick={() => setOpenAddDomainModal(true)}>Add Domain</button>
                                {
                                    (!paid || paymentMode === "offline") &&
                                    <div className="envelope"></div>
                                }
                            </div>
                            {
                                orgDetailsByEmail &&
                                orgDetailsByEmail.data && orgDetailsByEmail.data.files &&
                                <div className="uploaded-file">
                                    <h4>Uploaded File</h4>
                                    <span>
                                        {orgDetailsByEmail &&
                                            orgDetailsByEmail.data && orgDetailsByEmail.data.files &&
                                            orgDetailsByEmail.data.files.sheetName
                                        }
                                    </span>
                                </div>
                            }
                            {
                                orgDetailsByEmail && orgDetailsByEmail.data && orgDetailsByEmail.data.allowedDomains &&
                                orgDetailsByEmail.data.allowedDomains.length > 0 &&
                                <div className="added-domains">
                                    <h4>Added Domains</h4>
                                    <ul>
                                        {
                                            orgDetailsByEmail && orgDetailsByEmail.data && orgDetailsByEmail.data.allowedDomains &&
                                            orgDetailsByEmail.data.allowedDomains.map(domain => (
                                                <li key={domain.name}><span>{domain.name}</span><span className="close" onClick={() => removeDomain(domain.name)}>x</span></li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {openConfirmUploadModal && (
                    <Confirm
                        modalid="uploadcsv"
                        toggle={openConfirmUploadModal}
                        file={file}
                        setOpenConfirmUploadModal={setOpenConfirmUploadModal}
                        setUploadFlag={setUploadFlag}
                    />
                )}

                {
                    openAddDomainModal &&
                    <AddDomainmodal setLoaded={setLoaded} toggle={openAddDomainModal} setOpenAddDomainModal={setOpenAddDomainModal} organisation={orgDetailsByEmail && orgDetailsByEmail.data} owner={owner} />
                }
            </PageLayout>
        </div>
    )
}
export default AddNewOrganisationAdmin;