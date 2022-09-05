import React from 'react';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import './modal.css';

import Modal from './modal'; 
import closeicon from '../../assets/images/close.svg';
import file from '../../assets/images/file.svg';
import deleteicon from '../../assets/images/delete.svg';

const options = [
  { value: 'MCQ', label: 'Multiple Choice Question' },
  { value: 'Fill in the blanks', label: 'Fill in the blanks' },
  
];
const limitoptions = [
  { value: '10sec', label: '10sec' },
  { value: '20sec', label: '20sec' },
  { value: '30sec', label: '30sec' },
];

const CreateQuestion = ({modalid,toggle,setOpenCreateQuestionModal,questionType,setQuestionType}) => {
  return(
    <Modal modalid={modalid} toggle={toggle}>
      <div className="modal-body">
        <div className="close-icon" data-dismiss="modal" aria-label="Close" onClick={()=>setOpenCreateQuestionModal(false)}>
          <div className="close-btn-icon"></div>
        </div>
        <div className="createquestion">
          <div className="create-question-header">
          <h5>Create Question</h5>
          <div className="modal-select choose-question">
            <label>Choosen Question type</label>
            <Select
                  classNamePrefix="multiselect"
                  className="multiselect"
                  placeholder="Multiple Choice Question"
                  options={options}
                  onChange={(e)=>setQuestionType(e.value)}
                />
          </div>
          </div>
          <div className="createquestion-wrapper">
            <div className="createquestion-formgroup">
              <h4>Add Questions</h4>
              <div className="add-question-group">
                <div className="type-question-wrapper">
                  <div className="type-question-card">
                    <div className="type-question-header">
                      <span>
                        10
                      </span>
                      <div className="type-ques-option">
                        <Link>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 8H15.01" stroke="#E25569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M17 4H7C5.34315 4 4 5.34315 4 7V17C4 18.6569 5.34315 20 7 20H17C18.6569 20 20 18.6569 20 17V7C20 5.34315 18.6569 4 17 4Z" stroke="#E25569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4 15L8 11C8.45606 10.5612 8.97339 10.3301 9.5 10.3301C10.0266 10.3301 10.5439 10.5612 11 11L16 16" stroke="#E25569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 14L15 13C15.4561 12.5611 15.9734 12.3301 16.5 12.3301C17.0266 12.3301 17.5439 12.5611 18 13L20 15" stroke="#E25569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                        <Link>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5V10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10V5Z" stroke="#23282E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 10C5 11.8565 5.7375 13.637 7.05025 14.9497C8.36301 16.2625 10.1435 17 12 17C13.8565 17 15.637 16.2625 16.9497 14.9497C18.2625 13.637 19 11.8565 19 10" stroke="#23282E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 21H16" stroke="#23282E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 17V21" stroke="#23282E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                        <Link>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 10L19.553 7.724C19.7054 7.64783 19.8748 7.61188 20.045 7.61954C20.2152 7.62721 20.3806 7.67824 20.5256 7.7678C20.6706 7.85736 20.7902 7.98247 20.8733 8.13127C20.9563 8.28006 20.9999 8.44761 21 8.618V15.382C20.9999 15.5524 20.9563 15.7199 20.8733 15.8687C20.7902 16.0175 20.6706 16.1426 20.5256 16.2322C20.3806 16.3218 20.2152 16.3728 20.045 16.3805C19.8748 16.3881 19.7054 16.3522 19.553 16.276L15 14V10Z" stroke="#23282E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H13C14.1046 18 15 17.1046 15 16V8C15 6.89543 14.1046 6 13 6Z" stroke="#23282E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                        <Link>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M14 10H15C16 10 16 11 17.016 13.527C18 16 18 17 19 17H20" stroke="#23282E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13 17C14.5 17 16 15 17 13.5C18 12 19.5 10 21 10" stroke="#23282E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 19C3 20.5 3.5 21 5 21C6.5 21 7 17 8 12C9 7 9.5 3 11 3C12.5 3 13 3.5 13 5" stroke="#23282E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 12H11" stroke="#23282E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Link>
                      </div>
                    </div>
                    <textarea placeholder="Type your question here" />
                  </div>
                  <div className="custom-upload-lg">
                      <label>
                        <input type="file"/>
                        <div className="custom-file">
                          <img src={file} alt="file"/>
                        </div>
                      </label>
                      <span>Image 1234.png</span>
                      <div className="delete-icon">
                        <img src={deleteicon} alt="deleteicon"/>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            {/* when question is not added */}
            {questionType==='Fill in the blanks'?<div className="createquestion-formgroup">
              <h4>Add the answer here</h4>
              <div className="form-group">
                <textarea placeholder="Answer*" className="answer-text"/>
              </div>
            </div>:null}

            {questionType==='MCQ' ? <div className="createquestion-formgroup">
              <h4>Options</h4>
              <div className="radio-group">
                <label className="radio-check radio-option">
                  <input type="radio" id="question1" name="ques-add"/>
                  {/* editable field */}
                  <span>
                    <input type="text" placeholder="Please type hear"/>
                  </span>
                  <div className="option-cancel">
                    <img src={closeicon} alt="close"/>
                  </div>
                </label>
                <label className="radio-check radio-option">
                  <input type="radio" id="question2" name="ques-add"/>
                  <span>
                    <input type="text" value="Option2" />
                  </span>
                  <div className="option-cancel" data-dismiss="modal" aria-label="Close">
                    <img src={closeicon} alt="close"/>
                  </div>
                </label>
                <label className="radio-check radio-option">
                  <input type="radio" id="question3" name="ques-add"/>
                  <span>
                    <input type="text" value="Option3" />
                  </span>
                  <div className="option-cancel">
                    <img src={closeicon} alt="close"/>
                  </div>
                </label>
                <label className="radio-check radio-option">
                  <input type="radio" id="question4" name="ques-add"/>
                  <span>
                    <input type="text" value="Option4" />
                  </span>
                  <div className="option-cancel">
                    <img src={closeicon} alt="close"/>
                  </div>
                </label>
              </div>
              <button className="add-option">
                + Add Options
              </button>
              
            </div>:null}
            <div className="modal-select option-timelimit">
                <label>Set time limit to answer this question</label>
                <Select
                  classNamePrefix="limitselect"
                  className="limitselect"
                  placeholder="15 sec"
                  options={limitoptions}
                />
              </div>
            <div className="createquestion-formgroup">
              <h4>Answer Explaination <span>(Optional)</span></h4>
              <div className="form-group">
                <textarea placeholder="explaination here for correct answer" className="explation-text"/>
              </div>
            </div>
            <div className="createquestion-button">
              <button type="submit" className="btn btn-outline" onClick={()=>setOpenCreateQuestionModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Publish</button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateQuestion;