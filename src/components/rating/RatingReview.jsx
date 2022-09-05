import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Feedbackmodal from "../modal/feedbackmodal";
import { getAllGames } from "../../redux/actions/homepageActions";
import ThankyouModal from "../modal/thankyou";
const RatingReview = (props) => {
  const dispatch = useDispatch();
  const [openFeedbackModal, setOpenFeedbackModal] = useState(true);
  const [openThankyouModal, setOpenThankyouModal] = useState(false);
  const [finalRating, setFinalRating] = useState(0);
  const AllGames = useSelector((state) => state.allGames);
  const { allGames } = AllGames;
  useEffect(() => {
    dispatch(getAllGames());
  }, []);
  const gameDetail =
    allGames &&
    allGames.data &&
    allGames.data.find((game) => game.staticRoute === props.match.params.game);
  return (
    <div>
      {openFeedbackModal && (
        <Feedbackmodal
          modalid="feedbackmodal"
          toggle={openFeedbackModal}
          setOpenFeedbackModal={setOpenFeedbackModal}
          setFinalRating={setFinalRating}
          setOpenThankyouModal={setOpenThankyouModal}
          gameDetail={gameDetail}
        />
      )}
      {openThankyouModal && (
        <ThankyouModal
          modalid="feedbackmodal"
          toggle={openThankyouModal}
          setOpenThankyouModal={setOpenThankyouModal}
          finalRating={finalRating}
        />
      )}
    </div>
  );
};

export default RatingReview;
