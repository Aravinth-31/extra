import React, { useEffect, useState } from "react";

import "./reportstable.css";
import arrow from "../../assets/images/arrow-right.svg";
import { useSelector, useDispatch } from "react-redux";
import search from "../../assets/images/search.svg";
import { getOverallReports } from "../../redux/actions/reportsActions";
import { useHistory } from "react-router-dom";
import { encryptData, EXTRAMILE_SUPERADMIN_EMAIL, S3_BASE_URL } from "../../helpers/helper";
import arrowleft from '../../assets/images/paginationarrow.svg';
import filtericon from '../../assets/images/filtericon.png';

import useConstant from "use-constant"
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useAsync } from 'react-async-hook';
import LoadingComponent from "../loader/LoadingComponent";
import ROLES from "../../helpers/userTypes";
import FilterModal from "../modal/filtermodal";

const useDebouncedSearch = (searchFunction) => {
  const [searchText, setSearchText] = useState('');
  const [recordsCount, SetRecordsCount] = useState(5);
  const [role, setRole] = useState("");

  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 500)
  );
  const results = useAsync(
    async () => {
      return debouncedSearchFunction(searchText, role);
    },
    [debouncedSearchFunction, searchText]
  );
  return {
    searchText,
    setSearchText,
    results,
    recordsCount,
    SetRecordsCount,
    role,
    setRole
  };
};

const ReportsTable = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const useSearch = () => useDebouncedSearch(searchFunction);
  const searchFunction = (text, role) => {
    dispatch(getOverallReports({ text }));
    if (role === ROLES.EMPLOYEE)
      SetRecordsCount(5);
    else
      SetRecordsCount(5);
  }
  const { searchText, setSearchText, SetRecordsCount, recordsCount, results, role, setRole } = useSearch();

  const UserInfo = useSelector((state) => state.getUser);
  const { userInfo } = UserInfo;

  const OverallReports = useSelector((state) => state.overallReports);
  const { overallReports, loading } = OverallReports;
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [filterState, setFilterState] = useState({
    initiatedBy: '',
    from: '',
    to: '',
    min: '',
    max: '',
    gameName: ''
  });

  useEffect(() => {
    if (userInfo) {
      var { role } = userInfo.data;
      setRole(role);
    }
  }, [userInfo])
  useEffect(() => {
    if (ROLES.EMPLOYEE === role)
      SetRecordsCount(5);
    else
      SetRecordsCount(5);
  }, [role])

  useEffect(() => {
    if (history.location && history.location.search && overallReports && overallReports.data && overallReports.data.overAllTableReports) {
      const page = new URLSearchParams(history.location.search).get('page');
      let recordCount = overallReports?.paginationData?.totalEntries;
      if (page > 0 && page <= Math.ceil(recordCount / 10)) {
        SetRecordsCount(recordCount);
        setPage(parseInt(page));
      }
    }
  }, [overallReports])

  const handleChange = (e) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  const showAllRecords = () => {
    let recordCount = overallReports?.paginationData?.totalEntries;
    SetRecordsCount(recordCount);
    history.push('/my-games/my-reports?page=1');
  };

  useEffect(() => {
    const value = sessionStorage.getItem("scrollPos");
    setScrollPos(value);
    sessionStorage.setItem("scrollPos", 0);
  }, []);
  useEffect(() => {
    dispatch(getOverallReports({ text: filterState.gameName, ...filterState }, page));
  }, [page]);
  const changePage = (newPage) => {
    window.scrollTo(0, 0);
    setPage(newPage);
    history.push('/my-games/my-reports?page=' + newPage);
  }
  useEffect(() => {
    if (results && results.loading) {
      setLoaded(false);
    }
    else {
      setLoaded(true);
      if (scrollPos > 0) {
        const element = document.getElementsByClassName("main-wrapper")[0];
        element.scrollTo(0, scrollPos);
      }
    }
  }, [results])

  return (
    <div>
      {/* table for desktop */}
      <LoadingComponent loaded={loaded} />
      <div className="report-table c-white-card mb0">
        <div className="search-bar">
          <h5>Reports By Sessions</h5>
          <div className="right">
            <div className="btn-tooltip">
              <img onClick={() => setOpenFilterModal(true)} src={filtericon} />
              <div className="tooltip">Add Filters</div>
            </div>
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
        </div>
        <table>
          <thead>
            <tr>
              <th>Game Name</th>
              <th>Initiated By</th>
              <th>Played On</th>
              <th>No of Players</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              overallReports?.data?.overAllTableReports?.length > 0
                ? overallReports.data.overAllTableReports.map((game, index) => {
                  if (index < recordsCount) {
                    return (
                      <tr
                        onClick={() => {
                          const element = document.getElementsByClassName("main-wrapper")[0];
                          sessionStorage.setItem("scrollPos", element.scrollTop);
                          sessionStorage.setItem("gameReportId", encryptData(game.game.gameId));
                          history.push("/game-reports/" + game.id);
                        }}
                        key={JSON.stringify(game.id)}
                      >
                        <td>
                          <div className="table-detail">
                            <div className="table-img">
                              <img
                                src={
                                  game.game &&
                                    game.game.game &&
                                    game.game.game.coverMedia[0] &&
                                    game.game.game.coverMedia[0].includes('https://youtu.be') ?
                                    S3_BASE_URL + game.game.game.coverMedia[1]
                                    : S3_BASE_URL + game.game.game.coverMedia[0]
                                }
                                alt="table"
                              />
                            </div>
                            <div className="table-desc">
                              <h4>{game.game.game.title}</h4>
                            </div>
                          </div>
                        </td>
                        <td>
                          {game.gameName && game.game && game.game.game && ((game.gameName.includes(game.game.game.title + " - PUBLIC SESSION") && game.game.game.isDefault) || (game.initiatedBy && game.initiatedBy.email === EXTRAMILE_SUPERADMIN_EMAIL)) ?
                            "Default" :
                            game.initiatedBy.firstName +
                            " " +
                            game.initiatedBy.lastName}
                        </td>
                        <td>
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true
                          }).format(new Date(game.playedOn))}
                        </td>
                        <td>
                          <b>{game.noOfPlayers}</b>
                        </td>
                        {game.status === "LIVE" ? (
                          <td>
                            <div className="table-arrow">
                              <div className="table-upadte live">live</div>
                              <div className="table-arrow-img">
                                <img src={arrow} alt="arrow" />
                              </div>
                            </div>
                          </td>
                        ) : game.status === "COMPLETED" ? (
                          <td>
                            <div className="table-arrow">
                              <div className="table-upadte complete">complete{" "}</div>
                              <div className="table-arrow-img">
                                <img src={arrow} alt="arrow" />
                              </div>
                            </div>
                          </td>
                        ) : null}
                      </tr>
                    );
                  } else {
                    return (<div key={JSON.stringify(game)} />);
                  }
                })
                : (!loading && <>No record found.</>)}
          </tbody>
        </table>
        {recordsCount &&
          overallReports &&
          overallReports.data &&
          overallReports.data.overAllTableReports &&
          ((role === ROLES.EMPLOYEE && overallReports?.paginationData?.totalEntries <= 5) || (role !== ROLES.EMPLOYEE && overallReports?.paginationData?.totalEntries <= 5) ||
            recordsCount ===
            overallReports?.paginationData?.totalEntries) ? null : (
          <div className="report-viewall">
            <button
              type="submit"
              className="btn btn-secondry"
              onClick={showAllRecords}
            >
              View all reports
            </button>
          </div>
        )}
      </div>
      {/* table for mobile */}
      <div className="table-responsive">
        {
          overallReports?.data?.overAllTableReports?.length > 0
            ? overallReports.data.overAllTableReports.map((game, index) => {
              if (index < recordsCount) {
                return (
                  <div
                    className="report-t-card c-white-card"
                    onClick={() => {
                      const element = document.getElementsByClassName("main-wrapper")[0];
                      sessionStorage.setItem("scrollPos", element.scrollTop);
                      sessionStorage.setItem("gameReportId", encryptData(game.game.gameId));
                      history.push("/game-reports/" + game.id);
                    }}
                    key={JSON.stringify(game)}
                  >
                    <div className="report-t-top">
                      <div className="table-detail">
                        <div className="table-img">
                          <img src={
                            game.game &&
                              game.game.game &&
                              game.game.game.coverMedia[0] &&
                              game.game.game.coverMedia[0].includes('https://youtu.be') ?
                              S3_BASE_URL + game.game.game.coverMedia[1]
                              : S3_BASE_URL + game.game.game.coverMedia[0]
                          } alt="table" />
                        </div>
                        <div className="table-desc">
                          <h4>{game.game.game.title}</h4>
                          <span>
                            {new Intl.DateTimeFormat("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true
                            }).format(new Date(game.playedOn))}
                          </span>
                        </div>
                      </div>
                      {game.status === "LIVE" ? (
                        <div className="table-upadte live">live</div>
                      ) : game.status === "COMPLETED" ? (
                        <div className="table-upadte complete">complete </div>
                      ) : null}
                    </div>
                    <div className="report-t-bottom">
                      <div className="report-t-left">
                        <span>Initiated by :</span>
                        <h6>
                          {game.gameName && game.game && game.game.game && game.gameName.includes(game.game.game.title + " - PUBLIC SESSION") ?
                            "Default" :
                            game.initiatedBy.firstName +
                            " " +
                            game.initiatedBy.lastName}
                        </h6>
                      </div>
                      <div className="report-t-right">
                        <span>No of Players:</span>
                        <h6>{game.noOfPlayers}</h6>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (<div key={JSON.stringify(game)} />);
              }
            })
            : (!loading && <>No record found.</>)}

        {recordsCount &&
          overallReports &&
          overallReports.data &&
          overallReports.data.overAllTableReports &&
          ((role === ROLES.EMPLOYEE && overallReports?.paginationData?.totalEntries <= 5) || (role !== ROLES.EMPLOYEE && overallReports?.paginationData?.totalEntries <= 5) ||
            recordsCount ===
            overallReports?.paginationData?.totalEntries) ? null : (
          <div className="report-viewall">
            <button
              type="submit"
              className="btn btn-secondry"
              onClick={showAllRecords}
            >
              View all reports
            </button>
          </div>
        )}
      </div>
      {
        recordsCount >= 10 &&
        <div className="pagination-wrapper">
          <button
            className={page > 1 ? "pagination-left enable" : "pagination-left"}
            onClick={() => {
              if (page > 1)
                changePage(page - 1);
              window.scrollTo(0, 0);
            }}
          >
            <img src={arrowleft} alt="arrow left" />
          </button>
          <div className="pagination-number">
            <h5>{page}</h5>
            <span>of {Math.ceil(recordsCount / 12)}{" "}pages</span>
          </div>
          <button
            className={(page < Math.ceil(recordsCount / 12)) ? "pagination-right enable" : "pagination-right"}
            onClick={() => {
              if (page < Math.ceil(recordsCount / 12))
                changePage(page + 1);
            }}
          >
            <img src={arrowleft} alt="arrow right" />
          </button>
        </div>
      }
      <FilterModal filterState={filterState} setFilterState={setFilterState} modalid={'filter-modal'} SetRecordsCount={SetRecordsCount} toggle={openFilterModal} setOpenFilterModal={setOpenFilterModal} setPage={setPage} />
    </div>
  );
};

export default ReportsTable;
