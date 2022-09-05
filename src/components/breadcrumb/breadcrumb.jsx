import React from 'react';
import { Link } from "react-router-dom";

import './breadcrumb.css';

const BreadCrumb = (props) => {
  return (
    <div className="breadcrumb">
      <Link to="">Home</Link>
      {
        !props.objective && !props.category && props.gameDetail?.data?.category?.[0] && (<>
          <Link to={`/category/${props.gameDetail.data.category[0].title}`}>{props.gameDetail.data.category[0].title}</Link></>)
      }
      {
        props.fromManageGames &&
        <Link to="/manage-games" >Manage Games</Link>
      }
      {
        props.objective &&
        <Link to="/objective" >Objectives</Link>
      }
      {
        props.category &&
        <Link to="/category/Quiz-Puzzle Formats" >Category</Link>
      }
      <Link to={"#"} className="active">{props.gameDetail && props.gameDetail.data && props.gameDetail.data.title}</Link>
    </div>
  );
};

export default BreadCrumb;