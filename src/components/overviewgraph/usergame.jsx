import React from 'react';
import { useSelector } from 'react-redux';

import './overviewgraph.css';

const UserGame = () => {
  const { overallReports } = useSelector(state => state.overallReports);

  return (
    <div className="overflow-wrapper">
      {/* total users */}
      <div className="total-top">
        <div className="c-white-card">
          <div className="total-top-left">
            <h5>Total users</h5>
            <h6>
              {
                overallReports && overallReports.data && overallReports.data.totalPlayers ?
                  overallReports.data.totalPlayers : 0
              }
            </h6>
            {/* <ul>
              <li>
                Men - 12,292
              </li>
              <li>
                Women  - 12,339
              </li>
            </ul> */}
            {/* <div className="percentage-card">
              <div className="percentage blue">
                18 to 25
                <span>40%</span>
              </div>
              <div className="percentage green">
                25 to 40
                <span>38%</span>
              </div>
              <div className="percentage yellow">
                40 to 50
                <span>25%</span>
              </div>
            </div> */}

            <div className="percentage-card">
              {overallReports && overallReports.data && overallReports.data.groupedUserBycity ? overallReports.data.groupedUserBycity.map((data, index) => {
                if (data.city) {
                  return (
                    <div key={index} className="percentage blue">
                      {data.city}
                    </div>
                  );
                }
                return null;
              }) : null}
            </div>
          </div>
          <div className="total-top-right"></div>
        </div>
        <div className="c-white-card">
          <h5>Top 5 played games</h5>
          <ul>
            {
              overallReports && overallReports.data && overallReports.data.topPlayedGamesData ?
                overallReports.data.topPlayedGamesData.map((game) => {
                  return (
                    <li key={JSON.stringify(game)}>
                      <span>{game.game.title}</span>
                      <div className="game-bar">
                        <div className="play-game-bar"></div>
                        {game.count >= 1000 ? game.count / 1000 + "k" : game.count}
                      </div>
                    </li>
                  )
                }) : null
            }

          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserGame;