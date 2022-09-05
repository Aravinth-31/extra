import React, { useEffect, useLayoutEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "./index.css";

import PageLayout from "../../components/pagelayout/pagelayout";
import ReportGameCard from "../../components/overviewgraph/reportgamecard";
import LeaderBoard from "../../components/leaderboard/leaderboard";
import ReviewTab from "../../components/reviewtab/reviewtab";
// imagge
import download from "../../assets/images/download.svg";
import ArrowBack from "../../assets/images/arrow-back.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadGameReport,
  getGameReport,
  getGameReview,
} from "../../redux/actions/reportsActions";
import { sideBarContentMyFavourites } from "../../helpers/sidebarContentMyGames";
import { getGameDetail } from "../../redux/actions/gameDetailAction";
import LoadingComponent from "../../components/loader/LoadingComponent";
import { BASE_URL, decryptData, encryptData } from "../../helpers/helper";
import axios from "axios";
import ROLES from "../../helpers/userTypes";

const GameReports = (props) => {
  const [loaded, setLoaded] = useState(false);
  const { gameReportFile } = useSelector((state) => state.gameReportFile);
  const GetGameReview = useSelector(state => state.getGameReview);
  const { gameReviews } = GetGameReview;
  const GameDetail = useSelector(state => state.gameDetail);
  const { gameDetail } = GameDetail;
  const { gameReport } = useSelector(state => state.gameReport);
  const { userInfo } = useSelector(state => state.getUser);

  const [zipFileAvailable, setZipFileAvailable] = useState(false);

  const dispatch = useDispatch();
  const history = props.history;
  let sessionId = "";
  if (
    history &&
    history.location &&
    history.location.pathname &&
    history.location.pathname.split("/").length > 2
  ) {
    sessionId = history.location.pathname.split("/")[2];
  }
  let gameId = "";
  gameId = decryptData(sessionStorage.getItem("gameReportId") || encryptData(""));

  useEffect(() => {
    if (sessionId) {
      dispatch(getGameReport(sessionId));
      dispatch(downloadGameReport(sessionId));
    }
  }, [sessionId]);

  useEffect(() => {
    const callBack = async () => {
      try {
        const response = await axios.post(BASE_URL + '/php/API/check.php', { gameId })
        if (response && response.data && response.data.response && response.data.response.success) {
          setZipFileAvailable(true);
        }
      } catch (error) {
        console.log(error);
      };
    }
    callBack();
  }, [gameId, sessionId]);
  useEffect(() => {
    if (gameId && gameId !== "") {
      dispatch(getGameReview(gameId));
      dispatch(getGameDetail(gameId))
    }
  }, [gameId]);
  useEffect(() => {
    if (
      (GameDetail && GameDetail.loading) ||
      (GetGameReview && GetGameReview.loading)
    ) {
      setLoaded(false);
    }
    else
      setLoaded(true);
  }, [GetGameReview, GameDetail]);
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="game-report">
      <PageLayout
        activeReport
        {...props}
        sideBarContents={sideBarContentMyFavourites}
        active={"My Reports"}
      >
        <LoadingComponent loaded={loaded} >
          <div className="report-section">
            <h5>
              <img
                src={ArrowBack}
                onClick={() => props.history.goBack()}
                alt="back"
              />
              {gameDetail && gameDetail.data && gameDetail.data.title}
            </h5>
            <div className="download-grp">
              {zipFileAvailable && (userInfo?.data?.role === ROLES.ORG_SUPER_ADMIN || userInfo?.data?.email === gameReport?.data?.session?.createdBy?.email) && (
                <a href={BASE_URL + "/php/zip.php?gameId=" + gameId + "&sessionId=" + sessionId}>
                  <button type="submit" className="btn btn-primary">
                    <img src={download} alt="download" />
                    <span>Download Data</span>
                  </button>
                </a>
              )}
              {gameReportFile && (userInfo?.data?.role === ROLES.ORG_SUPER_ADMIN || userInfo?.data?.email === gameReport?.data?.session?.createdBy?.email) && (
                <a href={gameReportFile.data.downloadUrl}>
                  <button type="submit" className="btn btn-primary">
                    <img src={download} alt="download" />
                    <span>Download Report</span>
                  </button>
                </a>
              )}
            </div>
          </div>
          <ReportGameCard />
          {/* desktop show and mobile hide */}
          <div className="c-white-card mhide">
            <Tabs className="cg-tabs reports-tab">
              <TabList>
                <Tab>Leaderboard</Tab>
                <Tab>Review</Tab>
              </TabList>
              <TabPanel>
                <LeaderBoard />
              </TabPanel>
              <TabPanel>
                {
                  gameReviews && gameReviews.data && gameReviews.data.length > 0 ?
                    gameReviews.data.map((review) => {
                      return (
                        <ReviewTab review={review} key={JSON.stringify(review)} />
                      )
                    })
                    :
                    <div className="no-data">There are currently no reviews. Please check later!</div>
                }
              </TabPanel>
            </Tabs>
          </div>
          {/* mobile show and desktop hide */}
          <div className="mshow">
            <div className="responsive-show-data">
              <div className="gamereport-title mb0 mshow">
                <h5>Leaderboard</h5>
              </div>
              <LeaderBoard />
            </div>
            <div className="responsive-show-data">
              <div className="gamereport-title mshow">
                <h5>Review</h5>
              </div>{
                gameReviews && gameReviews.data && gameReviews.data.length > 0 ?
                  gameReviews.data.map((review) => {
                    return (
                      <ReviewTab review={review} key={JSON.stringify(review)} />
                    )
                  })
                  :
                  <div className="no-data">There are currently no reviews!</div>
              }
            </div>
          </div>
        </LoadingComponent>
      </PageLayout>
    </div>
  );
};

export default GameReports;
