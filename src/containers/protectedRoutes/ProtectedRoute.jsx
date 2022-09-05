import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router";
import { useHistory } from "react-router-dom";
import { BASE_URL, decryptData, encryptData, EXTRAMILE_SUPERADMIN_EMAIL, failureAlert, GetUserType, isAuthenticated, setCookie } from "../../helpers/helper";
import ROLES, { OrgRoles } from "../../helpers/userTypes";
import { getGameServerOtp } from "../../redux/actions/gameDetailAction";
import ProtectedRouteScreen from "./ProtectedRouteScreen";
import { useEffect } from "react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import LoadingComponent from "../../components/loader/LoadingComponent";
import { getUser, signin } from "../../redux/actions/userAction";
import { verify } from "jsonwebtoken";
import * as ActionTypes from "../../redux/constants/userConstants";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    let auth = false;
    let load = false;
    const [flag, setFlag] = useState(0);
    const dispatch = useDispatch();
    const history = useHistory();

    const redirectToGame = async (gameId, sessionId) => {
        const userInfo = await dispatch(getUser());
        if (userInfo && userInfo.data && userInfo.data.email)
            await dispatch(signin({ email: userInfo.data.email }))
        const response = await dispatch(getGameServerOtp(gameId, sessionId));
        if (response && response.status === 200) {
            if (response.data && response.data.data && response.data.data.redirectUrl)
                window.location.replace(response.data.data.redirectUrl);
        }
        else {
            load = false;
            failureAlert("You are not allowed to access this game!");
            setFlag(prevState => prevState + 1);
            setTimeout(() => {
                history.push("/");
            }, 1500);
        }
    }
    const invited = async (inviteId, gameId, sessionId) => {
        const userInfo = await dispatch(getUser());
        if (userInfo && userInfo.data && userInfo.data.email) {
            if (userInfo.data.email === EXTRAMILE_SUPERADMIN_EMAIL) {
                window.location.replace("/");
                return
            }
            const response = await dispatch(signin({ email: userInfo.data.email, inviteId }));
            if (response && response.status === 200) {
                var obj = decryptData(inviteId);
                if (obj && obj.redirectURL)
                    window.location.href = obj.redirectURL;
                else if (gameId && sessionId)
                    redirectToGame(gameId, sessionId);
                else
                    window.location.replace("/");
            }
            else if (response && response.data) {
                if (response.data.message === "USER EXISTS IN OTHER ORGANIZATION" || response.data.message === "ACCESS DENIED")
                    failureAlert("You are not allowed to join");
                else
                    failureAlert(response.data.message);
                setFlag(prevState => prevState + 1);
                setTimeout(() => {
                    history.push("/");
                }, 1500);
            }
        }
    }
    useEffect(() => {
        const callBack = async () => {
            if (rest.onboard) {
                auth = !isAuthenticated();
                const sessionid = new URLSearchParams(rest.location.search).get('sessionId');
                const gameId = new URLSearchParams(rest.location.search).get('gameId');
                const inviteId = new URLSearchParams(rest.location.search).get('inviteId');
                if (!auth && inviteId) {
                    load = true;
                    setFlag(prevState => prevState + 1);
                    invited(inviteId, gameId, sessionid);
                }
                if (!auth && !inviteId && gameId && sessionid) {
                    load = true;
                    setFlag(prevState => prevState + 1);
                    redirectToGame(gameId, sessionid);
                }
            }
            else if (rest.magicsignin) {
                const token = new URLSearchParams(rest.location.search).get('token');
                const role = new URLSearchParams(rest.location.search).get('role');
                const email = new URLSearchParams(rest.location.search).get('email');
                const newRFToken = new URLSearchParams(rest.location.search).get('rfToken')
                const obj = {
                    email,
                    role,
                    token
                }
                dispatch({ type: ActionTypes.USER_SIGNIN_SUCCESS, payload: obj });
                localStorage.setItem("isAdmin", encryptData(false));
                localStorage.setItem("otpVerified", encryptData(true));
                localStorage.setItem("userSignInInfo", encryptData(obj));
                // setCookie("x-auth-token", newRFToken);
                localStorage.setItem("df-code", encryptData(newRFToken));
                
                localStorage.setItem("isAuthenticated", encryptData(true));
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000)
            }
        }
        callBack();
    }, [rest.location.search]);
    if (rest.magicsignin) {
        load = true;
    }
    if (rest.onboard) {
        auth = !isAuthenticated();
        const sessionid = new URLSearchParams(rest.location.search).get('sessionId');
        const gameId = new URLSearchParams(rest.location.search).get('gameId');
        if (!auth && gameId && sessionid)
            load = true;
    }
    if (rest.orgUsers && OrgRoles.includes(GetUserType())) {
        auth = true;
    }
    if (rest.authenticated && isAuthenticated()) {
        auth = true;
    }
    if (rest.orgOwnerAdmin && (GetUserType() === ROLES.ORG_ADMIN || GetUserType() === ROLES.ORG_SUPER_ADMIN)) {
        auth = true;
    }
    if (rest.extramileAdmin && GetUserType() === ROLES.EXTRAMILE_SUPERADMIN) {
        auth = true;
    }
    if (rest.orgOwner && GetUserType() === ROLES.ORG_SUPER_ADMIN) {
        auth = true;
    }
    return (
        <Route
            {...rest}
            key={flag}
            render={props =>
                load ? (
                    <>
                        <LoadingComponent loaded={false} />
                        <ToastContainer position="bottom-center" />
                    </>
                )
                    : auth ? (
                        <Component {...props} />
                    ) : (
                        <>
                            <ProtectedRouteScreen />
                            <ToastContainer position="bottom-center" />
                        </>
                    )
            }
        />
    )
}
export default ProtectedRoute
