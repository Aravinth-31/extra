import React, { useEffect, useState } from 'react';

import './overviewgraph.css';
// image
import winningratio from '../../assets/images/winningratio.svg';
import noofplayers from '../../assets/images/noofplayers.svg';
import noofquestions from '../../assets/images/noofquestions.png';
import timeicon from '../../assets/images/timeicon.svg';
import { useSelector } from 'react-redux';

const ReportGameCard = () => {
  const [avgerageTime, setAverageTime] = useState({ hours: 0, minutes: 0 });

  const { gameReport } = useSelector(state => state.gameReport);

  useEffect(() => {
    if (gameReport && gameReport.data && gameReport.data.avgTime) {
      // let avgTime = gameReport.data.avgTime && Math.round(parseFloat("110.00", 10));
      let avgTime = gameReport.data.avgTime && Math.round(parseFloat(gameReport.data.avgTime.avgTimeInMinutes, 10));
      setAverageTime({
        hours: Math.floor(avgTime / 60),
        minutes: avgTime % 60
      })
    }
  }, [gameReport]);

  return (
    <div className="overflow-wrapper">
      {/* avgerage card */}
      <div className="avg-wrapper report-game-ques">
        <div className="c-white-card">
          <div className="avg-graph">
            <div className="avg-title">Winning Ratio</div>
            <h5>
              {
                gameReport && gameReport.data && gameReport.data.avgWinRatio ?
                  Math.round(gameReport.data.avgWinRatio * 100) / 100 : 0
              }
              {/* 60 */}
              %</h5>
          </div>
          <div className="avg-right">
            <img src={winningratio} alt="winning" />
          </div>
        </div>
        <div className="c-white-card">
          <div className="avg-graph">
            <div className="avg-title">No of Players</div>
            <h5>
              {
                gameReport && gameReport.data && gameReport.data.noOfPlayers ?
                  gameReport.data.noOfPlayers : 0
              }
              {/* 120 */}
            </h5>
          </div>
          <div className="avg-right">
            <img src={noofplayers} alt="no of players" />
          </div>
        </div>
        <div className="c-white-card">
          <div className="avg-graph">
            <div className="avg-title">No of Question</div>
            <h5>
              {
                gameReport && gameReport.data && gameReport.data.noOfQuestions ?
                  gameReport.data.noOfQuestions : 0
              }
              {/* 20 */}
            </h5>
          </div>
          <div className="avg-right">
            <img src={noofquestions} alt="no of question" />
          </div>
        </div>
        <div className="c-white-card">
          <div className="avg-graph">
            <div className="avg-title">Time</div>
            <h5>
              {
                `${avgerageTime.hours}hr ${avgerageTime.minutes}min`
              }
              {/* 1hr 20min */}
            </h5>
          </div>
          <div className="avg-right">
            <img src={timeicon} alt="time" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGameCard;