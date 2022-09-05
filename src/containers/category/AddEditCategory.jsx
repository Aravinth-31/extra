import React, { useState } from "react";
import "./index.css";

import { useDispatch } from "react-redux";
import PageLayout from "../../components/pagelayout/pagelayout";
import { failureAlert, IsAdmin, signOut, successAlert } from "../../helpers/helper";
import sidebarContentAdmin from "../../helpers/sidebarContentAdmin";
import Select from "react-select";
import { useEffect } from "react";
import { addCategory, deleteCategory, gameAllCategory, updateCategory } from "../../redux/actions/gameDetailAction";
import { getAllGames } from "../../redux/actions/homepageActions";
import LoadingComponent from "../../components/loader/LoadingComponent";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

const AddEditCategory = (props) => {
    const isAdmin = IsAdmin();
    const dispatch = useDispatch();

    const [loaded, setLoaded] = useState(true);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [gameOptions, setGameOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedEditGames, setSelectedEditGames] = useState([]);
    const [selectedAddGames, setSelectedAddGames] = useState([]);
    const [titleTouched, setTitleTouched] = useState(false);
    const [addDetails, setAddDetails] = useState({ title: "", description: "" });
    const [editDescription, setEditDescription] = useState("");

    const AllGames = useSelector(state => state.allGames);
    const { allGames } = AllGames;
    const GameCategory = useSelector((state) => state.gameAllCategory);
    const { gameCategory } = GameCategory;
    const AddedCategory = useSelector(state => state.addedCategory);
    const UpdatedCategory = useSelector(state => state.updatedCategory);
    const DeletedCategory = useSelector(state => state.deletedCategory);


    useEffect(() => {
        dispatch(gameAllCategory());
        dispatch(getAllGames());
    }, [])

    useEffect(() => {
        if (gameCategory && gameCategory.data) {
            const options = gameCategory.data.map(category => (
                { id: category.id, label: category.title, value: category.title, games: category.games, description: category.description }
            ))
            setCategoryOptions(options);
        }
    }, [gameCategory]);
    useEffect(() => {
        if (allGames && allGames.data) {
            const options = allGames.data.map(game => (
                { id: game.id, label: game.title, value: game.title }
            ))
            setGameOptions(options);
        }
    }, [allGames]);
    useEffect(() => {
        if (selectedCategory && selectedCategory.games) {
            const options = selectedCategory.games.map(game => (
                { id: game.id, label: game.title, value: game.title }
            ))
            setSelectedEditGames(options);
            setEditDescription(selectedCategory.description);
        }
    }, [selectedCategory])

    useEffect(() => {
        if (
            (AllGames && AllGames.loading) ||
            (GameCategory && GameCategory.loading) ||
            (AddedCategory && AddedCategory.loading) ||
            (UpdatedCategory && UpdatedCategory.loading) ||
            (DeletedCategory && DeletedCategory.loading)
        ) {
            setLoaded(false);
        }
        else
            setLoaded(true);
    }, [AllGames, GameCategory, AddedCategory, UpdatedCategory, DeletedCategory])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!titleTouched)
            setTitleTouched(true)
        if (addDetails && addDetails.title && addDetails.title.length > 0) {
            const games = selectedAddGames.map(item => ({ id: item.id }));
            const response = await dispatch(addCategory({ category: { ...addDetails, games } }));
            if (response === 200) {
                successAlert("Category Added Successfully!");
                dispatch(gameAllCategory());
                setAddDetails({ title: "", description: "" });
                setSelectedAddGames([]);
            }
            else
                failureAlert("Something went wrong!");
        }
    }
    const handleEditCategory = async (e) => {
        e.preventDefault();
        if (!selectedCategory)
            return;
        const games = selectedEditGames.map(item => ({ id: item.id }));
        const response = await dispatch(updateCategory(selectedCategory.id, { description: editDescription, games }));
        if (response === 200) {
            successAlert("Category Updated Successfully!");
            dispatch(gameAllCategory());
        }
        else
            failureAlert("Something went wrong!");
    }
    const handleDeleteCategory = async (e) => {
        e.preventDefault();
        if (!selectedCategory)
            return;
        const response = await dispatch(deleteCategory(selectedCategory?.id));
        if (response === 200) {
            successAlert("Category deleted successfully");
            dispatch(gameAllCategory());
            setSelectedCategory(null);
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
            active={"Categories"}
            category
            sideBarContents={sidebarContentAdmin}
            profile
            {...props}
            signOut={() => signOut(dispatch, props.history, isAdmin)}
            isAdmin={isAdmin}
        >
            <div className="addedit-category">
                <LoadingComponent loaded={loaded} />
                <ToastContainer position="bottom-center" />
                <div className="add-category">
                    <h4 className="title">Add Category</h4>
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
                                    onChange={e => setSelectedAddGames(e)}
                                    placeholder="Select Games"
                                    value={selectedAddGames}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Description</label>
                            <textarea id="" width="100%" rows="5" placeholder="Enter the description" value={addDetails.description} name="description" onChange={handleChange}></textarea>
                        </div>
                        <button className="btn btn-primary" onClick={handleAddCategory}>ADD</button>
                    </form>
                </div>
                <hr className="faded" />
                <div className="edit-category">
                    <h4 className="title">Edit Category</h4>
                    <form onSubmit={e => e.preventDefault()}>
                        <div className="group">
                            <div className="form-group">
                                <label htmlFor="">Title</label>
                                <Select
                                    classNamePrefix="react-select"
                                    className="form-select"
                                    options={categoryOptions}
                                    menuPlacement={"auto"}
                                    onChange={e => setSelectedCategory(e)}
                                    placeholder="Select Category"
                                    value={selectedCategory}
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
                                    onChange={e => setSelectedEditGames(e)}
                                    placeholder="Select Games"
                                    value={selectedEditGames}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Description</label>
                            <textarea id="" width="100%" rows="5" placeholder="Enter the description" value={editDescription} name="description" onChange={(e) => setEditDescription(e.target.value)}></textarea>
                        </div>
                        <div className="btn-group">
                            <button className={`btn btn-secondry ${selectedCategory ? "" : "disabled"}`} onClick={handleDeleteCategory}>DELETE</button>
                            <button className={`btn btn-primary ${selectedCategory ? "" : "disabled"}`} onClick={handleEditCategory}>SAVE</button>
                        </div>
                    </form>
                </div>
            </div>
        </PageLayout>
    </div>

    )
}

export default AddEditCategory;