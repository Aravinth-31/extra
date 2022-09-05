import React from "react";
import StarRatings from "react-star-ratings";

import "./rating.css";

import diy from "../../assets/images/diy.svg";

const Rating = () => {
  const isAdmin = true;
  return (
    <div className="game-rating">

      {isAdmin ? (
        <>
          <h6>Rating 4.7</h6>
          <StarRatings
            rating={4.7}
            starRatedColor="#FED10C"
            numberOfStars={5}
            name="rating"
          />
          <span>(2,457 plays)</span>
          {/* <div className="diy-text">
            <img src={diy} alt="diy" className='diy-img' />
            DIY
          </div> */}
        </>
      ) : (
        <>
          <div>
            <h2>Rating</h2>

            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default Rating;
