import React from "react";
import { useDispatch } from "react-redux";
import { decryptData, encryptData } from "../../helpers/helper";
import { logOut } from "../../redux/actions/userAction";
import "./webinarhistory.css";
import Header from '../../components/header/header';
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { useState } from "react";
import { useEffect } from "react";
import arrowback from "../../assets/images/arrow-left.svg";
import Playcardlarge from "../../components/playCard/playcardlarge";
import PlayCardMobileHoverCard from "../../components/playCard/playCardMobileHoverCard";
import { getAllGames } from "../../redux/actions/homepageActions";
import { getAllWebinarCategories, getAllWebinars } from "../../redux/actions/commonActions";
import { OrgRoles } from "../../helpers/userTypes";
import LoadingComponent from "../../components/loader/LoadingComponent";
import arrowleft from "../../assets/images/paginationarrow.svg";
import BannerEditCard from "../../components/bannerEdit/BannerEditCard";
import WebinarDescriptionModal from "../../components/modal/webinardescriptionmodal";
import Slider from "react-slick";
import PlayCardHeading from "../../components/playCardHeading/playCardHeading";
import PurchasePlanModal from "../../components/modal/purchaseplan";

const WebinarHistory = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [play, setPlay] = useState(false);
    const [webinars, setWebinars] = useState({});
    const [zeroWebinarsFlag, setZeroWebinarsFlag] = useState(true);
    const [webinarDetails, setWeinarDetails] = useState({});
    const [loaded, setLoaded] = useState(true);
    const [openWebinarDescriptionModal, setOpenWebinarDescriptionModal] = useState(false);
    const [playClicked, setPlayClicked] = useState("");
    const [openPurchasePlansModal, setOpenPurchasePlansModal] = useState(false);
    const [showFull, setShowFull] = useState(false);

    const UserInfo = useSelector(state => state.getUser);
    const { userInfo } = UserInfo;
    const AllWebinars = useSelector(state => state.allWebinars);
    const { allWebinars } = AllWebinars;
    const AllWebinarCategories = useSelector(state => state.allWebinarCategories);
    const { allWebinarCategories } = AllWebinarCategories;

    const gameslider = {
        speed: 500,
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 4,
        className: "gameslider",
        cssEase: 'linear',
        lazyLoad: "progressive",
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 4.2,
                    slidesToScroll: 4,
                },
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 3.1,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 580,
                settings: {
                    slidesToShow: 2.2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 380,
                settings: {
                    slidesToShow: 2.05,
                    slidesToScroll: 2,
                },
            }
        ],
    };

    const signOut = async () => {
        await dispatch(logOut());
        history.push("/");
    };

    useEffect(() => {
        if (
            (UserInfo && UserInfo.loading) ||
            (AllWebinars && AllWebinars.loading) ||
            (AllWebinarCategories && AllWebinarCategories.loading)
        )
            setLoaded(false);
        else
            setLoaded(true);
    }, [UserInfo, AllWebinars, AllWebinarCategories]);
    useEffect(() => {
        if (userInfo?.data) {
            if (OrgRoles.includes(userInfo.data.role))
                setShowFull(true);
            else
                setShowFull(false);
        }
    }, [userInfo])

    useEffect(() => {
        dispatch(getAllWebinarCategories());
        dispatch(getAllWebinars(true));
    }, []);

    useEffect(() => {
        if (allWebinars?.data?.length && allWebinarCategories?.data) {
            let webinars = {};
            //flag to check atleast one webinar in any category
            let flag = false;
            allWebinarCategories.data.forEach(catagory => {
                webinars[catagory.id] = allWebinars.data.filter(webinar => webinar.catagoryId === catagory.id) || [];
                if (webinars[catagory.id].length > 0)
                    flag = true;
            })
            //setting flag to display accordingly
            setZeroWebinarsFlag(!flag);
            setWebinars(webinars);
        }
    }, [allWebinars, allWebinarCategories])

    useEffect(() => {
        if (playClicked) {
            setTimeout(() => {
                setPlay(true);
            }, 500);
        }
    }, [playClicked]);

    const handleBackClick = () => {
        setPlayClicked("");
        setWeinarDetails(null);
    }

    const clickFunction = (webinar) => {
        setWeinarDetails(webinar);
        setOpenWebinarDescriptionModal(true);
    }
    const getMoreWebinars = () => {
        let moreWebinars = webinars[webinarDetails.catagoryId].filter(webinar => webinar.id !== webinarDetails.id).slice(0, 3);
        return moreWebinars
    }
    const checkMembership = (e) => {
        if (!showFull) {
            setOpenPurchasePlansModal(true);
        }
    }
    return (
        <>
            <Header signOut={signOut} showProfile {...props} />
            <div className="webinar-history-container">
                {
                    playClicked ?
                        <div className="stream-body">
                            <div className="back-arrow">
                                <img src={arrowback} alt="back" onClick={handleBackClick} />
                                <span> Back</span>
                            </div>
                            <div className="title">
                                <h4><span className="category">{webinarDetails.catagory.name ? webinarDetails.catagory.name + " : " : ""}</span> {webinarDetails.title}</h4>
                            </div>
                            <div className="video-container">
                                <ReactPlayer
                                    // onProgress={checkMembership}
                                    onEnded={checkMembership}
                                    url={showFull ? webinarDetails.fullVideoUrl : webinarDetails.previewUrl}
                                    onPause={() => setPlay(false)}
                                    onPlay={() => setPlay(true)}
                                    playing={play}
                                    controls
                                    config={{
                                        youtube: {
                                            playerVars: { disablekb: 1, list: [], origin: 'https://www.youtube.com' }
                                        }
                                    }} />
                            </div>
                            <div className="instructions">
                                <h4>About the session</h4>
                                <p>
                                    {webinarDetails.description}
                                </p>
                            </div>
                        </div> :
                        <div className="webinars">
                            <div className="title">All Webinars</div>
                            <LoadingComponent loaded={loaded}>
                                <div className="webinars-by-category">
                                    {
                                        zeroWebinarsFlag ?
                                            <div className="no-game-wrapper">
                                                <div>
                                                    <h3 className="no-game">Currently, there are no Webinars.</h3>
                                                    <span className="no-game-span" onClick={() => props.history.push("/")}>
                                                        Go to Homepage
                                                    </span>
                                                </div>
                                            </div>
                                            :
                                            allWebinarCategories?.data?.map(catagory =>
                                                webinars[catagory.id].length > 0 ?
                                                    <>
                                                        <PlayCardHeading
                                                            title={catagory.name}
                                                        />
                                                        <Slider {...gameslider}>
                                                            {
                                                                webinars[catagory.id].map((webinar) => {
                                                                    return (
                                                                        <BannerEditCard key={JSON.stringify(webinar)} image={webinar.mobileCoverMedia} webinar={webinar} clickFunction={clickFunction} />
                                                                    );
                                                                })
                                                            }
                                                        </Slider><br />
                                                    </>
                                                    : null
                                            )
                                    }
                                </div>
                            </LoadingComponent>
                        </div>
                }
            </div>
            {
                openWebinarDescriptionModal &&
                <WebinarDescriptionModal
                    modalid={"webinar-description"}
                    setOpenWebinarDescriptionModal={setOpenWebinarDescriptionModal}
                    toggle={openWebinarDescriptionModal}
                    key={"webinar-description"}
                    moreWebinars={getMoreWebinars()}
                    webinar={webinarDetails}
                    setPlayClicked={setPlayClicked}
                    clickFunction={clickFunction}
                />
            }
            {openPurchasePlansModal && <PurchasePlanModal toggle={openPurchasePlansModal} setOpenPurchasePlansModal={setOpenPurchasePlansModal} purchaseModalType={"Watch entire session"} />}
        </>
    )
}

export default WebinarHistory;