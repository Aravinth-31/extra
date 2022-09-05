import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { addSlogan, getAllGames, getAllSlogans } from "../../redux/actions/homepageActions";

import "./index.css";
import { bulkUpdateGame } from "../../redux/actions/gameDetailAction";

const SelectItem = ({ name, id, selectedGames, setSelectedGames }) => {
  const add = () => {
    setSelectedGames([...selectedGames, id]);
  }
  const remove = () => {
    let games = [...selectedGames]
    games = games.filter(game => game !== id);
    setSelectedGames(games);
  }
  if (name === "Select Games")
    return (
      <span>{name}</span>
    )
  return (
    <div className="add-default-select-item">
      <h4>{name}</h4>
      <span>
        {
          selectedGames.includes(id) ?
            <input type="checkbox" defaultChecked onChange={remove} />
            : <input type="checkbox" onChange={add} />
        }
      </span>
    </div>
  )
}

function AddGameInSloganModal({ setAddGameInSloganModal, sloganData, existing, userType }) {
  const dispatch = useDispatch();
  const [gameOptions, setGameOptions] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [sloganName, setSloganName] = useState("");
  const [sloganNameError, setSloganNameError] = useState("");

  const { allGames } = useSelector(state => state.allGames);

  const ref = React.createRef();
  useEffect(() => {
    dispatch(getAllGames());
  }, [])
  useEffect(() => {
    if (allGames && allGames.data) {
      let games = [];
      let options = [];
      allGames.data.forEach((game) => {
        if (game.slogan) {
          game.slogan.forEach(gameSlogan => {
            if (gameSlogan.id === sloganData)
              games.push(game.id);
          })
        }
        options.push({ value: game.title, label: game.title, id: game.id });
      })
      //alphabetical order sorting
      try {
        options = options.sort((x, y) => {
          let a = x.label.toLowerCase();
          let b = y.label.toLowerCase();
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        })
      } catch (err) {
        console.log(err);
      }
      setGameOptions(options);
      setSelectedGames(games);
    }
  }, [allGames, sloganData]);
  useEffect(() => {
    if (ref.current)
      ref.current.style.top = document.documentElement.scrollTop + "px";
  }, [ref]);
  const handleClose = (e) => {
    e.preventDefault();
    setAddGameInSloganModal(false);
  };
  const handleAddGame = async (slogan = sloganData) => {
    let games = [];
    let removingGames = [];
    let selected = [...selectedGames];
    if (existing) {
      existing.map((existingGame) => {
        //For Existing - selected games
        if (selected.includes(existingGame.id)) {
          games.push({ id: existingGame.id, slogan: existingGame.slogan, position: existingGame.position });
          const index = selected.indexOf(existingGame.id);
          if (index >= 0)
            selected.splice(index, 1);
        }
        //For Existing - not selected games
        else {
          // let slogans = existingGame.slogan;
          // // const index = slogans.indexOf(sloganData);
          // let index = -1;
          // slogans.forEach((sloganData, i) => {
          //   if (sloganData.id === sloganData)
          //     index = i;
          // })
          // if (index >= 0)
          //   slogans.splice(index, 1);
          // removingGames.push({ id: existingGame.id, slogan: slogans, position: existingGame.position });
        }
        return existingGame;
      })
    }
    //for not existing - selected games
    if (allGames && allGames.data) {
      selected.map((newGame) => {
        let { id, slogan, position, title } = allGames.data.find(game => game.id === newGame);
        slogan.push(sloganData);
        games.push({ id, slogan, position, title });
        return newGame
      })
    }
    games = [...games, ...removingGames];
    const responsecode = await dispatch(bulkUpdateGame(games, slogan));
    if (responsecode === 200) {
      dispatch(getAllGames());
      setAddGameInSloganModal(false);
    }
  };
  const handleAddSlogan = async (e) => {
    e.preventDefault();
    if (sloganData === "Add") {
      if (sloganName === "") {
        setSloganNameError("Please enter valid slogan name.");
        return;
      }
      else {
        setSloganNameError("");
        const response = await dispatch(addSlogan({ title: sloganName, sloganType: userType }));
        if (response && response.status === 200 && response.data && response.data.slogan) {
          dispatch(getAllSlogans());
          handleAddGame(response.data.slogan.id);
        }
      }
    }
    else {
      handleAddGame();
    }
  }
  const handleChange = (e) => {
    const { value } = e.target;
    if (value === "")
      setSloganNameError("Please enter valid slogan name");
    else
      setSloganNameError("");
    setSloganName(value);
  }
  return (
    <div className="add-game-in-slogan-modal" ref={ref} id="add-game-in-slogan-modal">
      <div className="container">
        <div className="btn-group">
          <button className="btn btn-primary" onClick={handleClose}>
            X
          </button>
        </div>
        <div className="form">
          <form>
            {
              sloganData === "Add" &&
              <div className="form-group">
                <input type="text" value={sloganName} onChange={handleChange} className="form-control add-slogan-field" placeholder="Enter Slogan Name" style={{ margin: 0 }} />
                <div className="error-message">{sloganNameError}</div>
              </div>
            }
            <div className="select">
              <Select
                classNamePrefix="react-select"
                className="form-select"
                options={gameOptions}
                closeMenuOnSelect={false}
                value={{ value: "", label: "Select Games" }}
                formatOptionLabel={function (data) {
                  return (
                    <SelectItem selectedGames={selectedGames} setSelectedGames={setSelectedGames} id={data.id} name={data.label} />
                  );
                }}
                placeholder="Select Users"
                styles={{
                  control: (base => ({
                    ...base,
                    cursor: "unset"
                  })),
                  option: (base, state) => ({
                    ...base,
                    borderBottom: '1px solid #f0f0f0',
                    background: '#fff',
                    color: '#000',
                    padding: 0,
                    cursor: 'unset'
                  }),
                  menuList: (base) => ({
                    ...base,
                    // overflow:'hidden'
                  })
                }}
              />
              <span className="game-count">*{selectedGames.length > 0 ? selectedGames.length : "No"} {selectedGames.length === 1 ? "Game" : "Games"} Selected</span>
            </div>
            <div className="form-group">
              <button className="btn btn-primary" onClick={handleAddSlogan}>
                ADD
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddGameInSloganModal;
