import React from 'react';
import './reviewtab.css';
import StarRatings from 'react-star-ratings';

const ReviewTab = (props) => {
  const { review } = props;
  const dateFormat = (date) => {
    const newDate = new Date(date);
    return `${newDate.toDateString().slice(4)}, ${formatAMPM(newDate)}`;
  }
  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours || 12;
    const strTime = `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
    return strTime;
  };
  return (
    <div className="reviewtab">
      <div className="reviewtab-desc">
        <div className="reviewtab-initial-name">
          <span>
            {
              review && review.user && (
                (review.user.firstName) ?
                  review.user.firstName.slice(0, 2)
                  : (review.user.last) ?
                    review.user.lastName.slice(0, 2)
                    : review.user.email?.slice(0, 2)
              )}</span>
        </div>
        <div className="reviewtab-detail">
          <div className="reviewtab-left">
            <h5>{
              review && review.user &&
              (
                ((review.user.firstName !== null && review.user.firstName !== "") || (review.user.lastName !== null && review.user.lastName !== "")) ?
                  ((review.user.firstName || "") + " " + (review.user.lastName || ""))
                  : review.user.email
              )}</h5>
            <span>{dateFormat(review && review.createdAt)}</span>
          </div>
          <div className="reviewtab-right">
            <StarRatings
              rating={review && review.rating}
              starRatedColor="#FED10C"
              numberOfStars={5}
              name='rating'
            />
          </div>
        </div>
      </div>
      <p>{review && review.review}</p>
    </div>
  );
};

export default ReviewTab;