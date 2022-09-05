import React, { useState } from "react";
import "./addeditgame.css";

import { useDispatch } from "react-redux";
import PageLayout from "../../components/pagelayout/pagelayout";
import { failureAlert, IsAdmin, REG_EX_URL_FORMAT, successAlert } from "../../helpers/helper";
import sidebarContentAdmin from "../../helpers/sidebarContentAdmin";
import { logOut } from "../../redux/actions/userAction";
import Select from "react-select"
import upload from '../../assets/images/upload.svg';
import { useEffect } from "react";
import { gameAllCategory, getAllObjectives, getGameDetail } from "../../redux/actions/gameDetailAction";
import { useSelector } from "react-redux";
import LoadingComponent from "../../components/loader/LoadingComponent";
import { addNewGame, updateGame } from "../../redux/actions/homepageActions";
import { ToastContainer } from "react-toastify";
import { uploadFile } from "../../redux/actions/commonActions";
import remove from '../../assets/images/remove.svg';

const AddEditGame = (props) => {
    const isAdmin = IsAdmin();
    const dispatch = useDispatch();
    const [uploadedImages, setUploadedImages] = useState([]);
    const [oldUploadedImages, setOldUploadedImages] = useState([]);
    const [loaded, setLoaded] = useState(true);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [objectiveOptions, setObjectiveOptions] = useState([]);
    const [details, setDetails] = useState({
        title: "",
        description: "",
        features: "",
        category: [],
        objectives: [],
        link: "",
        demoLink: "",
        videoURL: "",
        answerSheet: "",
        mailerTemplate: "",
    })
    const [oldDetails, setOldDetails] = useState({
        title: "",
        description: "",
        features: "",
        category: [],
        objectives: [],
        link: "",
        demoLink: "",
        videoURL: "",
        answerSheet: "",
        mailerTemplate: "",
    })
    const [touched, setTouched] = useState({
        title: false,
        description: false,
        features: false,
        category: false,
        link: false,
        demoLink: false,
        videoURL: false,
        coverMedia: false
    })
    const [submitClicked, setSubmitClicked] = useState(false);
    const [gameId, setGameId] = useState(null);

    const GameCategory = useSelector((state) => state.gameAllCategory);
    const { gameCategory } = GameCategory;
    const GameObjectives = useSelector(state => state.getAllObjectives);
    const { gameObjectives } = GameObjectives;
    const AddNewgGame = useSelector(state => state.addNewGame);
    const GameDetail = useSelector(state => state.gameDetail);
    const { gameDetail } = GameDetail;
    const FileUpload = useSelector(state => state.uploadedFile);
    const UpdateGame = useSelector(state => state.updateGame);

    useEffect(() => {
        dispatch(getAllObjectives());
        dispatch(gameAllCategory());
    }, []);

    useEffect(() => {
        if (props.match && props.match.params && props.match.params.id) {
            setGameId(props.match.params.id);
            dispatch(getGameDetail(props.match.params.id));
        }
        else
            setGameId(null);
    }, [props.match])
    useEffect(() => {
        if (gameDetail && gameDetail.data && gameId) {
            const { data } = gameDetail;
            setDetails(prevState => ({
                ...prevState,
                title: data.title,
                videoURL: data.coverMedia[0],
                description: data.description,
                features: data.features,
                link: data.link,
                demoLink: data.demoLink,
                answerSheet: data.answerSheet?.split("/").at(-1) || "",
                mailerTemplate: data.mailerTemplate?.split("/").at(-1) || "",
                category: data.category.map(item => ({ id: item.id, label: item.title, value: item.title })),
                objectives: data.objectives.map(item => ({ id: item.id, label: item.title, value: item.title }))
            }))
            setOldDetails(prevState => ({
                ...prevState,
                title: data.title,
                videoURL: data.coverMedia[0],
                description: data.description,
                features: data.features,
                link: data.link,
                demoLink: data.demoLink,
                answerSheet: data.answerSheet?.split("/").at(-1) || "",
                mailerTemplate: data.mailerTemplate?.split("/").at(-1) || "",
                category: data.category.map(item => ({ id: item.id, label: item.title, value: item.title })),
                objectives: data.objectives.map(item => ({ id: item.id, label: item.title, value: item.title }))
            }))
            let list = [];
            data.coverMedia.map((item) => {
                if (!item?.includes?.("youtu")) {
                    list.push({ name: item.split("/").pop(), url: item });
                }
            })
            setUploadedImages([...list]);
            setOldUploadedImages([...list]);
        }
    }, [gameDetail]);

    useEffect(() => {
        if (gameCategory && gameCategory.data) {
            const options = gameCategory.data.map(category => (
                { id: category.id, label: category.title, value: category.title }
            ))
            setCategoryOptions(options);
        }
    }, [gameCategory]);
    useEffect(() => {
        if (gameObjectives && gameObjectives.data) {
            const options = gameObjectives.data.map(objective => (
                { id: objective.id, label: objective.title, value: objective.title }
            ))
            setObjectiveOptions(options);
        }
    }, [gameObjectives]);

    useEffect(() => {
        if (
            (GameCategory && GameCategory.loading) ||
            (GameObjectives && GameObjectives.loading) ||
            (AddNewgGame && AddNewgGame.loading) ||
            (GameDetail && GameDetail.loading) ||
            (FileUpload && FileUpload.loading) ||
            (UpdateGame && UpdateGame.loading)
        ) {
            setLoaded(false);
        }
        else
            setLoaded(true);
    }, [GameCategory, GameObjectives, AddNewgGame, GameDetail, FileUpload, UpdateGame])

    const signOut = async () => {
        await dispatch(logOut());
        if (isAdmin) props.history.push("/admin");
        else props.history.push("/");
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prevState => ({
            ...prevState,
            [name]: true
        }))
    }
    const handleFileChange = (e, key) => {
        const file = e.target.files[0];
        if (key === "coverMedia") {
            if (file && file.type && file.type.startsWith("image/")) {
                if (!uploadedImages.some(item => item.name === file.name))
                    setUploadedImages(prevState => ([
                        ...prevState,
                        file
                    ]))
            }
        }
        else {
            if ((key === "answerSheet" && file.type !== "application/pdf") ||
                (key === "mailerTemplate" && (!file.name.endsWith(".ppt") && !file.name.endsWith(".pptx")))
            ) {
                failureAlert("File format not allowed");
                return;
            }
            setDetails(prevState => ({
                ...prevState,
                [key]: file
            }));
        }
        e.target.value = [];
    }
    const removeImg = (index) => {
        const list = [...uploadedImages];
        list.splice(index, 1);
        setUploadedImages(list);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (JSON.stringify(details) === JSON.stringify(oldDetails) && JSON.stringify(uploadedImages) === JSON.stringify(oldUploadedImages))
            return;
        setTouched({ title: true, description: true, features: true, category: true, link: true, demoLink: true, videoURL: true, coverMedia: true })
        setSubmitClicked(true);
    }
    const uploadFiles = async () => {
        const data = new FormData();
        let length = 0;
        var files = uploadedImages.filter(item => {
            if (item.url)
                return true;
            else {
                data.append("game-images", item);
                length += 1;
                return false;
            }
        })
        if (length > 0) {
            const response = await dispatch(uploadFile(data));
            if (response && response.data) {
                if (response.data.data && response.data.data.path) {
                    files.push({ name: response.data.data.path.split("/").pop(), url: response.data.data.path })
                } else if (response.data.data && response.data.data.length > 0) {
                    response.data.data.map(item => {
                        files.push({ name: item.split("/").pop(), url: item });
                    })
                }
            }
            else if (response && response.status === "Request failed with status code 417") {
                failureAlert("Uploaded file contains some malware!");
                return response.status;
            }
        }
        return files;
    }
    const uploadPDFFiles = async (file) => {
        if (file) {
            const data = new FormData();
            data.append("game-files", file);
            const response = await dispatch(uploadFile(data, true));
            if (response?.data?.data?.path) {
                return response.data.data.path
            }
            else if (response && response.status === "Request failed with status code 417") {
                failureAlert("Uploaded file contains some malware!");
                return response.status;
            }
            else {
                failureAlert("Something went wrong");
                return response.status;
            }
        }
        return null;
    }
    useEffect(() => {
        const callBack = async () => {
            if (submitClicked) {
                if (JSON.stringify(validate()) === JSON.stringify({ title: "", description: "", features: "", category: "", link: "", demoLink: "", videoURL: "", coverMedia: "" })) {
                    const { videoURL, category, objectives, ...data } = details;
                    const categoryIds = category.map(item => ({ id: item.id }))
                    const objectivesids = objectives.map(item => ({ id: item.id }))
                    const images = await uploadFiles();
                    data.answerSheet = typeof (details.answerSheet) == "string" ? details.answerSheet : await uploadPDFFiles(details.answerSheet);
                    data.mailerTemplate = typeof (details.mailerTemplate) == "string" ? details.mailerTemplate : await uploadPDFFiles(details.mailerTemplate);
                    if ([images, data.answerSheet, data.mailerTemplate].includes("Request failed with status code 417")) {
                        setSubmitClicked(false);
                        return;
                    }
                    if ([images, data.answerSheet, data.mailerTemplate].includes("Request failed with status code 500")) {
                        setSubmitClicked(false);
                        return;
                    }
                    data.coverMedia = [videoURL, ...images.map(item => item.url)];
                    data.category = categoryIds;
                    data.objectives = objectivesids;
                    if (gameId) {
                        const response = await dispatch(updateGame(gameId, { games: [data] }));
                        if (response === 200) {
                            successAlert("Game Updated Successfuly");
                            setTimeout(() => {
                                props.history.push("/all-games");
                            }, 1000)
                        }
                        else
                            failureAlert("Update Game failed")
                    }
                    else {
                        const response = await dispatch(addNewGame({ games: [data] }));
                        if (response === 200) {
                            successAlert("Game Added Successfuly");
                            setTimeout(() => {
                                props.history.push("/all-games");
                            }, 1000)
                        }
                        else
                            failureAlert("Add Game failed")
                    }
                }
                setSubmitClicked(false);
            }
        }
        callBack();
    }, [submitClicked])
    const validate = () => {
        const error = {
            title: "",
            description: "",
            features: "",
            category: "",
            link: "",
            demoLink: "",
            videoURL: "",
            coverMedia: ""
        }
        if (touched.title && details.title.length <= 0)
            error.title = "Please enter valid title";
        if (touched.description && details.description.length <= 0)
            error.description = "Please enter valid description";
        if (touched.features && details.features.length <= 0)
            error.features = "Please enter valid features";
        if (touched.link && !REG_EX_URL_FORMAT.test(details.link))
            error.link = "Please enter valid game link";
        if (touched.demoLink && !REG_EX_URL_FORMAT.test(details.demoLink))
            error.demoLink = "Please enter valid demo link";
        if (touched.videoURL && !REG_EX_URL_FORMAT.test(details.videoURL))
            error.videoURL = "Please enter valid video link";
        // if (touched.category && details.category.length <= 0)
        //     error.category = "Please select atleast one category";
        if (touched.coverMedia && uploadedImages.length <= 0)
            error.coverMedia = "Please upload atleast one cover media";
        return error;
    }
    const errors = validate();

    return (
        <div className="admin-homepage">
            <PageLayout
                sidebartitle=""
                active={"Games"}
                category
                sideBarContents={sidebarContentAdmin}
                profile
                {...props}
                signOut={signOut}
                {...props}
                isAdmin={isAdmin}
            >
                <div className="add-game-container">
                    <LoadingComponent loaded={loaded} />
                    <ToastContainer position="bottom-center" />
                    <h4 className="title">{gameId ? "Edit" : "Add"} Game</h4>
                    <form onSubmit={e => e.preventDefault()}>
                        <div className="flex-box">
                            <div className="form-group">
                                <label htmlFor="">Title</label>
                                <input type="text" className="form-field" placeholder="Please enter game title" name="title" value={details.title} onChange={handleChange} onBlur={handleBlur} />
                                <div className="error-message">{errors.title}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Video URL</label>
                                <input type="text" className="form-field" placeholder="Enter the video URL" name="videoURL" value={details.videoURL} onChange={handleChange} onBlur={handleBlur} />
                                <div className="error-message">{errors.videoURL}</div>
                            </div>
                        </div>
                        <div className="flex-box">
                            <div className="form-group">
                                <label htmlFor="">Description</label>
                                <textarea id="" cols="30" rows="10" placeholder="Enter the description" value={details.description} name="description" onChange={handleChange} onBlur={handleBlur}></textarea>
                                <div className="error-message">{errors.description}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Features</label>
                                <textarea id="" cols="30" rows="10" placeholder="Enter the features, each feature should be seperated by '*'. Example: '*feature 1. *feature2. '" value={details.features} name="features" onChange={handleChange} onBlur={handleBlur}></textarea>
                                <div className="error-message">{errors.features}</div>
                            </div>
                        </div>
                        <div className="flex-box">
                            <div className="form-group">
                                <label htmlFor="">Game URL</label>
                                <input type="text" className="form-field" placeholder="Please enter game URL" name="link" value={details.link} onChange={handleChange} onBlur={handleBlur} />
                                <div className="error-message">{errors.link}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Demo Game URL</label>
                                <input type="text" className="form-field" placeholder="Enter the demo game URL" name="demoLink" value={details.demoLink} onChange={handleChange} onBlur={handleBlur} />
                                <div className="error-message">{errors.demoLink}</div>
                            </div>
                        </div>
                        <div className="flex-box">
                            <div className="form-group">
                                <label htmlFor="">Category</label>
                                <Select
                                    classNamePrefix="react-select"
                                    className="form-select"
                                    options={categoryOptions}
                                    menuPlacement={"auto"}
                                    isMulti
                                    onChange={(e) => handleChange({ target: { name: "category", value: e } })}
                                    placeholder="Select Categories"
                                    value={details.category}
                                    onBlur={() => handleBlur({ target: { name: "category" } })}
                                />
                                <div className="error-message">{errors.category}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Objectives</label>
                                <Select
                                    classNamePrefix="react-select"
                                    className="form-select"
                                    options={objectiveOptions}
                                    menuPlacement={"auto"}
                                    onChange={(e) => handleChange({ target: { name: "objectives", value: e } })}
                                    value={details.objectives}
                                    isMulti
                                    placeholder="Select Objectives"
                                />
                            </div>
                        </div>
                        <div className="flex-box">
                            <div className="form-group">
                                <label htmlFor="">Upload Answer Sheet</label>
                                <div className="cstm-upload-btn">
                                    <label className="upload-btn">
                                        <input type="file" onChange={(e) => handleFileChange(e, "answerSheet")} accept="application/pdf" />
                                        <span>
                                            <img src={upload} alt="upload" />
                                            {details.answerSheet ? "Update" : "Upload"}
                                        </span>
                                    </label>
                                    <button type="submit" className={`btn btn-remove ${details.answerSheet ? "" : "disabled"}`} onClick={() => { setDetails(prevState => ({ ...prevState, answerSheet: null })) }}>
                                        <img src={remove} alt="remove" />
                                        Remove
                                    </button>
                                </div>
                                <div className="error-message">{details.answerSheet?.name ||
                                    details.answerSheet?.split("\\")?.at(-1) || ""}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Upload Mailer Template</label>
                                <div className="cstm-upload-btn">
                                    <label className="upload-btn">
                                        <input type="file" onChange={(e) => handleFileChange(e, "mailerTemplate")} accept="application/pdf,.ppt,.pptx" />
                                        <span>
                                            <img src={upload} alt="upload" />
                                            {details.mailerTemplate ? "Update" : "Upload"}
                                        </span>
                                    </label>
                                    <button type="submit" className={`btn btn-remove ${details.mailerTemplate ? "" : "disabled"}`} onClick={() => { setDetails(prevState => ({ ...prevState, mailerTemplate: null })) }}>
                                        <img src={remove} alt="remove" />
                                        Remove
                                    </button>
                                </div>
                                <div className="error-message">{details.mailerTemplate?.name ||
                                    details.mailerTemplate?.split("\\")?.at(-1) || ""}</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Upload Cover Media</label>
                            <div className="cstm-upload-btn">
                                <label className="upload-btn">
                                    <input type="file" onChange={(e) => { handleFileChange(e, "coverMedia") }} accept="image/x-png,image/jpg,image/jpeg" />
                                    <span>
                                        <img src={upload} alt="upload" />
                                        Update Image
                                    </span>
                                </label>
                            </div>
                            <div className="error-message">{errors.coverMedia}</div>
                        </div>
                        <ul className="uploaded-images">
                            {
                                uploadedImages.map((img, index) => {
                                    return (
                                        <li key={JSON.stringify(img)}>{img.name}<span className="close" onClick={() => removeImg(index)}>X</span></li>
                                    )
                                })
                            }
                        </ul>
                        <button className={`btn btn-primary ${JSON.stringify(details) === JSON.stringify(oldDetails) && JSON.stringify(uploadedImages) === JSON.stringify(oldUploadedImages) ? "disabled" : ""}`} onClick={handleSubmit}>{gameId ? "Save" : "Add"} Game</button>
                    </form>
                </div>
            </PageLayout>
        </div>
    )
}

export default AddEditGame