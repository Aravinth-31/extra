import React from 'react';
import { Link } from 'react-router-dom';

const SideBarMob = ({ contents, active }) => {
    return (
        <div className="sidenav-mob">
            <ul>
                {contents.map(item => {
                    return (
                        <li className={active === item.title ? "active" : ""}  key={JSON.stringify(item)}>
                            <Link to={item.redirectLink}>
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>

    )
}
export default SideBarMob