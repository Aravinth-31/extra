import React from "react";
import "./bannereditcard.css";

import { S3_BASE_URL } from "../../helpers/helper";

function BannerEditCard({ image, clickFunction, webinar }) {
    return (
        <div className="webinar-card">
            <img src={S3_BASE_URL + image} alt="img" onClick={() => clickFunction(webinar)} />
        </div>

    )
}
export default BannerEditCard;