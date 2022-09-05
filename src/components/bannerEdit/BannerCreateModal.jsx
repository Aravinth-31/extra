import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { gameAllCategory } from "../../redux/actions/gameDetailAction";
import {
  addBannerGame,
  getGamesByCategoryForBanner,
  updateBannerGame,
} from "../../redux/actions/homepageActions";

function BannerCreateModal({
  setBannerCreateModal,
  bannerEdit,
  bannerEditGameDetails,
}) {
  const dispatch = useDispatch();
  const [gameOptions, setGameOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const { gamesByCategoryForBanner: gamesByCategory } = useSelector(
    (state) => state.gamesByCategoryForBanner
  );
  const { gameCategory } = useSelector((state) => state.gameAllCategory);
  const [bannerGameDetails, setBannerGameDetails] = useState({
    image: "",
    category: "",
    game: "",
    redirectionURL: "",
    gameName: "",
  });
  const [errors, setErrors] = useState({
    img: "",
    category: "",
    game: "",
    redirectURL: "",
  });
  const ref = React.createRef();
  useEffect(() => {
    dispatch(gameAllCategory());
    // document.getElementById("banner-create-modal").style.top = document.documentElement.scrollTop + "px";
    ref.current.style.top = document.documentElement.scrollTop + "px";
    if (bannerEdit && bannerEditGameDetails && bannerEditGameDetails.game) {
      setBannerGameDetails((prevState) => ({
        ...prevState,
        game: bannerEditGameDetails.game.id,
        image: bannerEditGameDetails.coverMedia,
        gameName: bannerEditGameDetails.game.title,
        redirectionURL: bannerEditGameDetails.redirectURL,
      }));
    }
  }, []);
  useEffect(() => {
    var options = [];
    if (gameCategory && gameCategory.data) {
      gameCategory.data.map((category) => {
        options.push({ value: category.title, label: category.title });
        if (bannerEdit && bannerEditGameDetails && bannerEditGameDetails.game) {
          if (
            bannerEditGameDetails &&
            bannerEditGameDetails.game &&
            bannerEditGameDetails.game.categoryId === category.id
          )
            setBannerGameDetails((prevState) => ({
              ...prevState,
              category: category.title,
            }));
        }
        return category;
      });
      setCategories(options);
    }
  }, [gameCategory]);
  useEffect(() => {
    if (gamesByCategory && gamesByCategory.data) {
      var options = [];
      gamesByCategory.data.map((game) => {
        options.push({ value: game.title, label: game.title, id: game.id });
        return game;
      });
      setGameOptions(options);
    }
  }, [gamesByCategory]);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.name === "image") {
      var filesSelect = e.target.files;
      if (filesSelect.length > 0) {
        var fileSelect = filesSelect[0];
        var fileReader = new FileReader();
        fileSelect.crossOrigin = "anonymous";
        fileReader.onload = function (FileLoadEvent) {
          var srcData = FileLoadEvent.target.result;
          setBannerGameDetails((prevState) => ({
            ...prevState,
            [e.target.name]: srcData,
          }));
        };
        fileReader.readAsDataURL(fileSelect);
      }
    } else {
      setBannerGameDetails((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };
  const handleBannerAdd = (e, setBannerCreateModal) => {
    e.preventDefault();
    if (bannerEdit) {
      dispatch(
        updateBannerGame(bannerEditGameDetails.id, {
          game: bannerGameDetails.game,
          coverMedia: bannerGameDetails.image,
          redirectURL: bannerGameDetails.redirectionURL,
        })
      );
      setBannerCreateModal(false);
    } else {
      const error = validateInput();
      if (
        JSON.stringify(error) ===
        JSON.stringify({ img: "", category: "", game: "", redirectURL: "" })
      ) {
        dispatch(
          addBannerGame({
            game: bannerGameDetails.game,
            coverMedia: bannerGameDetails.image,
            redirectURL: bannerGameDetails.redirectionURL,
          })
        );
        setBannerCreateModal(false);
      }
    }
  };
  const categoryChanged = (category) => {
    dispatch(getGamesByCategoryForBanner(category));
  };
  const selectHandler = (e, key) => {
    if (key === "category") {
      categoryChanged(e.value);
      setBannerGameDetails((prevState) => ({ ...prevState, [key]: e.value }));
    } else {
      setBannerGameDetails((prevState) => ({
        ...prevState,
        [key]: e.id,
        gameName: e.value,
      }));
    }
  };
  const validateInput = () => {
    const error = {
      img: "",
      category: "",
      game: "",
      redirectURL: "",
    };
    if (bannerGameDetails.image === "") error.img = "Please select an image";
    if (bannerGameDetails.category === "")
      error.category = "Please select a category";
    if (bannerGameDetails.game === "") error.game = "Please select a game";
    setErrors(error);
    return error;
  };
  return (
    <div className="banner-create-modal" ref={ref} id="banner-create-modal">
      <div className="container">
        <div className="close">
          <span onClick={() => setBannerCreateModal(false)}>X</span>
        </div>
        <div className="form">
          <form onSubmit={(e) => handleBannerAdd(e, setBannerCreateModal)}>
            <div className="group">
              <label htmlFor="image">For Desktop</label>
              <div className="form-group" style={{ margin: "0px" }}>
                <input
                  type="file"
                  name="image"
                  id="bannerImage"
                  onChange={handleChange}
                  className="form-control"
                  accept="image/x-png,image/jpg,image/jpeg,image/gif"
                />
              </div>
            </div>
            <p
              style={{
                marginLeft: "10px",
                fontSize: "15px",
                marginBottom: "10px",
                marginTop: "-10px",
              }}
            >
              {"Size: 970 x 140"}
            </p>
            <div
              style={{
                color: "#F2545B",
                "font-family": "Fira Sans",
                "font-style": "normal",
                "font-weight": "normal",
                "font-size": "13px",
                marginLeft: "10px",
                marginTop: "-10px",
                marginBottom: "-10px",
              }}
            >
              {errors.img}
            </div>
            <div className="group">
              <label htmlFor="image">For Mobiles</label>
              <div className="form-group" style={{ margin: "0px" }}>
                <input
                  type="file"
                  name="image"
                  id="bannerImage"
                  onChange={handleChange}
                  className="form-control"
                  accept="image/x-png,image/jpg,image/jpeg,image/gif"
                />
              </div>
            </div>
            <p
              style={{
                marginLeft: "10px",
                fontSize: "15px",
                marginBottom: "10px",
                marginTop: "-10px",
              }}
            >
              {"Size: 328 x 140"}
            </p>
            <div
              style={{
                color: "#F2545B",
                "font-family": "Fira Sans",
                "font-style": "normal",
                "font-weight": "normal",
                "font-size": "13px",
                marginLeft: "10px",
                marginTop: "-10px",
                marginBottom: "-10px",
              }}
            >
              {errors.img}
            </div>
            <div className="form-group" style={{ marginTop: "20px" }}>
              <button className="btn btn-primary">UPLOAD</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BannerCreateModal;
