import React, { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";

import "./modal.css";
import Modal from "./modal";

import { addFeedback } from "../../redux/actions/gameDetailAction";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { encryptData, S3_BASE_URL } from "../../helpers/helper";
import LoadingComponent from "../loader/LoadingComponent";

const Feedbackmodal = ({
  modalid,
  toggle,
  setOpenFeedbackModal,
  setFinalRating,
  setOpenThankyouModal,
  gameDetail,
  sessionId
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [rating, setRating] = useState(0);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [review, setReview] = useState("");
  const [comments, setComments] = useState([]);
  const [loaded, setLoaded] = useState(true);

  const AddFeedback = useSelector(state => state.addFeedback);
  // const [commentsGoodRating, setCommentsGoodRating] = useState([
  //   "Great graphics",
  //   "Entertaining"
  // ]);
  // const [commentsAverageRating, setCommentsAverageRating] = useState([
  //   "Upgrade graphics",
  //   "Repair bugs",
  //   "Optimize graphics"
  // ]);
  // const [commentsBadRating, setCommentsBadRating] = useState([
  //   "Poor graphics",
  //   "Bad music",
  //   "Boredom"
  // ]);
  const commentsSuggestions = ["Structure", "Experience", "Fun Play", "Content"];

  useEffect(() => {
    const elements = document.getElementsByClassName("star");
    if (elements) {
      for (var i = 0; i < elements.length; i++) {
        if (elements[i]) {
          elements[i].style.cursor = "pointer";
          const val = i;
          elements[i].addEventListener("click", () => {
            setRating((val % 5) + 1);
            setDisableSubmit(false);
            // setComments(["Content", "Experience"]);
            // if ((val % 5) + 1 === 4 || (val % 5) + 1 === 5) {
            //   setComments([...commentsGoodRating]);
            // } else if ((val % 5) + 1 === 2 || (val % 5) + 1 === 3) {
            //   setComments([...commentsAverageRating]);
            // } else {
            //   setComments([...commentsBadRating]);
            // }
          });
        }
      }
    }
  }, []);
  const handleSubmit = async () => {
    setFinalRating(rating);
    var resStatus = await dispatch(
      addFeedback(gameDetail && gameDetail.id, rating, comments, review)
    );
    if (resStatus === 200) {
      setOpenThankyouModal(true);
      setOpenFeedbackModal(false);
    }
  };
  const handleChange = (e) => {
    setReview(e.target.value);
  };
  const handleCommentSelect = (e, value) => {
    let commentsData = [...comments];
    if (commentsData.includes(value)) {
      commentsData = commentsData.filter((comment) => comment !== value);
    } else {
      commentsData.push(value);
    }
    setComments(commentsData);
  };

  useEffect(() => {
    if (AddFeedback && AddFeedback.loading) {
      setLoaded(false);
    }
    else {
      setLoaded(true);
    }
  }, [AddFeedback])

  return (
    <Modal modalid={modalid} toggle={toggle}>
      <div className={`modal-body ${loaded ? "" : "loading"}`}>
        <LoadingComponent loaded={loaded} />
        <div className="close-icon" data-dismiss="modal" aria-label="Close" onClick={() => {
          sessionStorage.setItem("gameReportId", encryptData(gameDetail.id));
          history.push(`/game-reports/${sessionId}`);
          setOpenFeedbackModal(false);
        }}>
          <div
            className="close-btn-icon"
          ></div>
        </div>
        <div className="feedback-modal">
          <div className="feedback-modal-top">
            <div className="feedback-img">
              <img src={gameDetail && gameDetail.coverMedia[0] && gameDetail.coverMedia[0].includes('https://youtu.be') ? gameDetail && S3_BASE_URL + gameDetail.coverMedia[1] : gameDetail && S3_BASE_URL + gameDetail.coverMedia[0]} alt="escape" />
            </div>
            <div className="feedback-desc">
              <h5>{gameDetail && gameDetail.title}</h5>
            </div>
          </div>
          <div className="feedback-modal-rating">
            <div className="feebback-rating">
              <h5>How would you rate the game?</h5>
              <StarRatings
                rating={rating}
                starRatedColor="#FED10C"
                numberOfStars={5}
                name="rating"
              />
            </div>
            {/* when user give the rating, remove hide class */}
            <div className={rating > 0 ? "afterrating-value" : "afterrating-value hide"} id="alternate-value">
              {/* according to rating parameter , change rating content below */}
              <div className="feebback-rating">
                <h5>What did you {rating < 3 ? "not" : ""} like about this game?</h5>
                <div className="like-option">
                  {
                    commentsSuggestions.map((comment) => {
                      return (
                        <label>
                          <input
                            type="checkbox"
                            value={comment}
                            onChange={(e) => {
                              handleCommentSelect(e, comment);
                            }}
                            checked={
                              comments.includes(comment) ? true : false
                            }
                          />
                          <span>{comment} </span>
                        </label>
                      )
                    })
                  }
                  {/* <label>
                    <input
                      type="checkbox"
                      value="Content"
                      onChange={(e) => {
                        handleCommentSelect(e, "Content");
                      }}
                      checked={
                        comments.includes("Content") ? true : false
                      }
                    />
                    <span>Content </span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Structure"
                      onChange={(e) => {
                        handleCommentSelect(e, "Structure");
                      }}
                      checked={
                        comments.includes("Structure") ? true : false
                      }
                    />
                    <span>Structure</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Experience"
                      onChange={(e) => {
                        handleCommentSelect(e, "Experience");
                      }}
                      checked={comments.includes("Experience") ? true : false}
                    />
                    <span>Experience</span>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Fun Play"
                      onChange={(e) => {
                        handleCommentSelect(e, "Fun Play");
                      }}
                      checked={
                        comments.includes("Fun Play") ? true : false
                      }
                    />
                    <span>Fun Play</span>
                  </label> */}
                </div>
                {/* {(rating === 4 || rating === 5) && (
                  <div className="like-option">
                    <label>
                      <input
                        type="checkbox"
                        value="Great graphics"
                        onChange={(e) => {
                          handleCommentSelect(e, "Great graphics");
                        }}
                        checked={
                          comments.includes("Great graphics") ? true : false
                        }
                      />
                      <span>Great graphics </span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Good sound effects"
                        onChange={(e) => {
                          handleCommentSelect(e, "Good sound effects");
                        }}
                        checked={
                          comments.includes("Good sound effects") ? true : false
                        }
                      />
                      <span>Good sound effects</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Fun"
                        onChange={(e) => {
                          handleCommentSelect(e, "Fun");
                        }}
                        checked={comments.includes("Fun") ? true : false}
                      />
                      <span>Fun</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Interesting"
                        onChange={(e) => {
                          handleCommentSelect(e, "Interesting");
                        }}
                        checked={
                          comments.includes("Interesting") ? true : false
                        }
                      />
                      <span>Interesting</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Stressbuster"
                        onChange={(e) => {
                          handleCommentSelect(e, "Stressbuster");
                        }}
                        checked={
                          comments.includes("Stressbuster") ? true : false
                        }
                      />
                      <span>Stressbuster</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Entertaining"
                        onChange={(e) => {
                          handleCommentSelect(e, "Entertaining");
                        }}
                        checked={
                          comments.includes("Entertaining") ? true : false
                        }
                      />
                      <span>Entertaining</span>
                    </label>
                  </div>
                )}
                {(rating === 2 || rating === 3) && (
                  <div className="like-option">
                    <label>
                      <input
                        type="checkbox"
                        value="Optimize graphics"
                        onChange={(e) => {
                          handleCommentSelect(e, "Optimize graphics");
                        }}
                        checked={
                          comments.includes("Optimize graphics") ? true : false
                        }
                      />
                      <span>Optimize graphics </span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Improve gameplay"
                        onChange={(e) => {
                          handleCommentSelect(e, "Improve gameplay");
                        }}
                        checked={
                          comments.includes("Improve gameplay") ? true : false
                        }
                      />
                      <span> Improve gameplay </span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Upgrade graphics"
                        onChange={(e) => {
                          handleCommentSelect(e, "Upgrade graphics");
                        }}
                        checked={
                          comments.includes("Upgrade graphics") ? true : false
                        }
                      />
                      <span>Upgrade graphics</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Repair bugs"
                        onChange={(e) => {
                          handleCommentSelect(e, "Repair bugs");
                        }}
                        checked={
                          comments.includes("Repair bugs") ? true : false
                        }
                      />
                      <span>Repair bugs</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="More engaging"
                        onChange={(e) => {
                          handleCommentSelect(e, "More engaging");
                        }}
                        checked={
                          comments.includes("More engaging") ? true : false
                        }
                      />
                      <span>More engaging</span>
                    </label>
                  </div>
                )}
                {rating === 1 && (
                  <div className="like-option">
                    <label>
                      <input
                        type="checkbox"
                        value="Poor graphics"
                        onChange={(e) => {
                          handleCommentSelect(e, "Poor graphics");
                        }}
                        checked={
                          comments.includes("Poor graphics") ? true : false
                        }
                      />
                      <span>Poor graphics</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Poor sound effects"
                        onChange={(e) => {
                          handleCommentSelect(e, "Poor sound effects");
                        }}
                        checked={
                          comments.includes("Poor sound effects") ? true : false
                        }
                      />
                      <span>Poor sound effects</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Lagging"
                        onChange={(e) => {
                          handleCommentSelect(e, "Lagging");
                        }}
                        checked={comments.includes("Lagging") ? true : false}
                      />
                      <span>Lagging</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Extremely slow"
                        onChange={(e) => {
                          handleCommentSelect(e, "Extremely slow");
                        }}
                        checked={
                          comments.includes("Extremely slow") ? true : false
                        }
                      />
                      <span>Extremely slow</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Bad music"
                        onChange={(e) => {
                          handleCommentSelect(e, "Bad music");
                        }}
                        checked={comments.includes("Bad music") ? true : false}
                      />
                      <span>Bad music</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Boredom"
                        onChange={(e) => {
                          handleCommentSelect(e, "Boredom");
                        }}
                        checked={comments.includes("Boredom") ? true : false}
                      />
                      <span>Boredom</span>
                    </label>
                  </div>
                )} */}
              </div>
              <div className="feebback-rating">
                <h5>
                  Share your comments, if any <span>(Optional)</span>
                </h5>
                <div className="form-group">
                  <textarea
                    placeholder="Write your suggestions for improvements"
                    name="review"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            id="submit"
            onClick={handleSubmit}
            className={`btn btn-primary ${disableSubmit ? "disabled" : ""}`}
            disabled={disableSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default Feedbackmodal;
