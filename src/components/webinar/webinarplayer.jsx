import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { decryptData, encryptData } from "../../helpers/helper";
import { getUser, logOut } from "../../redux/actions/userAction";
import "./webinarplayer.css";
import Header from '../header/header';
import { useHistory } from "react-router-dom";
import VideoJS from "../videojs/videojs";
import { Link } from "react-router-dom";
import { backUpWebinarChats, getAllWebinars } from "../../redux/actions/commonActions";
import { useSelector } from "react-redux";
import ChatBox from "../chatbox/chatbox";
import ROLES from "../../helpers/userTypes";
import LoadingComponent from "../loader/LoadingComponent";
import ProtectedRouteScreen from "../../containers/protectedRoutes/ProtectedRouteScreen";

const WebinarPlayer = (props) => {
    const dispatch = useDispatch();
    const streamUrl = decryptData(localStorage.getItem("streamURL") || encryptData(""))
    const history = useHistory();
    let playerMonitor = 0;
    const [onLive, setOnLive] = useState(true);
    const [isChat, setIsChat] = useState(true);
    const [expanded, setExpanded] = useState(true);
    const { allWebinars } = useSelector(state => state.allWebinars);
    const { userInfo } = useSelector(state => state.getUser);
    const { orgDetailsByEmail } = useSelector((state) => state.getOrganisation);
    const backupChats = React.useRef({ chats: [] });
    const [initialLoading, setInitialLoading] = useState(true);
    const [allowed, setAllowed] = useState(false);

    const [details, setDetails] = useState({
        userId: "",
        userName: "",
        webinarId: "",
        mailId: "",
        companyName: ""
    });

    const signOut = async () => {
        await dispatch(logOut());
        history.push("/");
    };
    useEffect(() => {
        dispatch(getAllWebinars());
        dispatch(getUser());
        let liveMonitor = setInterval(async () => {
            dispatch(getAllWebinars());
            if (backupChats.current?.chats?.length > 0) {
                const { userName, userId, webinarId, chats } = backupChats.current;
                const data = { userName, userId, webinarId, message: chats.filter(item => !item.id).map(item => ({ content: item.message, createdAt: item.createdAt })) };
                if (data.message.length > 0) {
                    const response = await dispatch(backUpWebinarChats(data));
                    if (response?.data?.data) {
                        if (response.data.data.length > 0)
                            backupChats.current = { ...backupChats.current, chats: [...response.data.data] };
                        else
                            backupChats.current = { ...backupChats.current, chats: [] };
                    }
                }
            }
        }, 30000);
        return () => {
            clearInterval(liveMonitor);
            clearInterval(playerMonitor);
            localStorage.setItem("streamURL", encryptData(""));
        }
    }, []);
    useEffect(() => {
        if (allWebinars) {
            if (!allWebinars.data)
                setOnLive(false);
            else if (allWebinars.data && new Date(allWebinars.data.startsAt) > new Date())
                setOnLive(false);
        }
        if (allWebinars && allWebinars.data) {
            if (allWebinars.data.isChat && !isChat)
                setIsChat(true);
            else if (!allWebinars.data.isChat && isChat)
                setIsChat(false);
        }
    }, [allWebinars]);
    useEffect(() => {
        if (userInfo && userInfo.data)
            setDetails(prevState => ({
                ...prevState,
                userId: userInfo.data.id,
                userName: userInfo.data.firstName,
                mailId: userInfo.data.email
            }));
        if (orgDetailsByEmail && orgDetailsByEmail.data)
            setDetails(prevState => ({
                ...prevState,
                companyName: orgDetailsByEmail.data.name
            }))
        if (allWebinars && allWebinars.data)
            setDetails(prevState => ({
                ...prevState,
                webinarId: allWebinars.data.id
            }));
    }, [userInfo, allWebinars, orgDetailsByEmail]);
    useEffect(() => {
        if (allWebinars?.data && userInfo?.data && initialLoading) {
            const isShowStatus = JSON.parse(allWebinars.data.isShowStatus);
            const { organizationId, role } = userInfo.data;
            if (role === ROLES.EMPLOYEE) {
                if (isShowStatus.includes(organizationId))
                    setAllowed(true);
                else
                    setAllowed(false);
            }
            else
                setAllowed(true);
            setInitialLoading(false);
        }
    }, [userInfo, allWebinars]);

    const playerRef = React.useRef(null);
    const videoJsOptions = { // lookup the options in the docs for more options
        autoplay: true,
        preload: true,
        controls: true,
        responsive: true,
        fluid: true,
        liveui: true,
        sources: [{
            src: streamUrl,
            type: 'application/x-mpegURL'
        }]
    }
    const handlePlayerReady = (player) => {
        playerRef.current = player;
        player.on('waiting', () => {
            console.log('player is waiting');
        });
        player.on('dispose', () => {
            console.log('player will dispose');
        });
    };

    const emojiClicked = async (e, index) => {
        const videoContainer = document.getElementById("videoContainer");
        const node = document.getElementById(e.target.id);
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const clone = node.cloneNode(true);
                const id = new Date();
                clone.id = id;
                document.getElementById("reactions").insertBefore(clone, node);
                clone.style.position = "absolute";
                const randomNumber = Math.floor((Math.random() * videoContainer.clientWidth) - 80);
                clone.style.left = `-${randomNumber}px`;
                clone.style.transition = "all 1s ease";
                clone.style.bottom = "0px"
                clone.style.fontSize = "35px"
                const randomDuration = Math.floor((Math.random() * 2500) + 1)
                clone.animate({ opacity: 0, bottom: videoContainer.clientHeight + "px" }, 1000 + randomDuration, "linear");
                setTimeout(() => {
                    clone.style.display = "none";
                    clone.remove();
                }, 900 + randomDuration);
            }, Math.floor((Math.random() * 100) + 1))
        }
        // setTimeout(() => {
        if (window.socket?.connected)
            window.socket.emit("chats", { ...details, message: e.target.innerHTML });
        // }, 2000)
    }
    if (initialLoading)
        return (
            <LoadingComponent loaded={!initialLoading} />
        )
    else
        return (
            <>
                {
                    allowed ?
                        <>
                            <Header signOut={signOut} showProfile {...props} />
                            <div className="stream-container">
                                <div className="stream-body">
                                    {
                                        onLive ?
                                            <>
                                                <div className="video-container">
                                                    <VideoJS options={videoJsOptions} id="videoContainer" onReady={handlePlayerReady} />
                                                    <ChatBox classPrefix={"desktop"} backupChats={backupChats} isChat={isChat} />
                                                    {!isChat ?
                                                        <div className="reactions" >
                                                            {/* <i className="fa fa-check" aria-hidden="true"></i> */}
                                                            <div className={`items ${expanded ? "" : "collapse"}`} id="reactions">
                                                                <div className="reaction" id="reaction1" onClick={(e) => emojiClicked(e, 1)}>&#128077;</div>
                                                                <div className="reaction" id="reaction2" onClick={(e) => emojiClicked(e, 2)}>&#128076;</div>
                                                                <div className="reaction" id="reaction3" onClick={(e) => emojiClicked(e, 3)}>&#128079;</div>
                                                                <div className="reaction" id="reaction4" onClick={(e) => emojiClicked(e, 4)}>&#128512;</div>
                                                                <div className="reaction" id="reaction5" onClick={(e) => emojiClicked(e, 5)}>&#128525;</div>
                                                                <div className="reaction" id="reaction6" onClick={(e) => emojiClicked(e, 6)}>&#128175;</div>
                                                            </div>
                                                            <i className={`fa fa-angle-down expand-btn ${expanded ? "" : "collapse"}`} onClick={() => setExpanded(!expanded)}></i>
                                                        </div> : null
                                                    }
                                                </div>
                                                <div className="instructions">
                                                    <h4>Instructions</h4>
                                                    <ul>
                                                        <li key="line1" id="line1">Kindly use full screen mode for better experience.</li>
                                                        <li key={'lin2'}>Please refresh your page for the live feed.</li>
                                                    </ul>
                                                </div>
                                                <ChatBox classPrefix={"mobile"} backupChats={backupChats} isChat={isChat} />
                                            </>
                                            : <div className="not-live">
                                                <h4>Live Ended</h4>
                                                <Link to="/">
                                                    <h5>Go To Homepage</h5>
                                                </Link>
                                            </div>
                                    }
                                </div>
                            </div>
                        </> : <ProtectedRouteScreen />
                }
            </>
        )
}

export default WebinarPlayer;