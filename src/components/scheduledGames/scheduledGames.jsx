import React, { useEffect, useState } from "react";
import Playcardlarge from "../../components/playCard/playcardlarge";
import "./scheduledGames.css";
//images
import search from "../../assets/images/search.svg";
import arrowleft from "../../assets/images/paginationarrow.svg";
import SideBarMob from "../sidebar/sideBarMob";
import LikeShareModal from "../../components/modal/likesharemodal";
import { gamesScheduledByOthers, gamesScheduledByMe } from "../../redux/actions/gameDetailAction";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import PlayCardMobileHoverCard from "../../components/playCard/playCardMobileHoverCard";

import useConstant from "use-constant"
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useAsync } from 'react-async-hook';
import LoadingComponent from "../loader/LoadingComponent";

const sideBarMobContents = [
  { title: "Scheduled By Others", redirectLink: "/my-games/scheduled-by-others" },
  { title: "Scheduled By Me", redirectLink: "/my-games/scheduled-by-me" }
];

const useDebouncedSearch = (searchFunction) => {
  const [searchText, setSearchText] = useState('');
  const [gameSessionType, setGameSessionType] = useState("");
  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 500)
  );
  const results = useAsync(
    async () => {
      return debouncedSearchFunction(searchText, gameSessionType);
    },
    [debouncedSearchFunction, searchText]
  );
  return {
    searchText,
    setSearchText,
    results,
    setGameSessionType
  };
};

const ScheduledGames = (props) => {
  const [sessionType, setSessionType] = useState("");
  const useSearch = () => useDebouncedSearch(searchGames);
  const searchGames = (text, gameSessionType) => {
    if (gameSessionType === "user") {
      dispatch(gamesScheduledByMe(text));
    } else if (gameSessionType === "others") {
      dispatch(gamesScheduledByOthers(text));
    }
  }
  const { searchText, setSearchText, results, setGameSessionType } = useSearch();

  const dispatch = useDispatch();
  const history = useHistory();
  const GameSessionsByMe = useSelector((state) => state.gamesScheduledByMe);
  const { gameSessionsByMe } = GameSessionsByMe;
  const GameSessionsByOthers = useSelector((state) => state.gamesScheduledByOthers);
  const [page, setPage] = useState(1);
  const { gameSessionsByOthers } = GameSessionsByOthers;
  const [openShareModal, setOpenShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [openMobileHoverCard, setOpenMobileHoverCard] = useState(false);
  const [gameDetails, setGameDetails] = useState({});

  useEffect(() => {
    dispatch(gamesScheduledByOthers(searchText, page));
    dispatch(gamesScheduledByMe(searchText, page));
  }, [page]);
  useEffect(() => {
    setPage(1);
    setSessionType(props.gameSessionType);
    setGameSessionType(props.gameSessionType);
  }, [props.gameSessionType]);
  useEffect(() => {
    if (
      (GameSessionsByMe && GameSessionsByMe.loading) ||
      (GameSessionsByOthers && GameSessionsByOthers.loading) ||
      (results && results.loading)
    ) {
      setLoaded(false);
    }
    else
      setLoaded(true);
  }, [GameSessionsByMe, GameSessionsByOthers, results]);

  const handleClick = () => {
    history.push("/");
  };
  const handleChange = (e) => {
    setSearchText(e.target.value);
    // if (e.target.value.length === 0) {
    //   if (sessionType === "user") {
    //     dispatch(gamesScheduledByMe(""));
    //   } else if (sessionType === "others") {
    //     dispatch(gamesScheduledByOthers(""));
    //   }
    // }
    setPage(1)
  };
  useEffect(() => {
    if (history.location && history.location.search) {
      const page = new URLSearchParams(history.location.search).get('page');
      if (page > 1)
        setPage(parseInt(page));
    }
  }, [history.location]);

  const changePage = (newPage) => {
    setLoaded(false);
    setPage(newPage)
    history.push('/my-games/' + (sessionType === "user" ? "scheduled-by-me" : "scheduled-by-thers") + "?page=" + newPage);
    setTimeout(() => {
      setLoaded(true)
    }, 100);
  }

  //Pagination
  var dataLength;
  if (sessionType === "user") {
    dataLength = gameSessionsByMe?.paginationData?.totalEntries;
  } else {
    dataLength = gameSessionsByOthers?.paginationData?.totalEntries;
  }
  return (
    <div>
      <div className="profile-section">
        <h5 className="profile-name hide991">
          {sessionType === "user"
            ? "Scheduled By Me"
            : "Scheduled By Others"}
        </h5>
        <div className="input-icon">
          <img src={search} alt="search" />
          <input
            type="text"
            name="search"
            placeholder="Search a game"
            value={searchText}
            onChange={handleChange}
          />
        </div>
      </div>

      <SideBarMob active={props.gameSessionType === "user" ? "Scheduled By Me" : "Scheduled By Others"} contents={sideBarMobContents} />
      {openShareModal && (
        <LikeShareModal
          toggle={openShareModal}
          setOpenShareModal={setOpenShareModal}
          shareLink={shareLink}
        />
      )}
      <LoadingComponent loaded={loaded} >
        {sessionType === "user" && (
          gameSessionsByMe?.paginationData?.totalEntries > 0 ? (
            <div className="playcard-wrapper">
              {gameSessionsByMe.data.map((game, index) => {
                return (
                  <Playcardlarge
                    key={JSON.stringify(game.organizationGame.game)}
                    srcImage={game.organizationGame.game.coverMedia}
                    title={game.organizationGame.game.title}
                    gameDetail={game.organizationGame.game}
                    setOpenShareModal={setOpenShareModal}
                    setShareLink={setShareLink}
                    setGameDetails={setGameDetails}
                    setOpenMobileHoverCard={setOpenMobileHoverCard}
                  />
                );
              })
              }
            </div>
          ) :
            !GameSessionsByMe.loading && (
              <div className="no-game-wrapper">
                <div>
                  <h3 className="no-game ">
                    {
                      searchText.length === 0 ?
                        "Currently, there are no live games scheduled by you. Please schedule one or enjoy default games."
                        : "You haven't scheduled any game with this name. Please visit Category / Objective Library to schedule new games."
                    }
                  </h3>
                  <span className="no-game-span" onClick={handleClick}>
                    Go to Homepage
                  </span>
                </div>
              </div>
            )
        )}
        {" "}
        {sessionType === "others" && (
          gameSessionsByOthers?.paginationData?.totalEntries > 0 ?
            <div className="playcard-wrapper">
              {gameSessionsByOthers.data.map((game, index) => {
                return (
                  <Playcardlarge
                    key={JSON.stringify(game.organizationGame.game)}
                    srcImage={game.organizationGame.game.coverMedia}
                    title={game.organizationGame.game.title}
                    gameDetail={game.organizationGame.game}
                    scheduledBy={game.createdBy.email}
                    setOpenShareModal={setOpenShareModal}
                    setShareLink={setShareLink}
                    setGameDetails={setGameDetails}
                    setOpenMobileHoverCard={setOpenMobileHoverCard}
                  />
                );
              })
              }
            </div>
            : (
              <div>
                {!GameSessionsByOthers.loading && (
                  <div className="no-game-wrapper">
                    <div>
                      <h3 className="no-game">
                        {
                          searchText.length === 0 ?
                            "Currently, there are no live games scheduled by others. Please schedule one or enjoy the default games."
                            : "Currently, there are no live games scheduled by others with this name. Please schedule one or enjoy the default games."
                        }
                      </h3>
                      <span className="no-game-span" onClick={handleClick}>
                        Go to Homepage
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
        )}
        {dataLength > 0 && (
          <div className="pagination-wrapper active-games">
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
              <span>of {dataLength ? Math.ceil(dataLength / 12) : 1} pages</span>
            </div>
            <button
              className={(page < Math.ceil(dataLength / 12)) ? "pagination-right enable" : "pagination-right"}
              onClick={() => {
                if (page < Math.ceil(dataLength / 12)) changePage(page + 1);
              }}
            >
              <img src={arrowleft} alt="arrow right" />
            </button>
          </div>
        )}
      </LoadingComponent>
      {
        openMobileHoverCard &&
        <PlayCardMobileHoverCard
          setOpenShareModal={setOpenShareModal}
          gameDetail={gameDetails}
          setOpenMobileHoverCard={setOpenMobileHoverCard}
          setShareLink={setShareLink}
        />
      }
    </div>
  );
};

export default ScheduledGames;
