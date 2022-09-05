import React from 'react';

import './customedesigntab.css';
import floral from '../../assets/images/floral.svg';
import festive from '../../assets/images/festive.svg';
import check from '../../assets/images/check.svg';
import sports from '../../assets/images/sports.svg';

const DefaultTemplate = () => {
  return(
    <div className="defaulttheme">  
      {/* when click on apply-btn use apply default as classname */}
      <div className="defaulttheme-card default">
        <div className="theme-card-img">
          <div className="default-color">
          </div>
          {/* on click, apply default classname mention above*/}
          <div className="apply-btn">
            <button type="submit">Apply</button>
          </div>
          <div className="default-state">
            <img src={check} alt="check"/>
          </div>
        </div>
        <span>Color Fusion</span>
      </div>
      <div className="defaulttheme-card">
        <div className="theme-card-img">
          <div className="default-color">
            <img src={floral} alt="color"/>
          </div>
          {/* on click, apply default classname mention above*/}
          <div className="apply-btn">
            <button type="submit">Apply</button>
          </div>
          <div className="default-state">
            <img src={check} alt="check"/>
          </div>
        </div>
        <span>Floral Blue</span>
      </div>
      <div className="defaulttheme-card">
        <div className="theme-card-img">
          <div className="default-color">
            <img src={sports} alt="sports"/>
          </div>
          {/* on click, apply default classname mention above*/}
          <div className="apply-btn">
            <button type="submit">Apply</button>
          </div>
          <div className="default-state">
            <img src={check} alt="check"/>
          </div>
        </div>
        <span>Sports Cornern</span>
      </div>
      <div className="defaulttheme-card">
        <div className="theme-card-img">
          <div className="default-color">
            <img src={festive} alt="festive"/>
          </div>
          {/* on click, apply default classname mention above*/}
          <div className="apply-btn">
            <button type="submit">Apply</button>
          </div>
          <div className="default-state">
            <img src={check} alt="check"/>
          </div>
        </div>
        <span>Festive theme</span>
      </div>
    </div>
  );
};

export default DefaultTemplate;