import React from 'react';

import './onboard.css';

// image
import signin from '../../assets/images/signin.svg';
import teamBulding from '../../assets/images/teambuilding.svg';
import collaborate from '../../assets/images/collaborate.svg';
import celebrate from '../../assets/images/celebrate.svg';
const OnBoard = ({ children, isAdmin }) => {
    var styles = {}
    if (isAdmin)
        styles = { display: 'flex', justifyContent: 'center' }
    return (
        <section className="onborard-wrapper" style={styles} >
            {!isAdmin &&
                <div className="onboard-left">
                    <div className="onboard-content">
                        <h2>Spread positivity and have fun with your teams using ExtraMile Play</h2>
                        <div className="onboard-card">
                            <img src={teamBulding} alt="team" />
                            <div className="onboard-desc">
                                <h5>Connect</h5>
                                <p>Interact with teams across remote locations.</p>
                            </div>
                        </div>
                        <div className="onboard-card">
                            <img src={collaborate} alt="team" />
                            <div className="onboard-desc">
                                <h5>Collaborate</h5>
                                <p>Create synergies and bond over a common purpose.</p>
                            </div>
                        </div>
                        <div className="onboard-card">
                            <img src={celebrate} alt="team" />
                            <div className="onboard-desc">
                                <h5>Celebrate</h5>
                                <p>Appreciate, recognize and celebrate occasions together.</p>
                            </div>
                        </div>
                        <div className="onboard-img">
                            <img src={signin} alt="onboard" />
                        </div>
                    </div>
                </div>
            }
            <div id="onboard-right" className={isAdmin ? "onboard-right admin-login" : "onboard-right"}>
                {/* need to add right hand side content */}
                {children}
            </div>
        </section>
    )
}

export default OnBoard;