import React, { useEffect, useState } from "react";
import "./analytics.css";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import PageLayout from "../../components/pagelayout/pagelayout";
import { failureAlert, IsAdmin, successAlert } from "../../helpers/helper";
import sidebarContentAdmin from "../../helpers/sidebarContentAdmin";
import { logOut } from "../../redux/actions/userAction";
import AnalyticsCard from "../../components/Analytics/AnalyticsCard";
import { downloadRegisteredUsers, downloadSubscribedUsers, getUsersCount } from "../../redux/actions/adminApiActions";
import LoadingComponent from "../../components/loader/LoadingComponent";
import { ToastContainer } from "react-toastify";
import { downloadDemoRequests } from "../../redux/actions/commonActions";
import Select from "react-select";
import { downloadFile } from "../../helpers/downloadFile";

const Analytics = (props) => {
    const dispatch = useDispatch();
    const isAdmin = IsAdmin();
    const [loaded, setLoaded] = useState(true);
    const [notificationDetails, setNotificationDetails] = useState({ message: "", userType: null, redirectLink: "" });

    const GetUsersCount = useSelector(state => state.getUsersCount);
    const { usersCount } = GetUsersCount;
    const DownloadRegisteredUsers = useSelector(state => state.downloadRegisteredUsers);
    const DownloadSubscribedUsers = useSelector(state => state.downloadSubscribedUsers);
    const DownloadDemoRequests = useSelector(state => state.downloadedDemoRequests);

    const userTypes = [
        { label: "User", value: "USER" },
        { label: "Employee", value: "EMPLOYEE" },
        { label: "Admin", value: "ORG_ADMIN" },
        { label: "Owner", value: "ORG_SUPER_ADMIN" },
    ]

    useEffect(() => {
        dispatch(getUsersCount());
        window.socket?.on("addNotification", (data) => {
            successAlert("Notification sent");
        })
    }, [window.socket])
    useEffect(() => {
        if (
            (GetUsersCount && GetUsersCount.loading) ||
            (DownloadRegisteredUsers && DownloadRegisteredUsers.loading) ||
            (DownloadSubscribedUsers && DownloadSubscribedUsers.loading) ||
            (DownloadDemoRequests && DownloadDemoRequests.loading)
        ) {
            setLoaded(false);
        }
        else
            setLoaded(true);
    }, [GetUsersCount, DownloadRegisteredUsers, DownloadSubscribedUsers, DownloadDemoRequests]);
    const downloadSubscribedUsersData = async () => {
        const response = await dispatch(downloadSubscribedUsers());
        if (response && response.data && response.data.data && response.data.data.downloadUrl) {
            downloadFile(response.data.data.downloadUrl);
        }
        else {
            failureAlert("Something went wrong!");
        }
    }
    const downloadRegisteredUsersData = async () => {
        const response = await dispatch(downloadRegisteredUsers());
        if (response && response.data && response.data.data && response.data.data.downloadUrl) {
            downloadFile(response.data.data.downloadUrl);
        }
        else {
            failureAlert("Something went wrong!");
        }
    }
    const downloadDemoRequestsData = async () => {
        const response = await dispatch(downloadDemoRequests());
        if (response && response.data && response.data.data && response.data.data.downloadUrl) {
            downloadFile(response.data.data.downloadUrl);
        }
        else {
            failureAlert("Something went wrong!");
        }
    }
    const signOut = async () => {
        await dispatch(logOut());
        if (isAdmin) props.history.push("/admin");
        else props.history.push("/");
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNotificationDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const handleSendNotifications = (e) => {
        e.preventDefault();
        if (window.socket) {
            setNotificationDetails({ message: "", userType: null, redirectLink: "" });
            window.socket.emit("addNotification", notificationDetails);
        }
        else {
            failureAlert("Something went wrong!");
        }
    }
    return (
        <div className='admin-homepage'>
            <PageLayout
                sidebartitle=""
                active={"Analytics"}
                sideBarContents={sidebarContentAdmin}
                profile
                {...props}
                signOut={signOut}
                isAdmin={isAdmin}
            >
                <LoadingComponent loaded={loaded} />
                <ToastContainer position="bottom-center" />
                <div className="analytics-container">
                    <div className="title-container">
                        <h4>Analytics</h4>
                    </div>
                    <div className="download-btn-grp">
                        <button className="btn btn-primary" onClick={downloadDemoRequestsData}>Download Demo Requests</button>
                        <button className="btn btn-primary" onClick={downloadRegisteredUsersData}>Download Registered Users Data</button>
                        <button className="btn btn-primary" onClick={downloadSubscribedUsersData}>Download Subscribed Users Data</button>
                    </div>
                    <div className="analyticscard-container">
                        <AnalyticsCard title="Total Registered Users" value={usersCount && usersCount.data && usersCount.data.registeredUsers ? usersCount.data.registeredUsers : 0} />
                        <AnalyticsCard title="Total Subscribers" value={usersCount && usersCount.data && usersCount.data.subscribedUsers ? usersCount.data.subscribedUsers : 0} />
                    </div>
                    <div className="send-notifications">
                        <h4>Send Notifications</h4>
                        <form onSubmit={handleSendNotifications}>
                            <div className="form-group">
                                <input type="text" placeholder="Enter message to send" value={notificationDetails.message} name="message" onChange={handleChange} className="form-field" />
                            </div>
                            <div className="form-group">
                                <input type="text" placeholder="Enter redirect link" value={notificationDetails.redirectLink} name="redirectLink" onChange={handleChange} className="form-field" />
                            </div>
                            <div className="form-group">
                                <Select
                                    classNamePrefix="react-select"
                                    className="form-select"
                                    options={userTypes}
                                    menuPlacement={"auto"}
                                    isMulti
                                    onChange={(e) => handleChange({ target: { name: "userType", value: e } })}
                                    placeholder="Select User Type"
                                    value={notificationDetails.userType}
                                // onBlur={() => handleBlur({ target: { name: "category" } })}
                                />
                            </div>
                            <button className="btn btn-primary">Send</button>
                        </form>
                    </div>
                </div>
            </PageLayout>
        </div>
    )
}
export default Analytics;