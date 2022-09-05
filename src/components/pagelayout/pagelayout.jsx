import React from 'react';
import './pagelayout.css';
import {useHistory} from 'react-router-dom';
import Header from '../header/header';
import SideBar from '../sidebar/sidebar';
import { useDispatch } from 'react-redux';
import { logOut } from '../../redux/actions/userAction';

const PageLayout = (props) => {
  const { children, sidebartitle } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const signOut = async () => {
    await dispatch(logOut());
    history.push("/");
  };
  return (
    <div className="pagelayout">
      <Header signOut={signOut} {...props} />
      <SideBar {...props} sidebartitle={sidebartitle} />
      <div className="main-wrapper">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;