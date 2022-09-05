import React from 'react';

import './customegameheading.css';

import arrowBack from '../../assets/images/arrow-back.svg';

const CustomeGameHeading = () => {
  return(
    <div className="cstm-game-heading">
      <div className="back-btn">
        <img src={arrowBack} alt=""/>
        <h5>KBC</h5>
      </div>
      <div className="cg-title-wrapper">
        <div className="form-group">
          <label htmlFor="name">Quiz Title</label>
          <input type="text" className="form-control" id="name"  name="name"/>
        </div>
        <div className="cg-title-desc">
          <div className="cg-text">
            <span>Questions</span>
            <h4>20</h4>
          </div>
          <div className="cg-text">
            <span>Time Limit</span>
            <h4>1hr 20min</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomeGameHeading;