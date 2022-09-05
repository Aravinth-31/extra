import React from 'react';
import { Link } from 'react-router-dom';

import './questionstab.css';
import time from '../../assets/images/time.svg';
import questionimg from '../../assets/images/question.svg';
import editimg from '../../assets/images/edit.svg';
import duplicateimg from '../../assets/images/duplicate.svg';
import deleteimg from '../../assets/images/delete.svg';
import dragimg from '../../assets/images/drag.svg';

import EditDeleteModal from '../modal/editdeletemodal';

const QuestionsTab = () => {
  return(
    <div className="cstm-detail">
      <div className="cstm-template">
        <div className="questiontab-wrapper">
          {/* question tab card */}
          <div className="questiontab-card">
            <div className="questiontab-header">
              <span>01</span>
              <div className="question-time">
                <img src={time} alt="time"/>
                30 seconds
              </div>
            </div>
            <div className="questiontab-body">
              <div className="question-img">
                <img src={questionimg} alt="img1"/>
              </div>
              <div className="question-desc">
                <h5>Which planet is closest to the sun?</h5>
                <div className="radio-group">
                  <label className="radio-check">
                    <input type="radio" name="planet" id="p-mercury"/>
                    <span>Mercury</span>
                  </label>
                  <label className="radio-check">
                    <input type="radio" name="planet" id="p-venus"/>
                    <span>Venus</span>
                  </label>
                  <label className="radio-check">
                    <input type="radio" name="planet" id="p-mars"/>
                    <span>Mars</span>
                  </label>
                  <label className="radio-check">
                    <input type="radio" name="planet" id="p-earth"/>
                    <span>Earth</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="questiontab-footer">
              <Link className="action-btn" data-toggle="modal" data-target="#edit">
                <img src={editimg} alt="edit" />
                <span>edit</span>
              </Link>
              <Link className="action-btn">
                <img src={duplicateimg} alt="edit" />
                <span>Duplicate</span>
              </Link>
              <Link className="action-btn" data-toggle="modal" data-target="#delete">
                <img src={deleteimg} alt="edit" />
                <span>Delete</span>
              </Link>
              <Link className="action-btn ml-auto">
                <img src={dragimg} alt="drag"/>
              </Link>
            </div>
          </div>
            {/* repreat question tab card */}
          <div className="questiontab-card">
              <div className="questiontab-header">
                <span>02</span>
                <div className="question-time">
                  <img src={time} alt="time"/>
                  30 seconds
                </div>
              </div>
              <div className="questiontab-body">
                <div className="question-img">
                  <img src={questionimg} alt="img1"/>
                </div>
                <div className="question-desc">
                  <h5>Which planet is closest to the sun?</h5>
                  <div className="radio-group">
                    <label className="radio-check">
                      <input type="radio" name="planet" id="p-mercury"/>
                      <span>Mercury</span>
                    </label>
                    <label className="radio-check">
                      <input type="radio" name="planet" id="p-venus"/>
                      <span>Venus</span>
                    </label>
                    <label className="radio-check">
                      <input type="radio" name="planet" id="p-mars"/>
                      <span>Mars</span>
                    </label>
                    <label className="radio-check">
                      <input type="radio" name="planet" id="p-earth"/>
                      <span>Earth</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="questiontab-footer">
                <Link className="action-btn">
                  <img src={editimg} alt="edit" />
                  <span>edit</span>
                </Link>
                <Link className="action-btn">
                  <img src={duplicateimg} alt="edit" />
                  <span>Duplicate</span>
                </Link>
                <Link className="action-btn">
                  <img src={deleteimg} alt="edit" />
                  <span>Delete</span>
                </Link>
                <Link className="action-btn ml-auto">
                  <img src={dragimg} alt="drag"/>
                </Link>
              </div>
          </div>
          <div className="cstm-button">
            <button type="submit" className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
      <EditDeleteModal modalid="edit" title="edit"/>
      <EditDeleteModal modalid="delete" title="delete"/>
    </div>
  );
};

export default QuestionsTab;
