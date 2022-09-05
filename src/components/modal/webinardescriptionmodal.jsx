import React, { useEffect, useState } from 'react';

import './modal.css';
import Modal from './modal';
import BannerEditCard from '../bannerEdit/BannerEditCard';
import ReactPlayer from 'react-player';
import arrowback from "../../assets/images/arrow-left.svg";
import { useSelector } from 'react-redux';
import { OrgRoles } from '../../helpers/userTypes';
import { S3_BASE_URL } from '../../helpers/helper';

const WebinarDescriptionModal = ({ modalid, toggle, setOpenWebinarDescriptionModal, moreWebinars, webinar, setPlayClicked, clickFunction }) => {
    const [play, setPlay] = useState(false);
    const [playTrailerClicked, setPlayTrailerClicked] = useState(false);

    const { userInfo } = useSelector(state => state.getUser);

    useEffect(() => {
        const playToggler = setTimeout(() => {
            setPlay(true);
        }, 500);
        return () => {
            clearTimeout(playToggler);
        }
    }, [])
    const handlePlay = (flag) => {
        setPlayClicked(flag);
        setOpenWebinarDescriptionModal(false);
    }
    const handleClick = (webinar) => {
        setPlay(false);
        setPlayTrailerClicked(false);
        clickFunction(webinar);
    }
    return (
        <Modal modalid={modalid} toggle={toggle}>
            <div className="modal-body">
                <div className="close-icon" data-dismiss="modal" onClick={() => setOpenWebinarDescriptionModal(false)} aria-label="Close">
                    <div className="close-btn-icon"></div>
                </div>
                <div className="webinar-description">
                    <div className="back-arrow">
                        <img src={arrowback} alt="back" onClick={() => setOpenWebinarDescriptionModal(false)} />
                    </div>
                    <div className="title">
                        <h4>
                            <span className='category'>{webinar.catagory.name ? webinar.catagory.name + " : " : ""}</span>
                            {webinar.title}
                        </h4>
                    </div>
                    <div className={`preview ${playTrailerClicked ? "" : "bg-light"}`}>
                        {
                            playTrailerClicked ?
                                <ReactPlayer
                                    url={webinar.teaserUrl}
                                    onPause={() => setPlay(false)}
                                    onPlay={() => setPlay(true)}
                                    loop={true}
                                    height={'100%'}
                                    width={'100%'}
                                    playing={play}
                                    config={{
                                        youtube: {
                                            playerVars: { disablekb: 1, origin: 'https://www.youtube.com' }
                                        }
                                    }} />
                                : <>
                                    <img className='preview-image hide767' src={S3_BASE_URL + webinar.coverMedia} />
                                    <img className='preview-image show767' src={S3_BASE_URL + webinar.mobileCoverMedia} />
                                </>
                        }
                    </div>
                    <div className="btn-group">
                        <button className='btn btn-primary' onClick={() => setPlayTrailerClicked(true)}>Play Trailer</button>
                        <button className='btn btn-primary' onClick={() => handlePlay("SESSION")}>Watch the session</button>
                    </div>
                    <div className="description">
                        <h4 className='title'>About the session</h4>
                        <p className='content'>{webinar.description}</p>
                    </div>
                    {
                        moreWebinars.length > 0 &&
                        <div className="more-like-this">
                            <h4 className="title">More like this</h4>
                            <div className="more-webinars">
                                {
                                    moreWebinars.map(webinar =>
                                        <BannerEditCard key={JSON.stringify(webinar) + "on-modal"} image={webinar.mobileCoverMedia} webinar={webinar} clickFunction={handleClick} />
                                    )
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </Modal>
    );
};
export default WebinarDescriptionModal;
