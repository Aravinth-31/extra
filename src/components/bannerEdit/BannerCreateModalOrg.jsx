import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { failureAlert } from "../../helpers/helper";
import { uploadFile } from "../../redux/actions/commonActions";
import { gameAllCategory } from "../../redux/actions/gameDetailAction";
import { getBannerGames, updateBannerGame } from "../../redux/actions/homepageActions";

function BannerCreateModalOrg({ setBannerCreateModal, bannerEditGameDetails, }) {
    const dispatch = useDispatch();
    const [bannerGameDetails, setBannerGameDetails] = useState({
        imageDesktop: "",
        imageMobile: "",
        imageDesktopSize: "1328x208",
        imageMobileSize: "328x140"
    });
    const [errors, setErrors] = useState({
        imageDesktop: "",
        imageMobile: ""
    });
    const [submitClicked, setSubmitClicked] = useState(false);
    const { userInfo } = useSelector((state) => state.getUser);

    const ref = React.createRef();
    useEffect(() => {
        dispatch(gameAllCategory());
        // document.getElementById("banner-create-modal").style.top = document.documentElement.scrollTop + "px";
        ref.current.style.top = document.documentElement.scrollTop + "px";
    }, []);

    const handleChange = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file && file.type && file.type.startsWith("image/")) {
            const img = new Image();

            let width, height;
            img.onload = function () {
                width = this.width;
                height = this.height;
            }
            const _URL = window.URL || window.webkitURL;
            img.src = _URL.createObjectURL(file);

            const data = new FormData();
            data.append("banner-images", file);
            const response = await dispatch(uploadFile(data));
            if (response && response.status === 200) {
                if (response.data && response.data.data && response.data.data.path) {
                    setBannerGameDetails(prevState => ({
                        ...prevState,
                        [e.target.name]: response.data.data.path,
                        [e.target.name + "Size"]: width + "x" + height
                    }));
                }
            }
            else if (response?.status?.includes?.("417"))
                failureAlert("Uploaded file contains some malware!");
            else if (response?.status?.includes?.("500"))
                failureAlert("File Format Not supported");
        }
    };
    const handleBannerAdd = async (e) => {
        e.preventDefault();
        setSubmitClicked(true);
    };
    useEffect(() => {
        if (submitClicked) {
            const callBack = async () => {
                const validation = validateInput();
                if (JSON.stringify(validation) === JSON.stringify({ imageDesktop: "", imageMobile: "" })) {
                    if (bannerEditGameDetails && userInfo && userInfo.data) {
                        const body = {
                            coverMedia: bannerGameDetails.imageDesktop,
                            mobileCoverMedia: bannerGameDetails.imageMobile,
                            organizations: [{
                                id: userInfo.data.organizationId
                            }]
                        }
                        const response = await dispatch(updateBannerGame(bannerEditGameDetails.id, body));
                        if (response === 200) {
                            setBannerCreateModal(false);
                            dispatch(getBannerGames());
                        }
                    }
                }
                else
                    setErrors(validation);
                setSubmitClicked(false);
            }
            callBack();
        }
    }, [submitClicked]);

    const validateInput = () => {
        const error = {
            imageDesktop: "",
            imageMobile: ""
        };
        if (bannerGameDetails.imageDesktop === "" && submitClicked)
            error.imageDesktop = "Please select an image";
        if (bannerGameDetails.imageMobile === "" && submitClicked)
            error.imageMobile = "Please select an image";
        if (bannerGameDetails.imageDesktopSize !== "1328x208")
            error.imageDesktop = "Please upload image with required size.";
        if (bannerGameDetails.imageMobileSize !== "328x140")
            error.imageMobile = "Please upload image with required size.";
        return error;
    };
    useEffect(() => {
        setErrors(validateInput());
    }, [bannerGameDetails])

    return (
        <div className="banner-create-modal" ref={ref} id="banner-create-modal">
            <div className="container">
                <div className="close">
                    <span onClick={() => setBannerCreateModal(false)}>X</span>
                </div>
                <div className="form">
                    <form onSubmit={(e) => handleBannerAdd(e, setBannerCreateModal)}>
                        <div className="group">
                            <label htmlFor="image">For Desktop*</label>
                            <div className="form-group" style={{ margin: "0px" }}>
                                <input
                                    type="file"
                                    name="imageDesktop"
                                    id="bannerImage"
                                    onChange={handleChange}
                                    className="form-control"
                                    accept="image/x-png,image/jpg,image/jpeg,image/gif"
                                />
                            </div>
                        </div>
                        <p
                            style={{
                                marginLeft: "10px",
                                fontSize: "15px",
                                marginBottom: "10px",
                                marginTop: "-10px",
                            }}
                        >
                            {"Size: 1328 x 208"}
                        </p>
                        <div
                            style={{
                                color: "#F2545B",
                                "font-family": "Fira Sans",
                                "font-style": "normal",
                                "font-weight": "normal",
                                "font-size": "13px",
                                marginLeft: "10px",
                                marginTop: "-10px",
                                marginBottom: "-10px",
                            }}
                        >
                            {errors.imageDesktop}
                        </div>
                        <div className="group">
                            <label htmlFor="image">For Mobiles*</label>
                            <div className="form-group" style={{ margin: "0px" }}>
                                <input
                                    type="file"
                                    name="imageMobile"
                                    id="bannerImage"
                                    onChange={handleChange}
                                    className="form-control"
                                    accept="image/x-png,image/jpg,image/jpeg,image/gif"
                                />
                            </div>
                        </div>
                        <p
                            style={{
                                marginLeft: "10px",
                                fontSize: "15px",
                                marginBottom: "10px",
                                marginTop: "-10px",
                            }}
                        >
                            {"Size: 328 x 140"}
                        </p>
                        <div
                            style={{
                                color: "#F2545B",
                                "font-family": "Fira Sans",
                                "font-style": "normal",
                                "font-weight": "normal",
                                "font-size": "13px",
                                marginLeft: "10px",
                                marginTop: "-10px",
                                marginBottom: "-10px",
                            }}
                        >
                            {errors.imageMobile}
                        </div>
                        <div className="form-group" style={{ marginTop: "20px" }}>
                            <button className="btn btn-primary">UPLOAD</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BannerCreateModalOrg;
