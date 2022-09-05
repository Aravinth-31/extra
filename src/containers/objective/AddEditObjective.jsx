import React, { useState } from "react";
import "./index.css";

import { useDispatch } from "react-redux";
import PageLayout from "../../components/pagelayout/pagelayout";
import { failureAlert, IsAdmin, signOut, successAlert } from "../../helpers/helper";
import sidebarContentAdmin from "../../helpers/sidebarContentAdmin";
import Select from "react-select";
import { useEffect } from "react";
import { addObjective, deleteObjective, getAllObjectives, updateObjective } from "../../redux/actions/gameDetailAction";
import { getAllGames } from "../../redux/actions/homepageActions";
import LoadingComponent from "../../components/loader/LoadingComponent";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

const AddEditObjective = (props) => {
    const isAdmin = IsAdmin();
    const dispatch = useDispatch();

    const [loaded, setLoaded] = useState(true);
    const [objectiveOptions, setObjectiveoptions] = useState([]);
    const [gameOptions, setGameOptions] = useState([]);
    const [selectedObjective, setSelectedObjective] = useState(null);
    const [selectedEditGames, setSelectedEditGames] = useState([]);
    const [selectedAddGames, setSelectedAddGames] = useState([]);
    const [titleTouched, setTitleTouched] = useState(false);
    const [addDetails, setAddDetails] = useState({ title: "", description: "" });
    const [editDescription, setEditDescription] = useState("");

    const AllGames = useSelector(state => state.allGames);
    const { allGames } = AllGames;
    const AllObjective = useSelector((state) => state.getAllObjectives);
    const { gameObjectives } = AllObjective;
    const AddedObjective = useSelector(state => state.addedObjective);
    const UpdatedObjective = useSelector(state => state.updatedObjective);
    const DeletedObjective = useSelector(state => state.deletedObjective);

    useEffect(() => {
        dispatch(getAllObjectives());
        dispatch(getAllGames());
    }, [])

    useEffect(() => {
        if (gameObjectives && gameObjectives.data) {
            const options = gameObjectives.data.map(objective => (
                { id: objective.id, label: objective.title, value: objective.title, games: objective.games, description: objective.description }
            ))
            setObjectiveoptions(options);
        }
    }, [gameObjectives]);
    useEffect(() => {
        if (allGames && allGames.data) {
            const options = allGames.data.map(game => (
                { id: game.id, label: game.title, value: game.title }
            ))
            setGameOptions(options);
        }
    }, [allGames]);
    useEffect(() => {
        if (selectedObjective && selectedObjective.games) {
            const options = selectedObjective.games.map(game => (
                { id: game.id, label: game.title, value: game.title }
            ))
            setSelectedEditGames(options);
            setEditDescription(selectedObjective.description);
        }
    }, [selectedObjective])

    useEffect(() => {
        if (
            (AllGames && AllGames.loading) ||
            (AllObjective && AllObjective.loading) ||
            (AddedObjective && AddedObjective.loading) ||
            (UpdatedObjective && UpdatedObjective.loading) ||
            (DeletedObjective && DeletedObjective.loading)
        ) {
            setLoaded(false);
        }
        else
            setLoaded(true);
    }, [AllGames, AllObjective, AddedObjective, UpdatedObjective, DeletedObjective])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const handleAddObjective = async (e) => {
        e.preventDefault();
        if (!titleTouched)
            setTitleTouched(true)
        if (addDetails && addDetails.title && addDetails.title.length > 0) {
            const games = selectedAddGames.map(item => ({ id: item.id }));
            const response = await dispatch(addObjective({ objectives: { ...addDetails, games } }));
            if (response === 200) {
                successAlert("Objective Added Successfully!");
                dispatch(getAllObjectives());
                setAddDetails({ title: "", description: "" });
                setSelectedAddGames([]);
            }
            else
                failureAlert("Something went wrong!");
        }
    }
    const handleEditObjective = async (e) => {
        e.preventDefault();
        if (!selectedObjective)
            return;
        const games = selectedEditGames.map(item => ({ id: item.id }));
        const response = await dispatch(updateObjective(selectedObjective.id, { description: editDescription, games }));
        if (response === 200) {
            successAlert("Category Updated Successfully!");
            dispatch(getAllObjectives());
        }
        else
            failureAlert("Something went wrong!");
    }
    const handleDeleteObjective = async (e) => {
        e.preventDefault();
        if (!selectedObjective)
            return;
        const response = await dispatch(deleteObjective(selectedObjective?.id));
        if (response === 200) {
            successAlert("Objective deleted successfully");
            dispatch(getAllObjectives());
            setSelectedObjective(null);
            setEditDescription("");
            setSelectedEditGames([]);
        }
        else
            failureAlert("Something went wrong!");
    }
    const validate = () => {
        const error = { title: "" };
        if (titleTouched && addDetails && addDetails.title && addDetails.title.length <= 0) {
            error.title = "Please enter valid title";
        }
        return error;
    }
    const errors = validate();

    return (<div className="admin-homepage">
        <PageLayout
            sidebartitle=""
            active={"Objectives"}
            sideBarContents={sidebarContentAdmin}
            profile
            {...props}
            signOut={() => signOut(dispatch, props.history, isAdmin)}
            isAdmin={isAdmin}
        >
            <div className="addedit-objective">
                <LoadingComponent loaded={loaded} />
                <ToastContainer position="bottom-center" />
                <div className="add-objective">
                    <h4 className="title">Add Objective</h4>
                    <form onSubmit={e => e.preventDefault()}>
                        <div className="group">
                            <div className="form-group">
                                <label htmlFor="">Title</label>
                                <input type="text" value={addDetails.title} placeholder="Enter the title" onBlur={() => setTitleTouched(true)} name="title" onChange={handleChange} />
                                <div className="error-message">{errors.title}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Games</label>
                                <Select
                                    classNamePrefix="react-select"
                                    className="form-select"
                                    options={gameOptions}
                                    menuPlacement={"auto"}
                                    isMulti
                                    placeholder="Select Games"
                                    onChange={(e) => setSelectedAddGames(e)}
                                    value={selectedAddGames}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Description</label>
                            <textarea name="" id="" width="100%" rows="5" placeholder="Enter the description" value={addDetails.description} name="description" onChange={handleChange}></textarea>
                        </div>
                        <button className="btn btn-primary" onClick={handleAddObjective}>ADD</button>
                    </form>
                </div>
                <hr className="faded" />
                <div className="edit-objective">
                    <h4 className="title">Edit Objective</h4>
                    <form onSubmit={e => e.preventDefault()}>
                        <div className="group">
                            <div className="form-group">
                                <label htmlFor="">Title</label>
                                <Select
                                    classNamePrefix="react-select"
                                    className="form-select"
                                    options={objectiveOptions}
                                    menuPlacement={"auto"}
                                    placeholder="Select Objective"
                                    value={selectedObjective}
                                    onChange={(e) => setSelectedObjective(e)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Games</label>
                                <Select
                                    classNamePrefix="react-select"
                                    className="form-select"
                                    options={gameOptions}
                                    menuPlacement={"auto"}
                                    isMulti
                                    placeholder="Select Games"
                                    value={selectedEditGames}
                                    onChange={(e) => setSelectedEditGames(e)}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Description</label>
                            <textarea name="" id="" width="100%" rows="5" placeholder="Enter the description" value={editDescription} name="description" onChange={(e) => setEditDescription(e.target.value)}></textarea>
                        </div>
                        <div className="btn-group">
                            <button className={`btn btn-secondry ${selectedObjective ? "" : "disabled"}`} onClick={handleDeleteObjective}>DELETE</button>
                            <button className={`btn btn-primary ${selectedObjective ? "" : "disabled"}`} onClick={handleEditObjective}>SAVE</button>
                        </div>
                    </form>
                </div>
            </div>
        </PageLayout>
    </div>

    )
}

export default AddEditObjective;