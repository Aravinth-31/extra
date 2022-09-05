import React from 'react';
import ColorPicker from '../colorpicker/colorpicker';
import Progress from 'react-progressbar';

import './customcontenttab.css';

const CustomContentTab = () => {
  return(
    <div>
    <div className="cstm-detail">
      <div className="cstm-template">
        <div className="cstm-title">
          <h5>Questions</h5>
        </div>
        <div className="cstm-wrapper">
          <div className="form-group checkbox-label">
            <label htmlFor="name">Type of Question</label>
            <div className="checkbox-group">
              <label className="checkbox-item">
                <input type="checkbox" checked/>
                <span>MCQ</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox" checked/>
                <span>Fill in the blanks</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox"/>
                <span>Check Box</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox"/>
                <span>Polls</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox"/>
                <span>Open ended</span>
              </label>
            </div>
          </div>
          <div className="form-group radio-label-wrap">
            <label htmlFor="name">No of Options (MCQ)</label>
            <div className="radio-group">
              <label className="radio-item">
                <input
                  type="radio"
                  id="mcqtwo"
                  name="mcq"
                  checked
                />
                <span>Two</span>
              </label>
              <label className="radio-item">
                <input
                  type="radio"
                  id="mcqfour"
                  name="mcq"
                />
                <span>Four</span>
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="question">No of Questions</label>
            <div className="btn-grorp-wrapper">
              <input type="text" id="question"  name="question"/>
              {/* while typing in input field , show these okcancel-btn */}
              <div className="okcancel-btn">
                <button type="button" className="cancel-btn">
                  <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
                    <path d="M25.9375 9.0625L9.0625 25.9375" stroke="#F2545B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.0625 9.0625L25.9375 25.9375" stroke="#F2545B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button type="button" className="ok-btn">
                  <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                    <path d="M1.33203 10L9.66536 18.3333L26.332 1.66667" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cstm-template">
        <div className="cstm-title">
          <h5>Timer</h5>
        </div>
        <div className="cstm-wrapper">
          <div className="form-group">
            <label htmlFor="setTime">Set time limit per question</label>
            <input type="text" className="form-control" id="setTime"  name="setTime"/>
          </div>
          <div className="form-group radio-label-wrap">
            <label htmlFor="name">Points Mode Options</label>
            <div className="radio-group">
              <label className="radio-item">
                <input
                  type="radio"
                  id="modetime"
                  name="mode"
                  checked
                />
                <span>Decreasing Timer</span>
              </label>
              <label className="radio-item">
                <input
                  type="radio"
                  id="modeans"
                  name="mode"
                />
                <span>Lose Points on Wrong Answer</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="cstm-template">
        <div className="cstm-title">
          <h5>Scoring Pattern</h5>
        </div>
        <div className="cstm-wrapper">
          <div className="form-group">
            <label htmlFor="ponitsQues">Points per question</label>
            <input type="text" className="form-control" id="ponitsQues"  name="ponitsQues"/>
          </div>
        </div>
      </div>
      <div className="cstm-template">
        <div className="cstm-title">
          <h5>Life Lines</h5>
        </div>
        <div className="cstm-wrapper">
          <div className="form-group checkbox-label">
            <label htmlFor="name">Select Lifelines</label>
            <div className="checkbox-group">
              <label className="checkbox-item">
                <input type="checkbox"/>
                <span>50-50</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox" checked/>
                <span>Audience Poll</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox"/>
                <span>Double Dip</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox" checked/>
                <span>Phone a Friend</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox"/>
                <span>Ask the expert</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="cstm-template">
        <div className="cstm-title">
          <h5>Rules text</h5>
          <span>Rules for playing<br/> the game</span>
        </div>
        <div className="cstm-wrapper">
          <div className="rule-text">
            <ul>
              <li>lorem ipsum is a dummy text</li>
              <li>lorem ipsum is a dummy text</li>
              <li>lorem ipsum is a dummy text</li>
              <li>lorem ipsum is a dummy text</li>
              <li>lorem ipsum is a dummy text</li>
            </ul>
            <div className="add-new-btn">
              <button type="submit" className="add-btn">
                + Add New Rule
              </button>
              <div className="new-rule-card">
                <div className="form-group">
                  <label htmlFor="newrule">New Rule</label>
                  <div className="btn-grorp-wrapper">
                    <textarea id="newrule"/>
                    <div className="okcancel-btn">
                      <button type="button" className="cancel-btn">
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
                          <path d="M25.9375 9.0625L9.0625 25.9375" stroke="#F2545B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9.0625 9.0625L25.9375 25.9375" stroke="#F2545B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button type="button" className="ok-btn">
                        <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                          <path d="M1.33203 10L9.66536 18.3333L26.332 1.66667" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cstm-template">
        <div className="cstm-title">
          <h5>Scoring Pattern</h5>
        </div>
        <div className="cstm-wrapper">
          <div className="cstm-progress">
            <div className="form-group">
              <label>Points per question</label>
              <ColorPicker/>
            </div>
            <div className="cstm-progressbar">
              <label>Preview</label>
              <Progress completed={75} />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="cstm-button">
          <button type="submit" className="btn btn-outline">Cancel</button>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </div>
    </div>
  );
};

export default CustomContentTab;