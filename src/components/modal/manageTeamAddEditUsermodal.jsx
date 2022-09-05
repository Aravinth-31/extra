import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux"
import "./modal.css";
import Modal from "./modal";
import Select from "react-select";
import { useSelector } from "react-redux";
import ROLES from "../../helpers/userTypes";
import { getOrganisationUsers, organisationAdduser, organisationEdituser } from "../../redux/actions/organisationActions";
import Roles from '../../helpers/userTypes';
import LoadingComponent from "../loader/LoadingComponent";

const RoleOptions = {
  owner: [
    { label: "User", value: "EMPLOYEE" },
    { label: "Admin", value: "ORG_ADMIN" },
    { label: "Owner", value: "ORG_SUPER_ADMIN" }
  ],
  admin: [
    { label: "User", value: "EMPLOYEE" },
    { label: "Admin", value: "ORG_ADMIN" }
  ]
}
const ManageTeamAddEditUserModal = ({
  modalid,
  toggle,
  user,
  setOpenAddEditUserModal,
  orgDetailPage,
  successAlert
}) => {
  const [userDetails, setUserDetails] = useState({
    role: "",
    firstName: "",
    lastName: "",
    email: ""
  })
  const [prevDetails, setPrevDetails] = useState({
    role: "",
    firstName: "",
    lastName: "",
    email: ""
  })
  const { userInfo } = useSelector(state => state.getUser);
  const { orgUsers } = useSelector(state => state.orgUsers);
  const [existingUsers, setExistingUsers] = useState([]);
  const [options, setOptions] = useState([]);
  const [role, setRole] = useState("");
  const [touched, setTouched] = useState({
    role: false, firstName: false, email: false
  })
  const [enableSave, setEnableSave] = useState(true);
  const dispatch = useDispatch();
  const AddUser = useSelector(state => state.addUser);
  const [loaded, setLoaded] = useState(true);
  const [userError, setUserError] = useState("");

  useEffect(() => {
    if (user) {
      setEnableSave(false);
      const { email, firstName, lastName, role } = user;
      let label;
      if (role === Roles.ORG_ADMIN) {
        label = "Admin";
      }
      if (role === Roles.ORG_SUPER_ADMIN) {
        label = "Owner";
      }
      if (role === Roles.EMPLOYEE) {
        label = "User";
      }
      setUserDetails(prevState => ({
        ...prevState,
        firstName: firstName || "",
        lastName: lastName || "",
        email: email,
        role: { label: label, value: role }
      }));
      setPrevDetails(prevState => ({
        ...prevState,
        firstName: firstName || "",
        lastName: lastName || "",
        email: email,
        role: { label: label, value: role }
      }));
    }
  }, [user]);
  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.role)
      setRole(userInfo.data.role);
  }, [userInfo])
  useEffect(() => {
    if (orgUsers && orgUsers.data) {
      var users = [];
      orgUsers.data.forEach(user => {
        users.push(user.email);
      });
      if (userInfo && userInfo.data)
        users.push(userInfo.data.email)
      setExistingUsers(users);
    }
  }, [orgUsers]);
  useEffect(() => {
    if (role === ROLES.ORG_SUPER_ADMIN) {
      if (orgDetailPage)
        setOptions(RoleOptions.owner.slice(1));
      else
        setOptions(RoleOptions.owner);
    }
    else if (role === ROLES.ORG_ADMIN) {
      if (orgDetailPage)
        setOptions(RoleOptions.admin.slice(1));
      else
        setOptions(RoleOptions.admin);
    }
  }, [role]);
  useEffect(() => {
    if (user) {
      if (JSON.stringify(userDetails) === JSON.stringify(prevDetails))
        setEnableSave(false);
      else
        setEnableSave(true);
    }
  }, [userDetails]);
  useEffect(() => {
    if ((AddUser && AddUser.loading))
      setLoaded(false);
    else
      setLoaded(true);
  }, [AddUser]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    const nameFormat = /^[a-z]*$/i;
    if ((name === "firstName" || name === "lastName") && !nameFormat.test(value))
      return
    if ((name === "email") && userError !== "")
      setUserError("")
    setUserDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  }
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prevState => ({
      ...prevState,
      [name]: true
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!enableSave)
      return;
    setTouched({ firstName: true, email: true, role: true })
    if (userDetails.role === "" || JSON.stringify(validate()) !== JSON.stringify({ role: "", firstName: "", email: "", form: "" }))
      return
    const { role, firstName, lastName, email } = userDetails;

    if (user) {
      const response = await dispatch(organisationEdituser(user.id, { role: role.value, firstName, lastName, email }));
      if (response === 200)
        setOpenAddEditUserModal(false);
      dispatch(getOrganisationUsers('', orgDetailPage));
    } else {
      const response = await dispatch(organisationAdduser({ role: role.value, firstName, lastName, email }));
      if (response && response.data && response.data.message === "USER LIMIT EXCEEDED")
        setUserError("User Limit Exceeds!");
      else if (response && response.status === 200) {
        successAlert(`Invitation sent "User invited successfully"`);
        setOpenAddEditUserModal(false);
      }
      else if (response && response.message === "USER EXISTS IN OTHER ORGANIZATION")
        setUserError("User exists in another organisation");
      else if (response && response.message)
        setUserError(response.message);
      dispatch(getOrganisationUsers('', orgDetailPage));
    }
  }
  function validateEmail(email) {
    // const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const re = /^\w+([\.\$\#\!\&\%\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase());
  }
  const validate = () => {
    const errors = {
      role: "",
      firstName: "",
      email: "",
      form: ""
    }
    const firstNameFormat = /[a-zA-Z]{3,15}/
    if (touched.firstName && !firstNameFormat.test(userDetails.firstName))
      errors.firstName = "Please enter valid first name";
    if (touched.email && (!validateEmail(userDetails.email) || userDetails.email === ""))
      errors.email = "Please enter valid email";
    if (touched.role && userDetails.role === "" && !user)
      errors.role = "Please select any role";
    if (existingUsers.includes(userDetails.email.toLowerCase()) && !user)
      errors.form = "User already exists";
    return errors;
  }
  const errors = validate();
  return (
    <Modal modalid={modalid} toggle={toggle}>
      <div className="modal-body">
        <div className="close-icon" data-dismiss="modal" aria-label="Close" onClick={() => setOpenAddEditUserModal(false)}>
          <div
            className="close-btn-icon"
          ></div>
        </div>
        <div className="thankyou-body add-user">
          <LoadingComponent loaded={loaded} />
          <div className="team-Header">{user ? "Edit User Details" : "Add New User"}</div>
          <form onSubmit={handleSubmit} onKeyDown={(e) => {
            if (e.key === "Enter")
              e.preventDefault();
          }}>
            <div className="adduser-body">
              <div className="form-group">
                <label>Role *</label>
                <Select
                  classNamePrefix="react-select"
                  className="form-select"
                  placeholder="Select Role"
                  options={options}
                  value={userDetails.role}
                  onChange={(e) => handleChange({ target: { name: "role", value: e } })}
                  onBlur={() => handleBlur({ target: { name: "role" } })}
                  isDisabled={user ? !user.isMail : false}
                ></Select>
                <div className="error-message">{errors.role}</div>
              </div>
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  placeholder=""
                  value={userDetails.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={20}
                  required
                />
                <div className="error-message">{errors.firstName}</div>
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  placeholder=""
                  maxLength={20}
                  value={userDetails.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email Id *</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="mathew@gmail.com"
                  value={userDetails.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  disabled={user ? true : false}
                />
                <div className="error-message">{errors.email}</div>
                <div className="error-message">{errors.form}</div>
                <div className="error-message">{userError}</div>
              </div>
            </div>
            <div className="btn-grp">
              <button
                className="btn btn-outline team-button"
                onClick={() => setOpenAddEditUserModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className={enableSave ? "btn btn-primary team-button" : "btn btn-primary team-button disabled"} >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
export default ManageTeamAddEditUserModal;
