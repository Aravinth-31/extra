import React, { useEffect, useLayoutEffect, useState } from "react";
import "./index.css";

import PageLayout from "../../components/pagelayout/pagelayout";
import Playcardlarge from "../../components/playCard/playcardlarge";
import BreadCrumb from "../../components/breadcrumb/breadcrumb";
import ReactTextMoreLess from 'react-text-more-less';
// image
import search from "../../assets/images/search.svg";
import arrowleft from "../../assets/images/paginationarrow.svg";
import SideBarMob from "../../components/sidebar/sideBarMob";
import LoginModal from "../../components/modal/loginmodal";
import LikeShareModal from "../../components/modal/likesharemodal";
import {
  getAllObjectives
} from "../../redux/actions/gameDetailAction";
import { useDispatch, useSelector } from "react-redux";
import {
  getGamesByObjective
} from "../../redux/actions/homepageActions";
import PlayCardMobileHoverCard from "../../components/playCard/playCardMobileHoverCard";
import LoadingComponent from "../../components/loader/LoadingComponent";

import useConstant from "use-constant"
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useAsync } from 'react-async-hook';

const useDebouncedSearch = (searchFunction) => {
  const [searchText, setSearchText] = useState('');
  const [objectiveId, setObjectiveId] = useState("");
  const [fromManageGames, setFromManageGames] = useState(false);
  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 500)
  );
  const results = useAsync(
    async () => {
      if (objectiveId === "")
        return [];
      return debouncedSearchFunction(searchText, objectiveId, fromManageGames);
    },
    [debouncedSearchFunction, searchText]
  );
  return {
    searchText,
    setSearchText,
    objectiveId,
    setObjectiveId,
    fromManageGames,
    setFromManageGames,
    results,
  };
};

const Objective = (props) => {
  const useSearch = () => useDebouncedSearch((text, id, fromManageGamesFlag) => {
    dispatch(getGamesByObjective(id, fromManageGamesFlag, text));
    setPage(1);
  })
  const { searchText, setSearchText, setObjectiveId, fromManageGames, setFromManageGames, objectiveId, results } = useSearch();
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(true);
  const [shareLink, setShareLink] = useState("");
  const [sidebarContents, setSidebarContents] = useState([]);
  const [sideBarMobContents, setSideBarMobContents] = useState([]);
  const [page, setPage] = useState(1);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [openMobileHoverCard, setOpenMobileHoverCard] = useState(false);
  const [gameDetails, setGameDetails] = useState({});
  const [collapsed, setCollapsed] = useState(true);
  const [objectiveDesc, setObjectiveDesc] = useState("");

  const { loading, gamesByObjective } = useSelector(
    (state) => state.gamesByObjective
  );
  const GameObjectives = useSelector((state) => state.getAllObjectives);
  const { gameObjectives } = GameObjectives;

  useEffect(() => {
    if (!gameObjectives) dispatch(getAllObjectives());
    window.scrollTo(0, 0);
  }, []);

  let active = props.match.params.objective;
  active = active.replace("-", "/");
  active = active.replace("_", "&");
  active = active.replace("%20", " ");
  useEffect(() => {
    if (
      props.location &&
      props.location.state &&
      props.location.state.fromManageGames &&
      !fromManageGames
    ) {
      setFromManageGames(true);
    }
    // else {
    //   setFromManageGames(false);
    // }
  }, [props.location]);
  useEffect(() => {
    if (gameObjectives && gameObjectives.data) {
      let options = [];
      gameObjectives.data.forEach((objective) => {
        options.push({
          title: objective.title,
          redirectLink: `/objective/${objective.title.replace("/", "-")}`
        });
      });
      setSideBarMobContents(options);
      if (fromManageGames) {
        let contents = [
          { title: "Default Games", redirectLink: "/manage-games/default" },
          { title: "Categories", redirectLink: "/manage-games/category" },
          {
            title: "Objectives",
            redirectLink: "#",
            subTitles: options,
            subTitleActive: active
          }
        ];
        setSidebarContents(contents);
      } else {
        setSidebarContents(options);
      }
    }
  }, [gameObjectives, fromManageGames, active]);
  useEffect(() => {
    const page = new URLSearchParams(props.location.search).get('page') || 1;
    if (page > 1)
      setPage(parseInt(page));
    else
      setPage(1);
    setSearchText("");
    if (gameObjectives) {
      let object = gameObjectives && gameObjectives.data && gameObjectives.data.find((game) => game.title === active);
      if (object) {
        setObjectiveId(object.id)
        if (object.description)
          setObjectiveDesc(object.description);
        else
          setObjectiveDesc("");
        dispatch(getGamesByObjective(object.id, fromManageGames, searchText, page));
      }
    }
  }, [active, gameObjectives]);
  useEffect(() => {
    let object = gameObjectives && gameObjectives.data && gameObjectives.data.find((game) => game.title === active);
    dispatch(getGamesByObjective(object.id, fromManageGames, searchText, page));
  }, [page]);
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const gameDetail = { data: { title: active } };
  useEffect(() => {
    if (
      loading ||
      (results && results.loading)
    ) {
      setLoaded(false);
    }
    else
      setLoaded(true);
  }, [loading, results])

  const changePage = (newPage) => {
    setLoaded(false);
    setTimeout(() => setLoaded(true), 500);
    props.history.push({
      pathname: "/objective/" + active,
      search: "?page=" + newPage,
      state: { fromManageGames: fromManageGames }
    });
    setPage(newPage);
  }
  const handleChange = (e) => {
    setSearchText(e.target.value)
  }
  return (
    <div
      className={
        fromManageGames
          ? "objective-wrapper managegames-objective-wrapper"
          : "objective-wrapper"
      }
    >
      <PageLayout
        {...props}
        sidebartitle={fromManageGames ? "Manage Games" : "Objectives"}
        objective
        active={fromManageGames ? "Objectives" : active}
        sideBarContents={sidebarContents}
      >
        <div id="category-element" className={loaded ? "" : "loading"}>
          <BreadCrumb objective fromManageGames={fromManageGames} gameDetail={gameDetail} />
          <div className="profile-section">
            <h5 className="profile-name">{active}</h5>
            <h5 className="profile-name profile-name-common">Objectives</h5>
            <div className="input-icon">
              <img src={search} alt="search" />
              <input
                type="text"
                name="search"
                placeholder="Search a game"
                onChange={handleChange}
                value={searchText}
              />
            </div>
          </div>
          <SideBarMob active={active} contents={sideBarMobContents} />
          {openLoginModal && (
            <LoginModal
              modalid="loginmodal"
              toggle={openLoginModal}
              setOpenLoginModal={setOpenLoginModal}
            />
          )}
          {openShareModal && (
            <LikeShareModal
              toggle={openShareModal}
              setOpenShareModal={setOpenShareModal}
              shareLink={shareLink}
            />
          )}
          <ReactTextMoreLess
            collapsed={collapsed}
            text={objectiveDesc}
            lessHeight={60}
            className={"objective-desc"}
            showMoreText="... +Show More"
            showMoreElement={
              <span>
                ... <span className="show-more-text">+Show More</span>
              </span>
            }
            showLessElement={<span className="show-more-text"> -Show Less</span>}
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          />
          <br />
          <LoadingComponent loaded={loaded} >
            <div className="playcard-wrapper">
              {gamesByObjective ? (
                gamesByObjective?.paginationData?.totalEntries > 0 ? (
                  gamesByObjective.data.map((game, index) => {
                    return (
                      <Playcardlarge
                        key={JSON.stringify(game)}
                        srcImage={game.coverMedia}
                        title={game.title}
                        gameDetail={game}
                        setOpenShareModal={setOpenShareModal}
                        setShareLink={setShareLink}
                        setOpenLoginModal={setOpenLoginModal}
                        manage={fromManageGames}
                        setGameDetails={setGameDetails}
                        setOpenMobileHoverCard={setOpenMobileHoverCard}
                        refreshFunction={() => dispatch(getGamesByObjective(objectiveId, fromManageGames, searchText, page))}
                      />
                    );
                  })
                ) : (
                  <div className="no-game-wrapper">
                    <div>
                      <h3 className="no-game">
                        {
                          searchText.length === 0 ?
                            "Currently, there are no games under this objective."
                            : "Currently, there are no games with this name under this objective."
                        }
                      </h3>
                      <span className="no-game-span" onClick={() => props.history.push("/")}>
                        Go to Homepage
                      </span>
                    </div>
                  </div>)
              ) : null}
            </div>
            {
              gamesByObjective?.paginationData?.totalEntries > 0 && (
                <div className="pagination-wrapper">
                  <button
                    className={page > 1 ? "pagination-left enable" : "pagination-left"}
                    onClick={() => {
                      if (page > 1) changePage(page - 1);
                    }}
                  >
                    <img src={arrowleft} alt="arrow left" />
                  </button>
                  <div className="pagination-number">
                    <h5>{page}</h5>
                    <span>
                      of{" "}
                      {gamesByObjective
                        ? Math.ceil(gamesByObjective?.paginationData?.totalEntries / 12)
                        : 1}{" "}
                      pages
                    </span>
                  </div>
                  <button
                    className={(page < Math.ceil(gamesByObjective?.paginationData?.totalEntries / 12)) ? "pagination-right enable" : "pagination-right"}
                    onClick={() => {
                      if (page < Math.ceil(gamesByObjective?.paginationData?.totalEntries / 12))
                        changePage(page + 1);
                    }}
                  >
                    <img src={arrowleft} alt="arrow right" />
                  </button>
                </div>
              )}
          </LoadingComponent>
        </div>
        {
          openMobileHoverCard &&
          <PlayCardMobileHoverCard
            manage={fromManageGames}
            setOpenShareModal={setOpenShareModal}
            gameDetail={gameDetails}
            setOpenMobileHoverCard={setOpenMobileHoverCard}
            setShareLink={setShareLink}
          />
        }
      </PageLayout>
    </div>
  );
};

export default Objective;
