import React, { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  gameAllCategory,
  selectedGamesId,
} from "../../redux/actions/gameDetailAction";
import {
  getGamesByCategory,
  getAllGames,
  homeSearch
} from "../../redux/actions/homepageActions";

import "./premiumplancard.css";
// image
import quizImg from "../../assets/images/category/quiz.svg";
import arrow from "../../assets/images/arrow-right-red.svg";
import arrowback from "../../assets/images/arrow-left.svg";
import search from "../../assets/images/search.svg";
import PaymentModal from "../modal/paymentmodal";

const PlanCard = (props) => {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const { gameCategory } = useSelector((state) => state.gameAllCategory);
  const { gamesByCategory } = useSelector((state) => state.gamesByCategory);
  const [searchText, setSearchText] = useState("");
  const AllGames = useSelector((state) => state.allGames);
  const { allGames } = AllGames;
  const [selectedGames, setSelectedGames] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const SearchResults = useSelector((state) => state.homeSearch);
  const { searchResults } = SearchResults;
  const handleClick = () => {
    setOpenPaymentModal(true);

    dispatch(selectedGamesId(selectedId));
  };
  useEffect(() => {
    dispatch(gameAllCategory());
    dispatch(getAllGames());
  }, []);

  const handleChangeSearch = (e) => {
    const { value } = e.target;
    setSearchText(value);
    dispatch(homeSearch(value));
  };
  const handleClear = () => {
    setSelectedId([]);
    setSelectedGames([]);
  };

  const handleGameSelect = (e, value) => {
    let options = [...selectedId];
    let gamesOptions = [...selectedGames];

    if (props.selectedPlanDetails && !selectedId.includes(value.id)) {
      if (
        (props.selectedPlanDetails.data.validityPeriod === 3 &&
          selectedId.length === 10) ||
        (props.selectedPlanDetails.data.validityPeriod === 6 &&
          selectedId.length === 30)
      ) {
        return;
      }
    }

    // //selected games
    if (!gamesOptions.some((game) => game.id === value.id)) {
      gamesOptions.push(value);
    } else {
      gamesOptions = gamesOptions.filter((game) => game.id !== value.id);
    }
    setSelectedGames(gamesOptions);

    //selected games id
    if (!options.includes(value.id)) {
      options.push(value.id);
    } else {
      options = options.filter((option) => option !== value.id);
    }
    setSelectedId(options);
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const handleBackClick = () => {
    history.push("/plans");
  };
  const handleCategorySelect = (e, value) => {
    setSelectedCategory(value);
    dispatch(getGamesByCategory(value));
  };
  useEffect(() => {
    if (gameCategory && gameCategory.data[0]) {
      setSelectedCategory(gameCategory.data[0].title);
      dispatch(getGamesByCategory(gameCategory.data[0].title));
    }
  }, [gameCategory]);
  useEffect(() => {
    if (
      props.selectedPlanDetails &&
      props.selectedPlanDetails.data.validityPeriod === 12
    ) {
      let options = [];
      let gamesOptions = [];
      allGames &&
        allGames.data.forEach((game) => {
          options.push(game.id);
          gamesOptions.push(game);
        });
      setSelectedId(options);
      setSelectedGames(gamesOptions);
    } else {
      setSelectedId([]);
      setSelectedGames([]);
    }
  }, [allGames]);

  return (
    <div className="plans-wrapper premium-wrapper">
      <div className="plans-heading">
        <div className="premium-plan">
          <div className="back-arrow">
            <img src={arrowback} alt="back" onClick={handleBackClick} />
          </div>
          <div className="premium-desc">
            <h5>
              {props.selectedPlanDetails &&
                props.selectedPlanDetails.data.title}{" "}
              Plan for{" "}
              {props.selectedPlanDetails &&
                props.selectedPlanDetails.data.validityPeriod}{" "}
              months
            </h5>
            <span>Add games to your plan</span>
          </div>
        </div>
      </div>
      <div className="premium-card">
        <div className="premium-category">
          <h5>Categories</h5>
          <div className="premium-overlay-wrapper">
            {/* premium category card */}

            {gameCategory &&
              gameCategory.data.map((category) => {
                return (
                  <div
                    className={`premium-category-card ${selectedCategory === category.title ? "active" : ""
                      }`}
                    onClick={(e) => handleCategorySelect(e, category.title)}
                  >
                    <div className="category-img">
                      <img src={quizImg} alt="quiz" />
                    </div>
                    <div className="category-desc">
                      <div className="category-left">
                        <h4>{category.title}</h4>
                        <sapn>{category.gameCount}</sapn>
                      </div>
                      <div className="category-right">
                        <div className="category-count">
                          {selectedGames &&
                            selectedGames.filter(
                              (game) => game.category.id === category.id
                            ).length}
                        </div>
                        <img src={arrow} alt="arrow" />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="premium-available-game">
          <h5>Available Games</h5>
          <div className="premium-search">
            <div className="searchbox">
              <img src={search} alt="search" />
              <input
                type="text"
                placeholder="Search by Games"
                onChange={handleChangeSearch}
              />
            </div>
            <div className="select-count-text">
              Selected:{" "}
              {props.selectedPlanDetails &&
                props.selectedPlanDetails.data.validityPeriod !== 12 ? (
                <>
                  {" "}
                  <b>{selectedId.length}</b>/
                  {props.selectedPlanDetails.data.validityPeriod === 3
                    ? "10"
                    : props.selectedPlanDetails.data.validityPeriod === 6
                      ? "30"
                      : ""}
                </>
              ) : (
                "All"
              )}
            </div>
          </div>
          {/* game card */}
          <div className="premium-available-overlay">
            {/* premium category card  use checked in iput type="checkbox on hover or click"*/}
            {searchText.length === 0 ? (
              <>
                {gamesByCategory &&
                  gamesByCategory.data.map((game) => {
                    return (
                      <div className="premium-checkbox">
                        <label>
                          <input
                            type="checkbox"
                            onChange={(e) => handleGameSelect(e, game)}
                            checked={
                              props.selectedPlanDetails &&
                                props.selectedPlanDetails.data.validityPeriod !==
                                12
                                ? selectedId.includes(game.id)
                                : true
                            }
                            disabled={
                              props.selectedPlanDetails &&
                                props.selectedPlanDetails.data.validityPeriod !==
                                12
                                ? false
                                : true
                            }
                          />
                          <div className="premium-category-card">
                            <div className="category-img round">
                              <img src={game.coverMedia[0]} alt="quiz" />
                            </div>
                            <div className="category-desc">
                              <div className="category-left">
                                <h4>{game.title}</h4>
                                <sapn>3,124 plays</sapn>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    );
                  })}{" "}
              </>
            ) : (
              <>
                {searchResults &&
                  searchResults.data
                    .filter((gameData) =>
                      gameData.title
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                        ? gameData
                        : ""
                    )
                    .map((game) => {
                      return (
                        <div className="premium-checkbox">
                          <label>
                            <input
                              type="checkbox"
                              onChange={(e) => handleGameSelect(e, game)}
                              checked={
                                props.selectedPlanDetails &&
                                  props.selectedPlanDetails.data
                                    .validityPeriod !== 12
                                  ? selectedId.includes(game.id)
                                  : true
                              }
                              disabled={
                                props.selectedPlanDetails &&
                                  props.selectedPlanDetails.data
                                    .validityPeriod !== 12
                                  ? false
                                  : true
                              }
                            />
                            <div className="premium-category-card">
                              <div className="category-img round">
                                <img src={game.coverMedia[0]} alt="quiz" />
                              </div>
                              <div className="category-desc">
                                <div className="category-left">
                                  <h4>{game.title}</h4>
                                  <sapn>3,124 plays</sapn>
                                </div>
                              </div>
                            </div>
                          </label>
                        </div>
                      );
                    })}{" "}
              </>
            )}
          </div>
          <div className="available-button">

            <button
              type="submit"
              className="btn btn-outline"
              onClick={handleClear}
              disabled={props.selectedPlanDetails &&
                props.selectedPlanDetails.data.validityPeriod === 12}
            >
              Clear All
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#payment"
              onClick={handleClick}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      {openPaymentModal ? (
        <PaymentModal
          modalid="payment"
          setOpenPaymentModal={setOpenPaymentModal}
        />
      ) : null}
    </div>
  );
};

export default PlanCard;
