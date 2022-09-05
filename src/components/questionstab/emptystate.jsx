import React from 'react';
import { Link } from 'react-router-dom';

import './questionstab.css';
// image
import emptystate from '../../assets/images/empty.svg';
import googlesheets from '../../assets/images/googlesheets.svg';
import mcq from '../../assets/images/mcq.svg';
import checkbox from '../../assets/images/checkbox-add.svg';
import fillblank from '../../assets/images/fillblank.svg';

const EmptyState = () => {
  return(
    <div className="cstm-detail">
      <div className="cstm-template">
        <div className="ques-emptystate">
          <img src={emptystate} alt="empty"/>
          <h5>Start by adding the first question</h5>
          <span>Lorem ipsum is a dummy text will appear for users</span>
          <div className="question-dropdown">
            <button className="btn btn-secondry dropdownmenu">
              <span>+ Add Question</span>
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
