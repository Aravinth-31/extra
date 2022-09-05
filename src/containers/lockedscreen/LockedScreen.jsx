import React from "react";
import "./lockedscreen.css";

const LockedScreen = (props) => {
    const serverDown = new URLSearchParams(props.location.search).get('server-down');
    const ssoError = new URLSearchParams(props.location.search).get('sso-error');
    const networkError = new URLSearchParams(props.location.search).get('network-error');
    return (
        <div className="locked-screen">
            <div></div>
            <div className="title">
                <h1>Welcome To Extramile Play</h1>
            </div>
            <div />
            <div className="message-container">
                <h4 className="locked-message">
                    {
                        serverDown ?
                            "Our server is feeling a little down, Please try again in a few moments." :
                            networkError ? "Check your internet connection, and try again " :
                                ssoError ? "Login URL Callback Error!! Contact Administrator!!"
                                    : "Your account has been temporarily locked for 60 Seconds due to more requests from your end."
                    }
                </h4>
            </div>
            <div /><div />
        </div>
    )
}

export default LockedScreen;