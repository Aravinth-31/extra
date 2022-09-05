import React from 'react';
import "./webinar.css";
import upload from '../../assets/images/upload.svg';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addWebinar, deleteWebinar, downloadChats, downloadWebinarParticipants, getAllWebinarCategories, getAllWebinars, updateWebinar, uploadFile } from '../../redux/actions/commonActions';
import { failureAlert, REG_EX_URL_FORMAT, successAlert } from '../../helpers/helper';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ConfirmModal from "../../components/modal/confirmModal";
import LoadingComponent from '../loader/LoadingComponent';
import { ToastContainer } from 'react-toastify';
import { downloadFile } from '../../helpers/downloadFile';
import Select from "react-select";

const Webinar = (props) => {
    const dispatch = useDispatch();
    const [webinarDetails, setWebinarDetails] = useState({
        coverMedia: "",
        mobileCoverMedia: "",
        redirectURL: "",
        title: "",
        webinarCategory: "",
        description: "",
        date: "",
        time: "",
        isChatAllowed: false
    })
    const [existingDetails, setExistingDetails] = useState({
        coverMedia: "",
        mobileCoverMedia: "",
        redirectURL: "",
        title: "",
        webinarCategory: "",
        description: "",
        date: "",
        time: "",
        isChatAllowed: false
    })
    const [touched, setTouched] = useState({
        coverMedia: false,
        mobileCoverMedia: false,
        redirectURL: false,
        title: false,
        webinarCategory: false,
        description: false,
        date: false,
        time: false,
    })
    const [errorDesktopImage, setErrorDesktopImage] = useState("");
    const [errorMobileImage, setErrorMobileImage] = useState("");
    const [submitClicked, setSubmitClicked] = useState("");
    const [edit, setEdit] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [webinarId, setWebinarId] = useState("");
    const [loaded, setLoaded] = useState(true);
    const [startsAtDate, setStartsAtDate] = useState("");
    const [categoryOptions, setCategoryOptions] = useState([]);

    const AllWebinars = useSelector(state => state.allWebinars);
    const { allWebinars } = AllWebinars;
    const DeletedWebinar = useSelector(state => state.deletedWebinar);
    const AddedWebinar = useSelector(state => state.addedWebinar);
    const UpdatedWebinar = useSelector(state => state.updatedWebinar);
    const DownloadChatsURL = useSelector(state => state.downloadChatsURL);
    const { downloadedChats } = DownloadChatsURL;
    const DownloadParticipantsURL = useSelector(state => state.downloadParticipantsURL);
    const { downloadedParticipants } = DownloadParticipantsURL;
    const { allWebinarCategories } = useSelector(state => state.allWebinarCategories);

    useEffect(() => {
        if (allWebinars?.data) {
            dispatch(downloadChats());
            dispatch(downloadWebinarParticipants());
        }
    }, [allWebinars]);

    useEffect(() => {
        dispatch(getAllWebinarCategories());
    }, []);

    useEffect(() => {
        if (allWebinarCategories?.data) {
            const categories = allWebinarCategories.data.map(cat => ({ label: cat.name, value: cat.name, id: cat.id }));
            setCategoryOptions(categories);
        }
    }, [allWebinarCategories]);

    useEffect(() => {
        if (allWebinars && allWebinars.data) {
            const webinar = allWebinars.data;
            const { startsAt } = webinar;
            const date = new Date(startsAt);
            setStartsAtDate(date);
            const newDate = `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
            const newTime = `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
            setExistingDetails({
                coverMedia: webinar.coverMedia,
                mobileCoverMedia: webinar.mobileCoverMedia,
                redirectURL: webinar.redirectURL,
                title: webinar.title || "",
                webinarCategory: webinar.catagoryId ? { label: webinar.catagory?.name, value: webinar.catagory?.name, id: webinar.catagoryId } : null,
                description: webinar.description || "",
                date: newDate,
                time: newTime,
                isChatAllowed: webinar.isChat
            })
            setWebinarDetails({
                coverMedia: webinar.coverMedia,
                mobileCoverMedia: webinar.mobileCoverMedia,
                redirectURL: webinar.redirectURL,
                title: webinar.title || "",
                webinarCategory: webinar.catagoryId ? { label: webinar.catagory?.name, value: webinar.catagory?.name, id: webinar.catagoryId } : null,
                description: webinar.description || "",
                date: newDate,
                time: newTime,
                isChatAllowed: webinar.isChat
            })
            setEdit(true);
            setWebinarId(webinar.id);
        }
        else {
            setExistingDetails({
                coverMedia: "",
                mobileCoverMedia: "",
                redirectURL: "",
                title: "",
                webinarCategory: "",
                description: "",
                date: "",
                time: "",
                isChatAllowed: false
            })
            setWebinarDetails({
                coverMedia: "",
                mobileCoverMedia: "",
                redirectURL: "",
                title: "",
                webinarCategory: "",
                description: "",
                date: "",
                time: "",
                isChatAllowed: false
            })
            setEdit(false);
            setWebinarId("");
        }
    }, [allWebinars]);

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prevState => ({
            ...prevState,
            [name]: true
        }));
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        e.target.value = null;
        if (file && file.type && file.type.startsWith("image/")) {
            const img = new Image();
            let width, height;
            img.onload = async function () {
                width = this.width;
                height = this.height;
                if (e.target.name === "coverMedia") {
                    if (width === 1328 && height === 208) {
                        setErrorDesktopImage("");
                        const data = new FormData();
                        data.append("banner-images", file);
                        const response = await dispatch(uploadFile(data));
                        if (response && response.status === 200) {
                            if (response.data && response.data.data && response.data.data.path) {
                                setWebinarDetails(prevState => ({
                                    ...prevState,
                                    coverMedia: response.data.data.path
                                }))
                            }
                        }
                        else if (response?.status?.includes?.("417"))
                            failureAlert("Uploaded file contains some malware!");
                        else if (response?.status?.includes?.("500"))
                            failureAlert("File Format Not supported");
                    }
                    else {
                        setWebinarDetails(prevState => ({
                            ...prevState,
                            coverMedia: null
                        }))
                        setErrorDesktopImage("*Image dimension should be 1328x208");
                    }
                }
                if (e.target.name === "mobileCoverMedia") {
                    if (width === 328 && height === 140) {
                        setErrorMobileImage("");
                        const data = new FormData();
                        data.append("banner-images", file);
                        const response = await dispatch(uploadFile(data));
                        if (response && response.status === 200) {
                            if (response.data && response.data.data && response.data.data.path) {
                                setWebinarDetails(prevState => ({
                                    ...prevState,
                                    mobileCoverMedia: response.data.data.path
                                }))
                            }
                        }
                        else if (response?.status?.includes?.("417"))
                            failureAlert("Uploaded file contains some malware!");
                        else if (response?.status?.includes?.("500"))
                            failureAlert("File Format Not supported");
                    }
                    else {
                        setWebinarDetails(prevState => ({
                            ...prevState,
                            mobileCoverMedia: null
                        }))
                        setErrorMobileImage("*Image dimension should be 328x140");
                    }
                }
                handleBlur(e);
            }
            const _URL = window.URL || window.webkitURL;
            img.src = _URL.createObjectURL(file);
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setWebinarDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const getTodayDate = () => {
        const date = new Date();
        const newDate = `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
        return newDate;
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (edit && JSON.stringify(existingDetails) === JSON.stringify(webinarDetails))
            return;
        setTouched({
            coverMedia: true, mobileCoverMedia: true, redirectURL: true, title: true, webinarCategory: false, description: true, date: true, time: true
        });
        setSubmitClicked(true);
    }
    useEffect(() => {
        const callBack = async () => {
            if (submitClicked && errorDesktopImage === "" && errorMobileImage === "" &&
                (JSON.stringify(validate()) === JSON.stringify({ coverMedia: "", mobileCoverMedia: "", redirectURL: "", title: "", webinarCategory: "", description: "", time: "", date: "" }))) {
                const { date, time, redirectURL, title, webinarCategory, description, coverMedia, mobileCoverMedia, isChatAllowed } = webinarDetails;
                const startsAt = new Date(parseInt(date.slice(0, 4)), parseInt(date.slice(5, 7)) - 1, parseInt(date.slice(8, 10)), parseInt(time.slice(0, 2)), parseInt(time.slice(3, 5))).toISOString();
                let response;
                if (edit) {
                    response = await dispatch(updateWebinar({ coverMedia, mobileCoverMedia, startsAt, title, description, catagoryId: webinarCategory.id, redirectURL, webinarId, isChat: isChatAllowed }));
                }
                else
                    response = await dispatch(addWebinar({ coverMedia, mobileCoverMedia, redirectURL, title, catagoryId: webinarCategory.id, description, startsAt, isChat: isChatAllowed }));
                if (response === 200) {
                    if (edit)
                        successAlert("Webinar Updated Successfully!");
                    else
                        successAlert("Webinar Added Successfully!");
                    setTouched({ coverMedia: false, mobileCoverMedia: false, redirectURL: false, title: false, webinarCategory: false, description: false, date: false, time: false });
                    dispatch(getAllWebinars());
                }
                else {
                    failureAlert("Something went wrong!");
                }
            }
            setSubmitClicked(false);
        }
        callBack();
    }, [submitClicked])
    const formatImageName = (name) => {
        if (name) {
            name = name.split("/")?.at(-1) || name;
            // name = name.replace("https://extramileplay.com/public/uploads/images/", "");
            // name = name.replace("https://uat.extramileplay.com/public/uploads/images/", "");
            // name = name.replace("https://extramileplay.com/public/uploads/banner-images/", "");
            // name = name.replace("https://uat.extramileplay.com/public/uploads/banner-images/", "");
            // if (name.length > 20)
            //     name = name.slice(20)
        }
        return name;
    }
    const handleDelete = async () => {
        if (webinarId) {
            const response = await dispatch(deleteWebinar(webinarId));
            if (response === 200) {
                successAlert("Webinar Deleted Successfully!");
                setStartsAtDate("")
            }
            await dispatch(getAllWebinars());
        }
        setOpenConfirmModal(false);
    }
    const validate = () => {
        const errors = {
            coverMedia: "",
            mobileCoverMedia: "",
            redirectURL: "",
            title: "",
            webinarCategory: "",
            description: "",
            time: "",
            date: ""
        }
        if (touched.coverMedia && (webinarDetails.coverMedia === "" || webinarDetails.coverMedia === null))
            errors.coverMedia = "Please select any image";
        if (touched.mobileCoverMedia && (webinarDetails.mobileCoverMedia === "" || webinarDetails.mobileCoverMedia === null))
            errors.mobileCoverMedia = "Please select any image";
        if (touched.redirectURL && !REG_EX_URL_FORMAT.test(webinarDetails.redirectURL))
            errors.redirectURL = "Please enter valid stream URL";
        if (touched.title && !webinarDetails.title)
            errors.title = "Please enter valid title";
        if (touched.webinarCategory && !webinarDetails.webinarCategory)
            errors.webinarCategory = "Please select valid category";
        if (touched.description && !webinarDetails.description)
            errors.description = "Please enter valid description";
        if (touched.date && webinarDetails.date === "" && startsAtDate > new Date())
            errors.date = "Please select start date";
        if (touched.time && startsAtDate > new Date()) {
            const date = new Date();
            const time = webinarDetails.time;
            const currenttime = `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
            if (webinarDetails.time === "")
                errors.time = "Please select start time";
            else if (webinarDetails.date === getTodayDate() && Date.parse("01/01/2011 " + time) <= Date.parse("01/01/2011 " + currenttime))
                errors.time = "Please select a time greater than current time";
        }
        return errors;
    }
    const errors = validate();

    useEffect(() => {
        if (
            (DeletedWebinar && DeletedWebinar.loading) ||
            (AddedWebinar && AddedWebinar.loading) ||
            (UpdatedWebinar && UpdatedWebinar.loading) ||
            (DownloadChatsURL && DownloadChatsURL.loading) ||
            (DownloadParticipantsURL && DownloadParticipantsURL.loading)
        )
            setLoaded(false);
        else
            setLoaded(true)
    }, [DeletedWebinar, AddedWebinar, UpdatedWebinar, DownloadChatsURL, DownloadParticipantsURL])

    return (
        <div className='webinar-container'>
            <LoadingComponent loaded={loaded} />
            <ToastContainer position='bottom-center' />
            <h1 className='title'>Webinar</h1>
            {
                allWebinars && allWebinars.data &&
                <div className="count-container">
                    <h4>Total Viewers : {allWebinars.data.participants}</h4>
                    {
                        downloadedParticipants && downloadedParticipants.data && downloadedParticipants.data.downloadUrl &&
                        <button className="btn btn-primary" onClick={() => downloadFile(downloadedParticipants.data.downloadUrl)}>Download Data</button>
                    }
                </div>
            }
            <form onSubmit={e => e.preventDefault()}>
                <h4>{edit ? "Update" : "Add"} Webinar</h4>
                <div className="form-group">
                    <label htmlFor="">Image for desktop (1328x208)</label>
                    <div className="cstm-upload-btn">
                        <label className="upload-button">
                            <input type="file" name="coverMedia" accept="image/x-png,image/jpg,image/jpeg" onChange={handleFileChange} />
                            <span>
                                <img src={upload} alt="upload" />
                                Upload
                            </span>
                        </label>
                    </div>
                    <div className="error-message">{errorDesktopImage ? errorDesktopImage : errors.coverMedia}</div>
                    <div className="error-message uploaded-info">{formatImageName(webinarDetails.coverMedia)}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="">Image for mobile (328x140)</label>
                    <div className="cstm-upload-btn">
                        <label className="upload-button">
                            <input type="file" name="mobileCoverMedia" accept="image/x-png,image/jpg,image/jpeg" onChange={handleFileChange} />
                            <span>
                                <img src={upload} alt="upload" />
                                Upload
                            </span>
                        </label>
                    </div>
                    <div className="error-message">{errorMobileImage ? errorMobileImage : errors.mobileCoverMedia}</div>
                    <div className="error-message uploaded-info">{formatImageName(webinarDetails.mobileCoverMedia)}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="">Stream Link</label>
                    <input type="text" className='form-field' placeholder='Enter Stream URL' name="redirectURL" onChange={handleChange} value={webinarDetails.redirectURL} onBlur={handleBlur} />
                    <div className="error-message">{errors.redirectURL}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="">Webinar Title</label>
                    <input type="text" className='form-field' placeholder='Enter webinar title' name="title" onChange={handleChange} value={webinarDetails.title} onBlur={handleBlur} />
                    <div className="error-message">{errors.title}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="">Webinar Category</label>
                    <Select
                        classNamePrefix="react-select"
                        className="form-select"
                        options={categoryOptions}
                        onChange={(e) => handleChange({ target: { name: "webinarCategory", value: e } })}
                        menuPlacement={"auto"}
                        placeholder="Select Category"
                        value={webinarDetails.webinarCategory}
                    />
                    <div className="error-message">{errors.webinarCategory}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="">Webinar Description</label>
                    <textarea className="form-field" placeholder="Enter webinar description" rows={3} value={webinarDetails.description} name="description" onChange={handleChange} onBlur={handleBlur} />
                    <div className="error-message">{errors.description}</div>
                </div>
                <div className="group">
                    <div className="form-group">
                        <label htmlFor="">Date</label>
                        <input type="date" min={getTodayDate()} className="form-field" name='date' onChange={handleChange} onBlur={handleBlur} value={webinarDetails.date} disabled={startsAtDate && startsAtDate <= new Date()} />
                        <div className="error-message">{errors.date}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Time</label>
                        <input type="time" className="form-field" name='time' onChange={handleChange} onBlur={handleBlur} value={webinarDetails.time} disabled={startsAtDate && startsAtDate <= new Date()} />
                        <div className="error-message">{errors.time}</div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="">Allow Chats</label>
                    <input type="checkbox" name='isChatAllowed' checked={webinarDetails.isChatAllowed} onClick={e => setWebinarDetails(prevState => ({ ...prevState, isChatAllowed: e.target.checked }))} className="form-field" />
                </div>
                {
                    edit ?
                        <div className='btn-group'>
                            <button className='btn btn-secondry' onClick={(e) => { e.preventDefault(); setOpenConfirmModal(true) }}>Delete</button>
                            <button className={`btn btn-primary ${JSON.stringify(webinarDetails) === JSON.stringify(existingDetails) ? "disabled" : ""}`} onClick={handleSubmit}>Update</button>
                            {
                                downloadedChats && downloadedChats.data && downloadedChats.data.downloadUrl &&
                                <button className="btn btn-secondry" onClick={() => downloadFile(downloadedChats.data.downloadUrl)}>Download Chats</button>
                            }
                        </div>
                        : <button className="btn btn-primary" onClick={handleSubmit}>Add Webinar</button>
                }
            </form>
            <ConfirmModal modalid="confirm-modal" toggle={openConfirmModal} setOpenConfirmModal={setOpenConfirmModal} title="Delete Webinar" question="Are you sure to delete webinar?" confirmFunction={handleDelete} />
        </div>
    )
}

export default Webinar;