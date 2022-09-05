import React, { useEffect } from 'react';
import './organisationDetails.css';
import Header from "../../components/header/header";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/actions/userAction";
import OrganisationDetailsCard from '../../components/organisationDetailsCard/organisationDetailsCard';
import { getPlanDetails } from "../../redux/actions/gameDetailAction";


const OrganisationDetails = (props) => {
    const dispatch = useDispatch();
    const { selectedPlanDetails } = useSelector(state => state.getPlanDetails);
    const signOut = async () => {
        await dispatch(logOut());
        props.history.push("/");
    }
    useEffect(() => {
        dispatch(getPlanDetails(props.match.params.id));
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <Header {...props} profile signOut={signOut} />
            <main className="container c-container">
                <OrganisationDetailsCard selectedPlanDetails={selectedPlanDetails} {...props}/>

            </main>
        </div>
    );
};
export default OrganisationDetails;
