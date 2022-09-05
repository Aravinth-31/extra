import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "./customegame.css";

import Header from "../../components/header/header";
import CustomeGameHeading from "../../components/customegameheading/customegameheading";
import CustomeDesignTab from "../../components/customedesigntab/customedesigntab";
import CustomContentTab from "../../components/customcontenttab/customcontenttab";
import QuestionsTab from "../../components/questionstab/questionstab";
// import EmptyState from '../../components/questionstab/emptystate';
// image
import googlesheets from "../../assets/images/googlesheets.svg";
import mcq from "../../assets/images/mcq.svg";
import checkbox from "../../assets/images/checkbox-add.svg";
import fillblank from "../../assets/images/fillblank.svg";
//Redux
import { useDispatch } from "react-redux";
import { logOut } from "../../redux/actions/userAction";
import CreateQuestion from "../../components/modal/createquestion";

const CustomeGame = (props) => {
  const dispatch = useDispatch();
  const signOut = async () => {
    await dispatch(logOut());
    props.history.push("/");
  };
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [openCreateQuestionModal, setOpenCreateQuestionModal] = useState(false);
  const handleQuestionType = (e, value) => {
    setQuestionType(value);
    setOpenCreateQuestionModal(true);
  };

  return (
    <div>
      <Header profile {...props} signOut={signOut} />
      <div className="container conatiner-960">
        <CustomeGameHeading />
        <Tabs className="cg-tabs">
          <TabList>
            <Tab onClick={(e) => setShowAddQuestion(false)}>Custom Design</Tab>
            <Tab onClick={(e) => setShowAddQuestion(false)}>Custom Content</Tab>
            <Tab onClick={(e) => setShowAddQuestion(true)}>Questions</Tab>
            {showAddQuestion ? (
              <div className="question-dropdown">
                <div className="add-question">
                  <button
                    className="btn btn-secondry dropdownmenu"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span>+ Add Question</span>
                  </button>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <div className="google-sheets">
                      <Link className="dropdown-item">
                        <div className="addicon google-icon">
                          <img src={googlesheets} alt="google" />
                        </div>
                        CSV File
                      </Link>
                    </div>
                    <Link
                      className="dropdown-item"
                      onClick={(e) => handleQuestionType(e, "MCQ")}
                    >
                      <div className="addicon mcq-icon">
                        <img src={mcq} alt="mcq" />
                      </div>
                      MCQ
                    </Link>
                    <Link className="dropdown-item">
                      <div className="addicon check-icon">
                        <img src={checkbox} alt="check" />
                      </div>
                      Check Box
                    </Link>
                    <Link
                      className="dropdown-item"
                      onClick={(e) =>
                        handleQuestionType(e, "Fill in the blanks")
                      }
                    >
                      <div className="addicon fillblank-icon">
                        <img src={fillblank} alt="fill" />
                      </div>
                      Fill in the blanks
                    </Link>
                  </div>
                </div>
                {openCreateQuestionModal && (
                  <CreateQuestion
                    toggle={openCreateQuestionModal}
                    setOpenCreateQuestionModal={setOpenCreateQuestionModal}
                    questionType={questionType}
                    setQuestionType={setQuestionType}
                  />
                )}
              </div>
            ) : null}
          </TabList>

          <TabPanel>
            <CustomeDesignTab />
          </TabPanel>
          <TabPanel>
            <CustomContentTab />
          </TabPanel>
          <TabPanel>
            {/* use empty state for empty data */}
            {/* <EmptyState/> */}
            <QuestionsTab />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomeGame;
