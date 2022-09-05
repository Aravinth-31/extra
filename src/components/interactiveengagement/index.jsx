import React, { useEffect, useState } from "react";

import "./index.css";

import interactive from "../../assets/images/interactive.svg";
import step1 from "../../assets/images/engage2.svg";
import step2 from "../../assets/images/engageunlimited.svg";
import step3 from "../../assets/images/engagereview.svg";
import innovative from "../../assets/images/innovative.svg";
import accessible from "../../assets/images/accessible.svg";
import affordable from "../../assets/images/affordable.svg";
import bannerplay from "../../assets/images/bannerplay.svg";
import bannerpause from "../../assets/images/pause.svg";
import team from "../../assets/images/team.svg";
import skills from "../../assets/images/skills.svg";
import fun from "../../assets/images/fun.svg";
import ReactPlayer from "react-player";

const InteractiveEngagement = () => {
  const [play, setPlay] = useState(false);
  const [animation, setAnimation] = useState();
  const [disablePause, setDisablePause] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPlay(true)
    }, 100);
  }, []);

  useEffect(() => {
    let count = 1;
    setInterval(() => {
      setAnimation(count++);
      if (count > 4) count = 1;
    }, 4000);
  }, []);
  return (
    <div className="howitworks-wrapper">
      {/* banner section */}
      <div className="how-banner-section">
        <div className="how-banner-video update" id="how-banner-video">
          <ReactPlayer
            onBufferEnd={() => setDisablePause(false)}
            url="https://youtu.be/qwy141txrnY"
            onPause={() => setPlay(false)}
            onPlay={() => setPlay(true)}
            loop={true}
            playing={play}
            config={{
              youtube: {
                playerVars: { disablekb: 1, origin: 'https://www.youtube.com' }
              }
            }} />
        </div>
        {
          !disablePause &&
          <div className="how-banner-desc">
            {/* <h6>Features Overview</h6>
          <span>Get to know our more features</span> */}
            <div className={`banner-play ${play ? "hide" : ""}`} onClick={() => setPlay(!play)}>
              <img src={bannerplay} alt="play" />
            </div>
            <div className={`banner-pause ${play ? "" : "hide"}`} onClick={() => setPlay(false)}>
              <img src={bannerpause} alt="pause" />
            </div>
          </div>
        }
      </div>
      {/* interative section */}
      <div className="interactive-wrapper">
        <h5>The only platform you need for interactive engagement</h5>
        <div className="interactive-section">
          <div className="interactive-left">
            <div
              className={`interactive-card ${animation === 1 ? "active" : ""}`}
            >
              <div className="interactive-header">Gamified Learning</div>
              <p>Who says learning has to be boring? We make it awesome by turning them into fun games.</p>
            </div>
            <div
              className={`interactive-card ${animation === 2 ? "active" : ""}`}
            >
              <div className="interactive-header">Team bonding</div>
              <p>Play together, compete or collaborate and have more fun! Our team activities result in bonding and camaraderie!</p>
            </div>
            <div
              className={`interactive-card ${animation === 3 ? "active" : ""}`}
            >
              <div className="interactive-header">Skill building</div>
              <p>Our games make you exercise both your left and right brains. Learning some new ropes while at it is an add-on.</p>
            </div>
            <div
              className={`interactive-card ${animation === 4 ? "active" : ""}`}
            >
              <div className="interactive-header">Fun stressbusters</div>
              <p>Take a break from work and shoo the stress pangs away with our variety of quick, fun energizers.</p>
            </div>
          </div>
          <div className="interactive-right">
            <img
              src={interactive}
              alt="interactive"
              className={`${animation === 1 ? "" : "hide"}`}
            />
            <img
              src={team}
              alt="team"
              className={`${animation === 2 ? "" : "hide"}`}
            />
            <img
              src={skills}
              alt="skills"
              className={`${animation === 3 ? "" : "hide"}`}
            />
            <img
              src={fun}
              alt="fun"
              className={`${animation === 4 ? "" : "hide"}`}
            />
          </div>
        </div>
      </div>
      {/* how it works steps */}
      <div className="steps-wrapper">
        <div className="howitworks-steps">
          <div className="howitworks-steps-img">
            <img src={step1} alt="step1" />
          </div>
          <div className="howitworks-steps-desc">
            <h4>Engage 2 ways</h4>
            <ul className="list-icon list-arrow">
              <li key={'live'}>
                Live participation in a virtual conference (MS Teams, Webex,
                Hangout, Zoom, Blue Jeans etc)
              </li>
              <li key={'employee'}>
                Employee-paced to allow them to progress at their own pace
              </li>
            </ul>
          </div>
        </div>
        <div className="howitworks-steps">
          <div className="howitworks-steps-desc">
            <h4>Engage unlimited users, anytime</h4>
            <ul className="list-icon list-arrow">
              <li key={'plan'}>Select your plan</li>
              <li key='teams'>Engage teams from the world over</li>
            </ul>
          </div>
          <div className="howitworks-steps-img">
            <img src={step2} alt="step2" />
          </div>
        </div>
        <div className="howitworks-steps">
          <div className="howitworks-steps-img">
            <img src={step3} alt="step3" />
          </div>
          <div className="howitworks-steps-desc">
            <h4>Review engagement levels</h4>
            <ul className="list-icon list-arrow">
              <li key={'session'}>Post-session reports</li>
              <li key={'participation'}>Overall participation analytics</li>
              <li key={'reviews'}>User reviews and feedback</li>
            </ul>
          </div>
        </div>
      </div>
      {/* reasons */}
      <div className="interactive-wrapper">
        <h5>Here are three reasons why you should go the extra mile</h5>
        <div className="reasons-wrapper">
          <div className="reasons-card">
            <div className="reasons-img">
              <img src={innovative} alt="innovative" />
            </div>
            <h3>Innovative</h3>
            <p>
              Unlimited ready-to-use games with fresh content and games added
              every month.
            </p>
          </div>
          <div className="reasons-card">
            <div className="reasons-img">
              <img src={accessible} alt="accessible" />
            </div>
            <h3>Accessible</h3>
            <p>
              Available to users, globally, on mobile/desktop with the option of
              API integration for single sign-in.
            </p>
          </div>
          <div className="reasons-card">
            <div className="reasons-img">
              <img src={affordable} alt="affordable" />
            </div>
            <h3>Affordable</h3>
            <p>
              Play the games as many times at the cost of less than Rs. 5/game/user. Pay online using credit/debit card or pay offline with
              a PO invoice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveEngagement;
