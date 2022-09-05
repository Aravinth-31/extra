import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { bulkUpdateGame } from "../../redux/actions/gameDetailAction";
import { deleteBannerGame, deleteSlogan, getAllGames, getAllSlogans } from "../../redux/actions/homepageActions";

function BannerDeleteModal({ setBannerDeleteModal, bannerGameId, sloganFlag, gameDetails, setSloganFlag, sloganData, games }) {
  const dispatch = useDispatch();
  const ref = React.createRef();
  useEffect(() => {
    if (ref.current)
      ref.current.style.top = document.documentElement.scrollTop + "px";
  }, [ref])

  const confirmBannerDelete = async (status) => {
    if (status) {
      if (sloganFlag === 'gameSlogan') {
        let sloganGames = [];
        games.forEach(game => {
          if (game.id !== gameDetails.id)
            sloganGames.push({ id: game.id, position: game.position, slogan: game.slogan, title: game.title });
        })
        await dispatch(bulkUpdateGame(sloganGames, sloganData));
        dispatch(getAllGames());
      }
      else if (sloganFlag === "Slogan") {
        await dispatch(deleteSlogan(sloganData));
        dispatch(getAllSlogans());
        dispatch(getAllGames());
      }
      else {
        dispatch(deleteBannerGame(bannerGameId, { game: bannerGameId }));
      }
    }
    setSloganFlag("");
    setBannerDeleteModal(false);
  }


  return (
    <div className="banner-delete-modal" ref={ref} id="banner-delete-modal">
      <div className="container">
        <span>Are you sure you want to delete ?</span>
        <div className="btn-group">
          <button className="btn btn-primary" onClick={() => confirmBannerDelete(true)}>Yes</button>
          <button className="btn btn-primary" onClick={() => confirmBannerDelete(false)}>No</button>
        </div>
      </div>
    </div>
  )
}

export default BannerDeleteModal;