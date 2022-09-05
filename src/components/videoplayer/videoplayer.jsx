import React from "react";
import './videoplayer.css';

class Video extends React.Component {
      componentDidMount = () => {
        this.playVideo();
      };
      componentWillUnmount = () => {
          this.pauseVideo();
      };
      playVideo = () => {
        // this.refs.vidRef.play();
      };
      pauseVideo = () => {
        // this.refs.vidRef.pause();
        // this.refs.vidPause.classList.add('hide');
      };

      render = () => {
        return (
          <div className="video-play">
            <video
              // ref="vidRef"
              src="https://assets.polestar.com/video/test/polestar-1_09.mp4"
              type="video/mp4"
             />

            {/* <div>
              <button ref="vidPlay" className="play-paused" onClick={this.playVideo}>
                <span/>
              </button>
              <button ref="vidPause" className="play-paused paused hide" onClick={this.pauseVideo}>
                <span/>
              </button>
            </div> */}
          </div>
        );
      };
    }

 export default Video;