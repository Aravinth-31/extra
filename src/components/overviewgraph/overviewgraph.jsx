import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

import "./overviewgraph.css";

const OverviewGraph = () => {
  const { overallReports } = useSelector((state) => state.overallReports);
  const [diffRating, setDiffRating] = useState();
  const [diffScore, setDiffScore] = useState();
  const [diffTime, setDiffTime] = useState();
  const [diffUser, setDiffUsers] = useState();
  useEffect(() => {
    if (overallReports && overallReports.data) {
      
      //Users change
      if (
        overallReports.data.user &&
        overallReports.data.user.sumOfUsersByWeek.length >= 2
      ) {
        setDiffUsers(
          overallReports.data.user.sumOfUsersByWeek[
            overallReports.data.user.sumOfUsersByWeek.length - 1
          ] -
            overallReports.data.user.sumOfUsersByWeek[
              overallReports.data.user.sumOfUsersByWeek.length - 2
            ]
        );
      } else if (
        overallReports.data.user &&
        overallReports.data.user.sumOfUsersByWeek.length
      ) {
        setDiffUsers(
          overallReports.data.user.sumOfUsersByWeek[
            overallReports.data.user.sumOfUsersByWeek.length - 1
          ]
        );
      }
      // Time change
      if (
        overallReports.data.time &&
        overallReports.data.time.sumOfTimeByWeek.length >= 2
      ) {
        setDiffTime(
          overallReports.data.time.sumOfTimeByWeek[
            overallReports.data.time.sumOfTimeByWeek.length - 1
          ] -
            overallReports.data.time.sumOfTimeByWeek[
              overallReports.data.time.sumOfTimeByWeek.length - 2
            ]
        );
      } else if (
        overallReports.data.time &&
        overallReports.data.time.sumOfTimeByWeek.length
      ) {
        setDiffTime(
          overallReports.data.time.sumOfTimeByWeek[
            overallReports.data.time.sumOfTimeByWeek.length - 1
          ]
        );
      }
      // Score Change
      if (
        overallReports.data.score &&
        overallReports.data.score.sumOfScoreByWeek.length >= 2
      ) {
        setDiffScore(
          overallReports.data.score.sumOfScoreByWeek[
            overallReports.data.score.sumOfScoreByWeek.length - 1
          ] -
            overallReports.data.score.sumOfScoreByWeek[
              overallReports.data.score.sumOfScoreByWeek.length - 2
            ]
        );
      } else if (
        overallReports.data.score &&
        overallReports.data.score.sumOfScoreByWeek.length
      ) {
        setDiffScore(
          overallReports.data.score.sumOfScoreByWeek[
            overallReports.data.score.sumOfScoreByWeek.length - 1
          ]
        );
      }
      //Rating change
      if (
        overallReports.data.ratings &&
        overallReports.data.ratings.sumOfRatingsByWeek.length >= 0
      ) {
        setDiffRating(
          overallReports.data.ratings.sumOfRatingsByWeek[
            overallReports.data.ratings.sumOfRatingsByWeek.length - 1
          ] -
            overallReports.data.ratings.sumOfRatingsByWeek[
              overallReports.data.ratings.sumOfRatingsByWeek.length - 2
            ]
        );
      } else if (
        overallReports.data.ratings &&
        overallReports.data.ratings.sumOfRatingsByWeek
      ) {
        setDiffRating(
          overallReports.data.ratings.sumOfRatingsByWeek[
            overallReports.data.ratings.sumOfRatingsByWeek.length - 1
          ]
        );
      }
    }
  }, [overallReports]);
  return (
    <div className="overflow-wrapper">
      {/* avgerage card */}
      <div className="avg-wrapper">
        <div className="c-white-card">
          <div className="avg-title">Avg no of Users</div>
          <div className="avg-graph">
            <div className="avg-left">
              <h5>
                {overallReports &&
                  overallReports.data &&
                  overallReports.data.user &&
                  overallReports.data.user.avgUsers
                  ? Math.round(overallReports.data.user.avgUsers)
                  : 0}
              </h5>
              <span
                className={diffUser && diffUser >= 0 ? "success" : "danger"}
              >
                {diffUser ? (diffUser >= 0 ? "+" + diffUser : diffUser) : 0}{" "}
                this week
              </span>
            </div>
            <div className="avg-right">{/* graph content */}</div>
          </div>
        </div>
        <div className="c-white-card">
          <div className="avg-title">Avg time spent per user</div>
          <div className="avg-graph">
            <div className="avg-left">
              <h5>
                {overallReports &&
                overallReports.data &&
                overallReports.data.time &&
                overallReports.data.time.avgTimeInMinutes
                  ? parseFloat(
                      overallReports.data.time.avgTimeInMinutes
                    ).toFixed(2)
                  : 0}{" "}
                min
              </h5>
              <span
                className={diffTime && diffTime >= 0 ? "success" : "danger"}
              >
                {diffTime
                  ? diffTime >= 0
                    ? "+" + parseFloat(diffTime).toFixed(2)
                    : parseFloat(diffTime).toFixed(2)
                  : 0}{" "}
                this week
              </span>
            </div>
            <div className="avg-right">{/* graph content */}</div>
          </div>
        </div>
        <div className="c-white-card">
          <div className="avg-title">Avg Score</div>
          <div className="avg-graph">
            <div className="avg-left">
              <h5>
                {overallReports &&
                  overallReports.data &&
                  overallReports.data.score &&
                  overallReports.data.score.avgScore
                  ? overallReports.data.score.avgScore.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : 0}
              </h5>
              <span
                className={diffScore && diffScore >= 0 ? "success" : "danger"}
              >
                {diffScore ? (diffScore >= 0 ? "+" + diffScore : diffScore) : 0}{" "}
                this week
              </span>
            </div>
            <div className="avg-right">{/* graph content */}</div>
          </div>
        </div>
        <div className="c-white-card">
          <div className="avg-title">Avg User rating</div>
          <div className="avg-graph">
            <div className="avg-left">
              <h5>
                {overallReports &&
                overallReports.data &&
                overallReports.data.ratings &&
                overallReports.data.ratings.avgRating
                  ? parseFloat(overallReports.data.ratings.avgRating).toFixed(2)
                  : 0}
                <span>/5</span>
              </h5>
              <span
                className={diffRating && diffRating >= 0 ? "success" : "danger"}
              >
                {diffRating
                  ? diffRating >= 0
                    ? "+" + parseFloat(diffRating).toFixed(2)
                    : parseFloat(diffRating).toFixed(2)
                  : 0}{" "}
                this week
              </span>
            </div>
            <div className="avg-right">{/* graph content */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewGraph;
