import React from "react";
import "./errorboundry.css";
import connectionlost from '../../assets/images/connectionlost.svg';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
          console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div className="error-state flex-column">
                <div className="error-state-desc">
                    <h5>Oops! Looks like there was a problem</h5>
                    <span>If the error continues, chat with support via the chatbox or call +91 9137514336</span>
                    <button className="btn btn-secondry" onClick={()=>window.location.replace("/")}>
                        Go To Home
                    </button>
                </div>
                <div className="error-state-img">
                    <img src={connectionlost} alt="error" />
                </div>
            </div>
                ;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;