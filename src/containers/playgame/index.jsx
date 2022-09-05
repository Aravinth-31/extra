import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";

import Header from "../../components/header/header";
import PlaycardLarge from "../../components/playCard/playcardlarge";
import Footer from "../../components/footer/footer";

// image
import backbtn from "../../assets/images/arrow-back.svg";
import search from "../../assets/images/search.svg";
import arrowleft from "../../assets/images/paginationarrow.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  getContactUs,
  getAllGames,
  getCurrentlyPlayingGames,
  getPreviouslyPlayedGames,
} from "../../redux/actions/homepageActions";
import { logOut } from "../../redux/actions/userAction";
import { gameAllCategory } from "../../redux/actions/gameDetailAction";
import LikeShareModal from "../../components/modal/likesharemodal";
import LoginModal from "../../components/modal/loginmodal";
import PlayCardMobileHoverCard from "../../components/playCard/playCardMobileHoverCard";
import LoadingComponent from "../../components/loader/LoadingComponent";
import { IsAdmin } from "../../helpers/helper";

const PlayGame = (props) => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openShareModal, setOpenShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [games, setGames] = useState();
  const [page, setPage] = useState(1);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openMobileHoverCard, setOpenMobileHoverCard] = useState(false);
  const [gameDetails, setGameDetails] = useState({});

  const ContactUs = useSelector((state) => state.homeContactUs);
  const { contactUs } = ContactUs;
  const SearchResults = useSelector((state) => state.homeSearch);
  const { searchResults } = SearchResults;
  const GameCategory = useSelector((state) => state.gameAllCategory);
  const { gameCategory } = GameCategory;
  const CurrentlyPlayingGames = useSelector(state => state.getCurrentlyPlayingGames);
  const { currentlyPlayingGames } = CurrentlyPlayingGames;
  const PreviouslyPlayedGames = useSelector(state => state.getPreviouslyPlayedGames);
  const { previouslyPlayedGames } = PreviouslyPlayedGames;
  const AllGames = useSelector((state) => state.allGames);
  const { allGames } = AllGames;

  var isAdmin = IsAdmin();

  const filterGames = (games) => {
    let filteredGames = games.filter(game => game.title.toUpperCase().includes(searchText.toUpperCase()));
    if (selectedCategory)
      filteredGames = filteredGames.filter(game => game.category.filter(gamecategory => gamecategory.id === selectedCategory.id).length > 0)
    return filteredGames;
  }
  useEffect(() => {
    if (props.match.params.id === "Currently Active For Me" && currentlyPlayingGames) {
      setGames(filterGames([...currentlyPlayingGames.data]));
    }
    else if (props.match.params.id === "Previously Played By Me" && previouslyPlayedGames) {
      setGames(filterGames([...previouslyPlayedGames.data]));
    }
    else if (props.match.params.id === "Search Results..." && searchResults) {
      setGames(filterGames([...searchResults.data]));
    }
    else {
      var gamesOptions = [];
      if (allGames) {
        allGames.data.forEach((game) => {
          if (game.slogan) {
            game.slogan.forEach(gameSlogan => {
              if (gameSlogan.id === props.match.params.id)
                gamesOptions.push(game);
            })
          }
        })
      }
      setGames(filterGames([...gamesOptions]));
    }
    const page = new URLSearchParams(props.location.search).get('page');
    if (page > 1)
      setPage(parseInt(page));
    else
      setPage(1);
  }, [allGames, currentlyPlayingGames, previouslyPlayedGames, searchResults, selectedCategory, searchText]);
  //to show loader
  useEffect(() => {
    if (
      (ContactUs && ContactUs.loading) ||
      (GameCategory && GameCategory.loading) ||
      (CurrentlyPlayingGames && CurrentlyPlayingGames.loading) ||
      (PreviouslyPlayedGames && PreviouslyPlayedGames.loading) ||
      (AllGames && AllGames.loading) ||
      (SearchResults && SearchResults.loading)
    ) {
      setLoaded(false);
    }
    else
      setLoaded(true);
  }, [ContactUs, GameCategory, CurrentlyPlayingGames, PreviouslyPlayedGames, AllGames, SearchResults])

  useEffect(() => {
    dispatch(gameAllCategory());
    dispatch(getAllGames());
    dispatch(getContactUs());
    dispatch(getCurrentlyPlayingGames());
    dispatch(getPreviouslyPlayedGames());
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    var options = [];
    if (gameCategory && gameCategory.data) {
      gameCategory.data.forEach((category) => {
        options.push({ value: category.title, label: category.title, id: category.id });
      });
      setCategories(options);
    }
  }, [gameCategory]);

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };
  const signOut = async () => {
    await dispatch(logOut());
    props.history.push("/");
  };
  const handleSelect = (e, valueData) => {
    setSelectedCategory(valueData);
  };

  const changePage = (newPage, isLoadingTime) => {
    setLoaded(false);
    setTimeout(() => setLoaded(true), 500);
    if (!isLoadingTime && props.match && props.match.params)
      props.history.push('/play-game/' + props.match.params.id + "?page=" + newPage);
    setPage(newPage);
  }

  return (
    <div>
      <Header {...props} profile signOut={signOut} />
      <main className="container c-container ">
        <div className="playgame-heading">
          <div className="playgame-backbtn">
            <img
              src={backbtn}
              alt="back"
              onClick={() => {
                props.history.push("/");
              }}
            />
            <h5>
              {props.match.params.title}
              <span> {props.match.params.titleHighlight}</span>
            </h5>
          </div>
          <div className="profile-section">
            {openShareModal && (
              <LikeShareModal
                toggle={openShareModal}
                setOpenShareModal={setOpenShareModal}
                shareLink={shareLink}
              />
            )}
            {openLoginModal && (
              <LoginModal
                modalid="loginmodal"
                toggle={openLoginModal}
                setOpenLoginModal={setOpenLoginModal}
              />
            )}
            <div className="categoryDropdown">
              <button
                className="btn btn-secondry dropdownmenu"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span>{selectedCategory ? selectedCategory.value : "Choose Category"}</span>
                <div className="dropdown-arrow">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path
                      d="M1 1.5L4 4.5L7 1.5"
                      stroke="#23282E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                {categories
                  ? categories.map((game) => {
                    return (
                      <Link
                        to={"#"}
                        key={JSON.stringify(game)}
                        className="dropdown-item"
                        onClick={(e) => handleSelect(e, game)}
                      >
                        {game.label}
                      </Link>
                    );
                  })
                  : null}
              </div>
            </div>


            {props.match.params.title + " " + props.match.params.titleHighlight !== "Search Results..." && <div className="input-icon">
              <img src={search} alt="search" />
              <input
                type="text"
                name="search"
                placeholder="Search a game"
                onChange={handleChange}
              />
            </div>}
          </div>
        </div>
        <LoadingComponent loaded={loaded} >
          {selectedCategory && <><h2>{selectedCategory.value}</h2><br /></>}
          <div className="playcard-wrapper">
            {
              games && games.length > 0 ?
                games.map((game, index) => {
                  if (index >= (page - 1) * 12 && index < page * 12) {
                    return (
                      <PlaycardLarge
                        srcImage={game.coverMedia}
                        key={JSON.stringify(game)}
                        title={game.title}
                        gameDetail={game}
                        setOpenShareModal={setOpenShareModal}
                        setShareLink={setShareLink}
                        setOpenLoginModal={setOpenLoginModal}
                        setGameDetails={setGameDetails}
                        setOpenMobileHoverCard={setOpenMobileHoverCard}
                      />
                    )
                  }
                })
                : <div className="show-all no-data">
                  <h4> The game you are searching for is currently not available.</h4>
                </div>
            }
          </div>
          {
            games && games.length > 0 &&
            <div className="pagination-wrapper">
              <button
                className={page > 1 ? "pagination-left enable" : "pagination-left"}
                onClick={() => {
                  if (page > 1) changePage(page - 1);
                  window.scrollTo(0, 0);
                }}
              >
                <img src={arrowleft} alt="arrow left" />
              </button>
              <div className="pagination-number">
                <h5>{page}</h5>
                <span>
                  of {games ? Math.ceil(games.length / 12) : 1}{" "}pages
                </span>
              </div>
              <button
                className={(page < Math.ceil(games.length / 12)) ? "pagination-right enable" : "pagination-right"}
                onClick={() => {
                  if (page < Math.ceil(games.length / 12)) changePage(page + 1);
                }}
              >
                <img src={arrowleft} alt="arrow right" />
              </button>
            </div>
          }
        </LoadingComponent>
      </main>
      {
        openMobileHoverCard &&
        <PlayCardMobileHoverCard
          setOpenShareModal={setOpenShareModal}
          gameDetail={gameDetails}
          setOpenMobileHoverCard={setOpenMobileHoverCard}
          setShareLink={setShareLink}
        />
      }
      {contactUs ? <Footer {...props} isAdmin={isAdmin} contactUs={contactUs.data} /> : ""}
    </div>
  );
};

export default PlayGame;
