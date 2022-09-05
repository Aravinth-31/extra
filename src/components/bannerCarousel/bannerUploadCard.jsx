import React, { useEffect, useState } from "react";
import "./bannerUploadCard.css";
import upload from '../../assets/images/upload.svg';
import { uploadFile } from "../../redux/actions/commonActions";
import { useDispatch } from "react-redux";
import { deleteBannerGame, getBannerGames } from "../../redux/actions/homepageActions";
import { failureAlert, REG_EX_URL_FORMAT, successAlert } from "../../helpers/helper";
import deleteIconAdmin from "../../assets/images/deleteIconAdmin.svg";

const BannerUploadCard = ({ disabled, index, banner, editBannerList, setEditBannerList, editBannerSubmitClicked, setEditBannerSubmitClicked }) => {

    const dispatch = useDispatch();
    const [errorDesktopImage, setErrorDesktopImage] = useState("");
    const [errorMobileImage, setErrorMobileImage] = useState("");
    const [errorRedirectUrl, setErrorRedirectUrl] = useState("");

    const handleChange = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        e.target.value = null;
        if (file && file.type && file.type.startsWith("image/")) {
            const img = new Image();
            let width, height;
            img.onload = async function () {
                width = this.width;
                height = this.height;
                if (e.target.name === "imageDesktop") {
                    if (width === 1328 && height === 208) {
                        setErrorDesktopImage("");
                        const data = new FormData();
                        data.append("banner-images", file);
                        const response = await dispatch(uploadFile(data));
                        if (response && response.status === 200) {
                            if (response.data && response.data.data && response.data.data.path) {
                                let data = [...editBannerList];
                                data[index - 1].coverMedia = response.data.data.path;
                                setEditBannerList(data);
                                setEditBannerSubmitClicked(false)
                            }
                        }
                        else if (response?.status?.includes?.("417"))
                            failureAlert("Uploaded file contains some malware!");
                        else if (response?.status?.includes?.("500"))
                            failureAlert("File Format Not supported");
                    }
                    else {
                        let data = [...editBannerList];
                        data[index - 1].coverMedia = null;
                        setEditBannerList(data);
                        setErrorDesktopImage("*Image dimension should be 1328x208");
                    }
                }
                if (e.target.name === "imageMobile") {
                    if (width === 328 && height === 140) {
                        setErrorMobileImage("");
                        const data = new FormData();
                        data.append("banner-images", file);
                        const response = await dispatch(uploadFile(data));
                        if (response && response.status === 200) {
                            if (response.data && response.data.data && response.data.data.path) {
                                let data = [...editBannerList];
                                data[index - 1].mobileCoverMedia = response.data.data.path;
                                setEditBannerList(data);
                                setEditBannerSubmitClicked(false);
                            }
                        }
                        else if (response?.status?.includes?.("417"))
                            failureAlert("Uploaded file contains some malware!");
                        else if (response?.status?.includes?.("500"))
                            failureAlert("File Format Not supported");
                    }
                    else {
                        let data = [...editBannerList];
                        data[index - 1].mobileCoverMedia = null;
                        setEditBannerList(data);
                        setEditBannerSubmitClicked(false);
                        setErrorMobileImage("*Image dimension should be 328x140");
                    }
                }
            }
            const _URL = window.URL || window.webkitURL;
            img.src = _URL.createObjectURL(file);
        }
    };

    const handleUrlChange = (e) => {
        const { value } = e.target;
        let data = [...editBannerList];
        data[index - 1].redirectURL = value;
        setEditBannerList(data);
        setEditBannerSubmitClicked(false);
    }

    const formatImageName = (name) => {
        name=name.split("/")?.at(-1);
        // name = name.replace("https://extramileplay.com/public/uploads/banner-images/", "");
        // name = name.replace("https://uat.extramileplay.com/public/uploads/banner-images/", "");
        // if (name.length > 20)
        //     name = name.slice(20)
        return name;
    }
    const removeBanner = async () => {
        if (banner.id) {
            const response = await dispatch(deleteBannerGame(banner.id));
            if (response === 200) {
                successAlert("Banner Deleted!");
                dispatch(getBannerGames());
            }
        }
        else {
            let data = [...editBannerList];
            data.splice(index - 1, 1);
            data.push({ id: null, coverMedia: null, mobileCoverMedia: null, redirectURL: null })
            setEditBannerList(data);
        }
    }
    useEffect(() => {
        if (editBannerSubmitClicked) {
            if (banner.coverMedia !== null && banner.mobileCoverMedia === null)
                setErrorMobileImage("Please select an image");
            else
                setErrorMobileImage("");
            if (banner.mobileCoverMedia !== null && banner.coverMedia === null)
                setErrorDesktopImage("Please select an image");
            else
                setErrorDesktopImage("");
        }
        if (editBannerSubmitClicked && banner.redirectURL && banner.redirectURL !== "" && !REG_EX_URL_FORMAT.test(banner.redirectURL))
            setErrorRedirectUrl("Please enter valid url");
        else
            setErrorRedirectUrl("");
    }, [editBannerSubmitClicked, banner]);

    return (
        <>
            <div className={`banner-upload-card desktop ${disabled ? "faded03" : ""}`} key={index + "card"}>
                <p className="index">{"Banner " + index}</p>
                <div className="cstm-upload-btn">
                    <label className="upload-button">
                        <input type="file" name="imageMobile" key={index + "mobileimg"} onChange={handleChange} accept="image/x-png,image/jpg,image/jpeg,image/gif" />
                        <span>
                            <img src={upload} alt="upload" />
                            Upload
                        </span>
                    </label>
                    <p className={`uploaded-img`}>{banner.mobileCoverMedia && formatImageName(banner.mobileCoverMedia)}</p>
                    <div className="error-message">{errorMobileImage}</div>
                </div>
                <div className="cstm-upload-btn">
                    <label className="upload-button">
                        <input type="file" name="imageDesktop" key={index + "desktopimg"} onChange={handleChange} accept="image/x-png,image/jpg,image/jpeg,image/gif" />
                        <span>
                            <img src={upload} alt="upload" />
                            Upload
                        </span>
                    </label>
                    <p className={`uploaded-img`}>{banner.coverMedia && formatImageName(banner.coverMedia)}</p>
                    <div className="error-message">{errorDesktopImage}</div>
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Enter Redirection URL" value={banner.redirectURL} onChange={handleUrlChange} className="form-field" />
                    <div className="error-message">{errorRedirectUrl}</div>
                </div>
                <button className={`btn btn-primary`} onClick={removeBanner}>
                    <img src={deleteIconAdmin} alt="" />
                </button>
                {
                    disabled &&
                    <div className="envelope"></div>
                }
            </div>
            <div className={`banner-upload-card mobile ${disabled ? "faded03" : ""}`} key={index + "cardmob"}>
                <p className="index">{"Banner " + index}</p>
                <div className="parent">
                    <div className="child1">
                        <div className="cstm-upload-btn">
                            <label className="upload-button">
                                <input type="file" name="imageMobile" key={index + "mobileimg"} onChange={handleChange} accept="image/x-png,image/jpg,image/jpeg,image/gif" />
                                <span>
                                    <img src={upload} alt="upload" />
                                    Upload
                                </span>
                            </label>
                            <p className={`uploaded-img`}>{banner.mobileCoverMedia && formatImageName(banner.mobileCoverMedia)}</p>
                            <div className="error-message">{errorMobileImage}</div>
                        </div>
                        <div className="cstm-upload-btn">
                            <label className="upload-button">
                                <input type="file" name="imageDesktop" key={index + "desktopimg"} onChange={handleChange} accept="image/x-png,image/jpg,image/jpeg,image/gif" />
                                <span>
                                    <img src={upload} alt="upload" />
                                    Upload
                                </span>
                            </label>
                            <p className={`uploaded-img`}>{banner.coverMedia && formatImageName(banner.coverMedia)}</p>
                            <div className="error-message">{errorDesktopImage}</div>
                        </div>
                    </div>
                    <div className="child2">
                        <div className="form-group">
                            <input type="text" placeholder="Enter Redirection URL" value={banner.redirectURL} onChange={handleUrlChange} className="form-field" />
                            <div className="error-message">{errorRedirectUrl}</div>
                        </div>
                        <button className={`btn btn-primary`} onClick={removeBanner}>
                            <img src={deleteIconAdmin} alt="" />
                        </button>
                    </div>
                </div>
                {
                    disabled &&
                    <div className="envelope"></div>
                }
            </div>
        </>
    )
}

export default BannerUploadCard