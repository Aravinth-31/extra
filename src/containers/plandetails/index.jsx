import React, { useLayoutEffect } from 'react';

import Header from '../../components/header/header';
import PlanDetail from '../../components/plandetail/plandetail';
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/actions/userAction";
import PageLayout from '../../components/pagelayout/pagelayout';
import { sidebarContentMyAccount } from '../../helpers/sidebarContentAccount';

const PlanDetails = (props) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.getUser);
  const userType =
    userInfo && userInfo.data && userInfo.data.role;
  const signOut = async () => {
    await dispatch(logOut());
    props.history.push("/");
  };
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <PageLayout
        sidebartitle=""
        active={"My Plan"}
        sideBarContents={sidebarContentMyAccount}
        profile
        {...props}
        signOut={signOut}
      >
        <div className="plandetail-wrapper">
          <PlanDetail {...props} userType={userType} />
        </div>


      </PageLayout>
    </div>
  );
};

export default PlanDetails;