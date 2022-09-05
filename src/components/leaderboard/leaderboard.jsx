import React from 'react';

import './leaderboard.css';
import morevertical from '../../assets/images/more-vertical.svg';
import { useSelector } from 'react-redux';
const LeaderBoard = () => {

  const { gameReport } = useSelector(state => state.gameReport);

  return (
    <div>
      {/* table for desktop */}
      <div className="report-table leader-table">
        <table>
          <thead>
            <tr>
              <th>Player Name</th>
              {/* <th>Rank</th> */}
              <th>Score</th>
              {/* <th>Correct Answer</th>
              <th>Wrong Answer</th>
              <th>Unaswered</th> */}
              <th>Time Taken</th>
            </tr>
          </thead>
          <tbody>
            {gameReport && gameReport.data && gameReport.data.sortReport ?
              gameReport.data.sortReport.map((report, index) => {
                return (
                  <tr>
                    <td>
                      <div className="table-detail">
                        <div className="name-initial">
                          <span>{(report.user.firstName && report.user.firstName.slice) ? report.user.firstName.slice(0, 2).toUpperCase() : report.user.email && report.user.email.slice && report.user.email.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div className="table-desc">
                          <h4>{report.user.firstName && report.user.firstName !== "" ? report.user.firstName : report.user.email}</h4>
                        </div>
                      </div>
                    </td>
                    {/* <td><b>{index + 1}</b></td> */}
                    <td>{report.points}</td>
                    {/* <td className="correct-ans">{report.correctAnswer ? report.correctAnswer : "---"}</td>
                    <td className="wrong-ans">{report.wrongAnswer ? report.wrongAnswer : "---"}</td>
                    <td className="un-ans">{report.unAnswered ? report.unAnswered : "---"}</td> */}
                    <td>
                      <div className="reports-dropdown-view">
                        {report.time}
                        {/* <div className="reports-dropdown mshow">
                          <button id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src={morevertical} alt="dropdown" />
                          </button>
                          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <h6>More info</h6>
                            <div className="correct-ans">
                              Correct Answer <span>{report.correctAnswer ? report.correctAnswer : "---"}</span>
                            </div>
                            <div className="wrong-ans">
                              Wrong Answer <span>{report.wrongAnswer ? report.wrongAnswer : "---"}</span>
                            </div>
                            <div className="un-ans">
                              Unaswered <span>{report.unAnswered ? report.unAnswered : "---"}</span>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </td>
                  </tr>
                )
              }) : null
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderBoard;