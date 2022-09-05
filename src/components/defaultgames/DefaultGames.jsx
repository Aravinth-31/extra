import React, { useEffect, useState } from 'react';
import Playcardlarge from '../../components/playCard/playcardlarge';
// image
import search from '../../assets/images/search.svg';
import arrowleft from '../../assets/images/paginationarrow.svg';
import { useDispatch, useSelector } from 'react-redux';
import LoginModal from '../../components/modal/loginmodal';
import LikeShareModal from '../../components/modal/likesharemodal';
import { getAllGames } from '../../redux/actions/homepageActions';
import useDebouncedSearch from '../../helpers/debounce';
import PlayCardMobileHoverCard from "../../components/playCard/playCardMobileHoverCard";
import LoadingComponent from '../loader/LoadingComponent';

const DefaultGames = (props) => {
    const useSearch = () => useDebouncedSearch(text => searchGames(text));
    const searchGames = async (text) => {
        await dispatch(getAllGames(true, text, false, 1));
        setPage(1);
    }
    const { searchText, setSearchText, results } = useSearch();
    const dispatch = useDispatch();
    const [openShareModal, setOpenShareModal] = useState(false);
    const [shareLink, setShareLink] = useState("");
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [page, setPage] = useState(1);
    const [loaded, setLoaded] = useState(false);
    const [openMobileHoverCard, setOpenMobileHoverCard] = useState(false);
    const [gameDetails, setGameDetails] = useState({});

    const DefaultGames = useSelector(state => state.allGames);
    const { allGames } = DefaultGames;
    useEffect(() => {
        //pass isDefault true to get default games
        dispatch(getAllGames(true, searchText, false, page));
    }, [page]);
    useEffect(() => {
        if (
            (DefaultGames && DefaultGames.loading) ||
            (results && results.loading)
        ) {
            setLoaded(false);
        }
        else
            setLoaded(true);
    }, [DefaultGames, results]);
    useEffect(() => {
        if (props.location && props.location.search) {
            const page = new URLSearchParams(props.location.search).get('page');
            if (page > 1)
                setPage(parseInt(page));
        }
    }, [props.location]);
    const changePage = (newPage) => {
        setLoaded(false);
        setPage(newPage)
        props.history.push('/manage-games/default?page=' + newPage);
        setTimeout(() => {
            setLoaded(true)
        }, 100);
    }
    const handleChange = async (e) => {
        setSearchText(e.target.value);
        // if (e.target.value.length === 0) {
        //     await dispatch(getAllGames(true, ""));
        //     setPage(1);
        // }
    }
    return (
        <div className={loaded ? "manage-games" : "manage-games loading"}>
            <div className="profile-section">
                <h5 className="profile-name">Default Games</h5>
                <div className="input-icon">
                    <img src={search} alt="search" />
                    <input type='text' name='search' value={searchText} onChange={handleChange} placeholder="Search a game" />
                </div>
            </div>
            <LoadingComponent loaded={loaded} >
                {
                    allGames?.paginationData?.totalEntries > 0 ?
                        <div className="playcard-wrapper">
                            {
                                allGames.data.map((game, index) => {
                                    return (
                                        <Playcardlarge
                                            key={JSON.stringify(game)}
                                            srcImage={game.coverMedia}
                                            title={game.title}
                                            gameDetail={game}
                                            setOpenShareModal={setOpenShareModal}
                                            setShareLink={setShareLink}
                                            setOpenLoginModal={setOpenLoginModal}
                                            setGameDetails={setGameDetails}
                                            setOpenMobileHoverCard={setOpenMobileHoverCard}
                                        />
                                    )
                                })
                            }
                        </div> :
                        <div className="no-game-wrapper">
                            <div>
                                <h3 className="no-game">
                                    The game you are searching for is currently not available.
                                </h3>
                                <span className="no-game-span" onClick={() => props.history.push("/")}>
                                    Go to Homepage
                                </span>
                            </div>
                        </div>
                }
                {allGames?.paginationData?.totalEntries > 0 &&
                    <div className="pagination-wrapper">
                        <button
                            className={page > 1 ? "pagination-left enable" : "pagination-left"}
                            onClick={() => {
                                if (page > 1)
                                    changePage(page - 1);
                                window.scrollTo(0, 0);
                            }}
                        >
                            <img src={arrowleft} alt="arrow left" />
                        </button>
                        <div className="pagination-number">
                            <h5>{page}</h5>
                            <span>of {Math.ceil(allGames?.paginationData?.totalEntries / 12)}{" "}pages</span>
                        </div>
                        <button
                            className={(page < Math.ceil(allGames?.paginationData?.totalEntries / 12)) ? "pagination-right enable" : "pagination-right"}
                            onClick={() => {
                                if (page < Math.ceil(allGames?.paginationData?.totalEntries / 12))
                                    changePage(page + 1);
                            }}
                        >
                            <img src={arrowleft} alt="arrow right" />
                        </button>
                    </div>
                }
            </LoadingComponent>
            {
                openLoginModal && (
                    <LoginModal
                        modalid="loginmodal"
                        toggle={openLoginModal}
                        setOpenLoginModal={setOpenLoginModal}
                    />
                )
            }
            {
                openShareModal && (
                    <LikeShareModal
                        toggle={openShareModal}
                        setOpenShareModal={setOpenShareModal}
                        shareLink={shareLink}
                    />
                )
            }
            {
                openMobileHoverCard &&
                <PlayCardMobileHoverCard
                    setOpenShareModal={setOpenShareModal}
                    gameDetail={gameDetails}
                    setOpenMobileHoverCard={setOpenMobileHoverCard}
                    setShareLink={setShareLink}
                />
            }
        </div>
    )
}
export default DefaultGames;