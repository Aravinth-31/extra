import React, { useEffect, useState } from "react";
import "../scheduledGames/scheduledGames.css";

import arrowleft from "../../assets/images/paginationarrow.svg";
import Playcardlarge from "../../components/playCard/playcardlarge";
import { getFavGames } from "../../redux/actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import LikeShareModal from "../../components/modal/likesharemodal";
import PlayCardMobileHoverCard from "../../components/playCard/playCardMobileHoverCard";
import { useHistory } from "react-router-dom";
import notlike from "../../assets/images/notLike.svg";
import LoadingComponent from "../loader/LoadingComponent";
import { decryptData, encryptData } from "../../helpers/helper";

const MyFavourites = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const { loading, favGames } = useSelector((state) => state.getFavGames);
  const userLoginInfo = decryptData(localStorage.getItem("userSignInInfo") || encryptData({}));
  const [openShareModal, setOpenShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [openMobileHoverCard, setOpenMobileHoverCard] = useState(false);
  const [gameDetails, setGameDetails] = useState({});
  useEffect(() => {
    dispatch(getFavGames(false, page));
  }, [page]);
  useEffect(() => {
    if (history.location && history.location.search) {
      const page = new URLSearchParams(history.location.search).get('page');
      if (page > 1)
        setPage(parseInt(page));
    }
  }, [history.location]);
  return (
    <div>
      <div className="profile-section">
        <h5 className="profile-name hide991">My Favourites</h5>
      </div>
      <LoadingComponent loaded={!loading} />
      {openShareModal && (
        <LikeShareModal
          toggle={openShareModal}
          setOpenShareModal={setOpenShareModal}
          shareLink={shareLink}
        />
      )}
      {
        userLoginInfo &&
          favGames?.paginationData?.totalEntries > 0 ?
          <div className="playcard-wrapper">
            {
              favGames.data.map((game, index) => {
                return (
                  <Playcardlarge
                    key={JSON.stringify(game)}
                    srcImage={game.coverMedia}
                    title={game.title}
                    gameDetail={game}
                    setOpenShareModal={setOpenShareModal}
                    setShareLink={setShareLink}
                    setGameDetails={setGameDetails}
                    setOpenMobileHoverCard={setOpenMobileHoverCard}
                  />
                );
              })
            }
          </div> :
          <div>
            {
              !loading &&
              <div className="no-game-wrapper">
                <div>
                  <h3 className="no-game ">
                    {'No games added yet. To tag games as Favourites, LIKE them by clicking on '}<img src={notlike} alt="info" />
                  </h3>
                  <span className="no-game-span" onClick={() => history.push("/")}>
                    Go to Homepage
                  </span>
                </div>
              </div>
            }
          </div>
      }
      {favGames?.paginationData?.totalEntries > 0 && (
        <div className="pagination-wrapper">
          <button
            className={page > 1 ? "pagination-left enable" : "pagination-left"}
            onClick={() => {
              if (page > 1) {
                setPage(page - 1);
                history.push('/my-games/my-favourites?page=' + (page - 1));
              }
              window.scrollTo(0, 0);
            }}
          >
            <img src={arrowleft} alt="arrow left" />
          </button>
          <div className="pagination-number">
            <h5>{page}</h5>
            <span>
              of{" "}
              {favGames?.paginationData?.totalEntries
                ? Math.ceil(favGames?.paginationData?.totalEntries / 12)
                : 1}{" "}
              pages
            </span>
          </div>
          <button
            className={(page < Math.ceil(favGames?.paginationData?.totalEntries / 12)) ? "pagination-right enable" : "pagination-right"}
            onClick={() => {
              if (page < Math.ceil(favGames?.paginationData?.totalEntries / 12)) {
                setPage(page + 1);
                history.push('/my-games/my-favourites?page=' + (page + 1));
              }
            }}
          >
            <img src={arrowleft} alt="arrow right" />
          </button>
        </div>
      )}
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
export default MyFavourites;
