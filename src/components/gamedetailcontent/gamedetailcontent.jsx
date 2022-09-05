import React from "react";

import "./gamedetailcontent.css";

import ReactTextMoreLess from 'react-text-more-less';
import { useState } from "react";
import { S3_BASE_URL } from "../../helpers/helper";

const GameDetailContent = (gameDetail) => {
  const isAdmin = false;
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="g-detail-content">
      <div className="g-detail-card">
        <h4>About the Game</h4>
        {!isAdmin ? (
          <ReactTextMoreLess
            collapsed={collapsed}
            text={gameDetail && gameDetail.gameDetail && gameDetail.gameDetail.data
              ? gameDetail.gameDetail.data.description
              : ""}
            lessHeight={72}
            className={"about-game"}
            showMoreText="... +Show More"
            showMoreElement={
              <span>
                ... <span className="show-more-text">+Show More</span>
              </span>
            }
            showLessElement={<span className="show-more-text"> -Show Less</span>}
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          />
        ) : (
          <>
            <div className="form-group">
              <textarea
                style={{
                  resize: "horizontal",
                  width: "960px",
                  minHeight: "150px",
                  maxWidth: "100%",
                }}
                type="address"
                className="form-control"
                id="address"
                name="address"
                rows="10"
                cols="20"
                maxlength={200}
                placeholder="Enter Address"
                value={"About the game"}
              />
              <div className="btn-group">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ float: "right", position: "relative" }}
                >
                  Save
                </button>
              </div>
            </div>
            <hr className="seperator" />
          </>
        )}
      </div>
      <div className="g-detail-card">
        <h4>Game Features</h4>
        {!isAdmin ? (
          <ul className="list-icon list-arrow">
            {/* The Split function is used to split te features based on semicolon(.) as planned */}
            {gameDetail && gameDetail.gameDetail && gameDetail.gameDetail.data
              ? gameDetail.gameDetail.data.features
                .split("*")
                .map((feature) => {
                  if (feature !== "")
                    return <li key={JSON.stringify(feature)}>{feature}</li>;
                  return null;
                })
              : ""}
          </ul>
        ) : (
          <>
            <div className="form-group">
              <textarea
                style={{
                  resize: "horizontal",
                  width: "960px",
                  minHeight: "150px",
                  maxWidth: "100%",
                }}
                type="address"
                className="form-control"
                id="address"
                name="address"
                rows="10"
                cols="20"
                maxlength={200}
                placeholder="Enter Address"
                value={"Game Features"}
              />
              <div className="btn-group">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ float: "right" }}
                >
                  Save
                </button>
              </div>
            </div>
            <hr className="seperator" />
          </>
        )}
      </div>
      {/* <div className="g-detail-card objective">
        <h4>Game Objectives</h4>
        {!isAdmin ? (
          <ul className="list-icon list-check">
            
            {gameDetail && gameDetail.gameDetail && gameDetail.gameDetail.data && gameDetail.gameDetail.data.objectives
              ? gameDetail.gameDetail.data.objectives
                  .map((objective) => {
                    
                    if(objective!=="")
                    return <li key={JSON.stringify(objective)}>{objective.title}</li>;
                  })
              : ""}
          </ul>
        ) : (
          <>
            <div className="form-group">
              <textarea
                style={{
                  resize: "horizontal",
                  width: "960px",
                  minHeight: "150px",
                  maxWidth: "100%",
                }}
                type="address"
                className="form-control"
                id="address"
                name="address"
                rows="10"
                cols="20"
                maxlength={200}
                placeholder="Enter Address"
                value={"Game Objectives "}
              />
              <div className="btn-group">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ float: "right" }}
                >
                  Save
                </button>
              </div>
            </div>
            <hr className="seperator" />
          </>
        )}
      </div> */}
      {
        gameDetail && gameDetail.gameDetail && gameDetail.gameDetail.data
        && gameDetail.gameDetail.data.playedOrganization && gameDetail.gameDetail.data.playedOrganization.length > 0 &&
        <div className="g-detail-card">
          <h4>Played by Other Organisations</h4>
          <div className="org-wrapper">

            {gameDetail && gameDetail.gameDetail
              ? gameDetail.gameDetail.data.playedOrganization.map((orgImage) => {
                return (
                  <div className="org-card">
                    <div className="org-detail">
                      <div className="org-img">
                        <img src={S3_BASE_URL + orgImage} alt="OrgImage" />
                      </div>
                    </div>
                  </div>
                );
              })
              : null}

            {/* <div className="org-desc">
                <h5>Infosys Limited</h5>
                <span>February 26, 2021</span>
              </div> */}

            {/* <div className="org-trophy">
              <img src={trophy} alt="trophy" />
              <span>560</span>
            </div> */}

            {/* <div className="org-card">
            <div className="org-detail">
              <div className="org-img">
                <img src={tata} alt="org name" />
              </div>
              <div className="org-desc">
                <h5>Tata Consultancy Services</h5>
                <span>February 15, 2021</span>
              </div>
            </div>
            <div className="org-desc">
              <h5>Tata Consultancy Services</h5>
            </div>
          </div> */}
          </div>
        </div>
      }
    </div>
  );
};

export default GameDetailContent;
