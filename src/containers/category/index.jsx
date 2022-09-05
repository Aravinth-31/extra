import React, { useEffect, useState } from "react";
import "./index.css";

import PageLayout from "../../components/pagelayout/pagelayout";
import Playcardlarge from "../../components/playCard/playcardlarge";
import BreadCrumb from "../../components/breadcrumb/breadcrumb";
import ReactTextMoreLess from 'react-text-more-less';

// image
import search from "../../assets/images/search.svg";
import arrowleft from "../../assets/images/paginationarrow.svg";
import LoginModal from "../../components/modal/loginmodal";
import LikeShareModal from "../../components/modal/likesharemodal";
import { useDispatch, useSelector } from "react-redux";
import { gameAllCategory } from "../../redux/actions/gameDetailAction";
// import synonyms from "";

import {
  getGamesByCategory,
} from "../../redux/actions/homepageActions";
import SideBarMob from "../../components/sidebar/sideBarMob";
import PlayCardMobileHoverCard from "../../components/playCard/playCardMobileHoverCard";
import LoadingComponent from "../../components/loader/LoadingComponent";
import useConstant from "use-constant"
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useAsync } from 'react-async-hook';

const useDebouncedSearch = (searchFunction) => {
  const [searchText, setSearchText] = useState('');
  const [categoryId, setCategoryId] = useState("");
  const [fromManageGames, setFromManageGames] = useState(false);
  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 500)
  );
  const results = useAsync(
    async () => {
      if (categoryId === "")
        return [];
      return debouncedSearchFunction(searchText, categoryId, fromManageGames);
    },
    [debouncedSearchFunction, searchText]
  );
  return {
    searchText,
    setSearchText,
    categoryId,
    setCategoryId,
    fromManageGames,
    setFromManageGames,
    results,
  };
};

const Category = (props) => {
  const useSearch = () => useDebouncedSearch((text, id, fromManageGamesFlag) => {
    dispatch(getGamesByCategory(id, fromManageGamesFlag, text));
    setPage(1);
  })
  const { searchText, setSearchText, setCategoryId, fromManageGames, setFromManageGames, results, categoryId } = useSearch();
  const [categoryDesc, setCategoryDesc] = useState("");
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [sideBarContents, setSideBarContents] = useState([]);
  const [sideBarMobContents, setSideBarMobContents] = useState([]);
  const [shareLink, setShareLink] = useState("");
  const [loaded, setLoaded] = useState(true);
  const [openMobileHoverCard, setOpenMobileHoverCard] = useState(false);
  const [gameDetails, setGameDetails] = useState({});
  const [collapsed, setCollapsed] = useState(true);

  const GameCategory = useSelector(state => state.gameAllCategory);
  const { gameCategory } = GameCategory;
  const GamesBycategory = useSelector(state => state.gamesByCategory);
  const { gamesByCategory } = GamesBycategory;

  var active = props.match.params.category;
  //active = active.replace("-", "/");
  active = active.replace("%20", " ");
  const gameDetail = { data: { title: active } };

  useEffect(() => {
    if (props.location && props.location.state && props.location.state.fromManageGames && !fromManageGames) {
      setFromManageGames(true);
    }
    // else {
    //   setFromManageGames(false);
    // }
  }, [props.location])
  useEffect(() => {
    if (!gameCategory)
      dispatch(gameAllCategory());
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const page = new URLSearchParams(props.location.search).get('page') || 1;
    if (page > 1)
      setPage(parseInt(page));
    else
      setPage(1);
    setSearchText("");
    if (gameCategory) {
      let categoryData = gameCategory.data.find((object) => object.title === active);
      if (categoryData) {
        setCategoryId(categoryData.id);
        if (categoryData.description)
          setCategoryDesc(categoryData.description);
        else
          setCategoryDesc("");
        dispatch(getGamesByCategory(categoryData.id, fromManageGames, searchText, page));
      }
    }
  }, [active, gameCategory]);

  useEffect(() => {
    let categoryData = gameCategory.data.find((object) => object.title === active);
    dispatch(getGamesByCategory(categoryData.id, fromManageGames, searchText, page));
  }, [page]);

  useEffect(() => {
    if (gameCategory && gameCategory.data) {
      let options = [];
      gameCategory.data.forEach((category) => {
        options.push({ title: category.title, redirectLink: `/category/${category.title.replace('/', '-')}` });
      });
      setSideBarMobContents(options);
      if (fromManageGames) {
        let contents = [
          { title: "Default Games", redirectLink: "/manage-games/default" },
          { title: "Categories", redirectLink: "#", subTitles: options, subTitleActive: active },
          { title: "Objectives", redirectLink: "/manage-games/objective" },
        ]
        setSideBarContents(contents);
      }
      else {
        setSideBarContents(options);
      }
    }
  }, [gameCategory, active, fromManageGames]);
  useEffect(() => {
    if (
      (results && results.loading) ||
      (GamesBycategory && GamesBycategory.loading)
    ) {
      setLoaded(false);
    }
    else
      setLoaded(true);
  }, [GamesBycategory, results])
  const changePage = (newPage) => {
    setLoaded(false)
    setTimeout(() => setLoaded(true), 500);
    props.history.push({
      pathname: "/category/" + active,
      search: "?page=" + newPage,
      state: { fromManageGames: fromManageGames }
    });
    setPage(newPage);
  }
  const handleChange = (e) => {
    setSearchText(e.target.value);
  }

  return (
    <div className={fromManageGames ? "category-wrapper managegames-category-wrapper" : "category-wrapper"}>
      <PageLayout
        sidebartitle={fromManageGames ? "Manage Games" : "Category"}
        active={fromManageGames ? "Categories" : active}
        category
        sideBarContents={sideBarContents}
        {...props}
      >
        <div id="category-element" className={loaded ? "" : "loading"}>
          <BreadCrumb category fromManageGames={fromManageGames} gameDetail={gameDetail} />
          <div className="profile-section">
            <h5 className="profile-name">{active}</h5>
            <h5 className="profile-name-common profile-name">Categories</h5>
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
          <SideBarMob contents={sideBarMobContents} active={active} />
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
            text={categoryDesc}
            lessHeight={60}
            className={"category-desc"}
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
              {gamesByCategory && gamesByCategory.data ? (
                gamesByCategory?.paginationData?.totalEntries > 0 ? (
                  gamesByCategory.data.map((game, index) => {
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
                        refreshFunction={() => dispatch(getGamesByCategory(categoryId, fromManageGames, searchText))}
                      />
                    );
                  })
                ) : (
                  <div className="no-game-wrapper">
                    <div>
                      <h3 className="no-game">
                        {
                          searchText.length === 0 ?
                            "Currently, there are no games under this category."
                            : "Currently, there are no games with this name under this category."
                        }
                      </h3>
                      <span className="no-game-span" onClick={() => props.history.push("/")}>
                        Go to Homepage
                      </span>
                    </div>
                  </div>
                )
              ) : null}
            </div>
            {
              gamesByCategory?.paginationData?.totalEntries > 0 &&
              <div className="pagination-wrapper">
                <button
                  className={page > 1 ? "pagination-left enable" : "pagination-left"}
                  onClick={() => {
                    if (page > 1) changePage(page - 1);
                    window.scrollTo(0, 0);
                  }}
                >
                  <img src={arrowleft} alt="arrow left" />
                </button>
                <div className="pagination-number">
                  <h5>{page}</h5>
                  <span>
                    of {gamesByCategory ? Math.ceil(gamesByCategory?.paginationData?.totalEntries / 12) : 1}{" "}
                    pages
                  </span>
                </div>
                <button
                  className={(page < Math.ceil(gamesByCategory?.paginationData?.totalEntries / 12)) ? "pagination-right enable" : "pagination-right"}
                  onClick={() => {
                    if (page < Math.ceil(gamesByCategory?.paginationData?.totalEntries / 12)) changePage(page + 1);
                  }}
                >
                  <img src={arrowleft} alt="arrow right" />
                </button>
              </div>
            }
          </LoadingComponent>
        </div>
        {
          openMobileHoverCard &&
          <PlayCardMobileHoverCard
            setOpenShareModal={setOpenShareModal}
            gameDetail={gameDetails}
            setOpenMobileHoverCard={setOpenMobileHoverCard}
            manage={fromManageGames}
            setShareLink={setShareLink}
          />
        }
      </PageLayout>
    </div>
  );
};

export default Category;
