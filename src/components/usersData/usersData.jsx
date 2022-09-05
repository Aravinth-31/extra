import React, { useEffect, useState } from "react";
import search from "../../assets/images/search.svg";
import editButton from "../../assets/images/editWithFrame.svg";
import deleteButton from "../../assets/images/deleteWithFrame.svg";
// import editButton from "../../assets/images/editButton.svg";
// import deleteButton from "../../assets/images/deleteButton.svg";
import arrowleft from "../../assets/images/paginationarrow.svg";
import "./usersData.css";
import ManageTeamDeleteUserModal from "../modal/manageTeamDeleteUser";
import ManageTeamAddEditUserModal from "../modal/manageTeamAddEditUsermodal";
import { useDispatch, useSelector } from "react-redux";
import { getOrganisationUsers, deleteOrganisationUser } from '../../redux/actions/organisationActions';
import Roles, { OrgRoles } from '../../helpers/userTypes';
import { getMyPlans } from '../../redux/actions/plansApiActions';
import useDebouncedSearch from "../../helpers/debounce";
import LoadingComponent from "../loader/LoadingComponent";
import { failureAlert, successAlert } from "../../helpers/helper";
import { ToastContainer } from "react-toastify";
import ConfirmModal from "../modal/confirmModal";
import { deleteUsersBulk, downloadOrgUsers } from "../../redux/actions/userAction";
import { downloadFile } from "../../helpers/downloadFile";
const UsersData = (props) => {
  const useSearch = () => useDebouncedSearch(text => searchUsers(text));
  const searchUsers = (text) => {
    dispatch(getOrganisationUsers(text));
    setPage(1);
  }
  const { searchText, setSearchText, results } = useSearch();
  const dispatch = useDispatch();
  const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
  const [openAddEditUserModal, setOpenAddEditUserModal] = useState(false);
  const [editUser, setEditUser] = useState({});
  const [deleteUser, setDeleteUser] = useState({});
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState(true);
  const [deleteUsersList, setDeleteUsersList] = useState([]);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const OrgUsers = useSelector(state => state.orgUsers);
  const { orgUsers } = OrgUsers;
  const UserInfo = useSelector((state) => state.getUser);
  const { userInfo } = UserInfo;
  const DeletedUsers = useSelector(state => state.deletedUsers);
  const { myPlanDetails } = useSelector(state => state.getMyPlans);
  const DeleteOrgUser = useSelector(state => state.deleteOrgUser);
  const DownloadOrgUsers = useSelector(state => state.downloadOrgUsers);

  const handleEdit = (user) => {
    setEditUser(user);
    setOpenAddEditUserModal(true);
  }
  const handleDelete = (user) => {
    setDeleteUser(user);
    setOpenDeleteUserModal(true)
  }
  useEffect(() => {
    if (OrgRoles.includes(userInfo?.data?.role))
      dispatch(getMyPlans());
  }, []);
  useEffect(() => {
    dispatch(getOrganisationUsers(searchText, false, page));
  }, [page]);
  useEffect(() => {
    if (
      (OrgUsers && OrgUsers.loading) ||
      (results && results.loading) ||
      (DeleteOrgUser && DeleteOrgUser.loading) ||
      (DeletedUsers && DeletedUsers.loading) ||
      (DownloadOrgUsers && DownloadOrgUsers.loading)
    ) {
      setLoaded(false);
    }
    else
      setLoaded(true);
  }, [OrgUsers, results, DeleteOrgUser, DeletedUsers, DownloadOrgUsers])
  const handleChange = (e) => {
    setSearchText(e.target.value);
    // if (e.target.value.length === 0) {
    //   dispatch(getOrganisationUsers(""));
    //   setPage(1);
    // }
  }
  const handleDeleteUser = async (e) => {
    const response = await dispatch(deleteOrganisationUser(deleteUser.id));
    if (response === 200) {
      setOpenDeleteUserModal(false);
      dispatch(getOrganisationUsers(''));
    }
  }

  const handleDeleteUsersToggle = async (e, user) => {
    let deletelist = [...deleteUsersList];
    if (e.target.checked) {
      if (!deletelist.includes(user.id))
        deletelist.push(user.id);
    }
    else {
      if (deletelist.includes(user.id)) {
        deletelist = deletelist.filter(id => id !== user.id);
      }
    }
    setDeleteUsersList(deletelist);
  }

  const handleDeleteUsersBulk = async () => {
    let deletelist = [...deleteUsersList]
    deletelist = deletelist.map(id => ({ id }));
    const response = await dispatch(deleteUsersBulk({ users: deletelist }));
    if (response === 200) {
      setOpenConfirmModal(false);
      successAlert(`${deletelist.length > 1 ? "Users" : "User"} deleted successfully`);
      dispatch(getOrganisationUsers(''));
      setDeleteUsersList([]);
      setPage(1);
    }
    else {
      failureAlert("Something went wrong!");
    }

  }

  const handleDownloadUsers = async () => {
    const response = await dispatch(downloadOrgUsers());
    if (response?.data?.data?.downloadUrl) {
      downloadFile(response.data.data.downloadUrl);
    }
    else
      failureAlert("Something went wrong!");
  }

  return (
    <div>
      {openDeleteUserModal && <ManageTeamDeleteUserModal toggle={openDeleteUserModal} user={deleteUser} handleDeleteUser={handleDeleteUser} setOpenDeleteUserModal={setOpenDeleteUserModal} />}
      {openAddEditUserModal &&
        <ManageTeamAddEditUserModal
          modalid="add-user-modal"
          toggle={openAddEditUserModal}
          user={editUser}
          setOpenAddEditUserModal={setOpenAddEditUserModal}
          successAlert={successAlert}
        />}
      <ConfirmModal modalid="confirm-modal" toggle={openConfirmModal} setOpenConfirmModal={setOpenConfirmModal} title="Delete Users" question="Are you sure to delete this users?" confirmFunction={handleDeleteUsersBulk} />
      <LoadingComponent loaded={loaded} />
      <ToastContainer position="bottom-center" />
      <div className="teams-search msearch">
        <div className="mspan">
          <span className="teams-user">Users </span>
          <br />
          <span className="teams-user-count">{orgUsers?.paginationData?.totalEntries} of {myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail
            && myPlanDetails.data.planDetail.plan.userLimit} users</span>
          {
            deleteUsersList.length !== 0 &&
            <button className="btn btn-secondry" onClick={e => setOpenConfirmModal(true)}>Delete</button>
          }
        </div>
        <div className="download-container">
          {
            userInfo?.data?.role === Roles.ORG_SUPER_ADMIN &&
            <button className="btn btn-primary download" onClick={handleDownloadUsers}>Download Users</button>
          }
          <div className="input-icon search-bar">
            <img src={search} alt="search" />
            <input type="text" name="search" placeholder="Search" value={searchText} onChange={handleChange} />
          </div>
        </div>
      </div>
      {/* Desktop table */}
      <div className="team-table">
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email ID</th>
              <th>Role</th>
              <th style={{ padding: '9px 40px' }}>Action</th>
              <th>
                <button onClick={e => setOpenConfirmModal(true)} className={`btn btn-secondry ${deleteUsersList.length > 0 ? "" : "invisible"}`}>Delete</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {orgUsers?.paginationData?.totalEntries > 0 ? (orgUsers.data.sort((a, b) => a.role > b.role ? -1 : 1).map((user, index) => {
              return (
                <tr key={JSON.stringify(user)}>
                  <td>{`${user.firstName ? user.firstName : ""} ${user.lastName ? user.lastName : ""}`}</td>
                  <td>{user.email}</td>
                  <td className="teams-role">{user.role === Roles.ORG_SUPER_ADMIN ? "Owner" : user.role === Roles.ORG_ADMIN ? "Admin" : "User"}</td>
                  <td className="action-group" width={"200px"}>
                    {!(userInfo && userInfo.data && userInfo.data.role === Roles.ORG_ADMIN && user.role === Roles.ORG_SUPER_ADMIN) ?
                      userInfo && userInfo.data && user.email !== userInfo.data.email &&
                      <>
                        <span>
                          <img src={editButton} alt="edit" className={`${deleteUsersList.length !== 0 ? "invisible" : ""}`} onClick={() => handleEdit(user)} />
                        </span>
                        <span>
                          <img src={deleteButton} alt="delete" className={`${deleteUsersList.length !== 0 ? "invisible" : ""}`} onClick={() => handleDelete(user)} />
                        </span>
                      </>
                      : null
                    }
                  </td>
                  {
                    !(userInfo && userInfo.data && userInfo.data.role === Roles.ORG_ADMIN && user.role === Roles.ORG_SUPER_ADMIN) ?
                      userInfo && userInfo.data && user.email !== userInfo.data.email ?
                        <td className="delete-marks">
                          <input className="form-select" onClick={e => handleDeleteUsersToggle(e, user)} type="checkbox" />
                        </td> : <td>
                        </td>
                      : <td>
                      </td>
                  }
                </tr>
              );
            })) : (<>{!OrgUsers.loading && <div>No User found.</div>}</>)}

          </tbody>
        </table>
      </div>
      {/* Mobile view */}
      <div className="table-responsive m-teams-table">
        {orgUsers?.paginationData?.totalEntries > 0 ? (orgUsers.data.sort((a, b) => a.role > b.role ? -1 : 1).map((user, index) => {

          return (
            <div className="team-m-card c-white-card" key={JSON.stringify(user)}>
              <div className="team-m-top">
                <div className="role">
                  <span>Role</span>
                  <div className="teams-m-title">{user.role === Roles.ORG_SUPER_ADMIN ? "Owner" : user.role === Roles.ORG_ADMIN ? "Admin" : "User"}</div>
                </div>
                <div className="action-group">
                  {
                    userInfo && userInfo.data && user.email !== userInfo.data.email &&
                    <>
                      <span>
                        <img src={editButton} alt="edit" className={`${deleteUsersList.length !== 0 ? "invisible" : ""}`} onClick={() => handleEdit(user)} />
                      </span>
                      <span>
                        <img src={deleteButton} alt="delete" className={`edit-btn ${deleteUsersList.length !== 0 ? "invisible" : ""}`} onClick={() => handleDelete(user)} />
                      </span>
                    </>
                  }
                </div>
              </div>

              <div className="team-m-bottom">
                <div>
                  <div className="teams-m-name">{`${user.firstName ? user.firstName : ""} ${user.lastName ? user.lastName : ""}`}</div>
                  <div className="team-m-user">{user.email}</div>
                </div>
                <div className="delete-marks">
                  {
                    !(userInfo && userInfo.data && userInfo.data.role === Roles.ORG_ADMIN && user.role === Roles.ORG_SUPER_ADMIN) ?
                      userInfo && userInfo.data && user.email !== userInfo.data.email &&
                      <input className="form-select" onClick={e => handleDeleteUsersToggle(e, user)} type="checkbox" />
                      : null
                  }
                </div>
              </div>
            </div>
          );

        })) : (<>{!OrgUsers.loading && <div>No User found.</div>}</>)}



      </div>
      {/* Pagination */}
      {orgUsers?.paginationData?.totalEntries > 0 &&
        <div className="pagination-wrapper manage-team">
          <button
            className={(page > 1 && deleteUsersList.length === 0) ? "pagination-left enable" : "pagination-left"}
            onClick={() => {
              if (page > 1 && deleteUsersList.length === 0) {
                setPage(page - 1);
                window.scrollTo(0, 0);
              }
            }}
          >
            <img src={arrowleft} alt="arrow left" />
          </button>
          <div className="pagination-number">
            <h5>{page}</h5>
            <span>
              of {orgUsers ? Math.ceil(orgUsers?.paginationData?.totalEntries / 12) : 1}{" "}
              pages
            </span>
          </div>
          <button
            className={(page < Math.ceil(orgUsers?.paginationData?.totalEntries / 12)) && deleteUsersList.length === 0 ? "pagination-right enable" : "pagination-right"}
            onClick={() => {
              if (page < Math.ceil(orgUsers?.paginationData?.totalEntries / 12) && deleteUsersList.length === 0) {
                setPage(page + 1);
                window.scrollTo(0, 0);
              }
            }}
          >
            <img src={arrowleft} alt="arrow right" />
          </button>
        </div>}
    </div>
  );
};
export default UsersData;
