import React,{useEffect} from 'react';

import Header from '../../components/header/header';
import InteractiveEngagement from '../../components/interactiveengagement';
import Footer from '../../components/footer/footer';
import { useDispatch,useSelector } from "react-redux";
import { logOut } from "../../redux/actions/userAction";
import {getContactUs} from "../../redux/actions/homepageActions";
import { IsAdmin } from '../../helpers/helper';


const HowItWorks = (props) => {
  const dispatch=useDispatch();
  let isAdmin = IsAdmin();
  const { contactUs } = useSelector((state) => state.homeContactUs);
  const signOut = async () => {
    await dispatch(logOut());
    props.history.push("/");
  };
  useEffect(async () => {
    await dispatch(getContactUs());
  }, []);
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[]);
  
  return(
    <div>
      <Header profile {...props} signOut={signOut} isAdmin={isAdmin}/>
      <main className="container pad0">
      <InteractiveEngagement/>
      </main>
      {contactUs ? <Footer {...props} isAdmin={isAdmin} contactUs={contactUs.data} /> : ""}
    </div>
  );
};

export default HowItWorks;