import React from 'react';

import './emptystate.css';
import { Link } from "react-router-dom"
import pagenotfound from '../../assets/images/pagenotfound.svg';
import arrowright from '../../assets/images/arrow-right-red.svg';

const PagenNotFound = () => {
  return (
    <div className="error-state">
      <div className="error-state-img">
        <img src={pagenotfound} alt="error" />
      </div>
      <div className="error-state-desc">
        <h5>Sorry we couldn’t able to find that page</h5>
        <p>Error: The requested URL may be broken or the page may have been removed from the server </p>
        <Link to={"/"}>
          <button className="btn btn-back">
            <img src={arrowright} alt="arrow" />
            Go back to home page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PagenNotFound;