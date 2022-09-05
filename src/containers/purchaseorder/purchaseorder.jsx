import React, { useLayoutEffect } from 'react';
import '../../components/plancard/plancard.css';
import '../../components/premiumplancard/premiumplancard.css';
import '../../containers/organisationDetails/organisationDetails.css';
import '../../components/account/account.css';
import './purchaseorder.css';

import Header from '../../components/header/header';
import PurchaseOrderCard from '../../components/purchaseordercard/purchaseordercard';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from "../../redux/actions/userAction";

const PurchaseOrder = (props) => {
  const dispatch = useDispatch();
  const signOut = async () => {
    await dispatch(logOut());
    props.history.push("/");
  };
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { selectedPlanDetails } = useSelector(state => state.getPlanDetails);

  return (
    <div>
      <Header {...props} profile signOut={signOut} />
      <main className="container c-container ">
        <PurchaseOrderCard selectedPlanDetails={selectedPlanDetails} />
      </main>
    </div>
  );
};

export default PurchaseOrder;