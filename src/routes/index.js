import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Loadable from 'react-loadable';
import Loading from "../helpers/loading";

import HomePage from "../containers/dashboard/index";
import AdminSignUp from "../containers/admin/index";
import UserDetail from "../containers/userdetail/index";
import SignIn from "../containers/signin/index";
import GameDetail from "../containers/gamedetail";
import GameReports from "../containers/gamereports";
import OtpVerification from "../containers/otpverification/otpverification";
import Plans from "../containers/plans/plans";
import CustomeGame from "../containers/customegame/customegame";
import PremiumPlan from "../containers/premiumplan/premiumplan";
import PurchaseOrderCard from "../containers/purchaseorder/purchaseorder";
import MyAccount from "../containers/myaccount";
import Category from "../containers/category";
import Objective from "../containers/objective";
import PlayGame from "../containers/playgame";
import ErrorScrren from "../containers/errorscreen";
import HowItWorks from "../containers/howitworks";
import Faq from "../containers/faq";
import PrivacyPolicy from "../containers/privacypolicy";
import TermsofService from "../containers/termsofservice";
import { LinkedInPopUp } from "react-linkedin-login-oauth2";
import AllGames from "../containers/allgames";
import Footer from "../components/footer/footer";
import RatingReview from "../components/rating/RatingReview";
import PaymentDetails from "../components/paymentDetails/paymentDetails";
import OrganisationDetails from "../containers/organisationDetails/organisationDetails";
import ActiveGames from "../containers/activegames";
import ManageTeam from "../containers/manageteam/ManageTeam";
import ManageGames from "../containers/managegames/ManageGames";
import MyGames from "../containers/myGames/myGames";
import ProtectedRoute from "../containers/protectedRoutes/ProtectedRoute";
import OrgDetailsAdmin from "../components/orgDetailsAdmin/orgDetailsAdmin";
import OrganisationUsers from "../containers/organisationUsers/OrganisationUser";
import Analytics from "../containers/Analytics/Analytics";
import AddNewOrganisationAdmin from "../containers/addneworganisationadmin/addneworganisationadmin";
import EditOrganisationAdmin from "../containers/editorganisation/editorganisation";
import WebinarPlayer from "../components/webinar/webinarplayer";
import PagenNotFound from "../components/emptystate/pagenotfound";
import SessionExpired from "../components/emptystate/sessioexpired";
import AddEditGame from "../containers/AddOrEditGames/AddEditGame";
import Testimonials from "../containers/testimonials/testimonials";
import AddEditCategory from "../containers/category/AddEditCategory";
import AddEditObjective from "../containers/objective/AddEditObjective";
import { useDispatch, useSelector } from "react-redux";

import * as ActionTypes from "../redux/constants/commonApiConstants";
import { io } from "socket.io-client";
import { GetToken, SOCKET_URL } from "../helpers/helper";
import LockedScreen from "../containers/lockedscreen/LockedScreen";
import LoadingComponent from "../components/loader/LoadingComponent";
import { getNewToken } from "../redux/actions/commonActions";
import SSOAdminPage from "../containers/ssoadminpage/SSOAdminPage";
import WebinarHistory from "../containers/webinarHistory/webinarHistory";
import WebinarHistoryAdd from "../containers/webinarHistory/addWebinarhistory";

// const HomePage = Loadable({
//   loader : () => import('../containers/dashboard/index'),
//   loading: Loading
// });
// const AdminSignUp = Loadable({
//   loader: ()=> import("../containers/admin/index"),
//   loading:Loading
// });
// const UserDetail = Loadable({
//   loader : () => import("../containers/userdetail/index") ,
//   loading : Loading
// });
// const SignIn = Loadable({
//   loader : () => import("../containers/signin/index") ,
//   loading : Loading
// });

// const GameDetail = Loadable({
//   loader : () => import("../containers/gamedetail") ,
//   loading : Loading
// });
// const GameReports = Loadable({
//   loader : () => import("../containers/gamereports") ,
//   loading : Loading
// });
// const OtpVerification = Loadable({
//   loader : () => import("../containers/otpverification/otpverification") ,
//   loading : Loading
// });
// const Plans = Loadable({
//   loader : () => import("../containers/plans/plans") ,
//   loading : Loading
// });
// const CustomeGame = Loadable({
//   loader : () => import("../containers/customegame/customegame") ,
//   loading : Loading
// });
// const PremiumPlan = Loadable({
//   loader : () => import("../containers/premiumplan/premiumplan") ,
//   loading : Loading
// });
// const PurchaseOrderCard = Loadable({
//   loader : () => import("../containers/purchaseorder/purchaseorder") ,
//   loading : Loading
// });
// const MyAccount = Loadable({
//   loader : () => import("../containers/myaccount") ,
//   loading : Loading
// });
// const Category = Loadable({
//   loader : () => import("../containers/category") ,
//   loading : Loading
// });
// const Objective = Loadable({
//   loader : () => import("../containers/objective") ,
//   loading : Loading
// });
// const PlayGame = Loadable({
//   loader : () => import("../containers/playgame") ,
//   loading : Loading
// });
// const ErrorScrren = Loadable({
//   loader : () => import("../containers/errorscreen") ,
//   loading : Loading
// });
// const HowItWorks = Loadable({
//   loader : () => import("../containers/howitworks") ,
//   loading : Loading
// });
// const Faq = Loadable({
//   loader : () => import("../containers/faq") ,
//   loading : Loading
// });
// const PrivacyPolicy = Loadable({
//   loader : () => import("../containers/privacypolicy") ,
//   loading : Loading
// });
// const TermsofService = Loadable({
//   loader : () => import("../containers/termsofservice") ,
//   loading : Loading
// });
// const AllGames = Loadable({
//   loader : () => import("../containers/allgames") ,
//   loading : Loading
// });
// const Footer = Loadable({
//   loader : () => import("../components/footer/footer") ,
//   loading : Loading
// });
// const RatingReview = Loadable({
//   loader : () => import("../components/rating/RatingReview") ,
//   loading : Loading
// });
// const PaymentDetails = Loadable({
//   loader : () => import("../components/paymentDetails/paymentDetails") ,
//   loading : Loading
// });
// const OrganisationDetails = Loadable({
//   loader : () => import("../containers/organisationDetails/organisationDetails") ,
//   loading : Loading
// });
// const ActiveGames = Loadable({
//   loader : () => import("../containers/activegames") ,
//   loading : Loading
// });
// const ManageTeam = Loadable({
//   loader : () => import("../containers/manageteam/ManageTeam") ,
//   loading : Loading
// });
// const ManageGames = Loadable({
//   loader : () => import("../containers/managegames/ManageGames") ,
//   loading : Loading
// });
// const MyGames = Loadable({
//   loader : () => import("../containers/myGames/myGames") ,
//   loading : Loading
// });
// const ProtectedRoute = Loadable({
//   loader : () => import("../containers/protectedRoutes/ProtectedRoute") ,
//   loading : Loading
// });
// const OrgDetailsAdmin = Loadable({
//   loader : () => import("../components/orgDetailsAdmin/orgDetailsAdmin") ,
//   loading : Loading
// });
// const OrganisationUsers = Loadable({
//   loader : () => import("../containers/organisationUsers/OrganisationUser") ,
//   loading : Loading
// });


const Routes = () => {
  const dispatch = useDispatch();

  const { loading = true } = useSelector(state => state.newToken);

  useEffect(() => {
    sessionStorage.setItem("popupShown", JSON.stringify(false));
    const token = GetToken();
    if (token) {
      window.socket = io.connect(SOCKET_URL, {
        transports: ["websocket", "polling", "flashsocket"],
        reconnect: true,
        auth: {
          token
        }
      });
      window.socket?.on("notification", (notifications) => {
        dispatch({ type: ActionTypes.GET_NOTIFICATION_SUCCESS, payload: notifications, });
      })
      window.socket?.on("connect_error", (err) => {
        console.log(err instanceof Error); // true
        console.log(err.message); // not authorized
        console.log(err.data); // { content: "Please retry later" }
        setTimeout(() => {
          window.socket?.connect();
        }, 1000);
      });
      window.socket?.on("disconnect", (reason) => {
        console.log({ reason });
      })
    }
  });
  useEffect(() => {
    return () => {
      if (window.socket)
        window.socket.disconnect();
    }
  }, [])

  useEffect(() => {
    //to refresh token
    if (!window.location.href.includes("locked-screen"))
      dispatch(getNewToken());
    else
      dispatch({ type: ActionTypes.GET_NEW_TOKEN_FAIL, payload: "Tokens Not Found", });
  }, []);

  if (loading)
    return (
      <LoadingComponent loaded={!loading} />
    )
  return (
    <Router>
      <Switch>
        {/* <Route
          exact
          path="/signin/:inviteId?"
          component={(props) => {
            if (isAuthenticated()) {
              return <Redirect to="/" />;
            } else return <SignIn {...props} />;
          }}
        /> */}

        <ProtectedRoute exact path="/signin" onboard component={SignIn} />
        <ProtectedRoute exact path="/join" onboard component={SignIn} />
        <ProtectedRoute exact path="/admin" onboard component={AdminSignUp} />
        <ProtectedRoute exact path="/user-detail" onboard component={UserDetail} />
        <ProtectedRoute exact path="/otp-verification" onboard component={OtpVerification} />
        <ProtectedRoute path="/game-reports" orgUsers component={GameReports} />
        <ProtectedRoute exact path="/account/:tab?" authenticated component={MyAccount} />
        <ProtectedRoute exact path="/my-games/:tab?" orgUsers component={MyGames} />
        <ProtectedRoute exact path="/purchase-order" authenticated component={PurchaseOrderCard} />
        <ProtectedRoute exact path="/plan-selected/:id" authenticated component={PremiumPlan} />
        <ProtectedRoute exact path="/manage-team" orgOwnerAdmin component={ManageTeam} />
        <ProtectedRoute exact path="/ratings/:game/:user" authenticated component={RatingReview} />
        <ProtectedRoute exact path="/footer" extramileAdmin component={Footer} />
        <ProtectedRoute exact path="/all-games" extramileAdmin component={AllGames} />
        <ProtectedRoute exact path="/all-games/game/:id?" extramileAdmin component={AddEditGame} />
        <ProtectedRoute exact path="/purchase/:id" authenticated component={OrganisationDetails} />
        <ProtectedRoute exact path="/payment-details" extramileAdmin component={PaymentDetails} />
        <ProtectedRoute exact path="/org-details-admin" extramileAdmin component={OrgDetailsAdmin} />
        <ProtectedRoute exact path="/active-games/:id" orgUsers component={ActiveGames} />
        <ProtectedRoute exact path="/manage-games/:type?" orgOwner component={ManageGames} />
        <ProtectedRoute exact path="/custom-game" orgOwner component={CustomeGame} />
        <ProtectedRoute exact path="/users-admin/:id" extramileAdmin component={OrganisationUsers} />
        <ProtectedRoute exact path="/analytics" extramileAdmin component={Analytics} />
        <ProtectedRoute exact path="/addneworganisation" extramileAdmin component={AddNewOrganisationAdmin} />
        <ProtectedRoute exact path="/editorganisation" extramileAdmin component={EditOrganisationAdmin} />
        <ProtectedRoute exact path="/webinar/live" orgUsers component={WebinarPlayer} />
        <ProtectedRoute exact path="/magic-sign-in" magicsignin component={HomePage} />
        <ProtectedRoute exact path="/category/add-or-edit" extramileAdmin component={AddEditCategory} />
        <ProtectedRoute exact path="/objective/add-or-edit" extramileAdmin component={AddEditObjective} />
        <ProtectedRoute exact path="/ssoadminpage" extramileAdmin component={SSOAdminPage} />
        <ProtectedRoute exact path="/webinar/history/add" extramileAdmin component={WebinarHistoryAdd} />

        {/* <Route
          exact
          path="/admin"
          component={(props) => <AdminSignUp {...props} />}
        /> */}
        {/* <Route
          exact
          path="/user-detail"
          component={(props) => {
            if (isAuthenticated()) {
              return <Redirect to="/" />;
            } else return <UserDetail {...props} />;
          }}
        /> */}
        {/* <Route
          exact
          path="/otp-verification"
          component={(props) => {
            if (isAuthenticated()) {
              return <Redirect to="/" />;
            } else return <OtpVerification {...props} />;
          }}
        />
        <Route
          path="/game-reports"
          component={(props) => <GameReports {...props} />}
        /> */}
        {/* <Route
          exact
          path="/account/:tab?"
          component={(props) => <MyAccount {...props} />}
        /> */}
        {/* <Route
          exact
          path="/my-games/:tab?"
          component={(props) => <MyGames {...props} />}
        /> */}
        {/* <Route
          exact
          path="/purchase-order"
          component={(props) => <PurchaseOrderCard {...props} />}
        /> */}
        {/* <Route
          exact
          path="/plan-selected/:id"
          component={(props) => <PremiumPlan {...props} />}
        /> */}
        {/* <Route
          exact
          path="/manage-team"
          component={(props) => <ManageTeam {...props} />}
        /> */}
        {/* <Route
          exact
          path="/ratings/:game/:user"
          component={(props) => <RatingReview {...props} />}
        /> */}
        {/* <Route
          exact
          path="/footer"
          component={(props) => <Footer {...props} />}
        /> */}
        {/* <Route exact path="/all-games" component={AllGames} /> */}
        {/* <Route
          exact
          path="/purchase/:id"
          component={(props) => <OrganisationDetails {...props} />}
        /> */}
        {/* <Route
          exact
          path="/paymentDetails"
          component={(props) => <PaymentDetails {...props} />}
        /> */}
        {/* <Route
          exact
          path="/active-games/:id"
          component={(props) => <ActiveGames {...props} />}
        /> */}
        {/* <Route
          exact
          path="/manage-games/:type?"
          component={(props) => <ManageGames {...props} />}
        /> */}
        {/* <Route
          exact
          path="/custom-game"
          component={(props) => <CustomeGame {...props} />}
        /> */}


        <Route exact path="/" component={(props) => <HomePage {...props} />} />
        <Route exact path="/webinar/history" component={(props) => <WebinarHistory {...props} />} />
        <Route
          exact
          path="/game-detail/:id?"
          component={(props) => <GameDetail {...props} />}
        />
        <Route
          exact
          path="/plans"
          component={(props) => <Plans {...props} />}
        />
        <Route
          exact
          path="/category/:category?"
          component={(props) => <Category {...props} />}
        />
        <Route
          exact
          path="/objective/:objective?"
          component={(props) => <Objective {...props} />}
        />
        <Route
          exact
          path="/play-game/:id"
          component={(props) => <PlayGame {...props} />}
        />
        <Route
          exact
          path="/error-screen"
          component={(props) => <ErrorScrren {...props} />}
        />
        <Route
          exact
          path="/how-it-works"
          component={(props) => <HowItWorks {...props} />}
        />
        <Route exact path="/faq" component={(props) => <Faq {...props} />} />
        <Route
          exact
          path="/privacy-policy"
          component={(props) => <PrivacyPolicy {...props} />}
        />
        <Route
          exact
          path="/terms"
          component={(props) => <TermsofService {...props} />}
        />
        <Route
          exact
          path="play-game"
          component={(props) => <PlayGame {...props} />}
        />
        <Route
          exact
          path={"/demorequest"}
          component={(props) => <Testimonials {...props} />}
        />
        <Route
          exact
          path={"/locked-screen"}
          component={(props) => <LockedScreen {...props} />}
        />

        <Route exact path="/linkedin" component={LinkedInPopUp} />
        <Route exact path={"/sessionexpired"} component={SessionExpired} />
        <Route component={PagenNotFound} />
      </Switch>
    </Router>
  );
};

export default Routes;
