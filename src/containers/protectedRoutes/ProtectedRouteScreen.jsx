import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

const ProtectedRouteScreen = () => {
    return (
        <div className="protected-wrapper">
            <div>
                <h4>
                    Currently you are not allowed to visit this page !
                </h4>
                <div>
                    <Link to="/">
                        <h5>Go to HomeScreen</h5>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default ProtectedRouteScreen;