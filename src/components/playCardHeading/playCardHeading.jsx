import React from "react";
import { Link } from "react-router-dom";

const PlayCardHeading = ({
  title,
  titleHighlight,
  link,
  isAdmin,
  setShowAllModal,
  setSloganType,
  setModalTitle,
  gamecount,
  sloganType
}) => {
  return (
    <div className="game-heading">
      <div className="game-heading-left">
        <h2>
          {title}
          <span> {titleHighlight} </span>
        </h2>
        {gamecount && isAdmin && <div className="gamecount">({gamecount})</div>}
      </div>
      {isAdmin && (
        <Link>
          <span
            onClick={() => {
              setShowAllModal(true);
              setSloganType(sloganType);
              setModalTitle(title + " " + titleHighlight);
            }}
          >
            Edit All
          </span>
        </Link>
      )}
      {link && !isAdmin && (
        ((gamecount <= 2 && window.innerWidth <= 350) || (gamecount >= 3 && window.innerWidth <= 690) || (gamecount === 5 && window.innerWidth <= 860) || (gamecount > 5)) &&
        <Link to={{ pathname: "/play-game/" +sloganType }}>
          <span>Show All</span>
        </Link>
      )}
    </div>
  );
};

export default PlayCardHeading;
