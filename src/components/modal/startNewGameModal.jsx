import React, { useEffect, useState } from 'react';

import './modal.css';
import Modal from './modal';
import arrowback from "../../assets/images/arrow-left.svg";
import { Link } from 'react-router-dom';
import Select from 'react-select'
import { getGameDetail } from '../../redux/actions/gameDetailAction';
import { useDispatch, useSelector } from 'react-redux';
import { createGameSession, getAllGameSessions, updateGameSession } from '../../redux/actions/sessionsApiActions';
import { getOrganisationUsers } from '../../redux/actions/organisationActions';
import { BASE_URL, encryptData } from '../../helpers/helper';
import LoadingComponent from '../loader/LoadingComponent';
import * as ActionTypes from "../../redux/constants/sessionsApiConstants";

const SelectItem = ({ name, selectedUserList, setSelectedUserList }) => {
    const handleClick = (e, state) => {
        e.preventDefault();
        if (state === "add")
            setSelectedUserList(prevState => ([...prevState, name]));
        else {
            const userlist = selectedUserList.filter(userName => userName !== name)
            setSelectedUserList(userlist);
        }
    }
    if (name && selectedUserList && name !== "Select Users")
        return (
            <div className="select-item">
                <div>
                    <span className="name-highlighter">{name.slice(0, 2)}</span>
                    <span className="name">{name}</span>
                </div>
                <div>
                    {selectedUserList.includes(name) ?
                        <button onClick={(e) => handleClick(e, 'remove')} className="btn">{'Remove'}</button> :
                        <button onClick={(e) => handleClick(e, 'add')} className="btn invite">{'Invite'}</button>
                    }
                </div>
            </div>
        )
    else if (name === "Select Users")
        return (
            <span>
                {name}
            </span>
        )
    else
        return (
            <div />
        )
}
/* Use like this
<StartNewGameModal modalid={"new-game-modal"} toggle={true/false} />
 */
const StartNewGameModal = ({ modalid, toggle, setOpenNewGameModal, gameId, edit, setEdit, editSession, setEditSession }) => {
    const iconsForOptions = {
        Private: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.3333 7.33398H4.66659C3.93021 7.33398 3.33325 7.93094 3.33325 8.66732V12.6673C3.33325 13.4037 3.93021 14.0007 4.66659 14.0007H11.3333C12.0696 14.0007 12.6666 13.4037 12.6666 12.6673V8.66732C12.6666 7.93094 12.0696 7.33398 11.3333 7.33398Z" stroke="#23282E" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.99992 11.3333C8.36811 11.3333 8.66658 11.0349 8.66658 10.6667C8.66658 10.2985 8.36811 10 7.99992 10C7.63173 10 7.33325 10.2985 7.33325 10.6667C7.33325 11.0349 7.63173 11.3333 7.99992 11.3333Z" stroke="#23282E" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.33325 7.33333V4.66667C5.33325 3.95942 5.6142 3.28115 6.1143 2.78105C6.6144 2.28095 7.29267 2 7.99992 2C8.70716 2 9.38544 2.28095 9.88554 2.78105C10.3856 3.28115 10.6666 3.95942 10.6666 4.66667V7.33333" stroke="#23282E" strokeLinecap="round" strokeLinejoin="round" />
        </svg>`,
        Public: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#23282E" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.3999 6H13.5999" stroke="#23282E" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.3999 10H13.5999" stroke="#23282E" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.66677 2C6.54367 3.79974 5.94824 5.87858 5.94824 8C5.94824 10.1214 6.54367 12.2003 7.66677 14" stroke="#23282E" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.3335 2C9.4566 3.79974 10.052 5.87858 10.052 8C10.052 10.1214 9.4566 12.2003 8.3335 14" stroke="#23282E" strokeLinecap="round" strokeLinejoin="round" />
        </svg>`,
        'Invite Only': `<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12.5013H3.33333C2.97971 12.5013 2.64057 12.3608 2.39052 12.1108C2.14048 11.8607 2 11.5216 2 11.168V4.5013C2 4.14768 2.14048 3.80854 2.39052 3.55849C2.64057 3.30844 2.97971 3.16797 3.33333 3.16797H12.6667C13.0203 3.16797 13.3594 3.30844 13.6095 3.55849C13.8595 3.80854 14 4.14768 14 4.5013V9.5013" stroke="#23282E" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 4.5L8 8.5L14 4.5" stroke="#23282E" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 12.5H14" stroke="#23282E" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 10.5L14 12.5L12 14.5" stroke="#23282E" strokeLinecap="round" strokeLinejoin="round" />
        </svg>`
    }
    const [immediate, setImmediate] = useState(true);
    const [linkCopied, setLinkCopied] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [gameSettingsFilled, setGameSettingsFilled] = useState(false);
    const [types, setTypes] = useState([]);
    const [loaded, setLoaded] = useState(true);
    const GameDetail = useSelector(state => state.gameDetail);
    const { gameDetail } = GameDetail;
    const CreatedSession = useSelector(state => state.createSession);
    const { createdSession } = CreatedSession;
    const UpdatedSession = useSelector(state => state.updateSession);
    const { myPlanDetails } = useSelector(state => state.getMyPlans);
    const OrgUsers = useSelector(state => state.orgUsers);
    const { orgUsers } = OrgUsers;
    const { userInfo } = useSelector(state => state.getUser);

    const [selectedUserList, setSelectedUserList] = useState([]);
    const [inviteEmail, setInviteEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [dateError, setDateError] = useState("");
    const [usersList, setUserList] = useState([]);
    const [mode, setMode] = useState("");
    const [planExpiryDate, setPlanExpiryDate] = useState("");
    const modes = {
        PRIVATE: { value: 'Private', label: 'Private', key: "PRIVATE" },
        PUBLIC: { value: 'Public', label: 'Public', key: "PUBLIC" },
        INVITE: { value: 'Invite Only', label: 'Invite Only', key: "INVITE" },
    }
    const getToDate = () => {
        const date = new Date();
        const newDate = `${date.getFullYear() + 1}-${(date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
        return newDate;
    }
    const getTodayDate = () => {
        const date = new Date();
        const newDate = `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
        return newDate;
    }
    const getTime = () => {
        const time = new Date();
        const newTime = `${time.getHours() < 10 ? "0" + time.getHours() : time.getHours()}:${time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()}`;
        return newTime;
    }
    const formatToDate = (dateString) => {
        const date = new Date(dateString);
        const newDateString = `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()} ${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
        return newDateString;
    }
    const [sessionDetails, setSessionDetails] = useState({
        name: "",
        scheduleFromDate: getTodayDate(),
        scheduleFromTime: getTime(),
        scheduleTodate: getToDate(),
        scheduleToTime: "23:59",
        mode: { value: 'Public', label: 'Public', key: "PUBLIC" },
        gameId: ""
    })
    const dispatch = useDispatch();
    useEffect(() => {
        if (gameId)
            dispatch(getGameDetail(gameId));
        return () => {
            dispatch({ type: ActionTypes.GAME_CREATE_SESSION_SUCCESS, payload: null })
        }
    }, []);
    useEffect(() => {
        if (myPlanDetails && myPlanDetails.data && myPlanDetails.data.planDetail && myPlanDetails.data.planDetail.validityDate) {
            setPlanExpiryDate(myPlanDetails.data.planDetail.validityDate.slice(0, 10));
            setSessionDetails(prevState => ({
                ...prevState,
                scheduleTodate: myPlanDetails.data.planDetail.validityDate.slice(0, 10)
            }))
        }
    }, [myPlanDetails]);
    useEffect(() => {
        const scheduleFrom = formatToDate(editSession.scheduleFrom);
        const scheduleTo = formatToDate(editSession.scheduleTo);
        if (editSession && edit) {
            setImmediate(false);
            setSessionId(editSession.id);
            setSessionDetails(prevState => ({
                ...prevState,
                name: editSession.name,
                mode: modes[editSession.mode],
                scheduleFromDate: scheduleFrom.slice(0, 10),
                scheduleFromTime: scheduleFrom.slice(11, 16),
                scheduleTodate: scheduleTo.slice(0, 10),
                scheduleToTime: scheduleTo.slice(11, 16)
            }))
        }
    }, [editSession])
    useEffect(() => {
        if (gameDetail && gameDetail.data) {
            var options = []
            gameDetail.data.subGames.forEach((subGame) => {
                options.push({ value: subGame.title, label: subGame.title, id: subGame.id });
            })
            setTypes(options);
            if (!edit)
                setSessionDetails(prevState => ({
                    ...prevState,
                    gameId: gameDetail.data.id,
                    name: gameDetail.data.title + " - "
                }))
            else
                setSessionDetails(prevState => ({
                    ...prevState,
                    gameId: gameDetail.data.id,
                }))
        }
    }, [gameDetail]);

    useEffect(() => {
        if (
            (GameDetail && GameDetail.loading) ||
            (OrgUsers && OrgUsers.loading) ||
            (UpdatedSession && UpdatedSession.loading) ||
            (CreatedSession && CreatedSession.loading)
        ) {
            setLoaded(false);
        }
        else
            setLoaded(true);
    }, [GameDetail, CreatedSession, OrgUsers, UpdatedSession])
    useEffect(() => {
        if (createdSession && createdSession.data) {
            setSessionId(createdSession.data.id);
        }
    }, [createdSession]);
    useEffect(() => {
        if (orgUsers && orgUsers.data) {
            var users = [];
            orgUsers.data.forEach(user => {
                const name = user.firstName + " " + user.lastName
                if (userInfo && userInfo.data && userInfo.data.email !== user.email) {
                    users.push({ value: name, label: name });
                }
            });
            setUserList(users);
            if (edit && editSession && editSession.allowedUsers) {
                var allowedUsers = []
                editSession.allowedUsers.forEach(user => {
                    orgUsers.data.forEach(orguser => {
                        if (orguser.id === user.id) {
                            allowedUsers.push(orguser.firstName + " " + orguser.lastName);
                        }
                    })
                })
                setSelectedUserList(allowedUsers);
            }
        }
    }, [orgUsers]);
    const radioChangeHandler = (e) => {
        setImmediate(!immediate)
    }
    const handleGameSettingsSubmit = async (e) => {
        e.preventDefault();
        if (edit && new Date(editSession.scheduleTo) <= new Date())
            return;
        const { scheduleTodate, scheduleToTime } = sessionDetails;
        if (scheduleTodate === "" || scheduleToTime === "") {
            setDateError("End date and time should be selected");
            return;
        }
        const toDateFormat = new Date(parseInt(scheduleTodate.slice(0, 4)), parseInt(scheduleTodate.slice(5, 7)) - 1, parseInt(scheduleTodate.slice(8, 10)), parseInt(scheduleToTime.slice(0, 2)), parseInt(scheduleToTime.slice(3, 5)));
        if (toDateFormat < new Date()) {
            setDateError("End date and time should be greater than current date and time");
            return;
        }
        setDateError("");
        const body = {
            scheduleTo: toDateFormat.toISOString(),
            name: sessionDetails.name,
            mode: sessionDetails.mode.key,
            gameId: sessionDetails.gameId,
            scheduleFrom:new Date()
        };
        if (!immediate) {
            const { scheduleFromDate, scheduleFromTime } = sessionDetails;
            if (scheduleFromDate === "" || scheduleFromTime === "") {
                setDateError("Start date and time should be selected");
                return;
            }
            const fromDateFormat = new Date(parseInt(scheduleFromDate.slice(0, 4)), parseInt(scheduleFromDate.slice(5, 7)) - 1, parseInt(scheduleFromDate.slice(8, 10)), parseInt(scheduleFromTime.slice(0, 2)), parseInt(scheduleFromTime.slice(3, 5)));
            if (fromDateFormat > toDateFormat) {
                setDateError("End date and time should be greater than start date and time");
                return;
            }
            setDateError("");
            body["scheduleFrom"] = fromDateFormat.toISOString();
        }
        if (edit) {
            const { gameId, ...editBody } = body;
            const response = await dispatch(updateGameSession(editSession.id, editBody));
            if (response === 200) {
                dispatch(getOrganisationUsers(''));
                setMode(sessionDetails.mode.key);
                setGameSettingsFilled(true);
            }
        }
        else {
            if (sessionId) {
                const { gameId, ...editBody } = body;
                const response = await dispatch(updateGameSession(sessionId, editBody));
                if (response === 200) {
                    dispatch(getOrganisationUsers(''));
                    setMode(sessionDetails.mode.key);
                    setGameSettingsFilled(true);
                }
            }
            else {
                const response = await dispatch(createGameSession(body));
                if (response === 200) {
                    dispatch(getOrganisationUsers(''));
                    setMode(sessionDetails.mode.key);
                    setGameSettingsFilled(true);
                }
            }
        }
    }
    const handleInviteSubmit = async (e) => {
        e.preventDefault();
        if (mode === "PRIVATE") {
            const responsecode = await dispatch(updateGameSession(sessionId, { allowedUsers: [] }))
            if (responsecode !== 200)
                return;
        }
        else if (mode === "INVITE") {
            var allowedUsers = [];
            if (userInfo && userInfo.data && userInfo.data.id)
                allowedUsers.push({ id: userInfo.data.id });
            if (orgUsers && orgUsers.data) {
                orgUsers.data.forEach(user => {
                    if (selectedUserList.includes(user.firstName + " " + user.lastName))
                        allowedUsers.push({ id: user.id });
                })
            }
            const responsecode = await dispatch(updateGameSession(sessionId, { allowedUsers }))
            if (responsecode !== 200)
                return;
        }
        dispatch(getAllGameSessions(gameId));
        setOpenNewGameModal(false);
    }
    const handleClose = () => {
        setEdit(false);
        setEditSession({});
        dispatch(getAllGameSessions(gameId));
        setOpenNewGameModal(false);
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "name" && gameDetail && gameDetail.data && !value.startsWith(gameDetail.data.title + " - ")) {
            return;
        }
        setSessionDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const handleSelectChange = (e, name) => {
        setSessionDetails(prevState => ({
            ...prevState,
            [name]: e
        }))
    }
    const handleCopyLink = () => {
        // navigator.clipboard.writeText(shareLink);
        const { email, organizationId } = userInfo && userInfo.data;
        const obj = { from: email, organizationId: organizationId, onBoardType: "INVITE" };
        const inviteToken = encryptData(obj);
        const shareLink = BASE_URL + "/join?gameId=" + gameId + "&sessionId=" + sessionId + "&inviteId=" + inviteToken;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareLink)
                .then(() => setLinkCopied(true))
                .catch(err => {
                    console.error('Could not copy text: ', err);
                });
        } else {
            const dummyElement = document.createElement('span');
            dummyElement.style.whiteSpace = 'pre'
            dummyElement.textContent = shareLink;
            document.body.appendChild(dummyElement)
            const selection = window.getSelection();
            selection.removeAllRanges()
            const range = document.createRange()
            range.selectNode(dummyElement)
            selection.addRange(range)
            document.execCommand('copy');
            selection.removeAllRanges()
            document.body.removeChild(dummyElement)
            setLinkCopied(true);
        }
    }
    return (
        <Modal modalid={modalid} toggle={toggle}>
            <LoadingComponent loaded={loaded} />
            <div className={types.length > 0 ?
                loaded ? "modal-body transform9" : "modal-body transform9 loading"
                : loaded ? "modal-body" : "modal-body loading"
            }>
                <div className="close-icon" data-dismiss="modal" aria-label="Close">
                    <div className="close-btn-icon" onClick={handleClose}></div>
                </div>
                <div className="startnewgame-body">
                    <div className="back-arrow">
                        <img src={arrowback} alt="back" onClick={handleClose} />
                    </div>
                    <div className="header-part">
                        <div className="title">
                            <h4 >{edit ? "Edit Game Settings" : "Start New Game"} </h4>
                        </div>
                        <br />
                        <div className="nav-bar">
                            <button>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    <svg className={gameSettingsFilled ? "" : "hide"} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#E25569" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6 7.99935L7.33333 9.33268L10 6.66602" stroke="#E25569" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Game Settings
                                </span>
                            </button>
                            <button className={gameSettingsFilled ? "" : "fade"}>Invite Users</button>
                        </div>
                        <div className="progress-bar">
                            <div className="check-point active"></div>
                            <div className={gameSettingsFilled ? "check-point active" : "check-point"}></div>
                        </div>
                        <div className="progressor-container">
                            <div className="progressor" style={{ width: gameSettingsFilled ? '75%' : '25%' }}></div>
                        </div>
                    </div>
                    <br />
                    <div className="body-part">
                        <form onSubmit={handleGameSettingsSubmit} className={gameSettingsFilled ? "hide" : ""}>
                            <div className="form-group">
                                <label htmlFor="name">Name *</label>
                                <input type="text" className="form-control" pattern="^[A-Za-z0-9 !\+_,\'-]+$" maxLength={60} value={sessionDetails.name} name="name" onChange={handleChange} placeholder="Enter a title name" required />
                            </div>
                            {
                                types.length > 0 &&
                                <>
                                    <div className="game-mode-select selector2">
                                        <p htmlFor="name">Select Game Type</p>
                                        <Select
                                            options={types}
                                            className="form-control"
                                            placeholder="Select Game Type"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: 45,
                                                    border: 0,
                                                    background: '#f6f7f9'
                                                }),
                                            }}
                                        />
                                    </div>
                                    <br />
                                </>
                            }
                            <div className="starttime">
                                <label htmlFor="starttime">Start Time</label>
                            </div>
                            <label className="container-radio">Schedule Immediately<input onChange={radioChangeHandler} type="radio" checked={immediate} name="starttime" id="immediate" value="immediate" />
                                <span className="checkmark"></span>
                            </label>
                            <br />
                            <div className={immediate ? "group-end-date immediate-start" : "group-end-date hide"}>
                                <div className="form-group" style={{ width: '58%' }}>
                                    <label htmlFor="enddate">End Date</label>
                                    <input type="date" min={getTodayDate()} max={planExpiryDate} className="form-control" value={sessionDetails.scheduleTodate} name="scheduleTodate" onChange={handleChange} disabled={editSession && new Date(editSession.scheduleTo) <= new Date()} />
                                </div>
                                <div className="form-group" style={{ width: "38%", marginLeft: "5%" }}>
                                    <label htmlFor="endtime">End Time</label>
                                    <input type="time" className="form-control" value={sessionDetails.scheduleToTime} name="scheduleToTime" onChange={handleChange} disabled={editSession && new Date(editSession.scheduleTo) <= new Date()} />
                                </div>
                            </div>
                            <label className="container-radio">Pick a Date & Time<input type="radio" checked={!immediate} onChange={radioChangeHandler} name="starttime" id="pick" value="pick" />
                                <span className="checkmark"></span>
                            </label>
                            {
                                immediate && <br />
                            }
                            <div style={{ marginTop: '10px' }} className={immediate ? "hide" : ""}>
                                <div className="group-end-date">
                                    <div className="form-group" style={{ width: '58%' }}>
                                        <label htmlFor="enddate">Start Date</label>
                                        <input type="date" min={getTodayDate()} max={planExpiryDate} className="form-control" value={sessionDetails.scheduleFromDate} name="scheduleFromDate" onChange={handleChange} disabled={editSession && new Date(editSession.scheduleFrom) <= new Date()} />
                                    </div>
                                    <div className="form-group" style={{ width: "38%", marginLeft: "5%" }}>
                                        <label htmlFor="endtime">Start Time</label>
                                        <input type="time" className="form-control" value={sessionDetails.scheduleFromTime} name="scheduleFromTime" onChange={handleChange} disabled={editSession && new Date(editSession.scheduleFrom) <= new Date()} />
                                    </div>
                                </div>
                                <div className="group-end-date" style={{ marginTop: '-20px' }}>
                                    <div className="form-group" style={{ width: '58%' }}>
                                        <label htmlFor="enddate">End Date</label>
                                        <input type="date" min={(new Date(sessionDetails.scheduleFromDate) < new Date()) ? getTodayDate() : sessionDetails.scheduleFromDate} max={planExpiryDate} className="form-control" value={sessionDetails.scheduleTodate} name="scheduleTodate" onChange={handleChange} disabled={editSession && new Date(editSession.scheduleTo) <= new Date()} />
                                    </div>
                                    <div className="form-group" style={{ width: "38%", marginLeft: "5%" }}>
                                        <label htmlFor="endtime">End Time</label>
                                        <input type="time" className="form-control" value={sessionDetails.scheduleToTime} name="scheduleToTime" onChange={handleChange} disabled={editSession && new Date(editSession.scheduleTo) <= new Date()} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-grp" >
                                <label htmlFor="gamevisibility">Game Visibility:</label>
                                <Select
                                    onChange={(e) => handleSelectChange(e, "mode")}
                                    menuPlacement={"top"}
                                    menuPosition="absolute"
                                    options={[
                                        { value: 'Private', label: 'Private', key: "PRIVATE" },
                                        { value: 'Public', label: 'Public', key: "PUBLIC" },
                                        { value: 'Invite Only', label: 'Invite Only', key: "INVITE" },
                                    ]}
                                    formatOptionLabel={function (data) {
                                        return (
                                            <span style={{ display: 'flex', alignItems: 'center' }} dangerouslySetInnerHTML={{
                                                __html: iconsForOptions[data.label] + '&nbsp' + data.label
                                            }} />
                                        );
                                    }}
                                    styles={{
                                        menuList: (base) => ({
                                            ...base,
                                            // overflow:'scroll'
                                            zIndex: 100
                                        })
                                    }}
                                    value={sessionDetails.mode}
                                    isSearchable={false}
                                />
                            </div>
                            <div className="form-group">
                                <div className="error-message visibility-note">
                                    <span>*</span>
                                    {
                                        sessionDetails.mode.value === "Public" ? " This game will now be visible to all users in your organization"
                                            : sessionDetails.mode.value === "Private" ? "All users with the game link can play this game"
                                                : "Only users invited can play this game"
                                    }
                                </div>
                            </div>
                            <div className={dateError ? "form-group" : "hide"}>
                                <div className="error-message">{dateError}</div>
                            </div>
                            <div className="account-btn-group" style={{ marginTop: '20px' }}>
                                <Link to={"#"} ><button type="submit" className="btn btn-outline" onClick={handleClose}>Cancel</button></Link>
                                <button type="submit" className={(edit && new Date(editSession.scheduleTo) <= new Date()) ? "btn btn-primary disabled" : "btn btn-primary"} > {edit ? "Schedule" : "Create"}</button>
                            </div>
                        </form>
                        <form className={gameSettingsFilled ? "invite-users-part" : "invite-users-part hide"} onSubmit={handleInviteSubmit}>
                            <h4 className="fade">Share game via link</h4>
                            <h4 className="share-link" onClick={handleCopyLink}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.0004C10.3259 14.333 10.7148 14.5972 11.1441 14.7776C11.5734 14.958 12.0344 15.0509 12.5 15.0509C12.9656 15.0509 13.4266 14.958 13.8559 14.7776C14.2852 14.5972 14.6741 14.333 15 14.0004L19 10.0004C19.663 9.33734 20.0355 8.43806 20.0355 7.50038C20.0355 6.5627 19.663 5.66342 19 5.00038C18.337 4.33734 17.4377 3.96484 16.5 3.96484C15.5623 3.96484 14.663 4.33734 14 5.00038L13.5 5.50038" stroke="#50A5F8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M13.9999 9.99973C13.674 9.66713 13.285 9.4029 12.8558 9.22252C12.4265 9.04213 11.9655 8.94922 11.4999 8.94922C11.0343 8.94922 10.5733 9.04213 10.144 9.22252C9.71474 9.4029 9.32577 9.66713 8.99989 9.99973L4.99989 13.9997C4.33685 14.6628 3.96436 15.562 3.96436 16.4997C3.96436 17.4374 4.33685 18.3367 4.99989 18.9997C5.66293 19.6628 6.56221 20.0353 7.49989 20.0353C8.43757 20.0353 9.33685 19.6628 9.99989 18.9997L10.4999 18.4997" stroke="#50A5F8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Copy Game Link
                            </h4>
                            {
                                linkCopied ?
                                    <h5 style={{ color: "grey", marginTop: "-10px", fontWeight: "400", marginBottom: "15px" }}>
                                        Link Copied!
                                    </h5> : null
                            }
                            {/* hide for public and invite only visibility*/}
                            <div className={mode === "PRIVATE" ? "form-group" : "form-group hide"}>
                                <div className="error-message">* Share this game link privately with all users you would like to invite</div>
                                {/* <label htmlFor="adduseremail">Add Users</label>
                                <input type="text" className="form-control" id="adduseremail" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Add users via email id" />
                                <div className="error-message">{emailError}</div> */}
                            </div>
                            {/* show for invite only visiblity */}
                            <div className={mode === "INVITE" ? "" : "hide"}>
                                <h4 className="fade">Select Users</h4>
                                <br />
                                <Select
                                    options={usersList}
                                    closeMenuOnSelect={false}
                                    menuPlacement={"auto"}
                                    maxMenuHeight={190}
                                    value={{ value: "", label: "Select Users" }}
                                    formatOptionLabel={function (data) {
                                        return (
                                            <SelectItem name={data.label} selectedUserList={selectedUserList} setSelectedUserList={setSelectedUserList} />
                                        );
                                    }}
                                    placeholder="Select Users"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            minHeight: 42,
                                            border: 0,
                                            background: '#f6f7f9'
                                        }),
                                        dropdownIndicator: (base) => ({
                                            ...base,
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                        }),
                                        clearIndicator: (base) => ({
                                            ...base,
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                            opacity: 0,
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            borderBottom: '0px solid #f0f0f0',
                                            background: '#fff',
                                            color: '#000',
                                            padding: 5
                                        })
                                    }}
                                />
                                <h4 className="invite-player-count">{usersList.length} players in the list</h4>
                            </div>
                            <div className="form-group">
                                <div className="error-message">
                                    ** Click on save to confirm / schedule the session
                                </div>
                            </div>
                            {/* <input type="text" className="form-control" onChange={(e) => setUserSelectInputText(e.target.value)} /> */}
                            <div className="account-btn-group" style={{ marginTop: '30px' }}>
                                <Link to={"#"} ><button type="submit" className="btn btn-outline" onClick={() => setGameSettingsFilled(false)}>Back</button></Link>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
export default StartNewGameModal;
