import React, { useState } from "react";
import "./ssoadminpage.css";

import { useDispatch } from "react-redux";
import PageLayout from "../../components/pagelayout/pagelayout";
import { failureAlert, IsAdmin, REG_EX_URL_FORMAT, signOut, successAlert } from "../../helpers/helper";
import sidebarContentAdmin from "../../helpers/sidebarContentAdmin";
import { useEffect } from "react";
import LoadingComponent from "../../components/loader/LoadingComponent";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import Select from "react-select";
import { getAllOrganisations } from "../../redux/actions/organisationActions";
import upload from '../../assets/images/upload.svg';
import { updateSSODetails } from "../../redux/actions/adminApiActions";
import { uploadFile } from "../../redux/actions/commonActions";
import { ReactMultiEmail, isEmail } from 'react-multi-email';

const SSOAdminPage = (props) => {
    const isAdmin = IsAdmin();
    const dispatch = useDispatch();
    const [ssoType, setSsoType] = useState("PEOPLESTRONG");
    const [loaded, setLoaded] = useState(true);
    const [allOrganisations, setAllOrganisations] = useState([]);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [details, setDetails] = useState({
        organization: null,
        ssoLoginURL: "",
        ssoLogoutURL: "",
        publicKey: null,
        allowNewUsers: false,
        domains: []
    });
    const [touched, setTouched] = useState({
        organization: false,
        ssoLoginURL: false,
        ssoLogoutURL: false,
        publicKey: false,
        domains: false
    });
    const AllOrganisationData = useSelector(state => state.allOrganisationData);
    const { allOrganisationData } = AllOrganisationData;
    const fileUpload = useSelector(state => state.uploadedFile);
    const updatedSSODetails = useSelector(state => state.updatedSSODetails);

    useEffect(() => {
        dispatch(getAllOrganisations("", true));
    }, [])
    useEffect(() => {
        if (
            (AllOrganisationData && AllOrganisationData.loading) ||
            (fileUpload && fileUpload.loading) ||
            (updatedSSODetails && updatedSSODetails.loading)
        ) {
            setLoaded(false);
        }
        else
            setLoaded(true);
    }, [AllOrganisationData, fileUpload, updatedSSODetails])
    useEffect(() => {
        if (allOrganisationData && allOrganisationData.data && allOrganisationData.data.allOrganisationDetails) {
            setAllOrganisations(allOrganisationData.data.allOrganisationDetails.map(data => (
                { label: data.organizationName, value: data.organizationName, id: data.organizationId, ssoTracking: data.ssoTracking }
            )))
        }
    }, [allOrganisationData]);
    useEffect(() => {
        if (details.organization?.ssoTracking?.length > 0) {
            const ssoTracking = details.organization.ssoTracking[0];
            setDetails(prevState => ({
                ...prevState,
                domains: ssoTracking.domain?.map(domain => "@" + domain) || [],
                publicKey: { name: ssoTracking.certificatePath },
                ssoLoginURL: ssoTracking.ssoLoginUrl,
                ssoLogoutURL: ssoTracking.ssoLogoutUrl,
                allowNewUsers: ssoTracking.allowAll
            }))
        }
    }, [details.organization]);

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prevState => ({
            ...prevState,
            [name]: true
        }))
    }
    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === "allowNewUsers")
            setDetails(prevState => ({
                ...prevState,
                [name]: checked
            }))
        else
            setDetails(prevState => ({
                ...prevState,
                [name]: value
            }))
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setDetails(prevState => ({
            ...prevState,
            publicKey: file
        }));
        e.target.value = [];
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({ organization: true, publicKey: true, domains: true, ssoLoginURL: true, ssoLogoutURL: true });
        setSubmitClicked(true);
    }
    const formatImageName = (name) => {
        name = name?.split("/")?.at(-1) || "";
        return name;
    }

    useEffect(() => {
        const callBack = async () => {
            if (submitClicked) {
                if (JSON.stringify(validate()) === JSON.stringify({ organization: "", ssoLoginURL: "", ssoLogoutURL: "", publicKey: "", domains: "" })) {
                    const modifiedDomains = details.domains.map(domain => domain.slice(1));
                    let body = {
                        ssoLoginUrl: details.ssoLoginURL,
                        organizationId: details.organization.id,
                        domains: modifiedDomains,
                        allowAll: details.allowNewUsers,
                        azure: false,
                        certificatePath: null,
                        ssoLogoutURL: ""
                    };
                    if (ssoType === "AZUREAD") {
                        const data = new FormData();
                        data.append("certificates", details.publicKey);
                        let fileResponse;
                        if (details.publicKey.type)
                            fileResponse = await dispatch(uploadFile(data));
                        else
                            fileResponse = { data: { data: { path: details.publicKey.name } } }
                        body.certificatePath = fileResponse.data.data.path;
                        body.azure = true;
                        body.ssoLogoutUrl = details.ssoLogoutURL;
                    }
                    const response = await dispatch(updateSSODetails(body));
                    if (response?.status === 200) {
                        dispatch(getAllOrganisations("", true));
                        successAlert("Updated Successfully");
                    }
                    else {
                        failureAlert("Something went wrong");
                    }
                    setTouched({ organization: false, publicKey: false, ssoLoginURL: false, ssoLogoutURL: false, domains: false });
                    setDetails({ organization: null, publicKey: null, ssoLoginURL: "", ssoLogoutURL: "", domains: [], allowNewUsers: false });
                }
                setSubmitClicked(false);
            }
        }
        callBack();
    }, [submitClicked]);
    const validate = () => {
        const errors = {
            organization: "",
            ssoLoginURL: "",
            ssoLogoutURL: "",
            publicKey: "",
            domains: ""
        }
        if (touched.organization && !details.organization)
            errors.organization = "Please select an organization";
        if (touched.ssoLoginURL && !REG_EX_URL_FORMAT.test(details.ssoLoginURL))
            errors.ssoLoginURL = "Please enter valid URL";
        if (touched.ssoLogoutURL && !REG_EX_URL_FORMAT.test(details.ssoLogoutURL) && ssoType === "AZUREAD")
            errors.ssoLogoutURL = "Please enter valid URL";
        if (touched.publicKey && !details.publicKey?.name && ssoType === "AZUREAD")
            errors.publicKey = "Please upload certificate";
        if (touched.domains && !details.domains?.length > 0)
            errors.domains = "Please add atleast one domain";
        return errors;
    }
    const validateDomain = (value) => {
        const domainFormat = /^@[\(\)\[\]a-zA-Z0-9\.\`\~\!\#\$\%\^\&\*\_\=\+\'-]+\.[a-zA-Z0-9]+$/;
        if (value.length === 1)
            return false;
        else if (value.length > 0 && !domainFormat.test(value))
            return false;
        return true;
    }
    const errors = validate();
    // console.log(errors,details);

    return (<div className="admin-homepage">
        <PageLayout
            sidebartitle=""
            active={"SSO Details"}
            category
            sideBarContents={sidebarContentAdmin}
            profile
            {...props}
            signOut={() => signOut(dispatch, props.history, isAdmin)}
            isAdmin={isAdmin}
        >
            <div className="ssoadminpage">
                <LoadingComponent loaded={loaded} />
                <ToastContainer position="bottom-center" />
                <h4 className="title">Update SSO Details</h4>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="">SSO Type</label>
                        <Select
                            classNamePrefix="react-select"
                            className="form-select"
                            options={[{ label: "Azure Ad", value: "AZUREAD" }, { label: "People Strong", value: "PEOPLESTRONG" }]}
                            menuPlacement={"auto"}
                            onChange={e => setSsoType(e.value)}
                            placeholder="Select SSO Type"
                        // value={details.organization}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Organization</label>
                        <Select
                            classNamePrefix="react-select"
                            className="form-select"
                            options={allOrganisations}
                            menuPlacement={"auto"}
                            onChange={e => handleChange({ target: { name: "organization", value: e } })}
                            placeholder="Select Organization"
                            value={details.organization}
                        />
                        <div className="error-message">{errors.organization}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">SSO Login URL</label>
                        <input type="text" className="form-field" placeholder="Enter SSO Login URL" value={details.ssoLoginURL} name="ssoLoginURL" onChange={handleChange} onBlur={handleBlur} />
                        <div className="error-message">{errors.ssoLoginURL}</div>
                    </div>
                    {
                        ssoType === "AZUREAD" &&
                        <>
                            <div className="form-group">
                                <label htmlFor="">SSO Logout URL</label>
                                <input type="text" className="form-field" placeholder="Enter SSO Logout URL" value={details.ssoLogoutURL} name="ssoLogoutURL" onChange={handleChange} onBlur={handleBlur} />
                                <div className="error-message">{errors.ssoLogoutURL}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Public Key</label>
                                <div className="cstm-upload-btn">
                                    <label className="upload-button">
                                        <input type="file" name="publicKey" onChange={handleFileChange} onBlur={handleBlur} accept=".cer" />
                                        <span>
                                            <img src={upload} alt="upload" />
                                            Upload
                                        </span>
                                    </label>
                                </div>
                                <p className={`uploaded-img`}>{details.publicKey && formatImageName(details.publicKey.name)}</p>
                                <div className="error-message">{errors.publicKey}</div>
                            </div>
                        </>
                    }
                    <div className="form-group">
                        <label htmlFor="domains">Domains*</label>
                        <ReactMultiEmail
                            placeholder="Enter a domain name: @example.com"
                            emails={details.domains}
                            onChange={(_domains) => {
                                setDetails(prevState => ({ ...prevState, domains: _domains }));
                            }}
                            validateEmail={email => {
                                return validateDomain(email); // return boolean
                            }}
                            getLabel={(
                                domain,
                                index,
                                removeDomain,
                            ) => {
                                return (
                                    <div data-tag key={index + JSON.stringify(domain)}>
                                        {domain}
                                        <span data-tag-handle onClick={() => removeDomain(index)}>
                                            ×
                                        </span>
                                    </div>
                                );
                            }}
                        />
                        <div className="error-message">{errors.domains}</div>
                    </div>
                    <div className="form-group check-box">
                        <label htmlFor="allowUsers">Allow New Users</label>
                        <input type="checkbox" name="allowNewUsers" checked={details.allowNewUsers} onChange={handleChange} className="form-field" />
                    </div>
                    <button className="btn btn-primary">Update</button>
                </form>
            </div>
        </PageLayout>
    </div>

    )
}

export default SSOAdminPage;