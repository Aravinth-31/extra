import React, { useEffect, useState } from 'react';
import "./account.css";
import '../usersData/usersData.css';
import '../gametitledetails/gametitledetails.css';
import '../activeGamesDetail/activeGamesDetail.css';
import search from "../../assets/images/search.svg";
import editImg from "../../assets/images/editWithFrame.svg";
import deleteImg from "../../assets/images/deleteWithFrame.svg";
import OrganisationLeaveDeleteModal from '../modal/OrganisationLeaveDeleteModal';
import ManageTeamDeleteUserModal from "../modal/manageTeamDeleteUser";
import ManageTeamAddEditUserModal from "../modal/manageTeamAddEditUsermodal";
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrganisationUser, getOrganisationUsers } from '../../redux/actions/organisationActions';
import { getMyPlans } from '../../redux/actions/plansApiActions';
import ROLES, { OrgRoles } from '../../helpers/userTypes';
import useDebouncedSearch from '../../helpers/debounce';
import LoadingComponent from '../loader/LoadingComponent';
import { successAlert } from '../../helpers/helper';
import { ToastContainer } from 'react-toastify';

const OrgDetails = (props) => {
    const useSearch = () => useDebouncedSearch(text => searchUsers(text));
    const searchUsers = (text) => {
        dispatch(getOrganisationUsers(text, true));
    }
    const { searchText, setSearchText, results } = useSearch();
    const { role, email } = props
    const [openLeaveDeleteModal, setLeaveDeleteModal] = useState(false);
    const [leaveOrgFlag, setLeaveOrgFlag] = useState(false);
    const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
    const [openAddEditUserModal, setOpenAddEditUserModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState({});
    const [loaded, setLoaded] = useState(true);
    const [ownerCount, setOwnerCount] = useState(false);

    const OrgUsers = useSelector(state => state.orgUsers);
    const { orgUsers } = OrgUsers;
    const MyPlanDetails = useSelector(state => state.getMyPlans);
    const { myPlanDetails } = MyPlanDetails;
    const OrgDetailsByEmail = useSelector(state => state.getOrganisation);
    const { orgDetailsByEmail } = OrgDetailsByEmail;
    const LeaveOrganisation = useSelector(state => state.leaveOrganisation);
    const { userInfo } = useSelector(state => state.getUser);

    const dispatch = useDispatch();
    useEffect(() => {
        if (
            (OrgUsers && OrgUsers.loading) ||
            (MyPlanDetails && MyPlanDetails.loading) ||
            (results && results.loading) ||
            (LeaveOrganisation && LeaveOrganisation.loading)
        ) {
            setLoaded(false);
        }
        else {
            setLoaded(true);
        }
    }, [OrgUsers, MyPlanDetails, results, LeaveOrganisation]);
    useEffect(() => {
        if (orgUsers && orgUsers.data) {
            var count = 0;
            orgUsers.data.map((user) => {
                if (user.role === ROLES.ORG_SUPER_ADMIN)
                    count += 1;
                return user;
            })
            setOwnerCount(count);
        }
    }, [orgUsers]);
    useEffect(() => {
        dispatch(getOrganisationUsers('', true));
        if (OrgRoles.includes(userInfo?.data?.role))
            dispatch(getMyPlans());
    }, []);

    const handleEdit = (user) => {
        setEditUser(user);
        setOpenAddEditUserModal(true);
    }
    const handleAdd = () => {
        setEditUser(null);
        setOpenAddEditUserModal(true);
    }
    const handleDelete = (user) => {
        setDeleteUser(user);
        setOpenDeleteUserModal(true)
    }
    const handleDeleteOrg = () => {
        setLeaveOrgFlag(false)
        setLeaveDeleteModal(true);
    }
    const handleLeaveOrg = () => {
        setLeaveOrgFlag(true);
        setLeaveDeleteModal(true);
    }
    const handleDeleteUser = async (e) => {
        const response = await dispatch(deleteOrganisationUser(deleteUser.id));
        if (response === 200) {
            setOpenDeleteUserModal(false);
            dispatch(getOrganisationUsers('', true));
        }
    }
    return (
        <div className="myaccount-wrapper organisation-details-wrapper organization-details">
            <LoadingComponent loaded={loaded} />
            <ToastContainer position="bottom-center" />
            <div className="myaccount-heading">
                <h5>Organisation Details</h5>
            </div>
            <h4 className="title">My Organisation</h4>
            <div className="group">
                <div className="form-group">
                    <label htmlFor="orgName">Organisation Name</label>
                    <input type="text" value={orgDetailsByEmail && orgDetailsByEmail.data && orgDetailsByEmail.data.name} className="form-control" disabled />
                </div>
                <div className="form-group">
                    <label htmlFor="orgName">Country</label>
                    <input type="text" value={orgDetailsByEmail && orgDetailsByEmail.data && orgDetailsByEmail.data.country} className="form-control" disabled />
                </div>
            </div>
            <hr /><br />
            <div className="details-top">
                <div className="counts">
                    <h4>Total Users</h4>
                    <p>
                        <span className="teams-user-count">
                            {myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail && myPlanDetails.data.planDetail.currentUserCount}
                            {" of "}
                            {myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail && myPlanDetails.data.planDetail.plan.userLimit}
                        </span>
                    </p>
                </div>
                <div className="right">
                    <div className="input-icon desk-view">
                        <img src={search} alt="search" />
                        <input
                            type="text"
                            name="search"
                            placeholder="Search by email"
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                // e.target.value.length === 0 && dispatch(getOrganisationUsers("", true))
                            }}
                        />
                    </div>
                    <button className={role === "ORG_SUPER_ADMIN" ? "btn btn-secondry-owner btn-secondry" : "btn btn-secondry"} onClick={handleAdd}>{role === "ORG_SUPER_ADMIN" ? "+ Add New Owner/Admin" : "+ Add New Admin"}</button>
                </div>
            </div>
            <div className="input-icon mobile-view">
                <img src={search} alt="search" />
                <input
                    type="text"
                    name="search"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        // e.target.value.length === 0 && dispatch(getOrganisationUsers("", true)) 
                    }}
                />
            </div>
            <div className="report-table mb0">
                {orgUsers && orgUsers.data && orgUsers.data.length > 0 ?
                    <div className="game-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email Id</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orgUsers.data.map((user) => {
                                        return (
                                            <tr key={JSON.stringify(user)}>
                                                <td className="">{(user.firstName || "") + " " + (user.lastName || "")}</td>
                                                <td className="">{user.email}</td>
                                                <td className="games-title">{user.role === ROLES.ORG_SUPER_ADMIN ? "Owner" : user.role === ROLES.ORG_ADMIN ? "Admin" : "User"}</td>
                                                <td className="action-group">
                                                    {
                                                        (role === ROLES.ORG_SUPER_ADMIN || user.role === role) && (user.email !== email) &&
                                                        <>
                                                            <span>
                                                                <img src={editImg} alt="" onClick={() => handleEdit(user)} />
                                                            </span>
                                                            <span>
                                                                <img src={deleteImg} alt="" onClick={() => handleDelete(user)} />
                                                            </span>
                                                        </>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    : <div className="no-users">
                        <h4>No Users Found</h4>
                    </div>
                }
            </div>
            <div className="table-responsive">
                {
                    orgUsers && orgUsers.data &&
                    orgUsers.data.map((user) => {
                        return (
                            <div className="report-t-card c-white-card">
                                <div className="t-top">
                                    <div className="role">
                                        <span className="role">Role</span>
                                        <h4>{user.role === ROLES.ORG_SUPER_ADMIN ? "Owner" : user.role === ROLES.ORG_ADMIN ? "Admin" : "User"}</h4>
                                    </div>
                                    <div className={((role === ROLES.ORG_SUPER_ADMIN || user.role === role) && (user.email !== email)) ? "action-group" : "action-group hide"}>
                                        <span>
                                            <img src={editImg} alt="" onClick={() => handleEdit(user)} />
                                        </span>
                                        <span>
                                            <img src={deleteImg} alt="" onClick={() => handleDelete(user)} />
                                        </span>
                                    </div>
                                </div>
                                <div className='t-bottom'>
                                    <h4 className="name">{(user.firstName || "") + " " + (user.lastName || "")}</h4>
                                    <h4 className="email">{user.email}</h4>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="leave-container">
                <hr /><br />
                <div className={role === "ORG_SUPER_ADMIN" ? "leave leave-owner" : "leave"}>
                    <h4>Exiting the platform</h4>
                    {
                        role === "ORG_SUPER_ADMIN" ?
                            <div className="btn-group">
                                <div className={`${ownerCount <= 1 ? "btn-tooltip" : ""}`}>
                                    <button className={ownerCount > 1 ? "btn btn-outline" : "btn btn-outline disabled"} onClick={(e) => (ownerCount > 1 && handleLeaveOrg(e))}>Leave Organisation</button>
                                    {ownerCount <= 1 ? <div className="tooltip" role="tooltip">
                                        <span>Please add/assign another user as an organisation owner.</span>
                                    </div> : null} </div>
                                <button className="btn btn-secondry" onClick={handleDeleteOrg}>Delete Organisation</button>
                            </div> :
                            <button type="submit" className="btn btn-outline" onClick={handleLeaveOrg}>Leave Organisation</button>
                    }
                </div>
            </div>
            <OrganisationLeaveDeleteModal modalid={"leave-delete-org"} {...props} setLeaveDeleteModal={setLeaveDeleteModal} toggle={openLeaveDeleteModal} leave={leaveOrgFlag} orgId={orgDetailsByEmail && orgDetailsByEmail.data && orgDetailsByEmail.data.id} />
            {openDeleteUserModal && <ManageTeamDeleteUserModal modalid="delete-user-modal" toggle={openDeleteUserModal} setOpenDeleteUserModal={setOpenDeleteUserModal} user={deleteUser} handleDeleteUser={handleDeleteUser} orgDetailPage />}
            {openAddEditUserModal &&
                <ManageTeamAddEditUserModal
                    modalid="add-user-modal"
                    toggle={openAddEditUserModal}
                    user={editUser}
                    setOpenAddEditUserModal={setOpenAddEditUserModal}
                    orgDetailPage
                    successAlert={successAlert}
                />}
        </div>
    )
}

export default OrgDetails;