import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./organisationuser.css";

import deleteIconAdmin from "../../assets/images/deleteIconAdmin.svg";
import search from "../../assets/images/search.svg";
import ROLES from "../../helpers/userTypes";
import arrowleft from "../../assets/images/paginationarrow.svg";
import arrowback from "../../assets/images/arrow-back.svg";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import sidebarContentAdmin from "../../helpers/sidebarContentAdmin";
import PageLayout from "../../components/pagelayout/pagelayout";
import { deleteUsersBulk, logOut } from "../../redux/actions/userAction";
import { getUserByOrganisation } from "../../redux/actions/organisationActions";
import { useEffect } from "react";
import useDebouncedSearch from "../../helpers/debounce";
import { toggleOrgUserByAdmin } from "../../redux/actions/organisationActions";
import { getAllOrganisations } from "../../redux/actions/organisationActions";
import LoadingComponent from "../../components/loader/LoadingComponent";
import { IsAdmin, successAlert } from "../../helpers/helper";
import ManageTeamDeleteUserModal from "../../components/modal/manageTeamDeleteUser";

const OrganisationUsers = (props) => {
  const [loaded, setLoaded] = useState(true);
  const useSearch = () => useDebouncedSearch((text) => searchDetails(text));
  const searchDetails = (text) => {
    dispatch(getUserByOrganisation(props.match.params.id, text));
  };
  const [orgDisabled, setOrgDisabled] = useState(false);
  const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
  const [deleteUser, setDeleteUser] = useState({});
  const { searchText, setSearchText, results } = useSearch();
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const isAdmin = IsAdmin();

  useEffect(() => {
    dispatch(getUserByOrganisation(props.match.params.id, searchText, page));
  }, [page]);

  const UsersByOrganisation = useSelector((state) => state.usersByOrganisation);
  const { usersByOrganisation } = UsersByOrganisation;
  const AllOrganisationData = useSelector(state => state.allOrganisationData);
  const { allOrganisationData } = AllOrganisationData;
  const DeletedUsers = useSelector(state => state.deletedUsers);
  const [ownerCount, setOwnerCount] = useState(0);

  const handleChange = (e) => {
    setSearchText(e.target.value);
    setPage(1);
    // if (e.target.value.length === 0) {
    //   setTimeout(() => {
    //     dispatch(getUserByOrganisation(props.match.params.id, ""));
    //   }, 500)
    // }
  };
  useEffect(() => {
    if (!allOrganisationData) {
      dispatch(getAllOrganisations(''));
    }
  }, []);
  useEffect(() => {
    if (allOrganisationData && allOrganisationData.data) {
      let orgObject = allOrganisationData.data.allOrganisationDetails.find((org) => org.organizationId === props.match.params.id);
      setOrgDisabled(!orgObject.isActive);
    }
  }, [allOrganisationData]);
  const signOut = async () => {
    await dispatch(logOut());
    if (isAdmin) props.history.push("/admin");
    else props.history.push("/");
  };
  useEffect(() => {
    if (
      (UsersByOrganisation && UsersByOrganisation.loading) ||
      (results && results.loading) ||
      (DeletedUsers && DeletedUsers.loading)
    ) {
      setLoaded(false);
    } else {
      setLoaded(true);
    }
  }, [UsersByOrganisation, results, DeletedUsers]);

  useEffect(() => {
    if (usersByOrganisation?.data?.users) {
      let count = 0;
      usersByOrganisation.data.users.map((user) => {
        if (user.role === ROLES.ORG_SUPER_ADMIN)
          count += 1;
      })
      setOwnerCount(count);
    }
  }, [usersByOrganisation])

  const handleToggleUser = async (userId, isActive) => {
    if (orgDisabled) {
      return
    }
    const resStatus = await dispatch(toggleOrgUserByAdmin(userId, isActive));
    if (resStatus === 200) {
      dispatch(getUserByOrganisation(props.match.params.id, ""));
    }
  };
  const handleUserDelete = (e) => {
    setOpenDeleteUserModal(true);
    setDeleteUser(e);
  }
  const handleDeleteUser = async () => {
    const response = await dispatch(deleteUsersBulk({ users: [{ id: deleteUser.id }] }));
    if (response === 200) {
      dispatch(getUserByOrganisation(props.match.params.id, ""));
      successAlert("User Deleted Successfully!");
      setOpenDeleteUserModal(false);
    }
  }
  return (
    <PageLayout
      sidebartitle=""
      active={"Organisation Details"}
      category
      sideBarContents={sidebarContentAdmin}
      profile
      {...props}
      signOut={signOut}
      {...props}
      isAdmin={isAdmin}
    >
      <div className="organisation-users">
        <div className="teams-search msearch">
          <div className="back-arrow">
            <Link to="/org-details-admin">
              <img src={arrowback} alt="back" />
            </Link>
          </div>
          <div className="mspan">
            <span className="teams-user">Organisation Users </span>
            <br />
            {/* <span className="teams-user-count">{orgUsers && orgUsers.data && orgUsers.data.length} of {myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail
                        && myPlanDetails.data.planDetail.plan.userLimit}</span> */}
          </div>
          <div className="input-icon search-bar">
            <img src={search} alt="search" />
            <input
              type="text"
              name="search"
              placeholder="Search"
              value={searchText}
              onChange={handleChange}
            />
          </div>
        </div>
        <LoadingComponent loaded={loaded} />
        <ToastContainer position="bottom-center" />
        {/* Desktop table */}
        <div className="team-table">
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Email ID</th>
                <th>Role</th>
                <th>Action</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                usersByOrganisation?.paginationData?.totalEntries > 0 ? (
                  usersByOrganisation.data.users
                    .sort((a, b) => (a.role < b.role ? 1 : -1))
                    .map((user, index) => {
                      return (
                        <tr>
                          <td>{user.firstName + " " + user.lastName}</td>
                          <td>{user.email}</td>
                          <td className="teams-role">
                            {user.role === ROLES.ORG_SUPER_ADMIN
                              ? "Owner"
                              : user.role === ROLES.ORG_ADMIN
                                ? "Admin"
                                : "User"}
                          </td>
                          <td className="action-group">
                            <div className="orgDetails-actions">
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  disabled={orgDisabled}
                                  defaultChecked={user.isActive}
                                />
                                <span
                                  className={`slider ${orgDisabled ? "disabled" : null}`}
                                  onClick={() =>
                                    handleToggleUser(user.id, !user.isActive)
                                  }
                                ></span>
                              </label>
                            </div>
                          </td>
                          <td className="action-group">
                            <div className={`orgDetails-actions ${(user.role === ROLES.ORG_SUPER_ADMIN && ownerCount < 2) ? "btn-tooltip" : ""}`}>
                              <button className={`view-btn btn-primary delete ${(user.role === ROLES.ORG_SUPER_ADMIN && ownerCount < 2) ? "disabled" : ""}`} onClick={() => {
                                if (user.role === ROLES.ORG_SUPER_ADMIN && ownerCount < 2)
                                  return;
                                handleUserDelete(user);
                              }}>
                                <img src={deleteIconAdmin} alt="search" />
                              </button>
                              {(user.role === ROLES.ORG_SUPER_ADMIN && ownerCount < 2) ? <div className="tooltip" role="tooltip">
                                <span>Atleast one owner should be there.</span>
                              </div> : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <>{!UsersByOrganisation.loading && <div>No User found.</div>}</>
                )}
            </tbody>
          </table>
        </div>
        {/* Mobile view */}
        <div className="table-responsive m-teams-table">
          {
            usersByOrganisation?.paginationData?.totalEntries > 0 ? (
              usersByOrganisation.data.users
                .sort((a, b) => (a.role > b.role ? 1 : -1))
                .map((user, index) => {
                  return (
                    <div className="team-m-card c-white-card">
                      <div className="team-m-top">
                        <div className="role">
                          <span>Role</span>
                          <div className="teams-m-title">
                            {user.role === ROLES.ORG_SUPER_ADMIN
                              ? "Owner"
                              : user.role === ROLES.ORG_ADMIN
                                ? "Admin"
                                : "User"}
                          </div>
                        </div>
                        <div className="action-group">
                          <div className="orgDetails-actions ">
                            <label className="switch">
                              <input
                                type="checkbox"
                                disabled={orgDisabled}
                                defaultChecked={user.isActive}
                              />
                              <span
                                className={`slider ${orgDisabled ? "disabled" : null}`}
                                onClick={() =>
                                  handleToggleUser(user.id, !user.isActive)
                                }
                              ></span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="team-m-bottom">
                        <div>
                          <div className="teams-m-name">
                            {user.firstName + " " + user.lastName}
                          </div>
                          <div className="team-m-user">{user.email}</div>
                        </div>
                        <div className={`orgDetails-actions ${(user.role === ROLES.ORG_SUPER_ADMIN && ownerCount < 2) ? "btn-tooltip" : ""}`}>
                          <button className={`view-btn btn-primary delete ${(user.role === ROLES.ORG_SUPER_ADMIN && ownerCount < 2) ? "disabled" : ""}`}
                            onClick={() => {
                              if (user.role === ROLES.ORG_SUPER_ADMIN && ownerCount < 2)
                                return;
                              handleUserDelete(user)
                            }}>
                            <img src={deleteIconAdmin} alt="search" />
                          </button>
                          {(user.role === ROLES.ORG_SUPER_ADMIN && ownerCount < 2) ? <div className="tooltip" role="tooltip">
                            <span>Atleast one owner should be there.</span>
                          </div> : null}
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <>{!UsersByOrganisation.loading && <div>No User found.</div>}</>
            )}
        </div>
        {/* Pagination */}
        {
          usersByOrganisation?.paginationData?.totalEntries > 0 && (
            <div className="pagination-wrapper">
              <button
                className={
                  page > 1 ? "pagination-left enable" : "pagination-left"
                }
                onClick={() => {
                  if (page > 1) setPage(page - 1);
                  window.scrollTo(0, 0);
                }}
              >
                <img src={arrowleft} alt="arrow left" />
              </button>
              <div className="pagination-number">
                <h5>{page}</h5>
                <span>
                  of{" "}
                  {usersByOrganisation
                    ? Math.ceil(usersByOrganisation?.paginationData?.totalEntries / 12)
                    : 1}{" "}
                  pages
                </span>
              </div>
              <button
                className={
                  page < Math.ceil(usersByOrganisation?.paginationData?.totalEntries / 12)
                    ? "pagination-right enable"
                    : "pagination-right"
                }
                onClick={() => {
                  if (
                    page < Math.ceil(usersByOrganisation?.paginationData?.totalEntries / 12)
                  )
                    setPage(page + 1);
                }}
              >
                <img src={arrowleft} alt="arrow right" />
              </button>
            </div>
          )}
        {openDeleteUserModal && <ManageTeamDeleteUserModal modalid="delete-user-modal" toggle={openDeleteUserModal} setOpenDeleteUserModal={setOpenDeleteUserModal} user={deleteUser} handleDeleteUser={handleDeleteUser} orgDetailPage />}

      </div>
    </PageLayout>
  );
};

export default OrganisationUsers;
