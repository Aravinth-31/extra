import React, { useLayoutEffect } from 'react';

import './plans.css';

import Header from '../../components/header/header';
import PlanCard from '../../components/plancard/plancard';
import { logOut } from "../../redux/actions/userAction";
import { useDispatch } from 'react-redux';
import { IsAdmin } from '../../helpers/helper';

const Plans = (props) => {
  const dispatch = useDispatch();
  var isAdmin = IsAdmin();
  const signOut = async () => {
    await dispatch(logOut());
    props.history.push("/");
  };
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <Header {...props} profile signOut={signOut} isAdmin={isAdmin} />
      <main className="container c-container ">
        <PlanCard {...props} />
      </main>
    </div>
  );
};

export default Plans;