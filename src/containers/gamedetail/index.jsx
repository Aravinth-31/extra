import React, { useEffect, useLayoutEffect, useState } from 'react';

import './index.css';
import Header from '../../components/header/header';
import BreadCrumb from '../../components/breadcrumb/breadcrumb';
import GameTitleDetails from '../../components/gametitledetails/gametitledetails';
import GameDetailContent from '../../components/gamedetailcontent/gamedetailcontent';
import { useDispatch, useSelector } from 'react-redux';
import { getFavGames, logOut } from "../../redux/actions/userAction";
import { getGameDetail, checkReviewExist } from '../../redux/actions/gameDetailAction';
import { getMyPlans } from '../../redux/actions/plansApiActions';
import FeedbackModal from "../../components/modal/feedbackmodal";
import ThankyouModal from "../../components/modal/thankyou";
import LoadingComponent from '../../components/loader/LoadingComponent';
import { useHistory } from 'react-router-dom';
import * as ActionTypes from "../../redux/constants/gameDetailConstants";
import { decryptData, encryptData, IsAdmin } from '../../helpers/helper';
import { OrgRoles } from '../../helpers/userTypes';

const GameDetail = (props) => {
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [openThankyouModal, setOpenThankyouModal] = useState(false);
  const [finalRating, setFinalRating] = useState(0);
  const [loaded, setLoaded] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  const GameDetail = useSelector(state => state.gameDetail);
  const GetMyPlans = useSelector(state => state.getMyPlans);
  const { gameDetail } = GameDetail;
  const CheckReviewExist = useSelector(state => state.checkReviewExist);
  const { verifyReviewExist, loading } = CheckReviewExist;
  const { userInfo } = useSelector(state => state.getUser);

  useEffect(() => {
    if (verifyReviewExist) {
      const { message } = verifyReviewExist;
      if (message === "USER_NOT_RATED_THIS_GAME") {
        setOpenFeedbackModal(true);
      }
      else if (message === "USER_ALREADY_RATED_THIS_GAME") {
        setOpenFeedbackModal(false);
        sessionStorage.setItem("gameReportId", encryptData(props.match.params.id));
        history.push(`/game-reports/${sessionId}`);
      }
    }
  }, [verifyReviewExist]);

  const dispatch = useDispatch();
  const history = useHistory();
  let isAdmin = IsAdmin();
  useEffect(() => {
    if (props.location) {
      const sessionid = new URLSearchParams(props.location.search).get('sessionId');
      setSessionId(sessionid);
    }
  }, [props.location])

  useEffect(async () => {
    if (sessionId && sessionId !== "") {
      dispatch(checkReviewExist(props.match.params.id))
    }
  }, [sessionId])
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    dispatch(getGameDetail(props.match.params.id));
    dispatch(getFavGames());
    return () => {
      dispatch({ type: ActionTypes.GAME_VERIFY_REVIEW_EXIST_SUCCESS, payload: null });
    }
  }, []);
  useEffect(() => {
    const otpVerified = decryptData(localStorage.getItem("otpVerified") || encryptData(false));
    if (otpVerified && OrgRoles.includes(userInfo?.data?.role))
      dispatch(getMyPlans())
  }, [userInfo]);

  useEffect(() => {
    if (
      (GameDetail && GameDetail.loading) ||
      (GetMyPlans && GetMyPlans.loading)
    ) {
      setLoaded(false);
    }
    else
      setLoaded(true);
  }, [GameDetail, GetMyPlans]);
  const signOut = async () => {
    await dispatch(logOut());
    props.history.push("/");
  };

  return (
    <div>
      {/* <LoadingComponent loaded={!loading} > */}
      <Header profile {...props} signOut={signOut} isAdmin={isAdmin} />
      <LoadingComponent loaded={loaded} />
      <main className={loaded ? "container c-container" : "container c-container loading"}>
        {!isAdmin ? <BreadCrumb gameDetail={gameDetail} /> : null}
        <GameTitleDetails {...props} isAdmin={isAdmin} gameDetail={gameDetail} openFeedbackModal={openFeedbackModal} openThankyouModal={openThankyouModal} />
        <GameDetailContent gameDetail={gameDetail} />
      </main>
      {openFeedbackModal && (
        <FeedbackModal
          modalid="feedbackmodal"
          toggle={openFeedbackModal}
          setOpenFeedbackModal={setOpenFeedbackModal}
          setFinalRating={setFinalRating}
          setOpenThankyouModal={setOpenThankyouModal}
          gameDetail={gameDetail && gameDetail.data}
          sessionId={sessionId}
        />
      )}
      {openThankyouModal && (
        <ThankyouModal
          modalid="feedbackmodal"
          toggle={openThankyouModal}
          setOpenThankyouModal={setOpenThankyouModal}
          finalRating={finalRating}
          sessionId={sessionId}
          gameId={gameDetail && gameDetail.data && gameDetail.data.id}
        />
      )}
      {/* </LoadingComponent> */}
    </div>
  );
};

export default GameDetail;