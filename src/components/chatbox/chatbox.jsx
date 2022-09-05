import React, { useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import "./chatbox.css";
import { failureAlert } from '../../helpers/helper';
import { useSelector } from 'react-redux';
import Picker from 'emoji-picker-react';
import smile from "../../assets/images/smileoutline.png";
import Filter from "bad-words"
import { ToastContainer } from 'react-toastify';
import { Words } from '../../helpers/profanewords';
import { useDispatch } from 'react-redux';
import { backUpParticipants } from '../../redux/actions/commonActions';

const filter = new Filter();
Words.forEach(word => {
    filter.addWords(word);
})

const ChatBox = ({ classPrefix, backupChats, isChat }) => {
    const dispatch = useDispatch();
    const [content, setContent] = useState("");
    const [details, setDetails] = useState({
        userId: "",
        userName: "",
        webinarId: "",
        mailId: "",
        companyName: ""
    });
    const [joined, setJoined] = useState(false);
    const [chats, setChats] = useState([]);
    const [chatsToShow, setChatsToShow] = useState([]);
    const [showEmojiPanel, setShowEmojiPanel] = useState(false);
    const [currentCountToShow, setCurrentCountToShow] = useState(15);
    var colors = ['col-943d24', 'col-9b45b2', 'col-73a24e', 'col-f0a04b', 'col-f0a04b'];

    const { userInfo } = useSelector(state => state.getUser);
    const { allWebinars } = useSelector(state => state.allWebinars);
    const { orgDetailsByEmail } = useSelector((state) => state.getOrganisation);

    const chatLogRef = useRef();

    useEffect(() => {
        window.socket?.emit("getChat");
        window.socket?.on("chatsMessage", (data) => {
            setChats(data);
        })
        // return () => {
        //     if (socket)
        //         socket.disconnect();
        // }
    }, [window.socket])
    useEffect(() => {
        document.addEventListener("mouseup", eventhandle, false);
        return () => {
            document.removeEventListener("mouseup", eventhandle.apply, false);
        }
    }, [])
    const eventhandle = (e) => {
        const element = document.getElementById("chat-form")
        if (element) {
            var isClickInsideElement = element.contains(e.target);
            if (!isClickInsideElement)
                setShowEmojiPanel(false);
        }
    }
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
        const callBack = async () => {
            if (details.userId !== "" && details.userName !== "" && details.webinarId !== "" && details.mailId !== "" && details.companyName !== "" && !joined) {
                if (window.socket?.connected) {
                    window.socket.emit("joinWebinar", details)
                    setJoined(true);
                }
                else {
                    const response = await dispatch(backUpParticipants(details));
                    if (response === 200) {
                        setJoined(true);
                    }
                }
            }
        }
        callBack();
    }, [details, window.socket]);
    const handleChange = (e) => {
        setContent(e.target.value);
    }
    const handleSend = (e) => {
        e.preventDefault();
        if (content.length === 0)
            return;
        setShowEmojiPanel(false);
        if (details.userId && details.userName && details.webinarId) {
            if (window.socket?.connected)
                window.socket.emit("chats", { ...details, message: content });
            else {
                const data = {
                    ...details,
                    chats: [...backupChats.current?.chats, { ...details, message: content, createdAt: (new Date()).toISOString() }]
                }
                backupChats.current = data;
            }
        }
        else
            failureAlert("Something is wrong!");
        setContent("");
    }
    useEffect(() => {
        var objDiv = document.getElementById("chat-log");
        if (objDiv)
            objDiv.scrollTop = 10000000000;
        if (chatLogRef.current)
            chatLogRef.current.scrollTop = 10000000000;
        // const messages = document.getElementsByClassName("message");
    }, [chats, backupChats?.current]);

    useEffect(() => {
        if (chats) {
            let data = [];
            if (chats.length - 15 >= currentCountToShow)
                data = chats.slice(chats.length - currentCountToShow, chats.length)
            else
                data = [...chats];
            setChatsToShow(data);
        }
    }, [chats, currentCountToShow]);
    const scrollHandler = (e) => {
        if (e.target.scrollTop <= 20) {
            if (currentCountToShow <= chats.length - 15) {
                setCurrentCountToShow(currentCountToShow + 15);
                e.target.scrollTop = 20
            }
            else
                setCurrentCountToShow(chats.length);
        }
    }

    const emojiClicked = (e, obj) => {
        setContent(prevState => (
            prevState + obj.emoji
        ))
    }
    const showFiltered = (message) => {
        let list = message.split(" ");
        let newlist = list.map(word => {
            try {
                return filter.clean(word);
            } catch (err) {
                return word;
            }
        })
        return newlist.join(" ");
    }
    return (
        <div className={classPrefix + " chat-container"}>
            <ToastContainer position='bottom-center' />
            <div className="chat-log" id="chat-log" onScroll={scrollHandler} ref={chatLogRef}>
                {
                    chatsToShow.length > 0 ?
                        chatsToShow.map((chat, index) => (
                            <div key={JSON.stringify(chat.id)} className={`message ${isChat ? "" : "emojies"}  ${chat.userId === details.userId ? "self" : ""}`}>
                                <span className={`name ${colors[index % 5]}`}>{chat.userName}</span>
                                {
                                    !isChat &&
                                    <span className={`name ${colors[index % 5]}`}>:</span>
                                }
                                <span className="content">{showFiltered(chat.message)}</span>
                            </div>
                        ))
                        : backupChats.current?.chats?.length > 0 ?
                            backupChats.current?.chats?.map((chat, index) => (
                                <div key={JSON.stringify(chat.id)} className={`message ${isChat ? "" : "emojies"}  ${chat.userId === details.userId ? "self" : ""}`}>
                                    <span className={`name ${colors[index % 5]}`}>{chat.userName}</span>
                                    {
                                        !isChat &&
                                        <span className={`name ${colors[index % 5]}`}>:</span>
                                    }
                                    <span className="content">{showFiltered(chat.message)}</span>
                                </div>
                            )) :
                            <div className="no-messages">
                                <h4>No Messages Yet!</h4>
                            </div>
                }
            </div>
            {
                isChat ?
                    <form onSubmit={handleSend} id="chat-form">
                        <Picker
                            pickerStyle={{ position: "absolute", bottom: 50, borderRadius: 0, width: "100%", height: "200px", display: showEmojiPanel ? "inherit" : "none" }}
                            disableSearchBar
                            onEmojiClick={emojiClicked}
                        />
                        <div className="form-group">
                            <input type="text" className="form-field" value={content} onChange={handleChange} placeholder={`Chat as ${details.userName ? details.userName : ""}`} />
                            <img src={smile} alt="" className='emoji-btn' onClick={() => setShowEmojiPanel(prevState => !prevState)} />
                        </div>
                        <button className={`btn btn-primary ${content.length > 0 ? "" : "disabled"}`}>Send</button>
                    </form> : null
            }
        </div>
    )
}

export default ChatBox