import React from "react";
import PageLayout from '../../components/pagelayout/pagelayout';
import ScheduledGames from '../../components/scheduledGames/scheduledGames';
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useParams } from "react-router";
import MyFavourites from "../../components/myFavourites/myFavourites";
import { sidebarContentScheduledByOthers, sideBarContentMyFavourites, sidebarContentScheduledByMe } from "../../helpers/sidebarContentMyGames";
import { logOut } from "../../redux/actions/userAction";
import Roles from '../../helpers/userTypes';
import Reports from "../reports/reports";

const MyGames = (props) => {
  const dispatch = useDispatch();
  const { tab } = useParams();
  const signOut = async () => {
    await dispatch(logOut());
    props.history.push("/");
  };
  const UserInfo = useSelector((state) => state.getUser);
  const { userInfo } = UserInfo;

  var active="";
  var sidebarContent=[];
  if (tab === "scheduled-by-me" || tab === "") {
    active = "My Games";
    sidebarContent = [...sidebarContentScheduledByMe];
  }
  else if (tab === "scheduled-by-others") {
    active = "My Games";
    sidebarContent = [...sidebarContentScheduledByOthers];
  } else if (tab === "my-favourites") {
    active = "My Favourites";
    sidebarContent = [...sideBarContentMyFavourites];
  } else if (tab === "my-reports") {
    active = "My Reports";
    sidebarContent = [...sideBarContentMyFavourites];
  } else {
    active = "My Games";
    sidebarContent = [...sidebarContentScheduledByOthers];
  }
  if (
    userInfo &&
    userInfo.data.role !== Roles.ORG_SUPER_ADMIN &&
    userInfo.data.role !== Roles.ORG_ADMIN
  ) {
    sidebarContent = sidebarContent.filter(
      (data) => data.title !== "My Favourites"
    );
  }
  if (tab)
    return (
      <div>
        <PageLayout
          active={active}
          sideBarContents={sidebarContent}
          {...props}
          signOut={signOut}
        >
          {active === "My Games" ? (
            <ScheduledGames gameSessionType={tab === "scheduled-by-me" ? "user" : "others"} />
          ) : active === "My Favourites" ? (
            <MyFavourites />
          ) : active === "My Reports" ? (
            <Reports />
          ) : null}
        </PageLayout>
      </div>
    );
  return <Redirect to="/my-games/scheduled-by-others" />;
};
export default MyGames;
