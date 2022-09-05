import React, { useEffect } from "react";
import SortableListGrid from "../sortableList/SortableListGrid";
import arrowback from "../../assets/images/arrow-left.svg";


function ShowAllModal({ items, setShowAllModal, setBannerDeleteModal, setAddGameInSloganModal, setSloganData, setSloganFlag,
  setGameDetails, setConfirmSloganSortModal, sloganType, modalTitle, onSortEndDrag }) {
  const ref = React.createRef();
  useEffect(() => {
    if (ref.current)
      ref.current.style.top = document.documentElement.scrollTop + 'px';
  }, [ref])
  return (
    <div className="show-all-modal" ref={ref} id="show-all-modal">
      <div className="container">
        <div className="hide991">
          <div className="btn-group">
            <button className="btn btn-primary" onClick={() => setShowAllModal(false)}>
              X
            </button>
          </div>
        </div>
        <div className="show-all-title">
          <div className="back-arrow show991">
            <img src={arrowback} onClick={() => setShowAllModal(false)} alt="back" />
          </div>
          <h1 className="title">{modalTitle}</h1>
        </div>
        <div>
          <div className="show-all-items">

            <SortableListGrid
              items={items}
              onSortEnd={(oldIndex, newIndex) => onSortEndDrag(oldIndex, newIndex, sloganType)}
              setGameDetails={setGameDetails}
              setSloganFlag={setSloganFlag}
              setBannerDeleteModal={setBannerDeleteModal}
              zIndex10={true}
            />
            <hr className="seperator" />
            <div
              className="butn-group"
              style={{ display: "flex", justifyContent: "flex-end", flexDirection: 'unset' }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                style={{ margin: "0px 10px" }}
                onClick={() => {
                  setAddGameInSloganModal(true);
                  setSloganData(sloganType);
                }}
              >
                Add
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ margin: "0px 10px" }}
                onClick={() => {
                  setConfirmSloganSortModal(true);
                  setSloganData(sloganType);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowAllModal;
