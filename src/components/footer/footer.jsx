import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./footer.css";

import SvgIcon from "../../components/svgIcon/svgIcon";
import sidebarContentAdmin from '../../helpers/sidebarContentAdmin';

// image
import locationImg from "../../assets/images/location.svg";
import phoneImg from "../../assets/images/phone.svg";
import mailImg from "../../assets/images/mail.svg";
import ExtraMilePlay from '../../assets/images/ExtramilPlay.png';

import {
  getAllSocialLinks,
  updateSocialLinks,
  getAllDescriptions,
  updateDescriptions,
  getContactUs,
  updateContactUs,
} from "../../redux/actions/homepageActions";
import ROLES, { OrgRoles } from '../../helpers/userTypes';
import ConfirmSaveSortModal from "../bannerEdit/ConfirmSaveModal";
import PageLayout from "../../components/pagelayout/pagelayout";
import { logOut } from "../../redux/actions/userAction";
import { IsAdmin } from "../../helpers/helper";

const FooterData = (props) => {
  const dispatch = useDispatch();
  const [contactUsEdit, setcontactUsEdit] = useState({
    isEdit: false,
    address: "",
    phone: "",
    mail: "",
    map: "",
  });

  const [contactUsEditErrors, setContactUsEditErrors] = useState({
    address: "",
    mail: "",
    phone: "",
  });
  const { socialLinks } = useSelector((state) => state.getSocialLinks);
  const { descriptions } = useSelector((state) => state.getDescription);
  const { gameCategory } = useSelector((state) => state.gameAllCategory);
  const { gameObjectives } = useSelector(state => state.getAllObjectives);

  const [socialLinkData, setSocialLink] = useState([]);
  const [descriptionData, setDescription] = useState("");

  const [index, setIndex] = useState(-1);
  const [confirmSaveModal, setConfirmSaveModal] = useState(false);
  const [saver, setSaver] = useState("");
  const [employee, setEmployee] = useState(true);
  const [confirmSave, setConfirmSave] = useState(false);
  const UserInfo = useSelector(state => state.getUser);
  const { userInfo } = UserInfo;
  var role = "";
  if (userInfo && userInfo.data) {
    role = userInfo.data.role;
  }

  useEffect(() => {
    dispatch(getAllSocialLinks());
    dispatch(getAllDescriptions());
  }, []);

  useEffect(() => {
    if (role === ROLES.EMPLOYEE)
      setEmployee(true);
    else
      setEmployee(false);
  }, [role]);

  useEffect(() => {
    if (socialLinks && socialLinks.data) setSocialLink(socialLinks.data);
  }, [socialLinks]);

  useEffect(() => {
    if (descriptions && descriptions.data)
      setDescription(descriptions.data[0] || []);
  }, [descriptions]);

  useEffect(() => {
    const data = {
      address: props.contactUs && props.contactUs.find((contact) => contact.mode === "ADDRESS") ?
        props.contactUs.find((contact) => contact.mode === "ADDRESS").value : "",
      phone: props.contactUs && props.contactUs.find((contact) => contact.mode === "PHONE") ?
        props.contactUs.find((contact) => contact.mode === "PHONE").value : "",
      mail: props.contactUs && props.contactUs.find((contact) => contact.mode === "MAIL") ?
        props.contactUs.find((contact) => contact.mode === "MAIL").value : "",
      map: props.contactUs && props.contactUs.find((contact) => contact.mode === "MAP") ?
        props.contactUs.find((contact) => contact.mode === "MAP").value : "",
    }
    setcontactUsEdit(prevState => ({
      ...prevState,
      ...data
    }))
  }, [props.contactUs]);

  const handleChangeContactUs = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setcontactUsEdit((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const saveContactUs = (e) => {
    const errors = { mail: "", address: "", phone: "" };
    if (contactUsEdit.address === "")
      errors.address = "Please enter a valid address";
    else if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        contactUsEdit.mail
      )
    )
      errors.mail = "Please enter a valid email";
    else if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(contactUsEdit.phone))
      errors.phone = "Please enter valid phone";
    else {
      const contactUsId = {
        address: props.contactUs.find((contact) => contact.mode === "ADDRESS") ?
          props.contactUs.find((contact) => contact.mode === "ADDRESS").id : "",
        phone: props.contactUs.find((contact) => contact.mode === "PHONE") ?
          props.contactUs.find((contact) => contact.mode === "PHONE").id : "",
        email: props.contactUs.find((contact) => contact.mode === "MAIL") ?
          props.contactUs.find((contact) => contact.mode === "MAIL").id : "",
        map: props.contactUs.find((contact) => contact.mode === "MAP") ?
          props.contactUs.find((contact) => contact.mode === "MAP").id : "",
      };

      dispatch(updateContactUs(contactUsEdit, contactUsId)).then(() =>
        dispatch(getContactUs())
      );
    }
    setContactUsEditErrors(errors);
  };

  const handleSocialLinkChange = (e, index) => {
    const tmpLinks = [...socialLinkData];
    tmpLinks[index].link = e.target.value;
    setSocialLink(tmpLinks);
  };

  const updateSocialLink = (index) => {
    const id = socialLinkData[index].id;
    const link = socialLinkData[index].link;
    dispatch(updateSocialLinks(id, { link })).then(() =>
      dispatch(getAllSocialLinks())
    );
  };

  const addOrRemoveSocialLink = (index) => {
    const id = socialLinkData[index].id;
    const deleted = !socialLinkData[index].deleted;
    dispatch(updateSocialLinks(id, { deleted })).then(() =>
      dispatch(getAllSocialLinks())
    );
  };

  const updateDescription = () => {
    const { id, text } = descriptionData;
    dispatch(updateDescriptions(id, { text })).then(() =>
      dispatch(getAllDescriptions())
    );
  };

  useEffect(() => {
    if (confirmSave) {
      if (saver === "desc") {
        updateDescription();
        setSaver("");
      } else if (saver === "props.contactUs") {
        saveContactUs();
        setSaver("");
      } else if (saver === "social") {
        updateSocialLink(index);
        setSaver("");
      }
    }
  }, [saver, confirmSave]);

  return (
    // linkes need to added on Link title
    <footer key={props.isAdmin ? "admin-footer" : "user-footer"}>
      {props.isAdmin && <h4 className="title">Footer</h4>}
      {confirmSaveModal && (
        <ConfirmSaveSortModal
          setConfirmSave={setConfirmSave}
          setConfirmSaveModal={setConfirmSaveModal}
        />
      )}
      <div className={`footer-top ${employee ? "employee-style" : ""}`}>
        {
          !employee &&
          <div className="footer-brand-desc">
            <Link to="/" onClick={() => {
              if (props.location && props.location.pathname === "/")
                window.location.reload();
              if (props.history)
                props.history.push("/")
            }} className="footer-heading"><img src={ExtraMilePlay} alt="logo" className="footer-logo" /></Link>

            {props.isAdmin ? (
              <div className="form-group">
                <textarea
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  rows="10"
                  cols="20"
                  maxlength={300}
                  placeholder="Enter Description"
                  onChange={(e) => {
                    setDescription((data) => ({ ...data, text: e.target.value }));
                  }}
                  value={descriptionData.text}
                  style={{
                    margin: "0px 0px 10px",
                    height: "240px",
                    resize: "vertical",
                  }}
                />
                <p style={{ color: "#F2545B", marginTop: "-35px", zIndex: "1" }}>
                  <span style={{ float: "right", marginRight: "15px" }}>
                    {descriptionData && descriptionData.text.length}/300
                  </span>
                </p>
                <div className="btn-group">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => {
                      setSaver("desc");
                      setConfirmSaveModal(true);
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p>
                {descriptionData &&
                  !descriptionData.deleted &&
                  descriptionData.text}
              </p>
            )}

            <Link
              onClick={() => window.open("https://www.extramile.in")}
              to={""}
              className="link-text"
            >
              extramile.in
            </Link>
          </div>
        }
        {!props.isAdmin && (
          <div className={`footer-social-desc ${employee ? "employee-style" : ""}`}>
            <div className="footer-quicklinks">
              <h5 className="footer-heading">Quick Links</h5>
              <ul className="footer-links">
                <li key={'footer-home'}>
                  <Link
                    onClick={() => {
                      if (props.history.location.pathname.split("/")[1] === "")
                        window.location.reload();
                      else
                        props.history.push("/");
                    }}
                    to={""}
                  >
                    Home
                  </Link>
                </li>
                <li key={'footer-category'}>
                  <Link
                    to={
                      (gameCategory &&
                        gameCategory.data &&
                        gameCategory.data[0] &&
                        gameCategory.data[0].title) ?
                        "/category/" + gameCategory.data[0].title.replace("/", "-")
                        : "#"
                    }>Category</Link>
                </li>
                <li key={'footer-obj'}>
                  <Link
                    to={
                      (gameObjectives &&
                        gameObjectives.data &&
                        gameObjectives.data[0] &&
                        gameObjectives.data[0].title) ?
                        "/objective/" + gameObjectives.data[0].title.replace("/", "-")
                        : "#"
                    }>Objectives</Link>
                </li>
                <li key={'footer-playstream'}>
                  <Link to={"/webinar/history"}>
                    PlayStream
                  </Link>
                </li>
                <li key={'footer-hiw'}>
                  <Link to="/how-it-works">How it works</Link>
                </li>
                {!OrgRoles.includes(role) && <li key={'footer-plans'}><Link to="/plans">Plans</Link></li>}
                <li key={'footer-faq'}>
                  <Link to="/faq">FAQs</Link>
                </li>
              </ul>
            </div>
          </div>
        )}
        {
          !employee &&
          <div className="footer-social-desc">
            <div className="footer-contactus">
              <h5 className="footer-heading">Contact us</h5>
              <div className="address-info">
                <div className="address">
                  <img src={locationImg} alt="location" />
                  {props.isAdmin ? (
                    <div className="form-group">
                      <textarea
                        style={{
                          resize: "vertical",
                          width: "260px",
                          minHeight: "100px",
                        }}
                        type="address"
                        className="form-control"
                        id="address"
                        name="address"
                        rows="10"
                        cols="20"
                        maxlength={200}
                        placeholder="Enter Address"
                        value={contactUsEdit.address}
                        onChange={handleChangeContactUs}
                      />
                      <p style={{ marginTop: "-35px", zIndex: "1" }}>
                        <span
                          style={{
                            float: "right",
                            marginRight: "15px",
                            color: "#F2545B",
                          }}
                        >
                          {contactUsEdit && contactUsEdit.address.length}/200
                        </span>
                      </p>
                    </div>
                  ) : (
                    <span>
                      {props.contactUs.find(
                        (contact) => contact.mode === "ADDRESS"
                      ) ?
                        props.contactUs.find(
                          (contact) => contact.mode === "ADDRESS"
                        ).value : ""
                      }
                    </span>
                  )}
                </div>
                <a
                  href={
                    props.isAdmin
                      ? ""
                      : `mailto:${props.contactUs.find(
                        (contact) => contact.mode === "MAIL"
                      ) ?
                        props.contactUs.find(
                          (contact) => contact.mode === "MAIL"
                        ).value : ""
                      }`
                  }
                  onClick={props.isAdmin ? (e) => e.preventDefault() : null}
                >
                  <img src={mailImg} alt="mail" />
                  {props.isAdmin ? (
                    <div className="form-group">
                      <input
                        type="mail"
                        className="form-control"
                        id="mail"
                        name="mail"
                        placeholder="Enter Mail"
                        value={contactUsEdit.mail}
                        onChange={handleChangeContactUs}
                      />
                    </div>
                  ) : (
                    <span>
                      {
                        props.contactUs.find((contact) => contact.mode === "MAIL") ?
                          props.contactUs.find((contact) => contact.mode === "MAIL").value : ""
                      }
                    </span>
                  )}
                </a>
                <a
                  href={
                    props.isAdmin
                      ? ""
                      : `tel:${props.contactUs.find(
                        (contact) => contact.mode === "PHONE"
                      ) ?
                        props.contactUs.find(
                          (contact) => contact.mode === "PHONE"
                        ).value : ""
                      }`
                  }
                  onClick={props.isAdmin ? (e) => e.preventDefault() : null}
                >
                  <img src={phoneImg} alt="phone" />
                  {props.isAdmin ? (
                    <div className="form-group">
                      <input
                        type="numbers"
                        className="form-control"
                        id="phone"
                        name="phone"
                        placeholder="Enter Phone"
                        value={contactUsEdit.phone}
                        onChange={handleChangeContactUs}
                      />
                      <div
                        className="invalid-feedback"
                        style={{
                          color: "#F2545B",
                          "font-family": "Fira Sans",
                          "font-style": "normal",
                          "font-weight": "normal",
                          "font-size": "13px",
                        }}
                      >
                        {contactUsEditErrors.phone}
                      </div>
                    </div>
                  ) : (
                    <span>
                      {
                        props.contactUs.find(
                          (contact) => contact.mode === "PHONE"
                        ) ?
                          props.contactUs.find(
                            (contact) => contact.mode === "PHONE"
                          ).value : ""
                      }
                    </span>
                  )}
                </a>
              </div>
              {props.isAdmin && (
                <div style={{ paddingLeft: '25px' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ margin: "5px 0" }}
                    onClick={() => {
                      setSaver("props.contactUs");
                      setConfirmSaveModal(true);
                    }}
                  >
                    Save{" "}
                  </button>
                </div>
              )}
            </div>
          </div>
        }
        {
          !employee &&
          <div className="footer-social-desc">
            <div className="footer-sociallinks">
              <h5 className="footer-heading">Social links</h5>
              <div className="social-icon">
                {socialLinkData.length > 0 &&
                  socialLinkData
                    .filter((data) => !data.deleted)
                    .map(({ link, socialMedia }) => (
                      <React.Fragment key={link}>
                        <Link
                          to={"#"}
                          key={JSON.stringify(link)}
                          onClick={() => window.open(link)}
                        >
                          <SvgIcon name={socialMedia} />
                        </Link>
                      </React.Fragment>
                    ))}
              </div>

              {props.isAdmin && (
                <div>
                  <div className="form-group">
                    {socialLinkData.length > 0 &&
                      socialLinkData.map(
                        ({ link, socialMedia, deleted, id }, index) => (
                          <React.Fragment key={link}>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              name="email"
                              placeholder="Enter link for facebook"
                              onChange={(e) => handleSocialLinkChange(e, index)}
                              value={link}
                            />
                            <div className="btn-group">
                              <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={() => {
                                  setIndex(index);
                                  setSaver("social");
                                  setConfirmSaveModal(true);
                                }}
                              >
                                Save
                              </button>
                              <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={() => addOrRemoveSocialLink(index)}
                              >
                                {deleted ? "Un Hide" : "Hide"}
                              </button>
                            </div>
                          </React.Fragment>
                        )
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        }
      </div>
      {
        !employee &&
        !props.isAdmin && <div className="footer-copyright">
          <span>Copyright © 2021 ExtraMile , All Rights Reserved</span>
          <div className="policy-terms">
            <Link to="/privacy-policy">Privacy Policy</Link>|<Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      }
    </footer>
  );
};

const Footer = (props) => {
  const isAdmin = IsAdmin();
  const dispatch = useDispatch();
  const signOut = async () => {
    await dispatch(logOut());
    if (isAdmin) props.history.push("/admin");
    else props.history.push("/");
  };
  useEffect(() => {
    dispatch(getContactUs());
  }, []);
  const ContactUs = useSelector((state) => state.homeContactUs);
  const { contactUs } = ContactUs;
  if (isAdmin)
    return (
      <div className='admin-homepage'>

        <PageLayout
          sidebartitle=""
          active={"Footer Page"}
          category
          sideBarContents={sidebarContentAdmin}
          profile
          {...props}
          signOut={signOut}
          {...props}
          isAdmin={isAdmin}
        >
          <FooterData {...props} isAdmin={isAdmin} contactUs={contactUs && contactUs.data} />
        </PageLayout>
      </div>
    )
  else
    return (
      <>
        <FooterData {...props} />
      </>
    )
}

export default React.memo(Footer);
