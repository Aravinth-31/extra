import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";
//image
import excel from "../../assets/images/excel.svg";
import uploadwhite from "../../assets/images/uploadwhite.svg";
import deleteButton from "../../assets/images/deleteWithFrame.svg";
import Confirm from "../modal/confirm";
import SampleCsv from "../modal/samplecsv";
import ManageTeamAddEditUserModal from "../modal/manageTeamAddEditUsermodal";
import {
    addUsersWithDummyEmailOrg,
    getMasterOtpOrganisation,
    getOrganisationUsers,
    setMasterOtpOrganisation,
    updateOrganisation
} from "../../redux/actions/organisationActions";
import { useDispatch, useSelector } from "react-redux";
import {
    downloadEmployeeDatabase,
    uploadEmployeeDetails,
    uploadFile
} from "../../redux/actions/commonActions";
import { getOrganisation } from "../../redux/actions/plansApiActions";
import { BASE_URL, decryptData, preventNonNumericalInput } from "../../helpers/helper";
import DeleteDomainModal from "../modal/deleteDomainModal";
import { ToastContainer } from "react-toastify";
import { successAlert, failureAlert } from "../../helpers/helper";
import LoadingComponent from "../loader/LoadingComponent";
import { EMPLOYEE_DATABASE_UPLOAD_SUCCESS, FILE_UPLOAD_SUCCESS } from "../../redux/constants/commonApiConstants";
import ROLES from "../../helpers/userTypes";
import { downloadFile } from "../../helpers/downloadFile";
import 'font-awesome/css/font-awesome.min.css';
import UsersAddedModal from "../modal/UsersAddedModal";

const AddUser = () => {
    const [openAddEditUserModal, setOpenAddEditUserModal] = useState(false);
    const [file, setFile] = useState(null);
    const [dummyUsersFile, setDummyUsersFile] = useState(null);
    const [uploadFlag, setUploadFlag] = useState(false);
    const [openConfirmUploadModal, setOpenConfirmUploadModal] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [yesFlag, setYesFlag] = useState(false);
    const [domainName, setDomainName] = useState("");
    const [csvError, setCsvError] = useState("");
    const [domainNameError, setDomainNameError] = useState("");
    const [existingDomains, setExistingDomains] = useState([]);
    const [openDeleteDomainModal, setOpenDeleteDomainModal] = useState(false);
    const [deleteDomainName, setDeleteDomainName] = useState("");
    const [dummyUserdetails, setDummyUserDetails] = useState({ noOfUsers: '', domain: '', otp: '' });
    const [addDummyUsersClicked, setAddDummyUsersClicked] = useState(false);
    const [touched, setTouched] = useState({ noOfUsers: false, domain: false, otp: false, file: false });
    const [byUploadingFile, setByUploadingFile] = useState(false);
    const [openUsersAddedModal, setOpenUsersAddedModal] = useState(false);

    const dispatch = useDispatch();

    const UploadedFile = useSelector((state) => state.uploadedFile);
    const UploadedEmployeeDetails = useSelector((state) => state.uploadEmployeeDatabase);
    const { uploadedEmployeeDetails } = UploadedEmployeeDetails;
    const GetOrganisation = useSelector((state) => state.getOrganisation);
    const { orgDetailsByEmail } = GetOrganisation;
    const { userInfo } = useSelector((state) => state.getUser);
    const UpdateOrganisation = useSelector((state) => state.updateOrganisation);
    const CreateSamplecsv = useSelector(state => state.createSamplecsv);
    const OrgUsers = useSelector(state => state.orgUsers);
    const { orgUsers } = OrgUsers;
    const { myPlanDetails } = useSelector(state => state.getMyPlans);
    const AddUsersDummyEmail = useSelector(state => state.addUsersDummyEmail);
    const GetMasterOtp = useSelector(state => state.getMasterOtp);
    const { getMasterOtp } = GetMasterOtp;
    const SetMasterOtp = useSelector(state => state.setMasterOtp);

    const masterOtpRef = React.createRef();

    const DownloadEmployeeDatabase = useSelector(
        (state) => state.downloadEmployeeDatabase
    );

    useEffect(() => {
        if (userInfo && userInfo.data && userInfo.data.email)
            dispatch(getOrganisation(userInfo.data.email));
        dispatch(getOrganisationUsers(""));
        return (() => {
            dispatch({ type: FILE_UPLOAD_SUCCESS, payload: null, });
            dispatch({ type: EMPLOYEE_DATABASE_UPLOAD_SUCCESS, payload: null, });
        })
    }, []);
    useEffect(() => {
        if (orgDetailsByEmail && orgDetailsByEmail.data) {
            dispatch(getMasterOtpOrganisation(orgDetailsByEmail?.data?.id));

            if (orgDetailsByEmail.data.restrictedDomain) setYesFlag(true);
            else setYesFlag(false);
            var domains = [];
            orgDetailsByEmail.data.allowedDomains.map((domain) => {
                domains.push(domain.name);
                return domain;
            });
            setExistingDomains(domains);
        }
    }, [orgDetailsByEmail]);

    useEffect(() => {
        if (getMasterOtp?.masterOtp) {
            const decryptedOtp = decryptData(getMasterOtp.masterOtp);
            if (decryptedOtp)
                setDummyUserDetails(prevState => ({
                    ...prevState,
                    otp: decryptedOtp
                }))
        }
    }, [getMasterOtp])

    const fileChanged = (e, isDummyUsersFile) => {
        const inputFile = e.target.files[0];
        e.target.value = [];
        if (!isDummyUsersFile) {
            setFile(inputFile);
            setOpenConfirmUploadModal(true);
        }
        else
            setDummyUsersFile(inputFile);
    };
    useEffect(() => {
        async function callBack() {
            if (uploadFlag) {
                if (file) {
                    const fileData = new FormData();
                    fileData.append("sheets", file);
                    const { status, data } = await dispatch(uploadFile(fileData, true));
                    if (status === 200) {
                        if (data && data.data && data.data.path) {
                            const { path } = data.data;
                            const response = await dispatch(uploadEmployeeDetails(path.replace(BASE_URL + "/", "")));
                            const responsecode = response.status;
                            if (responsecode === 200 && userInfo && userInfo.data) {
                                const { data } = response
                                // successAlert(`File Uploaded Successfully, ${data.userCount && data.userCount} ${data.userCount && data.userCount <= 1 ? "user" : "users"} invited.`)
                                setOpenUsersAddedModal(true);
                                dispatch(getOrganisation(userInfo.data.email));
                                setCsvError("");
                            } else if (
                                response?.status === 500 &&
                                response?.data?.message ===
                                "USER EXISTS IN OTHER ORGANIZATION"
                            ) {
                                setCsvError("* Duplicate Entry in file, Some Users already exists in some other organisation");
                            }
                            else if (response && response.data && response.data.message === "USER LIMIT EXCEEDED") {
                                failureAlert("User limit exceeds");
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
                    setFile(null);
                }
                setUploadFlag(false);
            }
        }
        callBack();
    }, [uploadFlag]);
    useEffect(() => {
        if (
            (UploadedFile && UploadedFile.loading) ||
            (GetOrganisation && GetOrganisation.loading) ||
            (UpdateOrganisation && UpdateOrganisation.loading) ||
            (UploadedEmployeeDetails && UploadedEmployeeDetails.loading) ||
            (DownloadEmployeeDatabase && DownloadEmployeeDatabase.loading) ||
            (CreateSamplecsv && CreateSamplecsv.loading) ||
            (AddUsersDummyEmail && AddUsersDummyEmail.loading) ||
            (GetMasterOtp && GetMasterOtp.loading) ||
            (SetMasterOtp && SetMasterOtp.loading)
        ) {
            setLoaded(false);
        } else setLoaded(true);
    }, [
        UploadedFile,
        UploadedEmployeeDetails,
        GetOrganisation,
        UpdateOrganisation,
        DownloadEmployeeDatabase,
        CreateSamplecsv,
        AddUsersDummyEmail,
        GetMasterOtp,
        SetMasterOtp
    ]);
    const handleDownload = async () => {
        const response = await dispatch(downloadEmployeeDatabase());
        if (response && response.data && response.data.data && response.data.data.downloadUrl)
            downloadFile(response.data.data.downloadUrl);
    };
    const uploadDate = (date) => {
        return `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`;
    };
    const updateDomainRestriction = (flag) => {
        setYesFlag(flag);
        if (orgDetailsByEmail && orgDetailsByEmail.data)
            dispatch(
                updateOrganisation(orgDetailsByEmail.data.id, {
                    restrictedDomain: flag
                })
            );
    };
    const handleChange = (e) => {
        const { value } = e.target;
        const domainFormat = /^@[\(\)\[\]a-zA-Z0-9\.\`\~\!\#\$\%\^\&\*\_\=\+\'-]+\.[a-zA-Z0-9]+$/;
        if (value.length === 1)
            setDomainNameError("Domain name length should be minimum 2");
        else if (existingDomains.includes(value))
            setDomainNameError("Domain name already exists");
        else if (value.length > 0 && !domainFormat.test(value)) {
            setDomainNameError("Domain name format should be in the given format");
        } else setDomainNameError("");
        setDomainName(value);
    };
    const addDomain = async (e) => {
        e.preventDefault();
        if (domainNameError !== "" || domainName === "") return;
        const newDomain = { name: domainName };
        if (orgDetailsByEmail && orgDetailsByEmail.data) {
            var allowedDomains = [];
            orgDetailsByEmail.data.allowedDomains.map((domain) => {
                allowedDomains.push({ name: domain.name, createdAt: domain.createdAt });
                return domain;
            });
            const responsecode = await dispatch(
                updateOrganisation(orgDetailsByEmail.data.id, {
                    allowedDomains: [...allowedDomains, newDomain]
                })
            );
            if (responsecode && responsecode.status === 200 && userInfo && userInfo.data) {
                successAlert("Domain Added Successfully.")
                dispatch(getOrganisation(userInfo.data.email));
                setDomainName("");
            }
            else if (responsecode && responsecode.status === 400 && responsecode.data && responsecode.data.message === "DOMAIN_ALREADY_EXIST") {
                setDomainNameError("This domain name is already taken by some other organisation")
            }
        }
    };
    const handleDeleteDomain = (e, domain) => {
        e.preventDefault();
        setDeleteDomainName(domain);
        setOpenDeleteDomainModal(true);
    };
    const removeDomain = async (domainName) => {
        if (orgDetailsByEmail && orgDetailsByEmail.data) {
            var allowedDomains = [];
            orgDetailsByEmail.data.allowedDomains.map((domain) => {
                if (domainName !== domain.name)
                    allowedDomains.push({
                        name: domain.name,
                        createdAt: domain.createdAt
                    });
                return domain;
            });
            const responsecode = await dispatch(
                updateOrganisation(orgDetailsByEmail.data.id, {
                    allowedDomains: allowedDomains
                })
            );
            if (responsecode && responsecode.status === 200 && userInfo && userInfo.data) {
                successAlert("Domain Removed Successfully.")
                dispatch(getOrganisation(userInfo.data.email));
                setDomainName("");
            }
            setOpenDeleteDomainModal(false);
        }
    };

    const handleChangeData = (e) => {
        const { value, name } = e.target;
        if (name === 'otp' && value.length > 6)
            return;
        setDummyUserDetails(prevState => ({
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
    const handleDummyUserSubmit = (e) => {
        e.preventDefault();
        setTouched({ noOfUsers: true, domain: true, otp: true, file: true });
        setAddDummyUsersClicked(true);
    }
    useEffect(() => {
        const callBack = async () => {
            if (addDummyUsersClicked) {
                if (JSON.stringify(validate()) === JSON.stringify({ noOfUsers: '', domain: '', otp: '', file: '' }) && orgDetailsByEmail?.data?.id) {
                    const body = {
                        organizationId: orgDetailsByEmail.data.id,
                        domain: dummyUserdetails.domain,
                    };
                    if (byUploadingFile) {
                        const fileData = new FormData();
                        fileData.append("temp-files", dummyUsersFile);
                        const { status, data } = await dispatch(uploadFile(fileData, true));
                        if (status === 200 && data?.data) {
                            const { path } = data.data;
                            body.filePath = path.replace(BASE_URL + "/", "");
                        }
                        else {
                            failureAlert("Something went wrong!");
                            return;
                        }
                    }
                    else
                        body.userCount = parseInt(dummyUserdetails.noOfUsers);

                    if (!getMasterOtp?.masterOtp)
                        body.masterOtp = dummyUserdetails.otp;
                    const response = await dispatch(addUsersWithDummyEmailOrg(body, byUploadingFile));
                    if (response?.data?.status === false)
                        failureAlert(response?.data?.message);
                    else if (response?.status === 200) {
                        downloadFile(response?.data?.downloadLink?.downloadUrl);
                        successAlert("Users Added SuccessFully, check the file for details.");
                        setDummyUserDetails({ domain: '', noOfUsers: '', otp: '' });
                        setTouched({ domain: false, noOfUsers: false, otp: false, file: false });
                        dispatch(getMasterOtpOrganisation(orgDetailsByEmail?.data?.id));
                        setByUploadingFile(false);
                        setDummyUsersFile(null);
                    }
                    else {
                        failureAlert("Something went wrong!");
                    }
                }
                setAddDummyUsersClicked(false);
            }
        }
        callBack();
    }, [addDummyUsersClicked]);

    const handleUpdateMasterOtp = async (e) => {
        e.preventDefault();
        if (orgDetailsByEmail && dummyUserdetails.otp.length === 6) {
            const response = await dispatch(setMasterOtpOrganisation(orgDetailsByEmail.data?.id, { otp: dummyUserdetails.otp }));
            if (response?.status === 200) {
                dispatch(getMasterOtpOrganisation(orgDetailsByEmail?.data?.id));
                successAlert("Otp updated successfully");
            }
            else
                failureAlert("Something went wrong!");
        }
    }

    const validate = () => {
        const errors = {
            noOfUsers: '',
            domain: '',
            otp: '',
            file: ''
        };
        if (touched.noOfUsers && !dummyUserdetails.noOfUsers && !byUploadingFile)
            errors.noOfUsers = "No of users should be given";
        const userLimit = myPlanDetails?.data?.planDetail?.plan?.userLimit - orgUsers?.data?.length;
        if (touched.noOfUsers && dummyUserdetails.noOfUsers && userLimit && dummyUserdetails.noOfUsers > userLimit && !byUploadingFile)
            errors.noOfUsers = "No of users exceeding user limits";
        const domainFormat = /^@[\(\)\[\]a-zA-Z0-9\.\`\~\!\#\$\%\^\&\*\_\=\+\'-]+\.[a-zA-Z0-9]+$/;
        if (touched.domain && !domainFormat.test(dummyUserdetails.domain))
            errors.domain = "Domain should be in given format";
        if (touched.otp && (!dummyUserdetails.otp || dummyUserdetails.otp.length !== 6))
            errors.otp = "Please enter valid otp";
        if (touched.file && !dummyUsersFile && byUploadingFile)
            errors.file = "Please select any file";
        return errors;
    }
    const errors = validate();
    return (
        <div className="employedata-wrapper add-user-wrapper">
            <LoadingComponent loaded={loaded} />
            <ToastContainer position="bottom-center" />
            <div className="single-user-add">
                <div className="left">
                    <h4>Add a Single User</h4>
                    <p>You can add a single user to your organisation</p>
                </div>
                <div className="right">
                    <button
                        className="btn btn-primary"
                        onClick={() => setOpenAddEditUserModal(true)}
                    >
                        +Add User
                    </button>
                </div>
            </div>
            <div className="add-bulk-users">
                <h4>Add Multiple Users (bulk upload)</h4>
                <div className="employedata-csvcard">
                    <div className="employedata-csvfile">
                        <h5>Sample CSV file</h5>
                        <Link data-toggle="modal" to={'#'} data-target="#sample-csv">
                            <img src={excel} alt="csv" />
                            <span>View Sample</span>
                        </Link>
                    </div>
                    <div>
                        <div className="employedata-upload">
                            <h4>Upload CSV file to add Users</h4>
                            <div className="upload-button">
                                <button type="submit" className="btn btn-primary">
                                    <img src={uploadwhite} alt="download" />
                                    <span> Upload/Update</span>
                                </button>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={fileChanged}
                                />
                            </div>
                        </div>
                        <div className="download-note" >
                            {orgDetailsByEmail && orgDetailsByEmail.data && orgDetailsByEmail.data.files ?
                                <span>Download below listed file, edit and upload to update existing file.</span>
                                : <span>Check the sample file format once to upload properly.</span>
                            }
                        </div>
                        <div className="form-group"><div className="error-message">{csvError}</div></div>
                    </div>
                </div>
            </div>
            {orgDetailsByEmail &&
                orgDetailsByEmail.data &&
                orgDetailsByEmail.data.files && (
                    <div className="upload-table-wrapper">
                        <h4>Uploaded files</h4>
                        <div className="report-table uploadata-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>File Name</th>
                                        <th>Users</th>
                                        <th>Upload Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{orgDetailsByEmail.data.files.sheetName}</td>
                                        <td>{orgDetailsByEmail.data.files.noOfUsers}</td>
                                        <td>
                                            {uploadDate(orgDetailsByEmail.data.files.createdAt)}
                                        </td>
                                        <td>
                                            <button
                                                type="submit"
                                                className="btn btn-secondry"
                                                onClick={handleDownload}
                                            >
                                                <svg
                                                    width="14"
                                                    height="15"
                                                    viewBox="0 0 12 13"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M5.60246 9.52273C5.6547 9.57497 5.71671 9.61641 5.78495 9.64468C5.8532 9.67295 5.92635 9.6875 6.00022 9.6875C6.07409 9.6875 6.14724 9.67295 6.21549 9.64468C6.28373 9.61641 6.34574 9.57497 6.39798 9.52273L8.51928 7.40143C8.62477 7.29594 8.68403 7.15287 8.68403 7.00368C8.68403 6.8545 8.62477 6.71143 8.51928 6.60594C8.41379 6.50045 8.27072 6.44119 8.12154 6.44119C7.97235 6.44119 7.82928 6.50045 7.72379 6.60594L6.56272 7.76701V1.625C6.56272 1.47582 6.50346 1.33274 6.39797 1.22725C6.29248 1.12176 6.1494 1.0625 6.00022 1.0625C5.85104 1.0625 5.70796 1.12176 5.60247 1.22725C5.49698 1.33274 5.43772 1.47582 5.43772 1.625V7.76701L4.27665 6.60594C4.17116 6.50045 4.02809 6.44119 3.8789 6.44119C3.72972 6.44119 3.58665 6.50045 3.48116 6.60594C3.37567 6.71143 3.31641 6.8545 3.31641 7.00368C3.31641 7.15287 3.37567 7.29594 3.48116 7.40143L5.60246 9.52273Z"
                                                        fill="var(--color-theme)"
                                                    />
                                                    <path
                                                        d="M10.875 5.9375C10.7258 5.9375 10.5827 5.99676 10.4773 6.10225C10.3718 6.20774 10.3125 6.35082 10.3125 6.5V10.8125H1.6875V6.5C1.6875 6.35082 1.62824 6.20774 1.52275 6.10225C1.41726 5.99676 1.27418 5.9375 1.125 5.9375C0.975816 5.9375 0.832742 5.99676 0.727252 6.10225C0.621763 6.20774 0.5625 6.35082 0.5625 6.5V11C0.5625 11.2486 0.661272 11.4871 0.837087 11.6629C1.0129 11.8387 1.25136 11.9375 1.5 11.9375H10.5C10.7486 11.9375 10.9871 11.8387 11.1629 11.6629C11.3387 11.4871 11.4375 11.2486 11.4375 11V6.5C11.4375 6.35082 11.3782 6.20774 11.2727 6.10225C11.1673 5.99676 11.0242 5.9375 10.875 5.9375Z"
                                                        fill="var(--color-theme)"
                                                    />
                                                </svg>
                                                <span>download</span>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* table responsive */}
                        <div className="table-responsive m-transacton-table">
                            <div className="uploadtable-card c-white-card">
                                <div className="uploadtable-card-left">
                                    <h5>{orgDetailsByEmail.data.files.sheetName}</h5>
                                    <ul>
                                        <li key={'users'}>{orgDetailsByEmail.data.files.noOfUsers} users</li>
                                        <li key={'createdat'}>
                                            {uploadDate(orgDetailsByEmail.data.files.createdAt)}
                                        </li>
                                    </ul>
                                </div>
                                <div className="uploadtable-card-right">
                                    <button
                                        type="submit"
                                        className="btn btn-secondry"
                                        onClick={handleDownload}
                                    >
                                        <svg
                                            width="13"
                                            height="14"
                                            viewBox="0 0 12 13"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M5.60246 9.52273C5.6547 9.57497 5.71671 9.61641 5.78495 9.64468C5.8532 9.67295 5.92635 9.6875 6.00022 9.6875C6.07409 9.6875 6.14724 9.67295 6.21549 9.64468C6.28373 9.61641 6.34574 9.57497 6.39798 9.52273L8.51928 7.40143C8.62477 7.29594 8.68403 7.15287 8.68403 7.00368C8.68403 6.8545 8.62477 6.71143 8.51928 6.60594C8.41379 6.50045 8.27072 6.44119 8.12154 6.44119C7.97235 6.44119 7.82928 6.50045 7.72379 6.60594L6.56272 7.76701V1.625C6.56272 1.47582 6.50346 1.33274 6.39797 1.22725C6.29248 1.12176 6.1494 1.0625 6.00022 1.0625C5.85104 1.0625 5.70796 1.12176 5.60247 1.22725C5.49698 1.33274 5.43772 1.47582 5.43772 1.625V7.76701L4.27665 6.60594C4.17116 6.50045 4.02809 6.44119 3.8789 6.44119C3.72972 6.44119 3.58665 6.50045 3.48116 6.60594C3.37567 6.71143 3.31641 6.8545 3.31641 7.00368C3.31641 7.15287 3.37567 7.29594 3.48116 7.40143L5.60246 9.52273Z"
                                                fill="var(--color-theme)"
                                            />
                                            <path
                                                d="M10.875 5.9375C10.7258 5.9375 10.5827 5.99676 10.4773 6.10225C10.3718 6.20774 10.3125 6.35082 10.3125 6.5V10.8125H1.6875V6.5C1.6875 6.35082 1.62824 6.20774 1.52275 6.10225C1.41726 5.99676 1.27418 5.9375 1.125 5.9375C0.975816 5.9375 0.832742 5.99676 0.727252 6.10225C0.621763 6.20774 0.5625 6.35082 0.5625 6.5V11C0.5625 11.2486 0.661272 11.4871 0.837087 11.6629C1.0129 11.8387 1.25136 11.9375 1.5 11.9375H10.5C10.7486 11.9375 10.9871 11.8387 11.1629 11.6629C11.3387 11.4871 11.4375 11.2486 11.4375 11V6.5C11.4375 6.35082 11.3782 6.20774 11.2727 6.10225C11.1673 5.99676 11.0242 5.9375 10.875 5.9375Z"
                                                fill="var(--color-theme)"
                                            />
                                        </svg>
                                        <span> Download </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            {
                userInfo?.data?.role === ROLES.ORG_SUPER_ADMIN &&
                <div className="add-dummy">
                    <h4>Add Users With Dummy Email</h4>
                    <div className="toggle-file-container">
                        <div className="checkbox-container">
                            <input type="checkbox" className="form" onClick={e => setByUploadingFile(e.target.checked)} />
                            <span>By Uploading File</span>
                        </div>
                        {
                            byUploadingFile &&
                            <div className="employedata-csvfile">
                                <h5>Sample CSV file</h5>
                                <Link data-toggle="modal" to={'#'} data-target="#sample-csv-dummyusers">
                                    <img src={excel} alt="csv" />
                                    <span>View Sample</span>
                                </Link>
                            </div>
                        }
                    </div>
                    <form onSubmit={e => e.preventDefault()}>
                        <div className="group">
                            <div className="form-group">
                                {
                                    byUploadingFile ?
                                        <div className="upload-button">
                                            <button type="submit" className="btn btn-secondry">
                                                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clipPath="url(#clip0)">
                                                        <path d="M3.66797 10.2845V11.2257C3.66797 11.4753 3.76713 11.7147 3.94363 11.8912C4.12013 12.0677 4.35952 12.1668 4.60913 12.1668H10.2561C10.5057 12.1668 10.7451 12.0677 10.9216 11.8912C11.0981 11.7147 11.1973 11.4753 11.1973 11.2257V10.2845" stroke="var(--color-theme)" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M9.78516 5.61359L7.43225 3.26068L5.07935 5.61359" stroke="var(--color-theme)" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M7.43164 4.16675V9.81372" stroke="var(--color-theme)" strokeLinecap="round" strokeLinejoin="round" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0">
                                                            <rect width="16" height="16" fill="var(--color-theme)" transform="translate(0 0.5)" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                <span> Upload File</span>
                                            </button>
                                            <input
                                                type="file"
                                                accept=".csv"
                                                onChange={e => fileChanged(e, true)}
                                            />
                                            <div className="error-message file-name">{dummyUsersFile?.name ? dummyUsersFile.name : ""}</div>
                                            <div className="error-message">{errors.file}</div>
                                        </div>
                                        : <>
                                            <input type="number" className="text" placeholder="Enter no of users to add *" onChange={handleChangeData} onBlur={handleBlur} name="noOfUsers" value={dummyUserdetails.noOfUsers} onKeyPress={preventNonNumericalInput} />
                                            <div className="error-message">{errors.noOfUsers}</div>
                                        </>
                                }
                            </div>
                            <div className="form-group">
                                <input type="text" className="text" placeholder="Enter domain - Ex: @gmail.com *" onChange={handleChangeData} onBlur={handleBlur} name="domain" value={dummyUserdetails.domain} />
                                <div className="error-message">{errors.domain}</div>
                            </div>
                            {
                                getMasterOtp?.masterOtp ? null :
                                    <div className="form-group">
                                        <input type="password" className="text" ref={masterOtpRef} placeholder="Enter master otp *" onChange={handleChangeData} onBlur={handleBlur} name="otp" value={dummyUserdetails.otp} onKeyPress={preventNonNumericalInput} />
                                        <span toggle="#password-field" className="fa fa-fw fa-eye field-icon toggle-password" onClick={e => {
                                            if (e.target.classList?.value?.includes?.("fa-eye-slash")) {
                                                e.target.classList?.remove?.("fa-eye-slash")
                                                masterOtpRef.current.type = "password"
                                            }
                                            else {
                                                e.target.classList?.add?.("fa-eye-slash")
                                                masterOtpRef.current.type = "text"
                                            }
                                        }}></span>
                                        <div className="error-message">{errors.otp}</div>
                                    </div>
                            }
                        </div>
                        <button className="btn btn-primary" onClick={handleDummyUserSubmit}>Add Users</button>
                    </form>
                    {
                        getMasterOtp?.masterOtp ?
                            <form className="otp-form" onSubmit={e => e.preventDefault()}>
                                <div className="form-group">
                                    <input type="password" className="text" ref={masterOtpRef} placeholder="Enter master otp *" onChange={handleChangeData} onBlur={handleBlur} name="otp" value={dummyUserdetails.otp} onKeyPress={preventNonNumericalInput} />
                                    <span toggle="#password-field" className="fa fa-fw fa-eye field-icon toggle-password" onClick={e => {
                                        if (e.target.classList?.value?.includes?.("fa-eye-slash")) {
                                            e.target.classList?.remove?.("fa-eye-slash")
                                            masterOtpRef.current.type = "password"
                                        }
                                        else {
                                            e.target.classList?.add?.("fa-eye-slash")
                                            masterOtpRef.current.type = "text"
                                        }
                                    }}></span>
                                    <div className="error-message">{errors.otp}</div>
                                </div>
                                <button className="btn btn-primary" onClick={handleUpdateMasterOtp}>Update Otp</button>
                            </form> : null
                    }
                </div>
            }
            <div className="team-settings-wrapper">
                <h4>Team Settings</h4>
                <p className="question">Are users allowed to join with the game link?</p>
                <div className="options">
                    <label className="container-radio">
                        Yes
                        <input
                            checked={yesFlag}
                            type="radio"
                            onChange={() => updateDomainRestriction(true)}
                            name="userallow"
                            id="allow"
                            value="yes"
                        />
                        <span className="checkmark"></span>
                    </label>
                    <label className="container-radio">
                        No
                        <input
                            checked={!yesFlag}
                            type="radio"
                            onChange={() => updateDomainRestriction(false)}
                            name="userallow"
                            id="dont-allow"
                            value="no"
                        />
                        <span className="checkmark"></span>
                    </label>
                </div>
            </div>
            <div
                className={
                    yesFlag ? "upload-domain-wrapper" : "upload-domain-wrapper hide"
                }
            >
                <h4>Upload Domains</h4>
                <div className="form-group">
                    <label htmlFor="domainname">Domain Name</label>
                    <div className="input-group">
                        <input
                            type="text"
                            value={domainName}
                            onChange={handleChange}
                            placeholder="Enter a domain name: @example.com"
                        />
                        <button
                            className={
                                domainName.length > 1
                                    ? "btn btn-primary"
                                    : "btn btn-primary disabled"
                            }
                            onClick={addDomain}
                        >
                            +Add
                        </button>
                    </div>
                    <div className="error-message">{domainNameError}</div>
                </div>
                {orgDetailsByEmail &&
                    orgDetailsByEmail.data &&
                    orgDetailsByEmail.data.allowedDomains &&
                    orgDetailsByEmail.data.allowedDomains.length > 0 && (
                        <div className="upload-table-wrapper">
                            <h4>Uploaded Domains</h4>
                            <div className="report-table uploadata-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Domain Name</th>
                                            <th>Upload Date</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orgDetailsByEmail.data.allowedDomains.map((domain) => {
                                            return (
                                                <tr>
                                                    <td width="38%">{domain.name}</td>
                                                    <td>{uploadDate(domain.createdAt)}</td>
                                                    <td>
                                                        <img
                                                            src={deleteButton}
                                                            alt="delete"
                                                            onClick={(e) =>
                                                                handleDeleteDomain(e, domain.name)
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {/* table responsive */}
                            <div className="table-responsive m-transacton-table">
                                {orgDetailsByEmail.data.allowedDomains.map((domain) => {
                                    return (
                                        <div className="uploadtable-card c-white-card">
                                            <div className="uploadtable-card-left">
                                                <h5>{domain.name}</h5>
                                            </div>
                                            <div className="uploadtable-card-right">
                                                <li key={domain.createdAt}>{uploadDate(domain.createdAt)}</li>
                                                <img
                                                    src={deleteButton}
                                                    alt="delete"
                                                    onClick={(e) => handleDeleteDomain(e, domain.name)}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
            </div>
            {openConfirmUploadModal && (
                <Confirm
                    modalid="uploadcsv"
                    toggle={openConfirmUploadModal}
                    file={file}
                    setOpenConfirmUploadModal={setOpenConfirmUploadModal}
                    setUploadFlag={setUploadFlag}
                    isFileExisting={orgDetailsByEmail?.data?.files ? true : false}
                />
            )}
            {openAddEditUserModal && (
                <ManageTeamAddEditUserModal
                    modalid="add-user-modal"
                    toggle={openAddEditUserModal}
                    setOpenAddEditUserModal={setOpenAddEditUserModal}
                    successAlert={successAlert}
                />
            )}
            {openDeleteDomainModal && (
                <DeleteDomainModal
                    toggle={openDeleteDomainModal}
                    setOpenDeleteDomainModal={setOpenDeleteDomainModal}
                    deleteFunction={removeDomain}
                    deleteData={deleteDomainName}
                />
            )}
            {
                openUsersAddedModal &&
                <UsersAddedModal modalid={"usersAddedModal"} setOpenUsersAddedModal={setOpenUsersAddedModal} toggle={openUsersAddedModal} uploadedEmployeeDetails={uploadedEmployeeDetails} />
            }
            <SampleCsv modalid="sample-csv" />
            <SampleCsv modalid="sample-csv-dummyusers" dummyusers />
        </div>
    );
};

export default AddUser;
