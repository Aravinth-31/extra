import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import "./mygame.css"

import Header from '../../components/header/header';
import PlaycardLarge from '../../components/playCard/playcardlarge';
import PlayCardHeading from '../../components/playCardHeading/playCardHeading'
// image
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../redux/actions/userAction';
import { getSubscribedGames } from '../../redux/actions/homepageActions';
import { gameAllCategory } from '../../redux/actions/gameDetailAction';
import LoadingComponent from '../../components/loader/LoadingComponent';

const MyGame = (props) => {
  const [allSubscribedGames, setAllSubscribedGames] = useState({});
  const [loaded, setLoaded] = useState(true);

  const [openShareModal, setOpenShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const SubscribedGames = useSelector(state => state.subscribedGames);
  const { subscribedGames } = SubscribedGames;
  const GameCategory = useSelector(state => state.gameAllCategory);
  const { gameCategory } = GameCategory;
  const mygameslider = {
    speed: 500,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    className: 'gameslider',
    responsive: [
      {
        breakpoint: 1320,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 580,
        settings: {
          slidesToShow: 1.8,
          slidesToScroll: 1
        }
      }
    ]
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(gameAllCategory());
    dispatch(getSubscribedGames())
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if ((SubscribedGames && SubscribedGames.loading) && (GameCategory && GameCategory.loading))
      setLoaded(false);
    else
      setLoaded(true);
  }, [SubscribedGames, GameCategory])
  useEffect(() => {
    if (gameCategory && subscribedGames) {
      const subGames = {};
      gameCategory.data.map(category => {
        let games = [];
        subscribedGames.data.map(game => {
          if (game.game.categoryId === category.id)
            games.push(game.game);
        })
        if (games.length > 0) {
          subGames[category.title] = games
        }
      })
      setAllSubscribedGames(subGames)
    }
  }, [gameCategory, subscribedGames])
  const signOut = async () => {
    await dispatch(logOut());
    props.history.push("/");
  };
  return (
    <LoadingComponent loaded={loaded} >
      <div className="my-games">
        <Header {...props} profile signOut={signOut} />
        <main className="container conatiner-960">
          <section className="banner-section">
            <div className="profile-section mygame-profile">
              <div className="profile-left">
                <h5 className="profile-name">My Games<span>({subscribedGames && subscribedGames.data ? subscribedGames.data.length : 0})</span></h5>
              </div>
            </div>
          </section>
          {
            Object.keys(allSubscribedGames).length > 0 ?
              Object.keys(allSubscribedGames).map(category => {
                return (
                  <section className="slider-section" key={category}>
                    <PlayCardHeading title={category} gamecount={allSubscribedGames[category].length} />
                    <Slider {...mygameslider}>
                      {
                        allSubscribedGames[category].map(game => {
                          return (
                            <PlaycardLarge
                              key={game.id}
                              srcImage={game.coverMedia}
                              title={game.title}
                              gameDetail={game}
                              setOpenShareModal={setOpenShareModal}
                              setShareLink={setShareLink}
                              setOpenLoginModal={setOpenLoginModal}
                            />
                          )
                        })
                      }
                    </Slider>
                  </section>
                )
              }) :
              <div>
                <h3 className="no-data">No Games Purchased</h3>
              </div>
          }

        </main>
      </div>
    </LoadingComponent>
  );
};

export default MyGame;