import React, { useLayoutEffect } from 'react';
import "./managegames.css"
import PageLayout from '../../components/pagelayout/pagelayout';
import DefaultGames from '../../components/defaultgames/DefaultGames';
import { Redirect, useParams } from 'react-router';
import { useSelector } from 'react-redux';

const sideBarContents = [
    { title: "Default Games", redirectLink: "/manage-games/default" },
    { title: "Categories", redirectLink: "/manage-games/category" },
    { title: "Objectives", redirectLink: "/manage-games/objective" },
];
const ManageGames = (props) => {
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const { gameObjectives } = useSelector(state => state.getAllObjectives);
    const { gameCategory } = useSelector(state => state.gameAllCategory);
    const { type } = useParams();
    let active = ""
    if (type === "default")
        active = "Default Games";
    else if (type === "category")
        active = "Categories";
    else if (type === "objective")
        active = "Objectives";
    let category = "Board Games";
    if (gameCategory && gameCategory.data && gameCategory.data.length > 0) {
        category = gameCategory.data[0].title
        category = category.replace("/", "-")
    }
    let objective = "";
    if (gameObjectives && gameObjectives.data && gameObjectives.data.length > 0) {
        objective = gameObjectives.data[0].title;
        objective = objective.replace("/", "-");
    }
    if (!type)
        return <Redirect to="/manage-games/default" />
    else if (type === "default") {
        return (
            <PageLayout sidebartitle="Manage Games" objective active={active} {...props} sideBarContents={sideBarContents}>
                <DefaultGames {...props} />
            </PageLayout>
        );
    }
    else if (type === "category") {
        return (
            <Redirect to={{
                pathname: "/category/" + category,
                state: { fromManageGames: true }
            }} />
        )
    }
    else {
        return (
            <Redirect to={{
                pathname: "/objective/" + objective,
                state: { fromManageGames: true }
            }} />
        )
    }
};

export default ManageGames;