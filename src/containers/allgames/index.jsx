import React, { useEffect, useState } from "react";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import search from "../../assets/images/search.svg";
import "./allgames.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllGames,
  getContactUs,
  homeSearch,
  updateGame,
} from "../../redux/actions/homepageActions";
import { logOut } from "../../redux/actions/userAction";
import PageLayout from "../../components/pagelayout/pagelayout";
import sidebarContentAdmin from "../../helpers/sidebarContentAdmin";
import useDebouncedSearch from "../../helpers/debounce";
import LoadingComponent from "../../components/loader/LoadingComponent";
import { failureAlert, IsAdmin, successAlert } from "../../helpers/helper";
import Playcardlarge from "../../components/playCard/playcardlarge";
import arrowleft from "../../assets/images/paginationarrow.svg";
import PlayCardMobileHoverCard from "../../components/playCard/playCardMobileHoverCard";
import { Link } from "react-router-dom";
import ConfirmModal from "../../components/modal/confirmModal";
import { ToastContainer } from "react-toastify";


function AllGamesData(props) {
  const useSearch = () => useDebouncedSearch(text => searchGames(text));
  const searchGames = (text) => {
    dispatch(homeSearch(text));
  }
  const { searchText, setSearchText, results } = useSearch();

  const dispatch = useDispatch();
  var isAdmin = IsAdmin();
  const [loaded, setloaded] = useState(true);
  const [page, setPage] = useState(1);
  const [gameDetails, setGameDetails] = useState({});
  const [openMobileHoverCard, setOpenMobileHoverCard] = useState(false);
  const [gamesList, setGamesList] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletGameData, setDeleteGameData] = useState("");

  const SearchResults = useSelector((state) => state.homeSearch);
  const { searchResults } = SearchResults;
  const ContactUs = useSelector((state) => state.homeContactUs);
  const { contactUs } = ContactUs
  const AllGames = useSelector(state => state.allGames);
  const { allGames } = AllGames;
  const UpdateGame = useSelector(state => state.updateGame);

  useEffect(() => {
    // dispatch(getAllGames(false, "", false, 1));
    dispatch(getContactUs());
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    dispatch(getAllGames(false, "", false, page));
  }, [page])
  useEffect(() => {
    if (
      (SearchResults && SearchResults.loading) ||
      (ContactUs && ContactUs.loading) ||
      (results && results.loading) ||
      (AllGames && AllGames.loading) ||
      (UpdateGame && UpdateGame.loading)
    ) {
      setloaded(false);
    }
    else
      setloaded(true)
  }, [SearchResults, ContactUs, results, AllGames, UpdateGame])
  useEffect(() => {
    if (searchText.length > 0 && searchResults && searchResults.data) {
      setGamesList(searchResults.data);
    }
    else if (allGames && allGames.data) {
      const games = allGames.data.sort((a, b) => {
        if (new Date(a.createdAt) < new Date(b.createdAt))
          return 1;
        else if (new Date(a.createdAt) > new Date(b.createdAt))
          return -1;
        else
          return 0;
      })
      setGamesList(games);
    }
  }, [allGames, searchResults])
  const handleChange = (e) => {
    setSearchText(e.target.value);
    changePage(1);
    // if (e.target.value.length === 0)
    //   dispatch(homeSearch(""));
  };
  useEffect(() => {
    if (props.location && props.location.search) {
      const page = new URLSearchParams(props.location.search).get('page');
      if (page > 1)
        setPage(parseInt(page));
    }
  }, [props.location]);

  const changePage = (newPage) => {
    // setloaded(false)
    // setTimeout(() => setloaded(true), 1000);
    props.history.push("/all-games?page=" + newPage);
    setPage(newPage);
  }
  const handleDelete = (game) => {
    setDeleteGameData(game);
    setOpenDeleteModal(true);
  }
  const handleConfirmDelete = async () => {
    const objectives = deletGameData.objectives.map(objective => ({ id: objective.id }));
    const categories = deletGameData.category.map(category => ({ id: category.id }));
    const gameData = { objectives, category: categories, isDisabled: true }
    const response = await dispatch(updateGame(deletGameData.id, { games: [gameData] }));
    if (response === 200) {
      dispatch(getAllGames(false, "", false, page));
      successAlert("Game Deleted Successfully")
      setSearchText("");
    }
    else {
      failureAlert("Something went wrong");
    }
    setOpenDeleteModal(false);
  }
  return (
    <div>
      <div className="allgames-container">
        {
          openDeleteModal &&
          <ConfirmModal modalid="confirm-modal" toggle={openDeleteModal} setOpenConfirmModal={setOpenDeleteModal} title="Delete Game" question="Are you sure to delete this game?" confirmFunction={handleConfirmDelete} />
        }
        <ToastContainer position="bottom-center" />
        <div className="all-games">
          <h4 className="title">All Games</h4>
          <div className="top">
            <div className="input-icon">
              <img src={search} alt="search" />
              <input
                type="text"
                name="search"
                value={searchText}
                onChange={handleChange}
                placeholder="Search by Game Name"
              />
            </div>
            <Link to={"/all-games/game"}>
              <button className="btn btn-primary">Add New Game</button>
            </Link>
          </div>
          <LoadingComponent loaded={loaded} >
            <div className="playcard-wrapper">
              {
                gamesList.length > 0 ? (
                  gamesList.map((game, index) => {
                    return (
                      <Playcardlarge
                        key={JSON.stringify(game)}
                        srcImage={game.coverMedia}
                        title={game.title}
                        gameDetail={game}
                        setGameDetails={setGameDetails}
                        setOpenMobileHoverCard={setOpenMobileHoverCard}
                        handleDelete={handleDelete}
                      />
                    );
                  })
                ) : (
                  <div className="no-game-wrapper">
                    <div>
                      <h3 className="no-game">
                        {
                          searchText.length === 0 ?
                            "Currently, there are no games."
                            : "Currently, there are no games with this name."
                        }
                      </h3>
                      <span className="no-game-span" onClick={() => props.history.push("/")}>
                        Go to Homepage
                      </span>
                    </div>
                  </div>
                )
              }
            </div>
            {
              gamesList.length > 0 &&
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
                    of {allGames?.paginationData?.totalEntries ? Math.ceil(allGames?.paginationData?.totalEntries / 12) : 1}{" "}
                    pages
                  </span>
                </div>
                <button
                  className={(page < Math.ceil(allGames?.paginationData?.totalEntries / 12)) ? "pagination-right enable" : "pagination-right"}
                  onClick={() => {
                    if (page < Math.ceil(allGames?.paginationData?.totalEntries / 12)) changePage(page + 1);
                  }}
                >
                  <img src={arrowleft} alt="arrow right" />
                </button>
              </div>
            }
          </LoadingComponent>
        </div>
        {
          openMobileHoverCard &&
          <PlayCardMobileHoverCard
            gameDetail={gameDetails}
            setOpenMobileHoverCard={setOpenMobileHoverCard}
          />
        }
      </div>
      {contactUs && !isAdmin ? <Footer {...props} isAdmin={isAdmin} contactUs={contactUs.data} /> : ""}
    </div>
  );
}

const AllGames = (props) => {
  const isAdmin = IsAdmin();
  const dispatch = useDispatch();
  const signOut = async () => {
    await dispatch(logOut());
    if (isAdmin) props.history.push("/admin");
    else props.history.push("/");
  };
  if (isAdmin)
    return (
      <div className='admin-homepage'>

        <PageLayout
          sidebartitle=""
          active={"Games"}
          category
          sideBarContents={sidebarContentAdmin}
          profile
          {...props}
          signOut={signOut}
          {...props}
          isAdmin={isAdmin}
        >
          <AllGamesData {...props} />
        </PageLayout>
      </div>
    )
  else
    return (
      <>
        <Header profile {...props} signOut={signOut} {...props} isAdmin={isAdmin} />
        <AllGamesData {...props} />
      </>
    )
}

export default AllGames;
