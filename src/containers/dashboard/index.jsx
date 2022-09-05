import React, { useEffect, useState } from "react";
import "reactjs-popup/dist/index.css";

import Slider from "react-slick";
import "./dashboard.css";
import Header from "../../components/header/header";
import BannerCard from "../../components/bannerCarousel/bannerCarousel";
import PlayCard from "../../components/playCard/playCard";
import PlayCardHeading from "../../components/playCardHeading/playCardHeading";
import Footer from "../../components/footer/footer";
import arrayMove from "array-move";
import Select from 'react-select'
import Sortablelist, { SortableItem } from 'react-easy-sort'


// image
import search from "../../assets/images/search.svg";
import bell from '../../assets/images/bell.svg';
import hand from '../../assets/images/hand.svg';
import arrowback from "../../assets/images/arrow-left.svg"
import deleteIconAdmin from "../../assets/images/deleteIconAdmin.svg";
import editIconAdmin from "../../assets/images/editIconAdmin.svg";

import {
  getAllGames,
  getBannerGames,
  homeSearch,
  getContactUs,
  getCurrentlyPlayingGames,
  getPreviouslyPlayedGames,
  getAllSlogans,
  backToDefaultBanners,
  addBannerGameBulk,
  updateBannerGameBulk,
  updateSloganBulk
} from "../../redux/actions/homepageActions";
import { useDispatch, useSelector } from "react-redux";
import { getFavGames, getUser, logOut } from "../../redux/actions/userAction";
import BannerEditCard from "../../components/bannerEdit/BannerEditCard";
import BannerDeleteModal from "../../components/bannerEdit/BannerDeleteModal";
import ShowAllModal from "../../components/bannerEdit/ShowAllModal";
import AddGameInSloganModal from "../../components/bannerEdit/AddGameInSoganModal";
import ConfirmSloganSortModal from "../../components/bannerEdit/ConfirmSloganSortModal";
import LikeShareModal from "../../components/modal/likesharemodal";
import PageLayout from "../../components/pagelayout/pagelayout";
import SortableListGrid from "../../components/sortableList/SortableListGrid";
import sidebarContentAdmin from '../../helpers/sidebarContentAdmin';
import { bulkUpdateGame } from "../../redux/actions/gameDetailAction";
import useDebouncedSearch from "../../helpers/debounce";
import PlayCardMobileHoverCard from "../../components/playCard/playCardMobileHoverCard";
import LoadingComponent from "../../components/loader/LoadingComponent";
import ROLES, { OrgRoles } from "../../helpers/userTypes";
import { decryptData, encryptData, GetUserType, IsAdmin, REG_EX_URL_FORMAT } from "../../helpers/helper";
import ConfirmModal from "../../components/modal/confirmModal";
import BannerUploadCard from "../../components/bannerCarousel/bannerUploadCard";
import BannerCreateModalOrg from "../../components/bannerEdit/BannerCreateModalOrg";
import { getAllWebinars } from "../../redux/actions/commonActions";
import Webinar from "../../components/webinar/webinar";
import { ToastContainer } from "react-toastify";

const Dashboard = (props) => {
  const banner = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: "bannerslider",
    autoplay: true,
    autoplaySpeed: 5000,
    lazyLoad: "progressive"
    // fade:true
  };

  const gameslider = {
    speed: 500,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 5,
    className: "gameslider",
    cssEase: 'linear',
    lazyLoad: "progressive",
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 4.2,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 3.1,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 580,
        settings: {
          slidesToShow: 2.2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 380,
        settings: {
          slidesToShow: 2.05,
          slidesToScroll: 2,
        },
      }
    ],
  };
  const useSearch = () => useDebouncedSearch(text => searchGames(text));
  const searchGames = (text) => {
    dispatch(homeSearch(text));
  }
  const { searchText, setSearchText, results } = useSearch();

  const orgRoles = ["ORG_SUPER_ADMIN", "ORG_ADMIN", "EMPLOYEE"];
  const dispatch = useDispatch();
  const [BannerGames, setBannerGames] = useState([]);

  const BannerGamesState = useSelector((state) => state.bannerGames);
  const { bannerGames } = BannerGamesState;
  const UserInfo = useSelector((state) => state.getUser);
  const { userInfo } = UserInfo;
  var role = ""
  if (userInfo)
    var { role } = userInfo.data;
  const AllGames = useSelector((state) => state.allGames);
  const { allGames } = AllGames;
  const SearchResults = useSelector((state) => state.homeSearch);
  const { searchResults } = SearchResults;
  const ContactUs = useSelector((state) => state.homeContactUs);
  const { contactUs } = ContactUs;
  const CurrentlyPlayingGames = useSelector(state => state.getCurrentlyPlayingGames);
  const { currentlyPlayingGames } = CurrentlyPlayingGames;
  const PreviouslyPlayedGames = useSelector(state => state.getPreviouslyPlayedGames);
  const { previouslyPlayedGames } = PreviouslyPlayedGames;

  const { updateGameInfo } = useSelector((state) => state.updateGame);

  const [bannerCreateModal, setBannerCreateModal] = useState(false);
  const [bannerDeleteModal, setBannerDeleteModal] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [addGameInSloganModal, setAddGameInSloganModal] = useState(false);
  const [confirmSloganSortModal, setConfirmSloganSortModal] = useState(false);
  const [bannerGameId, setBannerGameId] = useState("");
  const [gameDetails, setGameDetails] = useState({});
  const [loaded, setLoaded] = useState(false);

  const [sloganFlag, setSloganFlag] = useState("");
  const [bannerEdit, setBannerEdit] = useState(false);
  const [bannerEditGameDetails, setBannerEditGameDetails] = useState({});

  const [openShareModal, setOpenShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [showBannerPreview, setShowBannerPreview] = useState(false);
  const [editBannerSubmitClicked, setEditBannerSubmitClicked] = useState(false);
  const [editBannerList, setEditBannerList] = useState([
    { id: null, coverMedia: null, mobileCoverMedia: null, redirectURL: "" },
    { id: null, coverMedia: null, mobileCoverMedia: null, redirectURL: "" },
    { id: null, coverMedia: null, mobileCoverMedia: null, redirectURL: "" },
    { id: null, coverMedia: null, mobileCoverMedia: null, redirectURL: "" },
    { id: null, coverMedia: null, mobileCoverMedia: null, redirectURL: "" },
    { id: null, coverMedia: null, mobileCoverMedia: null, redirectURL: "" }
  ]);
  const [existingBannerList, setExistingBannerList] = useState([]);

  const [hover, setHover] = useState(false);
  const [hoverSlogan, setHoverSlogan] = useState('');
  const isAdmin = IsAdmin();
  const [activeTabType, setActiveTabType] = useState("Banners")
  const [activeSloganType, setActiveSloganType] = useState("");
  const [openMobileHoverCard, setOpenMobileHoverCard] = useState(false);

  const [slogansFor, setSlogansFor] = useState("NONLOGIN");
  const [bannersFor, setBannersFor] = useState("NONLOGIN");
  const [slogans, setSlogans] = useState([]);
  const GetSlogans = useSelector(state => state.getSlogans);
  const { allSlogans } = GetSlogans;
  const AddedSlogan = useSelector(state => state.addedSlogan);
  const DeletedSlogan = useSelector(state => state.deletedSlogan);
  const GameBulkUpdate = useSelector(state => state.gameBulkUpdate);
  const CustomizedSlogans = useSelector(state => state.customizedSlogans);
  const BackToDefaultBanner = useSelector(state => state.backToDefaultBanner);
  const UploadedFile = useSelector((state) => state.uploadedFile);
  const BulkAddBannerGame = useSelector(state => state.bulkAddBannerGame);
  const UpdateBannerGameBulk = useSelector(state => state.updateBannerGameBulk);
  const UpdateBannerGame = useSelector(state => state.updateBannerGame);
  const AllWebinars = useSelector(state => state.allWebinars);
  const { allWebinars } = AllWebinars;
  const UdpatedSlogans = useSelector(state => state.udpatedSlogans);
  const ToggleWebinarInfo = useSelector(state => state.toggleWebinarInfo);

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };
  useEffect(async () => {
    if (!userInfo) {
      dispatch(getUser());
    }
    if (userInfo?.data && (OrgRoles.includes(userInfo.data.role) || userInfo.data.role === ROLES.EXTRAMILE_SUPERADMIN)) {
      dispatch(getFavGames(true));
      dispatch(getAllWebinars());
    }
    dispatch(getBannerGames());
    dispatch(getAllGames(false));
    dispatch(getAllSlogans());
    await dispatch(getContactUs());
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    dispatch(getAllGames());
    if (userInfo?.data && (OrgRoles.includes(userInfo.data.role) || userInfo.data.role === ROLES.EXTRAMILE_SUPERADMIN)) {
      dispatch(getFavGames(true));
      dispatch(getAllWebinars());
    }
    dispatch(getBannerGames());
  }, [userInfo])
  useEffect(() => {
    if (role === "ORG_ADMIN" || role === "ORG_SUPER_ADMIN") {
      dispatch(getCurrentlyPlayingGames());
      dispatch(getPreviouslyPlayedGames());
    }
    if (OrgRoles.includes(role)) {
      setSlogansFor("SUBSCRIBED");
      setBannersFor("SUBSCRIBED");
    }
    else {
      setSlogansFor("NONLOGIN");
      setBannersFor("NONLOGIN");
    }
  }, [role])
  useEffect(() => {
    if (
      (BannerGamesState && BannerGamesState.loading) ||
      (AllGames && AllGames.loading) ||
      (SearchResults && SearchResults.loading) ||
      (results && results.loading) ||
      (GetSlogans && GetSlogans.loading) ||
      (AddedSlogan && AddedSlogan.loading) ||
      (GameBulkUpdate && GameBulkUpdate.loading) ||
      (DeletedSlogan && DeletedSlogan.loading) ||
      (CustomizedSlogans && CustomizedSlogans.loading) ||
      (BackToDefaultBanner && BackToDefaultBanner.loading) ||
      (UploadedFile && UploadedFile.loading) ||
      (BulkAddBannerGame && BulkAddBannerGame.loading) ||
      (UpdateBannerGame && UpdateBannerGame.loading) ||
      (UpdateBannerGameBulk && UpdateBannerGameBulk.loading) ||
      (AllWebinars && AllWebinars.loading) ||
      (UdpatedSlogans && UdpatedSlogans.loading) ||
      (ToggleWebinarInfo && ToggleWebinarInfo.loading)
    )
      setLoaded(false);
    else
      setLoaded(true);
  }, [BannerGamesState, AllGames, SearchResults,
    results, GetSlogans, AddedSlogan, UpdateBannerGame,
    GameBulkUpdate, DeletedSlogan, CustomizedSlogans, BackToDefaultBanner, UploadedFile,
    BulkAddBannerGame, UpdateBannerGameBulk, AllWebinars, UdpatedSlogans, ToggleWebinarInfo
  ]);
  useEffect(() => {
    if (OrgRoles.includes(GetUserType())) {
      let list = [];
      if (allWebinars && allWebinars.data && userInfo && userInfo.data) {
        if (userInfo.data.role === ROLES.EMPLOYEE) {
          let isShowStatus = JSON.parse(allWebinars.data.isShowStatus) || [];
          if (isShowStatus.includes(userInfo.data.organizationId))
            list = [allWebinars.data];
        }
        else
          list = [allWebinars.data];
      }
      if (bannerGames && bannerGames.data && bannerGames.data.length > 0) {
        list = [...list, ...bannerGames.data]
        setCustomize(true);
      }
      else if (bannerGames && bannerGames.defaultBannerGames) {
        list = [...list, ...bannerGames.defaultBannerGames?.filter?.(banner => banner.isSubscribed)];
        setCustomize(false);
      }
      setBannerGames(list);
    }
    else if (bannerGames && bannerGames.data) {
      const banners = bannerGames.data.filter(banner => (
        banner.organizations && banner.organizations.length === 0 && ((bannersFor === "NONLOGIN" && !banner.isSubscribed) || (bannersFor === "SUBSCRIBED" && banner.isSubscribed))
      ))
      let x = 6;
      let list = [];
      let list1 = [];
      banners.forEach(banner => {
        x = x - 1;
        list.push({ id: banner.id, coverMedia: banner.coverMedia, mobileCoverMedia: banner.mobileCoverMedia, redirectURL: banner.redirectURL });
        list1.push({ id: banner.id, coverMedia: banner.coverMedia, mobileCoverMedia: banner.mobileCoverMedia, redirectURL: banner.redirectURL });
      })
      for (var i = x; i > 0; i--) {
        list.push({ id: null, coverMedia: null, mobileCoverMedia: null, redirectURL: "" });
        list1.push({ id: null, coverMedia: null, mobileCoverMedia: null, redirectURL: "" });
      }
      setEditBannerList(list);
      setExistingBannerList(list1);
      setBannerGames(banners);
    }
    else {
      setBannerGames([]);
    }
  }, [bannerGames, allWebinars, userInfo, bannersFor]);
  useEffect(() => {
    dispatch(getAllGames());
  }, [updateGameInfo]);

  const [gamePosition, setGamePosition] = useState({
    RELEASES: [],
    PICKS: [],
    TRENDING: []
  });
  const [sloganData, setSloganData] = useState("");
  const [sloganType, setSloganType] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const updateGamePosition = (title) => {
    const gameArray = (gamePosition[title] || []).map((game) => ({ id: game.id, slogan: game.slogan, position: game.position, title: game.title }));
    const slogan = title;
    dispatch(bulkUpdateGame(gameArray, slogan)).then(() => dispatch(getAllGames()))
  };
  const positionSort = (a, b, slogan) => {
    if (!b.position)
      return -1;
    if (!a.position)
      return 1;
    if (!b.position[slogan])
      return -1;
    if (!a.position[slogan])
      return 1;
    if (a.position[slogan] < b.position[slogan])
      return -1;
    return 1;
  }
  const filterGames = (slogan) => {
    let games = allGames.data.filter((game) => {
      if (game.slogan && game.slogan.length > 0) {
        let flag = false;
        game.slogan.map(gameSlogan => {
          if (JSON.stringify(gameSlogan) === JSON.stringify(slogan)) {
            flag = true;
          }
        })
        return flag;
      }
    })
    return games.sort((a, b) => positionSort(a, b, slogan.id));
  }
  const toDefaultBanners = async () => {
    if (userInfo && userInfo.data) {
      const response = await dispatch(backToDefaultBanners(userInfo.data.organizationId));
      if (response && response.status === 200) {
        dispatch(getBannerGames());
        setCustomize(false);
        setOpenConfirmModal(false);
      }
    }
  }
  useEffect(() => {
    if (allGames && allGames.data && allSlogans && allSlogans.data) {
      allSlogans.data.forEach(slogan => {
        setGamePosition(prevState => ({
          ...prevState,
          [slogan.id]: filterGames(slogan)
        }));
      })
    }
  }, [allGames, allSlogans]);

  useEffect(() => {
    if (
      bannerCreateModal ||
      bannerDeleteModal ||
      showAllModal ||
      addGameInSloganModal
    )
      document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [
    bannerCreateModal,
    bannerDeleteModal,
    showAllModal,
    addGameInSloganModal,
  ]);
  const onSortEndDrag = (oldIndex, newIndex, sloganTitle) => {
    setGamePosition((prevState) => ({
      ...prevState,
      [sloganTitle]: arrayMove(prevState[sloganTitle], oldIndex, newIndex)
    }))
  };

  const onSortEndSlogans = async (oldIndex, newIndex) => {
    let reOrderedSlogans = arrayMove(slogans, oldIndex, newIndex)
    setSlogans(reOrderedSlogans);
    let body = reOrderedSlogans.map((slogan, index) => ({ id: slogan.id, sloganType: slogan.sloganType, title: slogan.title, position: index + 1 }))
    const response = await dispatch(updateSloganBulk(body));
    dispatch(getAllSlogans());
  }

  useEffect(() => {
    if (allSlogans && allSlogans.data) {
      let sloganArray = []
      allSlogans.data.map(slogan => {
        if (slogan.sloganType === slogansFor)
          sloganArray.push(slogan);
      })
      setSlogans(sloganArray);
    }
  }, [allSlogans, slogansFor])

  const submitEditBanners = async () => {
    setEditBannerSubmitClicked(true);
    let flag = false;
    editBannerList.forEach((banner) => {
      if ((banner.coverMedia !== null && banner.mobileCoverMedia === null) || (banner.coverMedia === null && banner.mobileCoverMedia !== null))
        flag = true;
      if (banner.redirectURL !== "" && banner.redirectURL !== null && !REG_EX_URL_FORMAT.test(banner.redirectURL))
        flag = true;
    })
    if (JSON.stringify(editBannerList) === JSON.stringify(existingBannerList))
      flag = true;
    if (flag)
      return;

    // add new 
    let addlist = [];
    editBannerList.forEach((banner) => {
      if (banner.coverMedia !== null && banner.mobileCoverMedia !== null && banner.id === null) {
        addlist.push({ coverMedia: banner.coverMedia, mobileCoverMedia: banner.mobileCoverMedia, redirectURL: banner.redirectURL, isSubscribed: bannersFor === "SUBSCRIBED" });
      }
    })
    //update existing
    let updateList = [];
    BannerGames.forEach((existing) => {
      editBannerList.forEach((banner) => {
        if (existing.id === banner.id && (existing.coverMedia !== banner.coverMedia || existing.mobileCoverMedia !== banner.mobileCoverMedia || existing.redirectURL !== banner.redirectURL))
          updateList.push({ id: banner.id, coverMedia: banner.coverMedia, mobileCoverMedia: banner.mobileCoverMedia, redirectURL: banner.redirectURL });
      })
    })
    await Promise.all([
      addlist.length ? dispatch(addBannerGameBulk({ games: addlist })) : null,
      updateList.length ? dispatch(updateBannerGameBulk({ games: updateList })) : null
    ]).then(() => {
      dispatch(getBannerGames());
    })
  }

  return (
    <div className={loaded ? "" : "loading"} id='dashboard-element'>
      <LoadingComponent loaded={loaded} />
      <ToastContainer position="bottom-center" />
      {isAdmin && activeSloganType === "" &&
        <div className='container-fluid admin-dashboard-btn-group'>
          <div className={activeTabType === "Banners" ? "group-item active" : "group-item"} onClick={() => {
            setActiveTabType("Banners");
          }}>
            Banners
          </div>
          <div className={activeTabType === "Slogans" ? "group-item active" : "group-item"} onClick={() => {
            setActiveTabType("Slogans");
          }}>
            Slogans
          </div>
          <div className={activeTabType === "Webinar" ? "group-item active" : "group-item"} onClick={() => {
            setActiveTabType("Webinar");
          }}>
            Webinar
          </div>
        </div>
      }
      <main className="container padtop0 mobileHoverCardParent" style={isAdmin ? { paddingTop: '0px', paddingBottom: '0px' } : { paddingTop: '65px' }}>
        {/* after purchasing a plan, until upload a CSV show this*/}
        <div className="upload-csv-section hide">
          <div className="upload-csv-title">
            <img src={bell} alt="bell" />
            <h5>Hey user, add CSV file for your users Id’s</h5>
          </div>
          <div className="upload-csv-butn">
            <img src={hand} alt="hand" />
            <button type="button">Upload CSV</button>
          </div>
        </div>
        {/* csv file ends */}
        <div className={isAdmin ? "sub-container pad0" : "sub-container"}>
          <section className="banner-section">
            {!isAdmin ? (
              <div className="profile-section">
                <h5 className="profile-name">
                  {userInfo && userInfo.data && userInfo.data.firstName
                    ? "Hi " + userInfo.data.firstName + ","
                    : ""}
                </h5>
                <div className="input-icon">
                  <img src={search} alt="search" />
                  <input
                    type="text"
                    name="search"
                    value={searchText}
                    onChange={handleChange}
                    placeholder="Search by Games, Categories, Objectives"
                  />
                </div>
              </div>
            ) : null}
            {searchText.length === 0 && !isAdmin ? (
              <Slider {...banner} >
                {BannerGames.map((game) => {
                  return (
                    <BannerCard
                      key={JSON.stringify(game)}
                      srcImage={game.coverMedia}
                      title={game.game && game.game.title}
                      redirectURL={game.redirectURL}
                      mobileImage={game.mobileCoverMedia}
                      setBannerCreateModal={setBannerCreateModal}
                      setOpenConfirmModal={setOpenConfirmModal}
                      customize={customize}
                      setCustomize={setCustomize}
                      role={role}
                      setBannerEditGameDetails={() => setBannerEditGameDetails(game)}
                      isWebinar={game.isShowStatus}
                      id={game.id}
                      startsAt={game.startsAt}
                    />
                  );
                })}
              </Slider>
            ) : null}
            {isAdmin && activeTabType === 'Banners' && (
              <>
                <div className="banner-editor">
                  <div className="head">
                    <h1>Default Banners</h1>
                    <Select
                      options={[{ label: "For Non-Subscribed Users", value: "NONLOGIN" }, { label: "For Subscribed Users", value: "SUBSCRIBED" }]}
                      defaultValue={{ label: "For Non-Subscribed Users", value: "NONLOGIN" }}
                      onChange={(e) => setBannersFor(e.value)}
                      value={bannersFor === "SUBSCRIBED" ? { label: "For Subscribed Users", value: "SUBSCRIBED" } : { label: "For Non-Subscribed Users", value: "NONLOGIN" }}
                      className="form-control"
                      placeholder="Slogans For"
                      menuPlacement="auto"
                      menuPosition="fixed"
                      styles={{
                        control: (base) => ({
                          ...base,
                          height: 35,
                          minWidth: 200,
                          boxSizing: "content-box"
                        }),
                        menu: (base) => ({
                          ...base,
                          // width: 300
                        })
                      }}
                    />
                  </div>
                  <div className="banner-upload">
                    <div className="banner-upload-grp">
                      <div className="banner-grp-title">
                        <p className="head1">Banner 0</p>
                        <p className="head2">
                          <span>Mobile</span>
                          <span className="size">(328x140)</span>
                        </p>
                        <p className="head3">
                          <span>Desktop</span>
                          <span className="size">(1328x208)</span>
                        </p>
                        <p className="head4">Redirection URL</p>
                        <button className="btn head5">remove</button>
                      </div>
                      {
                        editBannerList.map((banner, index) => {
                          if (index === 0)
                            return <BannerUploadCard
                              key={JSON.stringify(banner)}
                              editBannerList={editBannerList}
                              setEditBannerList={setEditBannerList}
                              uploaded={banner.id !== null}
                              banner={banner}
                              disabled={false}
                              index={index + 1}
                              editBannerSubmitClicked={editBannerSubmitClicked}
                              setEditBannerSubmitClicked={setEditBannerSubmitClicked}
                            />
                          else
                            return <BannerUploadCard
                              editBannerList={editBannerList}
                              setEditBannerList={setEditBannerList}
                              uploaded={banner.id !== null}
                              disabled={editBannerList[index - 1].coverMedia === null || editBannerList[index - 1].mobileCoverMedia === null}
                              index={index + 1}
                              banner={banner}
                              editBannerSubmitClicked={editBannerSubmitClicked}
                              setEditBannerSubmitClicked={setEditBannerSubmitClicked}
                            />
                        })
                      }
                    </div>
                    <div className="btn-grp">
                      <button className={`btn btn-primary ${JSON.stringify(editBannerList) === JSON.stringify(existingBannerList) ? "disabled" : ""}`} onClick={submitEditBanners}>Update Banners</button>
                    </div>
                    <div className="preview-container">
                      <p className="preview" onClick={() => setShowBannerPreview(state => !state)}>
                        Preview
                        <div className={`dropdown-arrow ${showBannerPreview ? "rotate" : ""} `}>
                          <svg width="20" height="10" viewBox="0 0 8 6" fill="none">
                            <path
                              d="M1 1.5L4 4.5L7 1.5"
                              stroke="#e25569"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </p>
                      <div className={`${showBannerPreview ? "" : "hide"}`}>
                        <Slider {...banner}>
                          {
                            BannerGames.map(banner => (
                              <BannerCard
                                key={JSON.stringify(banner)}
                                srcImage={banner.coverMedia}
                                mobileImage={banner.mobileCoverMedia}
                                setBannerCreateModal={setBannerCreateModal}
                                setOpenConfirmModal={setOpenConfirmModal}
                                customize={customize}
                                setCustomize={setCustomize}
                                role={role}
                              />
                            ))
                          }
                        </Slider>
                      </div>
                    </div>
                  </div>
                  {/* <div className="banner-edit">
                    {BannerGames.map((banner, index) => {
                      return (
                        <div className="banner-item">
                          <BannerEditCard
                            image={banner.coverMedia}
                            bannerCard={banner}
                            id={banner.id}
                            name={banner.game && banner.game.title}
                            setBannerGameId={setBannerGameId}
                            setBannerDeleteModal={setBannerDeleteModal}
                            setBannerEdit={setBannerEdit}
                            setBannerEditGameDetails={setBannerEditGameDetails}
                            setBannerCreateModal={setBannerCreateModal}
                          ></BannerEditCard>
                        </div>
                      );
                    })}
                    {BannerGames && BannerGames.length < 6 && (
                      <div className="banner-item add">
                        <div
                          className="Add container"
                          onClick={() => {
                            setBannerCreateModal(true);
                            setBannerEdit(false);
                          }}
                        >
                          <img
                            id="banner-add"
                            src="https://img.icons8.com/android/240/000000/plus.png"
                            alt="Add"
                          />
                        </div>
                      </div>
                    )}
                  </div> */}
                </div>
              </>
            )}
            {isAdmin && activeTabType === 'Slogans' && activeSloganType === "" && (
              <>
                <div className="banner-editor">
                  <div className="head">
                    <h1>Slogans</h1>
                    <Select
                      options={[{ label: "For Non-Subscribed Users", value: "NONLOGIN" }, { label: "For Subscribed Users", value: "SUBSCRIBED" }]}
                      defaultValue={{ label: "For Non-Subscribed Users", value: "NONLOGIN" }}
                      onChange={(e) => setSlogansFor(e.value)}
                      value={slogansFor === "SUBSCRIBED" ? { label: "For Subscribed Users", value: "SUBSCRIBED" } : { label: "For Non-Subscribed Users", value: "NONLOGIN" }}
                      className="form-control"
                      placeholder="Slogans For"
                      menuPlacement="auto"
                      menuPosition="fixed"
                      styles={{
                        control: (base) => ({
                          ...base,
                          height: 35,
                          minWidth: 200,
                          boxSizing: "content-box"
                        }),
                        menu: (base) => ({
                          ...base,
                          // width: 300
                        })
                      }}
                    />
                  </div>
                  <ul className='slogans-list'>
                    <Sortablelist
                      onSortEnd={onSortEndSlogans}
                    >
                      {
                        slogans.map((slogan) => {
                          return (<SortableItem key={JSON.stringify(slogan)}>
                            <li className={`slogans-item`} key={JSON.stringify(slogan)}>
                              <span>{slogan.title}</span>
                              <button className="btn btn-delete" onClick={() => {
                                setBannerDeleteModal(true);
                                setSloganData(slogan.id);
                                setSloganFlag("Slogan");
                              }}>
                                <span className="desktop">Delete</span>
                                <img src={deleteIconAdmin} className="mobile" alt="search" />
                              </button>
                              <button className="btn btn-edit" onClick={() => setActiveSloganType(slogan.id)}>
                                <span className="desktop">Edit</span>
                                <img src={editIconAdmin} className="mobile" alt="search" />
                              </button>
                            </li>
                          </SortableItem>)
                        })
                      }
                    </Sortablelist>

                    {/* {
                      slogans &&
                      slogans.map(slogan => (
                        <li className="slogans-item">
                          <span>{slogan.title}</span>
                          <button className="btn btn-delete" onClick={() => {
                            setBannerDeleteModal(true);
                            setSloganData(slogan.id);
                            setSloganFlag("Slogan");
                          }}>
                            <span className="desktop">Delete</span>
                            <img src={deleteIconAdmin} className="mobile" alt="search" />
                          </button>
                          <button className="btn btn-edit" onClick={() => setActiveSloganType(slogan.id)}>
                            <span className="desktop">Edit</span>
                            <img src={editIconAdmin} className="mobile" alt="search" />
                          </button>
                        </li>
                      ))
                    } */}
                  </ul>
                  <div className="add-slogan">
                    <button
                      className='btn btn-add-slogan'
                      onClick={() => {
                        setAddGameInSloganModal(true);
                        setSloganData("Add");
                      }}
                    >Add Slogan</button>
                  </div>
                </div>
              </>
            )}
            {isAdmin && activeTabType === "Webinar" && (
              <Webinar />
            )}

            {bannerCreateModal && (
              <BannerCreateModalOrg
                setBannerCreateModal={setBannerCreateModal}
                bannerEdit={bannerEdit}
                bannerEditGameDetails={bannerEditGameDetails}
              />
            )}
            {showAllModal && (
              <ShowAllModal
                items={gamePosition[sloganType]}
                setShowAllModal={setShowAllModal}
                setBannerDeleteModal={setBannerDeleteModal}
                setAddGameInSloganModal={setAddGameInSloganModal}
                setSloganData={setSloganData}
                setSloganFlag={setSloganFlag}
                sloganData={sloganData}
                setGameDetails={setGameDetails}
                setConfirmSloganSortModal={setConfirmSloganSortModal}
                sloganType={sloganType}
                modalTitle={modalTitle}
                onSortEndDrag={onSortEndDrag}
              />
            )}
            {bannerDeleteModal && (
              <BannerDeleteModal
                bannerGameId={bannerGameId}
                setBannerDeleteModal={setBannerDeleteModal}
                sloganFlag={sloganFlag}
                gameDetails={gameDetails}
                setSloganFlag={setSloganFlag}
                sloganData={sloganData}
                games={gamePosition[activeSloganType]}
              />
            )}
            {addGameInSloganModal && (
              <AddGameInSloganModal
                setAddGameInSloganModal={setAddGameInSloganModal}
                sloganData={sloganData}
                existing={gamePosition[sloganData]}
                userType={slogansFor}
              />
            )}
            {confirmSloganSortModal && (
              <ConfirmSloganSortModal
                setConfirmSloganSortModal={setConfirmSloganSortModal}
                updateGamePosition={updateGamePosition}
                sloganCategory={sloganData}
              />
            )}
          </section>
          {openShareModal && (
            <LikeShareModal
              toggle={openShareModal}
              setOpenShareModal={setOpenShareModal}
              shareLink={shareLink}
            />
          )}
          <ConfirmModal modalid="confirm-modal" toggle={openConfirmModal} setOpenConfirmModal={setOpenConfirmModal} title="To Default Banners" question="Are you sure to move to default banners?" confirmFunction={toDefaultBanners} />
          {searchText.length === 0 ? (
            <>
              {
                allSlogans && allSlogans.data &&
                allSlogans.data.map(slogan => (
                  slogan.sloganType === slogansFor ?
                    (isAdmin || (gamePosition[slogan.id] && gamePosition[slogan.id].length > 0)) && (!isAdmin || (isAdmin && activeSloganType === slogan.id)) ? (
                      <section key={slogan.id} className={(hoverSlogan === slogan.id && hover ? "common-section hover" : "common-section") + (isAdmin ? " margin1" : "")} >
                        {isAdmin &&
                          <>
                            <div className="back-arrow">
                              <img src={arrowback} onClick={() => setActiveSloganType("")} alt="back" />
                            </div>
                            <br />
                          </>
                        }
                        <PlayCardHeading
                          title={slogan.title.split(" ")[0]}
                          titleHighlight={slogan.title.split(" ").slice(1).join(" ")}
                          link
                          isAdmin={isAdmin}
                          setShowAllModal={setShowAllModal}
                          setSloganType={setSloganType}
                          setModalTitle={setModalTitle}
                          gamecount={gamePosition[slogan.id] && gamePosition[slogan.id].length}
                          sloganType={slogan.id}
                        />

                        {!isAdmin ? (
                          <Slider {...gameslider}>
                            {
                              gamePosition[slogan.id] && gamePosition[slogan.id].map((game) => {
                                return (
                                  <PlayCard
                                    key={JSON.stringify(game)}
                                    gameDetail={game}
                                    title={game.title}
                                    srcImage={game.coverMedia}
                                    setOpenShareModal={setOpenShareModal}
                                    setShareLink={setShareLink}
                                    setHover={setHover}
                                    setHoverSlogan={() => setHoverSlogan(slogan.id)}
                                    setGameDetails={setGameDetails}
                                    setOpenMobileHoverCard={setOpenMobileHoverCard}
                                  />
                                );
                              })
                            }
                          </Slider>
                        ) : (
                          <>
                            <div className="drag-message">
                              *Drag to rearrange the set and select save.
                            </div>
                            <br />
                            <SortableListGrid
                              items={gamePosition[slogan.id]}
                              onSortEnd={(oldIndex, newIndex) => onSortEndDrag(oldIndex, newIndex, slogan.id)}
                              setGameDetails={setGameDetails}
                              setSloganFlag={setSloganFlag}
                              setBannerDeleteModal={setBannerDeleteModal}
                              setSloganData={setSloganData}
                              sloganData={slogan.id}
                            />
                            <div className="btn-group add-save">
                              <button
                                type="submit"
                                className="btn btn-secondry"
                                style={{ float: "right" }}
                                onClick={() => {
                                  setAddGameInSloganModal(true);
                                  setSloganData(slogan.id);
                                }}
                              >
                                Add
                              </button>
                              <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ float: "right" }}
                                onClick={() => {
                                  setConfirmSloganSortModal(true);
                                  setSloganData(slogan.id);
                                }}
                              >
                                Save
                              </button>
                            </div>
                            {/* <hr className="seperator" /> */}
                          </>
                        )}
                      </section>
                    ) : null
                    : null
                ))
              }

              {!isAdmin && orgRoles.includes(role) && currentlyPlayingGames && currentlyPlayingGames.data && currentlyPlayingGames.data.length > 0 &&
                <section className={hoverSlogan === "Currently Active For Me" && hover ? "common-section hover" : "common-section"}>
                  <PlayCardHeading
                    title="Currently"
                    titleHighlight="Active For Me"
                    link
                    isAdmin={isAdmin}
                    setShowAllModal={setShowAllModal}
                    setSloganType={setSloganType}
                    setModalTitle={setModalTitle}
                    sloganType={"Currently Active For Me"}
                    gamecount={currentlyPlayingGames && currentlyPlayingGames.data && currentlyPlayingGames.data.length}
                  />
                  <Slider {...gameslider}>
                    {[...currentlyPlayingGames.data].reverse().map((game) => {
                      return (
                        <PlayCard
                          key={JSON.stringify(game)}
                          title={game.title}
                          gameDetail={game}
                          srcImage={game.coverMedia}
                          setOpenShareModal={setOpenShareModal}
                          setShareLink={setShareLink}
                          setHover={setHover}
                          setHoverSlogan={() => setHoverSlogan("Currently Active For Me")}
                          setGameDetails={setGameDetails}
                          setOpenMobileHoverCard={setOpenMobileHoverCard}
                        />
                      );
                    })}
                  </Slider>
                </section>
              }

              {!isAdmin && orgRoles.includes(role) && previouslyPlayedGames && previouslyPlayedGames.data && previouslyPlayedGames.data.length > 0 &&
                <section className={hoverSlogan === "Previously Played By Me" && hover ? "common-section hover" : "common-section"}>
                  <PlayCardHeading
                    title="Previously"
                    titleHighlight="Played By Me"
                    link
                    isAdmin={isAdmin}
                    setShowAllModal={setShowAllModal}
                    setSloganType={setSloganType}
                    setModalTitle={setModalTitle}
                    sloganType={'Previously Played By Me'}
                    gamecount={previouslyPlayedGames && previouslyPlayedGames.data && previouslyPlayedGames.data.length}
                  />
                  <Slider {...gameslider}>
                    {previouslyPlayedGames.data.map((game) => {
                      return (
                        <PlayCard
                          key={JSON.stringify(game)}
                          title={game.title}
                          gameDetail={game}
                          srcImage={game.coverMedia}
                          setOpenShareModal={setOpenShareModal}
                          setShareLink={setShareLink}
                          setHover={setHover}
                          setHoverSlogan={() => setHoverSlogan("Previously Played By Me")}
                          previouslyPlayed
                          setGameDetails={setGameDetails}
                          setOpenMobileHoverCard={setOpenMobileHoverCard}
                        />
                      );
                    })}
                  </Slider>
                </section>
              }
            </>
          ) : <LoadingComponent loaded={loaded} >
            {
              searchResults && searchResults.data ? (
                <section className={hover ? "common-section hover" : "common-section"}>
                  {searchResults.data.length > 0 ? (
                    <>
                      <PlayCardHeading title="Search" titleHighlight="Results..." link isAdmin={isAdmin}
                        setShowAllModal={setShowAllModal}
                        setSloganType={setSloganType}
                        setModalTitle={setModalTitle}
                        sloganType={'Search Results...'}
                        gamecount={searchResults && searchResults.data && searchResults.data.length}
                      />
                      <Slider {...gameslider}>
                        {searchResults.data.map((game) => {
                          return (
                            <PlayCard
                              key={JSON.stringify(game)}
                              title={game.title}
                              gameDetail={game}
                              srcImage={game.coverMedia}
                              setOpenShareModal={setOpenShareModal}
                              setShareLink={setShareLink}
                              setHover={setHover}
                              setHoverSlogan={setHoverSlogan}
                              setGameDetails={setGameDetails}
                              setOpenMobileHoverCard={setOpenMobileHoverCard}
                            />
                          );
                        })}
                      </Slider>
                    </>
                  ) : (
                    <>
                      <PlayCardHeading title="Search" titleHighlight="Results..." />
                      <div className="no-data-home">
                        <h4> The game you are searching for is currently not available.</h4>
                      </div>
                    </>
                  )}
                </section>
              ) : null}
          </LoadingComponent>
          }
        </div>
        {
          openMobileHoverCard &&
          <PlayCardMobileHoverCard
            manage={false}
            userInfo={userInfo}
            setOpenShareModal={setOpenShareModal}
            gameDetail={gameDetails}
            setOpenMobileHoverCard={setOpenMobileHoverCard}
            setShareLink={setShareLink}
          />
        }

      </main>
      {contactUs && !isAdmin ? <Footer {...props} isAdmin={isAdmin} contactUs={contactUs.data} /> : ""}
    </div>
  );
};

const HomePage = (props) => {
  const isAdmin = IsAdmin();
  const dispatch = useDispatch();
  const signOut = async () => {
    await dispatch(logOut());
    if (isAdmin) props.history.push("/admin");
    else props.history.push("/");
  };
  if (isAdmin)
    return (
      <div className='admin-homepage'>
        <PageLayout
          sidebartitle=""
          active={"Homepage"}
          category
          sideBarContents={sidebarContentAdmin}
          profile
          {...props}
          signOut={signOut}
          {...props}
          isAdmin={isAdmin}
        >
          <Dashboard {...props} />
        </PageLayout>
      </div>
    )
  else
    return (
      <>
        <Header profile {...props} signOut={signOut} {...props} isAdmin={isAdmin} />
        <Dashboard {...props} />
      </>
    )

}

export default React.memo(HomePage);
