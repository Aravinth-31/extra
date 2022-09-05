import React, { useState, useEffect } from 'react';

import './gamebanner.css';
import Video from '../videoplayer/videoplayer';

import bannerplay from "../../assets/images/videoPlay.svg";
import bannerpause from "../../assets/images/videoPause.svg";
import ReactPlayer from 'react-player'
import { S3_BASE_URL } from '../../helpers/helper';
// const samplevideo = "https://cdn.videvo.net/videvo_files/video/free/2014-08/small_watermarked/Earth_Zoom_In_preview.webm";
// const videoUrl = {
//   "ESCAPE ROOM": "https://youtu.be/6dSKUoV0SNI", 
//   "KBC": "https://youtu.be/ffdxY0S3bx4"
// }
const GameBanner = (gameDetail) => {
  const { openFeedbackModal, openThankyouModal, openShareModal, openLoginModal, openPurchasePlansModal } = gameDetail;
  const [play, setPlay] = useState(true);
  const [disablepause, setDisablePause] = useState(true);
  useEffect(() => {
    if (openFeedbackModal || openThankyouModal || openShareModal || openLoginModal || openPurchasePlansModal)
      setPlay(false);
    // else
    //   setPlay(true);
  }, [openFeedbackModal, openThankyouModal, openShareModal, openLoginModal, openPurchasePlansModal])

  return (
    <div className="game-banner">

      <div className="game-banner-left">
        <div className="game-banner-img">
          {!gameDetail?.gameDetail?.data?.coverMedia[0]?.includes('https://youtu.be') ?
            <Video /> :
            <div id="playback-video" className="playback-video">
              <ReactPlayer
                onBufferEnd={() => setDisablePause(false)}
                url={gameDetail?.gameDetail?.data?.coverMedia[0]}
                loop={true}
                playing={play}
                onPause={() => setPlay(false)}
                onPlay={() => {
                  setPlay(true);
                  if (openFeedbackModal || openThankyouModal || openShareModal || openLoginModal || openPurchasePlansModal) {
                    setPlay(false);
                  }
                }}
                config={{
                  youtube: {
                    playerVars: { disablekb: 1, origin: 'https://www.youtube.com' }
                  }
                }} />
            </div>
          }
          {/* <img src={gameBanner} alt="game-video"/> */}
        </div>
        {
          !disablepause &&
          <div className="how-banner-desc">
            <div className={`banner-play ${play ? "hide" : ""}`} onClick={() => setPlay(true)}>
              <img src={bannerplay} alt="play" />
            </div>
            <div className={`banner-pause ${play ? "" : "hide"}`} onClick={() => setPlay(false)}>
              <img src={bannerpause} alt="pause" />
            </div>
          </div>
        }
      </div>
      <div className="game-banner-right">
        {/* <div className="game-thumbnil active">
            <div className="game-banner-img">
              {gameDetail && gameDetail.gameDetail && gameDetail.gameDetail.data ?<img src={gameDetail.gameDetail.data.coverMedia[0]} alt="game1"/> : null}
            </div> */}
        {/* used paused class for paused the video */}
        {/* <div className="play-paused">
              <span/>
          </div>
          </div> */}
        <div className="game-thumbnil">
          <div className="game-banner-img">
            {gameDetail && gameDetail.gameDetail ? gameDetail.gameDetail.data.coverMedia.map((gameImage) => {
              if (!gameImage.includes('https://youtu.be')) {
                return <img src={S3_BASE_URL + gameImage} alt="gameImage" key={gameImage} />
              }
              return null;
            }) : null}

          </div>
        </div>

      </div>

    </div>
  );
};

export default GameBanner;