import React from 'react';

import './emptystate.css';

import connectionlost from '../../assets/images/connectionlost.svg';

const ConnectionLost = () => {
  return(
    <div className="error-state flex-column">
      <div className="error-state-desc">
        <h5>Oops! no internet connection found</h5>
        <span> Check your internet connection and try again</span>
        <button className="btn btn-secondry">
          Try again
        </button>
      </div>
      <div className="error-state-img">
        <img src={connectionlost} alt="error"/>
      </div>
    </div>
  );
};

export default ConnectionLost;