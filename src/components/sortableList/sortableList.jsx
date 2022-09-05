import React from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

import Playcard from "../playCard/playCard";
import Slider from "react-slick";

const SortableItem = SortableElement(
  ({ value, setBannerDeleteModal, setSloganFlag, setGameDetails, isAdmin, setHover, setHoverSlogan }) => (

    <li style={{ display: "inline" }} key={value}>
      <Playcard
        gameDetail={value}
        title={value.title}
        srcImage={value.coverMedia[0]}
        setBannerDeleteModal={setBannerDeleteModal}
        setSloganFlag={setSloganFlag}
        setGameDetails={setGameDetails}
        isAdmin={isAdmin}
        setHover={setHover}
        setHoverSlogan={setHoverSlogan}
      />

    </li>
  )
);


const SortableList = SortableContainer(
  ({
    items,
    setBannerDeleteModal,
    setAddGameInSloganModal,
    sloganData,
    setSloganData,
    setSloganFlag,
    setGameDetails,
    isAdmin,
    setHover,
    setHoverSlogan,
  }) => {
    const gameslider = {
      speed: 500,
      infinite: false,
      slidesToShow: 5,
      slidesToScroll: 1,
      className: "gameslider",
      responsive: [
        {
          breakpoint: 1320,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 700,
          settings: {
            slidesToShow: 3.2,
            slidesToScroll: 2,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 580,
          settings: {
            slidesToShow: 2.3,
            slidesToScroll: 1,
          },
        },
      ],
    };
    return (
      <Slider {...gameslider}>

        {items && items.map((value, index) => (
          <SortableItem
            key={`item-${value.id}`}
            index={index}
            value={value}
            setBannerDeleteModal={setBannerDeleteModal}
            sloganData={sloganData}
            setSloganData={setSloganData}
            setSloganFlag={setSloganFlag}
            setGameDetails={setGameDetails}
            isAdmin={isAdmin}
            setHover={setHover}
            setHoverSlogan={setHoverSlogan}
          />
        ))}
        <div className="sortable-list banner-item">
          <div className="Add">
            <img
              style={{ width: "100%", height: "100%", padding: "10px" }}
              src="https://img.icons8.com/android/240/000000/plus.png"
              alt=""
              onClick={() => (
                setAddGameInSloganModal(true), setSloganData(sloganData)
              )}
            />
          </div>
        </div>
      </Slider>
    );
  }
);

export default SortableList;
