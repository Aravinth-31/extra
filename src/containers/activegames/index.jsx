import React from 'react';
import Header from '../../components/header/header';
import { useDispatch } from "react-redux";
import { logOut } from "../../redux/actions/userAction";
import ActiveGamesDetail from '../../components/activeGamesDetail/activeGamesDetail';


const ActiveGames = (props)=>{
    const dispatch = useDispatch();
    const signOut = async () => {
        await dispatch(logOut());
        props.history.push("/");
      };
    return(<div>
        <Header {...props} profile signOut={signOut}/>
        <main className="container g-container">
        <ActiveGamesDetail/>
      </main>
    </div>);
}

export default ActiveGames;