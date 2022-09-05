import React from 'react';

import './emptystate.css';

import sessionexpired from '../../assets/images/session_expired.png';
import arrowright from '../../assets/images/arrow-right-red.svg';
import { Link } from 'react-router-dom';

const SessionExpired = () => {
    return (
        <div className="error-state">
            <div className="error-state-img session-expired">
                <img src={sessionexpired} alt="error" />
            </div>
            <div className="error-state-desc">
                <h5>Session Expired</h5>
                <p>Error: Your session has expired, please login again </p>
                <Link to={"/signin"} replace>
                    <button className="btn btn-back">
                        <img src={arrowright} alt="arrow" />
                        Go back to signin page
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default SessionExpired;