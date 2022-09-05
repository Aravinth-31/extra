import React, { useLayoutEffect } from "react";

import Account from "../../components/account/account";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/actions/userAction";
import PageLayout from "../../components/pagelayout/pagelayout";
import { Redirect, useParams } from "react-router";
import OrgDetails from "../../components/account/orgDetails";
import { sidebarContentMyAccount, sidebarContentMyAccountUser } from '../../helpers/sidebarContentAccount';
import sidebarContentAdmin from '../../helpers/sidebarContentAdmin';
import PlanDetail from "../../components/plandetail/plandetail";
import ROLES from "../../helpers/userTypes";

const MyAccount = (props) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.getUser);
  const userType = userInfo && userInfo.data && userInfo.data.role;
  const { tab } = useParams();
  const isAdmin =
    userInfo && userInfo.data && userInfo.data.role === "EXTRAMILE_SUPERADMIN";
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const signOut = async () => {
    await dispatch(logOut());
    props.history.push("/");
  };
  var active = ""
  if (tab === "details")
    active = "My Details";
  else if (tab === "org-details")
    active = "Organisation Details"
  else if (tab === "plan-details")
    active = "My Plan"
  if (isAdmin) {
    return (
      <div >
        <PageLayout
          sidebartitle=""
          active={"Profile"}
          sideBarContents={sidebarContentAdmin}
          profile
          {...props}
          signOut={signOut}
          isAdmin={isAdmin}
        >
          <Account />
        </PageLayout>
      </div>
    );
  } else {
    if (tab)
      return (
        // Updated UI for account
        <div >
          <PageLayout
            sidebartitle=""
            active={((userType === ROLES.ORG_ADMIN) || (userType === ROLES.ORG_SUPER_ADMIN)) ? active : "My Account"}
            sideBarContents={((userType === ROLES.ORG_ADMIN) || (userType === ROLES.ORG_SUPER_ADMIN)) ? sidebarContentMyAccount : sidebarContentMyAccountUser}
            profile
            {...props}
            signOut={signOut}
            isAdmin={isAdmin}
          >
            {active === "My Details" ?
              <Account {...props} /> : active === "Organisation Details" ?
                <OrgDetails {...props} role={userInfo && userInfo.data && userInfo.data.role} email={userInfo && userInfo.data && userInfo.data.email} /> :
                <div className="plandetail-wrapper">
                  <PlanDetail {...props} userType={userType} />
                </div>
            }
          </PageLayout>
        </div>
      );
    return (<Redirect to="/account/details" />)
  }
};

export default MyAccount;
