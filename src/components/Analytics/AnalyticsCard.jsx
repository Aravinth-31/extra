import React from "react";
import "./analyticscard.css"

const AnalyticsCard=({title,value})=>{
    return(
        <div className="analytics-card">
            <h5 className="title">{title}</h5>
            <h4 className="value">{value}</h4>
        </div>
    )
}

export default AnalyticsCard;