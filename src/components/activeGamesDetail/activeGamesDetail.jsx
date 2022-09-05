import React, { useEffect, useState } from "react";
import "./activeGamesDetail.css";
import arrowleft from "../../assets/images/paginationarrow.svg";
import publicOnly from "../../assets/images/public.svg";
import privateOnly from "../../assets/images/private.svg";
import inviteOnly from "../../assets/images/inviteOnly.svg";
import gameArrow from "../../assets/images/gameArrow.svg";
import StartNewGameModal from "../modal/startNewGameModal";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { deleteGameSession, getAllGameSessions } from "../../redux/actions/sessionsApiActions";
import { getGameDetail, getGameServerOtp } from "../../redux/actions/gameDetailAction";
import { getMyPlans } from "../../redux/actions/plansApiActions";
import DeleteDomainModal from '../modal/deleteDomainModal';
import LoadingComponent from "../loader/LoadingComponent";
import ROLES, { OrgRoles } from "../../helpers/userTypes";
import axios from "axios";
import { BASE_URL } from "../../helpers/helper";
import SettingsSvg from "../svgIcon/settingsSvg";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const ActiveGamesDetail = (props) => {
  const [openNewGameModal, setOpenNewGameModal] = useState(false);
  const [page, setPage] = useState(1);
  const [joinPressed, setJoinPressed] = useState(false);
  const [loaded, setLoaded] = useState(true);
  const { userInfo } = useSelector(state => state.getUser);
  const GameSessions = useSelector(state => state.gameSessions);
  const [edit, setEdit] = useState(false);
  const [editSession, setEditSession] = useState({});
  const [openDeleteDomainModal, setOpenDeleteDomainModal] = useState(false);
  const [deleteSession, setDeleteSession] = useState(null);
  const [loadFlag, setLoadFlag] = useState(0);
  const [showConfigure, setShowConfigure] = useState(false);

  const { gameSessions } = GameSessions;
  const GameDetail = useSelector(state => state.gameDetail);
  const { gameDetail } = GameDetail;
  const GetMyPlans = useSelector(state => state.getMyPlans);
  const { id } = useParams();
  const GameServerOtp = useSelector(state => state.gameServerOtp);
  const { gameServerOtp } = GameServerOtp;
  const DeleteSession = useSelector(state => state.deleteSession);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllGameSessions(id));
    dispatch(getGameDetail(id));
    if (OrgRoles.includes(userInfo?.data?.role))
      dispatch(getMyPlans());
    const callBack = async () => {
      try {
        const response = await axios.post(BASE_URL + "/php/API/admin.php", { gameId: id });
        if (response.data && response.data.response && response.data.response.success) {
          setShowConfigure(true);
        }
      } catch (err) {
        console.log(err);
      }
    }
    callBack();
  }, [id]);
  useEffect(() => {
    dispatch(getAllGameSessions(id, page));
  }, [page]);

  // useEffect(() => {
  //   if (gameSessions?.data && userInfo?.data) {
  //     const sessions = gameSessions.data.filter(session => {
  //       if (session.mode === "PRIVATE") {
  //         if (userInfo.data.role === ROLES.EMPLOYEE) {
  //           if (session.createdBy.email === userInfo.data.email)
  //             return true;
  //           return false;
  //         }
  //         return true;
  //       }
  //       return true;
  //     })
  //     setAllSessions(sessions);
  //   }
  //   else if (allSessions.length > 0)
  //     setAllSessions([]);
  // }, [gameSessions, userInfo]);

  const handleClick = () => {
    if (userInfo && userInfo.data && userInfo.data.role === ROLES.EMPLOYEE
      && gameDetail && gameDetail.data && !gameDetail.data.allowEmployeeSession)
      return;
    setOpenNewGameModal(true);
  }
  const formatToDate = (dateString) => {
    const date = new Date(dateString);
    const newDateString = `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}
    -${monthNames[date.getMonth()]}-
    ${date.getFullYear()} 
    ${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
    return newDateString;
  }
  const changePage = (newPage) => {
    setLoaded(false);
    setPage(newPage)
    setTimeout(() => {
      setLoaded(true)
    }, 100);
  }
  const handleEdit = (e, session) => {
    e.preventDefault();
    setEditSession(session);
    setEdit(true);
    setOpenNewGameModal(true);
  }
  const handleDelete = async (session) => {
    setOpenDeleteDomainModal(false);
    const response = await dispatch(deleteGameSession(session.id));
    if (response === 200) {
      dispatch(getAllGameSessions(id));
    }
  }
  useEffect(() => {
    if (
      (GameSessions && GameSessions.loading) ||
      (GetMyPlans && GetMyPlans.loading) ||
      (GameDetail && GameDetail.loading) ||
      (DeleteSession && DeleteSession.loading)
    ) {
      setLoaded(false);
    }
    else {
      setLoaded(true);
    }
  }, [GameSessions, GameDetail, GetMyPlans, DeleteSession]);

  const handleJoinGame = async (sessionId, from, to) => {
    if ((new Date(from) > new Date()) || (new Date(to) < new Date())) {
      setLoadFlag(prevState => prevState + 1);
      return;
    }
    setLoaded(false);
    const response = await dispatch(getGameServerOtp(id, sessionId));
    if (response && response.status === 200) {
      setJoinPressed(true);
    }
    else {
      setLoaded(true);
    }
  }
  useEffect(() => {
    if (joinPressed && gameServerOtp && gameServerOtp.data) {
      setJoinPressed(false);
      window.location.replace(gameServerOtp.data.redirectUrl);
    }
  }, [gameServerOtp, joinPressed])

  const handleConfigure = async (e, sessionId) => {
    e.preventDefault();
    setLoaded(false);
    const responseotp = await dispatch(getGameServerOtp(id, sessionId))
    if (responseotp && responseotp.data && responseotp.data.data && responseotp.data.data.redirectUrl)
      window.location.replace(responseotp.data.data.redirectUrl + "&admin=true");
    else
      setLoaded(true);
  }

  return (
    <div>
      {/* Desktop View */}
      {
        openNewGameModal &&
        <StartNewGameModal
          modalid={"new-game-modal"}
          gameId={id} toggle={openNewGameModal}
          setOpenNewGameModal={setOpenNewGameModal}
          editSession={editSession}
          setEditSession={setEditSession}
          edit={edit}
          setEdit={setEdit}
        />
      }
      <div className="games-table-sect">
        <div className="game-head">
          <h5>View Active Games</h5>
          <button type="submit"
            className={`btn btn-secondry ${userInfo &&
              userInfo.data && userInfo.data.role === ROLES.EMPLOYEE
              && gameDetail && gameDetail.data && !gameDetail.data.allowEmployeeSession ? "disabled" : ""}`} onClick={handleClick}>
            Start new Game
          </button>
        </div>
        <LoadingComponent loaded={loaded} >
          {
            gameSessions?.paginationData?.totalEntries > 0 ?
              <div className="game-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Initiated By</th>
                      <th>Game Visibility</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      {/* <th></th> */}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      gameSessions ?
                        gameSessions?.data?.map((session, index) => {
                          return (
                            <tr key={JSON.stringify(session)}>
                              <td className="games-title">{session.name}</td>
                              <td>
                                {
                                  session.name.includes(gameDetail && gameDetail.data && gameDetail.data.title + " - PUBLIC SESSION") ? "Default"
                                    : (userInfo && userInfo.data && session.createdBy.email === userInfo.data.email) ? "Me"
                                      : session.createdBy.email
                                }
                              </td>
                              <td>
                                {
                                  session.mode === "PUBLIC" ?
                                    <div className="game-mode">
                                      <img src={publicOnly} alt="public" /> <span>Public</span>
                                    </div>
                                    : session.mode === "PRIVATE" ?
                                      <div className="game-mode">
                                        <img src={privateOnly} alt="public" /> <span>Private</span>
                                      </div>
                                      :
                                      <div className="game-mode">
                                        <img src={inviteOnly} alt="public" /> <span>Invite Only</span>
                                      </div>
                                }
                              </td>
                              <td>{formatToDate(session.scheduleFrom)}</td>
                              <td>
                                <div className="game-btn">
                                  {formatToDate(session.scheduleTo)}
                                  <div className="action-group">
                                    {(userInfo && userInfo.data && session.createdBy.email === userInfo.data.email) && new Date(session.scheduleTo) > new Date() &&
                                      <>
                                        <div className="btn-tooltip">
                                          <button onClick={(e) => handleEdit(e, session)}>
                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <rect x="0.5" y="0.5" width="31" height="31" rx="3.5" fill="white" stroke="var(--color-theme)" />
                                              <path d="M10.666 21.3322H13.3327L20.3327 14.3322C20.6863 13.9786 20.885 13.499 20.885 12.9989C20.885 12.4988 20.6863 12.0192 20.3327 11.6656C19.9791 11.3119 19.4994 11.1133 18.9993 11.1133C18.4992 11.1133 18.0196 11.3119 17.666 11.6656L10.666 18.6656V21.3322Z" stroke="var(--color-theme)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                              <path d="M17 12.334L19.6667 15.0006" stroke="var(--color-theme)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                          </button>
                                          <div className="tooltip" role="tooltip">
                                            <span>Edit</span>
                                          </div>
                                        </div>
                                        <div className="btn-tooltip">
                                          <button className="delete-icon-img" onClick={(e) => { e.preventDefault(); setDeleteSession(session); setOpenDeleteDomainModal(true) }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M5.33301 7.8335H18.6663" stroke="var(--color-theme)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                              <path d="M10.333 11.1665V16.1665" stroke="var(--color-theme)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                              <path d="M13.667 11.1665V16.1665" stroke="var(--color-theme)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                              <path d="M6.16699 7.8335L7.00033 17.8335C7.00033 18.2755 7.17592 18.6994 7.48848 19.012C7.80104 19.3246 8.22496 19.5002 8.66699 19.5002H15.3337C15.7757 19.5002 16.1996 19.3246 16.5122 19.012C16.8247 18.6994 17.0003 18.2755 17.0003 17.8335L17.8337 7.8335" stroke="var(--color-theme)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                              <path d="M9.5 7.83333V5.33333C9.5 5.11232 9.5878 4.90036 9.74408 4.74408C9.90036 4.5878 10.1123 4.5 10.3333 4.5H13.6667C13.8877 4.5 14.0996 4.5878 14.2559 4.74408C14.4122 4.90036 14.5 5.11232 14.5 5.33333V7.83333" stroke="var(--color-theme)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>                                          </button>
                                          <div className="tooltip" role="tooltip">
                                            <span>Delete</span>
                                          </div>
                                        </div>
                                      </>
                                    }
                                    {
                                      userInfo && userInfo.data && (userInfo.data.role === ROLES.ORG_SUPER_ADMIN || session?.createdBy?.email === userInfo.data.email) && showConfigure &&
                                      <div className="btn-tooltip">
                                        {/* <img className="customise-icon" src={settingsSvg} onClick={(e) => handleConfigure(e, session.id)} alt="" />                                             */}
                                        <SettingsSvg handleConfigure={handleConfigure} session={session} />
                                        <div className="tooltip" role="tooltip">
                                          <span>Customize</span>
                                        </div>
                                      </div>
                                    }
                                  </div>
                                </div>
                              </td>
                              <td>
                                {" "}
                                <div style={{ margin: "0px -10px" }} className={((new Date(session.scheduleFrom) <= new Date()) && (new Date(session.scheduleTo) >= new Date())) ? "" : "btn-tooltip"}>
                                  <button
                                    type="submit"
                                    className={((new Date(session.scheduleFrom) <= new Date()) && (new Date(session.scheduleTo) >= new Date())) ? "btn btn-primary" : "btn btn-primary disabled"}
                                    onClick={e => handleJoinGame(session.id, session.scheduleFrom, session.scheduleTo)}
                                  >
                                    Join Game
                                  </button>
                                  {/* tooltip */}
                                  <div className={((new Date(session.scheduleFrom) <= new Date()) && (new Date(session.scheduleTo) >= new Date())) ? "tooltip hide" : "tooltip "} role="tooltip">
                                    <span>
                                      {
                                        new Date(session.scheduleFrom) > new Date() ?
                                          "This session not yet started."
                                          : "This session was ended."
                                      }
                                    </span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        }) : null
                    }

                  </tbody>
                </table>
              </div>
              : <div>
                <h3 className="no-data-desk">No Sessions Found !</h3>
              </div>
          }
          {/* table for mobile view */}
          <div className="table-responsive m-games-table">
            <div className="game-m-head">
              <h5>View Active Games</h5>
              <button type="submit"
                className={`btn btn-secondry  ${userInfo &&
                  userInfo.data && userInfo.data.role === ROLES.EMPLOYEE
                  && gameDetail && gameDetail.data && !gameDetail.data.allowEmployeeSession ? "disabled" : ""}`}
                onClick={handleClick}>
                Start new Game</button>
            </div>
            {
              gameSessions?.paginationData?.totalEntries > 0 ?
                gameSessions?.data.map((session) => {
                  return (
                    <div className="game-m-card c-white-card" key={JSON.stringify(session)}>
                      <div className="game-m-top">
                        <div className="game-detail">
                          {
                            session.mode === "PUBLIC" ?
                              <div className="game-mode">
                                <img src={publicOnly} alt="public" /> <span>Public</span>
                              </div>
                              : session.mode === "PRIVATE" ?
                                <div className="game-mode">
                                  <img src={privateOnly} alt="public" /> <span>Private</span>
                                </div>
                                :
                                <div className="game-mode">
                                  <img src={inviteOnly} alt="public" /> <span>Invite Only</span>
                                </div>
                          }
                        </div>
                      </div>
                      <div className="games-m-title">{session.name}</div>
                      <span className="games-m-date">
                        {formatToDate(session.scheduleFrom)}
                        <img src={gameArrow} alt="public" /> {formatToDate(session.scheduleTo)}
                      </span>
                      <div className="game-m-bottom">
                        <div>
                          <div className="game-m-initiate">Initiated by</div>
                          <div className="game-m-user">
                            {
                              session.name.includes(gameDetail && gameDetail.data && gameDetail.data.title + " - PUBLIC SESSION") ? "Default"
                                : (userInfo && userInfo.data && session.createdBy.email === userInfo.data.email) ? "Me"
                                  : session.createdBy.email
                            }
                          </div>
                        </div>
                        <div>
                          <div className="action-group">

                            {(userInfo && userInfo.data && session.createdBy.email === userInfo.data.email) && new Date(session.scheduleTo) > new Date() &&
                              <>
                                <div className="btn-tooltip">
                                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={(e) => handleEdit(e, session)} >
                                    <rect x="0.5" y="0.5" width="31" height="31" rx="3.5" fill="white" stroke="var(--color-theme)" />
                                    <path d="M10.666 21.3322H13.3327L20.3327 14.3322C20.6863 13.9786 20.885 13.499 20.885 12.9989C20.885 12.4988 20.6863 12.0192 20.3327 11.6656C19.9791 11.3119 19.4994 11.1133 18.9993 11.1133C18.4992 11.1133 18.0196 11.3119 17.666 11.6656L10.666 18.6656V21.3322Z" stroke="var(--color-theme)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M17 12.334L19.6667 15.0006" stroke="var(--color-theme)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  <div className="tooltip" role="tooltip">
                                    <span>Edit</span>
                                  </div>
                                </div>
                                <div className="btn-tooltip">
                                  <button className="delete-icon-img" >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={(e) => { e.preventDefault(); setDeleteSession(session); setOpenDeleteDomainModal(true) }}>
                                      <path d="M5.33301 7.8335H18.6663" stroke="var(--color-theme)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                      <path d="M10.333 11.1665V16.1665" stroke="var(--color-theme)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                      <path d="M13.667 11.1665V16.1665" stroke="var(--color-theme)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                      <path d="M6.16699 7.8335L7.00033 17.8335C7.00033 18.2755 7.17592 18.6994 7.48848 19.012C7.80104 19.3246 8.22496 19.5002 8.66699 19.5002H15.3337C15.7757 19.5002 16.1996 19.3246 16.5122 19.012C16.8247 18.6994 17.0003 18.2755 17.0003 17.8335L17.8337 7.8335" stroke="var(--color-theme)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                      <path d="M9.5 7.83333V5.33333C9.5 5.11232 9.5878 4.90036 9.74408 4.74408C9.90036 4.5878 10.1123 4.5 10.3333 4.5H13.6667C13.8877 4.5 14.0996 4.5878 14.2559 4.74408C14.4122 4.90036 14.5 5.11232 14.5 5.33333V7.83333" stroke="var(--color-theme)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>                                </button>
                                  <div className="tooltip" role="tooltip">
                                    <span>Edit</span>
                                  </div>
                                </div>
                              </>
                            }
                            {
                              userInfo && userInfo.data && (userInfo.data.role === ROLES.ORG_SUPER_ADMIN || session?.createdBy?.email === userInfo.data.email) && showConfigure &&
                              <div className="btn-tooltip">
                                {/* <img className="customise-icon" src={settingsSvg} onClick={(e) => handleConfigure(e, session.id)} alt="" /> */}
                                <SettingsSvg handleConfigure={handleConfigure} session={session} />
                                <div className="tooltip" role="tooltip">
                                  <span>Edit</span>
                                </div>
                              </div>
                            }
                          </div>
                        </div>
                        <button
                          type="submit"
                          className={((new Date(session.scheduleFrom) <= new Date()) && (new Date(session.scheduleTo) >= new Date())) ? "btn btn-primary join-game" : "btn btn-primary join-game disabled"}
                          onClick={() => handleJoinGame(session.id, session.scheduleFrom, session.scheduleTo)}
                        >
                          Join Game
                        </button>
                      </div>
                    </div>
                  );
                }) :
                <div>
                  <h3 className="no-data-mob">No Sessions Found !</h3>
                </div>
            }
          </div>
          {/* Pagination */}
          {gameSessions?.paginationData?.totalEntries > 0 &&
            <div className="pagination-wrapper active-games">
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
                <span>of {Math.ceil(gameSessions?.paginationData?.totalEntries / 12)}{" "}pages</span>
              </div>
              <button
                className={(page < Math.ceil(gameSessions?.paginationData?.totalEntries / 12)) ? "pagination-right enable" : "pagination-right"}
                onClick={() => {
                  if (page < Math.ceil(gameSessions?.paginationData?.totalEntries / 12))
                    changePage(page + 1);
                }}
              >
                <img src={arrowleft} alt="arrow right" />
              </button>
            </div>
          }
        </LoadingComponent>
        {openDeleteDomainModal && <DeleteDomainModal toggle={openDeleteDomainModal} setOpenDeleteDomainModal={setOpenDeleteDomainModal} deleteFunction={handleDelete} deleteData={deleteSession} session />}
      </div>
    </div >
  );
};
export default ActiveGamesDetail;
