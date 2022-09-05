import axios from "axios";
import store from "../redux/store/ConfigureStore";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/actions/userAction";
let refreshTokenPromise = null;

const abortController = new AbortController();

const GetToken = () => {
    var userSigninInfo = decryptData(localStorage.getItem("userSignInInfo") || encryptData(null));
    var userSignupInfo = decryptData(localStorage.getItem("userSignUpInfo") || encryptData(null));
    const { token } = userSigninInfo || userSignupInfo || { token: "" };
    return token;
}
const isAuthenticated = () => {
    const status = decryptData(localStorage.getItem("isAuthenticated") || encryptData(false));
    return status
}
const GetUserType = () => {
    var userSigninInfo = decryptData(localStorage.getItem("userSignInInfo") || encryptData(null));
    var userSignupInfo = decryptData(localStorage.getItem("userSignUpInfo") || encryptData(null));
    const userInfo = store.getState().getUser && store.getState().getUser.userInfo;
    const { role } = (userInfo && userInfo.data) || userSigninInfo || userSignupInfo || { role: "" };
    return role;
}
const axiosApiInstance = axios.create();
axiosApiInstance.interceptors.request.use(
    (config) => {
        const token = GetToken();
        // const rfToken = getCookie("x-auth-token");
        const rfToken = decryptData(localStorage.getItem("df-code") || encryptData(false));
        config.headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-auth-token": rfToken,
            signal: abortController.signal,
            ...config.headers
        }
        return { ...config, signal: abortController.signal };
    }, (error) => {
        Promise.reject(error);
    }
);
const getRefreshToken = () => {
    return new Promise((resolve, reject) => {
        const token = GetToken();
        // const rfToken = getCookie("x-auth-token")
        const rfToken = decryptData(localStorage.getItem("df-code") || encryptData(""));
        if (rfToken && !["undefined", "null"].includes(rfToken)) {
            fetch(BASE_URL + "/api/auth/rf-token?fromhelper", {
                method: "GET",
                headers: {
                    authorization: token,
                    "x-auth-token": rfToken
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    return resolve(data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    if (error?.pushLogout) {
                        abortController.abort();
                        localStorage.clear();
                        // deleteCookie("x-auth-token");
                        localStorage.setItem("df-code", encryptData(null));
                        if (window.socket) window.socket.disconnect();
                        window.location.href = "/sessionexpired";
                    }
                    reject(error);
                });
        }
        else {
            reject("Tokens Not Found");
        }
    });
};

axiosApiInstance.interceptors.response.use(function (response) {
    // console.log(response.headers);
    // if (response.headers["new-x-access-token"] && response.headers["auth-role"]) {
    //     const data = { role: response.headers["auth-role"], token: response.headers["new-x-access-token"], isNewUser: false };
    //     console.log(response.headers["new-x-access-token"]);
    //     localStorage.setItem("userSignInInfo", encryptData(data));
    // }
    // if (response.headers["new-x-auth-token"]) {
    //     setCookie("x-auth-token", response.headers["new-x-auth-token"]);
    // }
    return response;
}, async function (error) {
    // if (401 === error?.response?.status) {
    //     abortController.abort();
    //     localStorage.clear();
    //     if (window.socket)
    //         window.socket.disconnect();
    //     window.location.href = "/sessionexpired";
    // }
    if (error.config && error.response && error.response.status === 401) {
        if (!refreshTokenPromise) {
            refreshTokenPromise = getRefreshToken().then((data) => {
                refreshTokenPromise = null;
                return data;
            });
        }
        return refreshTokenPromise.then(async (data) => {
            const { rfToken, ...remData } = data;
            await localStorage.setItem("userSignInInfo", encryptData(remData));
            await localStorage.setItem("otpVerified", encryptData(true));
            await localStorage.setItem("isAuthenticated", encryptData(true));
            // await setCookie("x-auth-token", rfToken);
            await localStorage.setItem("df-code", encryptData(rfToken));
            error.config.headers["Authorization"] = "Bearer " + data.token;
            error.config.headers["x-auth-token"] = data.rfToken;
            return axiosApiInstance.request(error.config);
        });
    }
    if (([429, 502, 503, 504].includes(error?.response?.status)) || "Network Error" == error?.message) {
        abortController.abort();
        if (error?.response?.status === 429)
            window.location.href = "/locked-screen";
        else if ("Network Error" == error?.message)
            window.location.href = "/locked-screen?network-error=true";
        else
            window.location.href = "/locked-screen?server-down=true";
    }
    return Promise.reject(error);
});

const successAlert = (content) => {
    toast.success(content, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        pauseOnFocusLoss: false
    });
}
const failureAlert = (content) => {
    toast.warning(content, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        pauseOnFocusLoss: false
    });
}

const IsAdmin = () => {
    const isAdmin = decryptData(localStorage.getItem("isAdmin") || encryptData(false));
    return isAdmin;
}

const BASE_URL = "https://uat.extramileplay.com";
const RAZOR_PAY_API_KEY = "rzp_test_qAt2XUJ3I92Ylv";
const AZURE_CLIENT_ID = "1303b808-7b2a-4c2a-b4f4-541968a0a304";
// const RAZOR_PAY_API_KEY = "rzp_live_sxtbgj6TGuvb2X";
const ENCRYPION_KEY = "ExTrAmIlE_PlAy-SeCrEtKeY";
const REG_EX_URL_FORMAT = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i');

//local
const SOCKET_URL = "wss://uat.extramileplay.com";
// const S3_BASE_URL="https://extramileplay-uat-public.s3.amazonaws.com/"
const S3_BASE_URL = "https://extramileplay-uat-public.extramileplay.com/";
const EXTRAMILE_SUPERADMIN_EMAIL = "webmaster@extramileplay.in";

const encryptData = (data) => {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPION_KEY).toString();
    return ciphertext;
}
const decryptData = (data) => {
    if (data) {
        data = data.split(" ").join("+");
        var decryptedData = "";
        try {
            var bytes = CryptoJS.AES.decrypt(data, ENCRYPION_KEY);
            decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (err) {
            try {
                decryptedData = JSON.parse(data);
            } catch (e) {
                console.error(e);
            }
        }
        return decryptedData;
    }
}
const signOut = async (dispatch, history, isAdmin) => {
    await dispatch(logOut());
    if (isAdmin) history.push("/admin");
    else history.push("/");
};

function preventNonNumericalInput(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
    var charStr = String.fromCharCode(charCode);
    if (charCode !== 13 && !charStr.match(/^[0-9]+$/))
        e.preventDefault();
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const setCookie = (cookieName, cookieValue, hourToExpire) => {
    let date = new Date();
    date.setTime(date.getTime() + (20 * 24 * 60 * 60 * 1000));
    document.cookie = cookieName + " = " + cookieValue + ";path=/;expires=" + date;
}

const getCookie = (cookieName) => {
    const cookieObj = new URLSearchParams(document.cookie.replaceAll("; ", "&"))
    return cookieObj.get(cookieName);
}
const deleteCookie = (cookieName) => {
    document.cookie = cookieName + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
export {
    GetToken,
    isAuthenticated,
    GetUserType,
    successAlert,
    failureAlert,
    axiosApiInstance,
    BASE_URL,
    RAZOR_PAY_API_KEY,
    REG_EX_URL_FORMAT,
    SOCKET_URL,
    EXTRAMILE_SUPERADMIN_EMAIL,
    encryptData,
    decryptData,
    IsAdmin,
    signOut,
    preventNonNumericalInput,
    monthNames,
    AZURE_CLIENT_ID,
    abortController,
    S3_BASE_URL,
    setCookie,
    getCookie,
    deleteCookie
}