import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './premiumplan.css';

import Header from '../../components/header/header';
import PremiumPlanCard from '../../components/premiumplancard/premiumplancard';
import { logOut } from "../../redux/actions/userAction";
import { getPlanDetails } from "../../redux/actions/gameDetailAction";


const PremiumPlan = (props) => {
  const dispatch = useDispatch();
  const { selectedPlanDetails } = useSelector(state => state.getPlanDetails);
  const signOut = async () => {
    await dispatch(logOut());
    props.history.push("/");
  };

  useEffect(() => {
    dispatch(getPlanDetails(props.match.params.id));
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {

  }, [selectedPlanDetails]);

  return (
    <div>
      <Header {...props} profile signOut={signOut} />
      <main className="container c-container ">
        <PremiumPlanCard selectedPlanDetails={selectedPlanDetails} />
      </main>
    </div>
  );
};

export default PremiumPlan;