import React, { useState } from "react";
import "./webinarhistory.css";

import { useDispatch } from "react-redux";
import PageLayout from "../../components/pagelayout/pagelayout";
import { failureAlert, IsAdmin, REG_EX_URL_FORMAT, signOut, successAlert } from "../../helpers/helper";
import sidebarContentAdmin from "../../helpers/sidebarContentAdmin";
import { useEffect } from "react";
import LoadingComponent from "../../components/loader/LoadingComponent";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import Select from "react-select";
import { updateSSODetails } from "../../redux/actions/adminApiActions";
import { getAllWebinarCategories, getAllWebinars, updateWebinar } from "../../redux/actions/commonActions";

const WebinarHistoryAdd = (props) => {
    const isAdmin = IsAdmin();
    const dispatch = useDispatch();
    const [loaded, setLoaded] = useState(true);
    const [webinarsList, setWebinarsList] = useState([]);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [details, setDetails] = useState({
        webinar: null,
        description: "",
        previewUrl: "",
        webinarCategory: "",
        teaserUrl: "",
        fullVideoUrl: "",
        hideFromUsers: false
    });
    const [touched, setTouched] = useState({
        webinar: false,
        description: false,
        previewUrl: false,
        webinarCategory: "",
        teaserUrl: false,
        fullVideoUrl: false
    });
    const [categoryOptions, setCategoryOptions] = useState([]);

    const AllWebinars = useSelector(state => state.allWebinars);
    const { allWebinars } = AllWebinars;
    const { allWebinarCategories } = useSelector(state => state.allWebinarCategories);

    useEffect(() => {
        dispatch(getAllWebinars(true, true));
        dispatch(getAllWebinarCategories());
    }, [])
    useEffect(() => {
        if (details.webinar) {
            setDetails(prevState => ({
                ...prevState,
                description: details.webinar.data.description || "",
                fullVideoUrl: details.webinar.data.fullVideoUrl || "",
                hideFromUsers: details.webinar.data.hideFromUsers || false,
                previewUrl: details.webinar.data.previewUrl || "",
                webinarCategory: details.webinar.data.catagoryId ? { label: details.webinar.data.catagory?.name, value: details.webinar.data.catagory?.name, id: details.webinar.data.catagoryId } : null,
                teaserUrl: details.webinar.data.teaserUrl || ""
            }))
        }
    }, [details.webinar])
    useEffect(() => {
        if (
            (AllWebinars && AllWebinars.loading)
        ) {
            setLoaded(false);
        }
        else
            setLoaded(true);
    }, [AllWebinars])
    useEffect(() => {
        if (allWebinars?.data?.length > 0) {
            setWebinarsList(allWebinars.data.map(data => (
                { label: data.title, value: data.title, id: data.id, data }
            )))
        }
    }, [allWebinars]);
    useEffect(() => {
        if (allWebinarCategories?.data) {
            const categories = allWebinarCategories.data.map(cat => ({ label: cat.name, value: cat.name, id: cat.id }));
            setCategoryOptions(categories);
        }
    }, [allWebinarCategories]);

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prevState => ({
            ...prevState,
            [name]: true
        }))
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prevState => ({
            ...prevState,
            [name]: value
        }))
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({ fullVideoUrl: true, description: true, previewUrl: true, webinarCategory: true, teaserUrl: true, webinar: true });
        setSubmitClicked(true);
    }

    useEffect(() => {
        const callBack = async () => {
            if (submitClicked) {
                if (JSON.stringify(validate()) === JSON.stringify({ webinar: "", description: "", previewUrl: "", webinarCategory: "", teaserUrl: "", fullVideoUrl: "" })) {
                    let body = {
                        teaserUrl: details.teaserUrl,
                        previewUrl: details.previewUrl,
                        catagoryId: details.webinarCategory.id,
                        description: details.description,
                        fullVideoUrl: details.fullVideoUrl,
                        hideFromUsers: details.hideFromUsers,
                        coverMedia: details.webinar.data.coverMedia,
                        mobileCoverMedia: details.webinar.data.mobileCoverMedia,
                        redirectURL: details.webinar.data.redirectURL,
                        startsAt: details.webinar.data.startsAt,
                        isChat: details.webinar.data.isChat,
                        webinarId: details.webinar.id,
                        title: details.webinar.title,
                    };
                    const response = await dispatch(updateWebinar(body));
                    if (response === 200) {
                        successAlert("Updated Successfully");
                        dispatch(getAllWebinars(true, true));
                    }
                    else {
                        failureAlert("Something went wrong");
                    }
                    setTouched({ webinar: false, fullVideoUrl: false, description: false, previewUrl: false, webinarCategory: false, teaserUrl: false });
                    setDetails({ webinar: null, fullVideoUrl: "", hideFromUsers: false, description: "", previewUrl: "", webinarCategory: "", teaserUrl: "" });
                }
                setSubmitClicked(false);
            }
        }
        callBack();
    }, [submitClicked]);
    const validate = () => {
        const errors = {
            webinar: "",
            description: "",
            previewUrl: "",
            webinarCategory: "",
            teaserUrl: "",
            fullVideoUrl: "",
        }
        if (touched.webinar && !details.webinar)
            errors.webinar = "Please select a webinar";
        if (touched.description && !details.description)
            errors.description = "Please enter valid description";
        if (touched.previewUrl && !REG_EX_URL_FORMAT.test(details.previewUrl))
            errors.previewUrl = "Please enter valid Url";
        if (touched.webinarCategory && !details.webinarCategory)
            errors.webinarCategory = "Please select valid category";
        if (touched.teaserUrl && !REG_EX_URL_FORMAT.test(details.teaserUrl))
            errors.teaserUrl = "Please enter valid Url";
        if (touched.fullVideoUrl && !REG_EX_URL_FORMAT.test(details.fullVideoUrl))
            errors.fullVideoUrl = "Please enter valid Url";
        return errors;
    }
    const errors = validate();
    // console.log(errors,details);

    return (<div className="admin-homepage">
        <PageLayout
            sidebartitle=""
            active={"Webinars History"}
            category
            sideBarContents={sidebarContentAdmin}
            profile
            {...props}
            signOut={() => signOut(dispatch, props.history, isAdmin)}
            isAdmin={isAdmin}
        >
            <div className="webinar-hisory-add">
                <LoadingComponent loaded={loaded} />
                <ToastContainer position="bottom-center" />
                <h4 className="title">Add Webinar History</h4>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="">Webinar</label>
                        <Select
                            classNamePrefix="react-select"
                            className="form-select"
                            options={webinarsList}
                            menuPlacement={"auto"}
                            onChange={e => handleChange({ target: { name: "webinar", value: e } })}
                            placeholder="Select Webinar"
                            value={details.webinar}
                        />
                        <div className="error-message">{errors.organization}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Webinar Description</label>
                        <textarea className="form-field" placeholder="Enter webinar description" value={details.description} name="description" onChange={handleChange} onBlur={handleBlur} />
                        <div className="error-message">{errors.description}</div>
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
                            value={details.webinarCategory}
                        />
                        <div className="error-message">{errors.webinarCategory}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Webinar Preview Url</label>
                        <input type="text" className="form-field" placeholder="Enter webinar preview Url" value={details.previewUrl} name="previewUrl" onChange={handleChange} onBlur={handleBlur} />
                        <div className="error-message">{errors.previewUrl}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Webinar Teaser Url</label>
                        <input type="text" className="form-field" placeholder="Enter webinar trailer Url" value={details.teaserUrl} name="teaserUrl" onChange={handleChange} onBlur={handleBlur} />
                        <div className="error-message">{errors.teaserUrl}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Webinar Full Url</label>
                        <input type="text" className="form-field" placeholder="Enter webinar full Url" value={details.fullVideoUrl} name="fullVideoUrl" onChange={handleChange} onBlur={handleBlur} />
                        <div className="error-message">{errors.fullVideoUrl}</div>
                    </div>
                    <div className="form-group checkbox">
                        <label htmlFor="">Hide From Users</label>
                        <input type="checkbox" name='hideFromUsers' checked={details.hideFromUsers} onClick={e => setDetails(prevState => ({ ...prevState, hideFromUsers: e.target.checked }))} className="form-field" />
                    </div>
                    <button className="btn btn-primary">Update</button>
                </form>
            </div>
        </PageLayout>
    </div>

    )
}

export default WebinarHistoryAdd;