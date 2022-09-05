import React from 'react';

import Header from '../../components/header/header';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AddUser from '../../components/adduser/AddUser';
import '../../components/reportstable/reportstable.css';
import '../customegame/customegame.css';
import "./manageteam.css";
import '../../components/plandetail/plandetail.css';
//import '../../components/databasecontent/index.css';
import '../../components/adduser/index.css';
import '../../components/paymentDetails/paymentDetails.css';
import UsersData from '../../components/usersData/usersData';
import { useDispatch } from 'react-redux';
import { logOut } from '../../redux/actions/userAction';

const ManageTeam = (props) => {
    const dispatch = useDispatch();
    const signOut = async () => {
        await dispatch(logOut());
        if (props.history)
            props.history.push("/");
    };
    return (
        <div>
            <Header signOut={signOut} {...props} profile />
            <main className="container conatiner-960 ">
                <div className="manageteam-wrapper">
                    <div className="plandetail-premium database-heading">
                        <h5>Manage Team</h5>
                    </div>
                    <Tabs className="cg-tabs reports-tab databse-tabs">
                        <TabList>
                            <Tab>User data</Tab>
                            <Tab>Add Users/User</Tab>
                        </TabList>
                        <TabPanel>
                            <UsersData />
                        </TabPanel>
                        <TabPanel>
                            <AddUser />
                        </TabPanel>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default ManageTeam;