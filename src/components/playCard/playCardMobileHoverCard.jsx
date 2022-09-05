import React from 'react';
import "./hovercardmobile.css";
import "./playCard.css";
import Draggable from "react-draggable";

import diyImg from "../../assets/images/diy.svg";
import quesImg from "../../assets/images/questions.svg";
import { useEffect } from 'react';
import { useState } from 'react';
import ROLES, { OrgRoles } from '../../helpers/userTypes';
import { useHistory } from 'react-router-dom';
import { addToFavourite, removeFromFavourite } from '../../redux/actions/homepageActions';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL, encryptData, S3_BASE_URL } from '../../helpers/helper';
import { getGameDetail, toggleLiveGames } from '../../redux/actions/gameDetailAction';
import { Link } from 'react-router-dom';
import LoadingComponent from '../loader/LoadingComponent';
import { toggleCreateSessionAccess } from '../../redux/actions/sessionsApiActions';

const PlayCardMobileHoverCard = (
    { setOpenMobileHoverCard, manage, gameDetail, setOpenShareModal, setShareLink }
) => {
    const [liked, setLiked] = useState(false);
    const [active, setActive] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [loaded, setLoaded] = useState(true);

    const { favGames } = useSelector((state) => state.getFavGames);
    const { userInfo } = useSelector((state) => state.getUser);
    const GameDetail = useSelector(state => state.gameDetail);
    const gameInfo = GameDetail.gameDetail;

    useEffect(() => {
        setActive(true);
        dispatch(getGameDetail(gameDetail.id));
    }, [])
    useEffect(() => {
        if (favGames && favGames.data) {
            favGames.data.forEach((game) => {
                if (game.id === gameDetail.id) {
                    setLiked(true)
                    return;
                }
            });
        }
    }, [favGames]);

    const history = useHistory();
    const dispatch = useDispatch();

    const onStop = (e, position) => {
        if (position.lastY >= 35) {
            setActive(false);
            setTimeout(() => {
                setOpenMobileHoverCard(false)
            }, 500)
        }
    }
    const onShareClick = () => {
        if (userInfo && userInfo.data && OrgRoles.includes(userInfo.data.role)) {
            const { email, organizationId } = userInfo && userInfo.data;
            const obj = { from: email, organizationId: organizationId, onBoardType: "INVITE", redirectURL: "/game-detail/" + gameDetail.id };
            const inviteToken = encryptData(obj);
            const shareLink = BASE_URL + "/join?inviteId=" + inviteToken;
            setShareLink(shareLink);
        }
        else
            setShareLink(BASE_URL + "/game-detail/" + gameDetail.id);
        setOpenShareModal(true);
    }
    const moreDetails = () => {
        history.push("/game-detail/" + gameDetail.id);
    }
    const addFav = () => {
        setLiked(true);
        dispatch(addToFavourite(gameDetail.id));
    };
    const removeFav = () => {
        setLiked(false);
        dispatch(removeFromFavourite(gameDetail.id));
    };
    const handleLiveToggle = async () => {
        if (gameDetail && gameDetail.id && !gameDetail.isDefault) {
            setIsLive(prevState => !prevState);
            const response = await dispatch(toggleLiveGames(gameDetail.id))
            if (response === 200) {
                dispatch(getGameDetail(gameDetail.id));
            }
        }
    }
    const handletoggleCreateSessionAccess = () => {
        if (gameDetail && gameDetail.id)
            dispatch(toggleCreateSessionAccess(gameDetail.id))
    }
    const handleStartGame = () => {
        if (isLive)
            history.push("/active-games/" + gameDetail.id)
    }
    const playDemoGame = () => {
        if (userInfo && userInfo.data && userInfo.data.role === ROLES.EXTRAMILE_SUPERADMIN && gameDetail && gameDetail.id)
            history.push("/all-games/game/" + gameDetail.id);
        else if (gameDetail && gameDetail.demoLink) {
            if (gameDetail.demoLink.includes("?"))
                window.location.replace(gameDetail.demoLink + "&gameId=" + gameDetail.id);
            else
                window.location.replace(gameDetail.demoLink + "?gameId=" + gameDetail.id);
        }
    }
    useEffect(() => {
        if (gameInfo) {
            if (gameInfo && gameInfo.data && (gameInfo.data.isLive || gameInfo.data.isDefault))
                setIsLive(true);
            else
                setIsLive(false);
        }
    }, [gameInfo]);
    useEffect(() => {
        if ((GameDetail && GameDetail.loading)) {
            setLoaded(false);
        }
        else
            setLoaded(true);
    }, [GameDetail])
    return (
        <div className={`hovercard-mobile ${active ? "active" : ""} ${loaded ? "" : "loading"}`}>
            <LoadingComponent loaded={loaded} color={"#fff"} />
            <div className="close-div" onClick={() => onStop("", { lastY: 40 })}></div>
            <Draggable axis="y" bounds={{ bottom: 40, top: 0 }} position={{ x: 0, y: 0 }} onStop={onStop} handle=".handler" >
                <div className={manage ? "card-wrapper manage" : "card-wrapper"}>
                    <div className="handle-wrapper">
                        <span className="handler"></span>
                    </div>
                    <div className="content-wrapper">
                        <div className="content-wrapper-top">
                            <img src={gameDetail && gameDetail.coverMedia[0] && gameDetail.coverMedia[0].includes('https://youtu.be') ? S3_BASE_URL + gameDetail.coverMedia[1] : S3_BASE_URL + gameDetail.coverMedia[0]} alt="" className="title-img" />
                            <div className="playcard-content-mob">
                                <h5>{gameDetail && gameDetail.title}</h5>
                                <p>{gameDetail && gameDetail.description}</p>
                                <div className="playcard-review">
                                    {/* <div className="playcard-review-content">
                                        <img src={quesImg} alt="play" />
                                        <h4 className="questions">
                                            10
                                            <span>Questions</span>
                                        </h4>
                                    </div> */}
                                    {/* <div className="playcard-review-content">
                                        <img src={diyImg} alt="diy" style={{ marginRight: '5px' }} />
                                        <h4>DIY</h4>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={manage ? "playcard-actions" : "playcard-actions hide"}>
                        <div className="playcard-make-live">
                            {
                                gameDetail && gameDetail.isDefault ?
                                    <>
                                        <h5>Live By Default:</h5>
                                        <label className="switch">
                                            <input type="checkbox" checked />
                                            <span className="slider disabled"></span>
                                        </label>
                                    </> : <>
                                        <h5>Make Game Live:</h5>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked={gameDetail && gameDetail.isLive} />
                                            <span className="slider" onClick={handleLiveToggle}></span>
                                        </label>
                                    </>
                            }
                        </div>
                        <div className="playcard-make-live">
                            {
                                gameDetail && gameDetail.isDefault ?
                                    <>
                                        <h5>Allowed users to create game sessions:</h5>
                                        <label className="switch">
                                            <input type="checkbox" checked />
                                            <span className="slider disabled"></span>
                                        </label>
                                    </>
                                    : !isLive ?
                                        <>
                                            <h5>Allow users to create game sessions:</h5>
                                            <div className="btn-tooltip">
                                                <label className="switch disabled">
                                                    <input type="checkbox" checked={false} readOnly />
                                                    <span className="slider"></span>
                                                </label>
                                                <div className="tooltip" role="tooltip">
                                                    <span>Please make game live.</span>
                                                </div>
                                            </div>
                                        </> : <>
                                            <h5>Allow users to create game sessions:</h5>
                                            <label className="switch">
                                                <input type="checkbox" defaultChecked={gameInfo && gameInfo.data ? gameInfo.data.allowEmployeeSession : gameDetail && gameDetail.allowEmployeeSession} />
                                                <span className="slider" onClick={handletoggleCreateSessionAccess}></span>
                                            </label>
                                        </>
                            }
                        </div>
                    </div>

                    <div className="content-wrapper-bottom">
                        <div className={"svg-wrapper"}>
                            {/* Remove className liked to make unlike */}
                            {/* Add hide className to remove like option */}
                            <svg width="40" height="40" viewBox="0 0 40 40"
                                id="like-btn-mob"
                                className={userInfo && userInfo.data &&
                                    (userInfo.data.role === ROLES.ORG_ADMIN || userInfo.data.role === ROLES.ORG_SUPER_ADMIN) ?
                                    liked ? "liked" : "" : "hide"}
                                onClick={() => liked ? removeFav() : addFav()}
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="40" height="40" rx="6" fill="var(--color-theme)" fill-opacity="0.08" />
                                <path d="M25.625 21.1788L20 26.7498L14.375 21.1788C14.004 20.8177 13.7117 20.3838 13.5166 19.9042C13.3216 19.4247 13.2279 18.91 13.2415 18.3925C13.2552 17.875 13.3758 17.3659 13.5958 16.8973C13.8159 16.4287 14.1306 16.0107 14.5201 15.6697C14.9096 15.3287 15.3655 15.072 15.8591 14.9159C16.3527 14.7597 16.8732 14.7075 17.388 14.7624C17.9028 14.8173 18.4006 14.9782 18.8501 15.2349C19.2997 15.4917 19.6912 15.8388 20 16.2543C20.3101 15.8418 20.7021 15.4978 21.1513 15.2437C21.6005 14.9897 22.0974 14.8311 22.6107 14.7779C23.124 14.7247 23.6428 14.778 24.1346 14.9346C24.6263 15.0911 25.0805 15.3474 25.4686 15.6875C25.8568 16.0277 26.1706 16.4442 26.3903 16.9112C26.61 17.3781 26.731 17.8854 26.7457 18.4013C26.7604 18.9172 26.6684 19.4305 26.4756 19.9092C26.2827 20.3879 25.9932 20.8216 25.625 21.1833" stroke="var(--color-theme)" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span id="share-btn-mob" onClick={onShareClick}>
                                <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                                    <rect
                                        width="32"
                                        height="32"
                                        rx="6"
                                        fill="var(--color-theme)"
                                        fillOpacity="0.08"
                                    />
                                    <path
                                        d="M11.3333 17.6568C12.622 17.6568 13.6667 16.5653 13.6667 15.219C13.6667 13.8726 12.622 12.7812 11.3333 12.7812C10.0447 12.7812 9 13.8726 9 15.219C9 16.5653 10.0447 17.6568 11.3333 17.6568Z"
                                        stroke="var(--color-theme)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M20.6667 12.7812C21.9554 12.7812 23 11.6897 23 10.3433C23 8.99698 21.9554 7.90553 20.6667 7.90553C19.378 7.90553 18.3334 8.99698 18.3334 10.3433C18.3334 11.6897 19.378 12.7812 20.6667 12.7812Z"
                                        stroke="var(--color-theme)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M20.6667 22.5324C21.9554 22.5324 23 21.4409 23 20.0946C23 18.7482 21.9554 17.6568 20.6667 17.6568C19.378 17.6568 18.3334 18.7482 18.3334 20.0946C18.3334 21.4409 19.378 22.5324 20.6667 22.5324Z"
                                        stroke="var(--color-theme)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M13.4333 14.1626L18.5667 11.3997"
                                        stroke="var(--color-theme)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M13.4333 16.2753L18.5667 19.0382"
                                        stroke="var(--color-theme)"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                        </div>
                        {
                            gameDetail.previouslyPlayed ?
                                <Link to={"game-reports/" + gameDetail.lastPlayedSessionID}><button id="play-btn" className="btn btn-primary w180">View Game Report</button></Link>
                                : userInfo && userInfo.data && OrgRoles.includes(userInfo.data.role) ?
                                    <div className="btn-tooltip">
                                        <button
                                            id="play-btn"
                                            className={`btn btn-primary w180 ${isLive ? "" : "disabled"}`}
                                            onClick={handleStartGame}
                                        >{"Start/Join Game"}</button>
                                        <div className={`tooltip ${isLive ? "hide" : ""}`} role="tooltip">
                                            <span>Please make game live first.</span>
                                        </div>
                                    </div>
                                    : <button id="play-btn" onClick={playDemoGame} className="btn btn-primary">
                                        {
                                            userInfo && userInfo.data && userInfo.data.role === ROLES.EXTRAMILE_SUPERADMIN ? "Edit Game" :
                                                "Play Demo"}</button>
                        }
                    </div>
                    <div className="more-details-wrapper" onClick={moreDetails}>
                        <h4>More Details</h4>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 12L10 8L6 4" stroke="#23282E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </Draggable>
        </div>
    )
};

export default PlayCardMobileHoverCard;