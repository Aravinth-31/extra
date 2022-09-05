import React, { useEffect } from 'react';

import Header from '../../components/header/header';
import FaqComponent from '../../components/faqcomponent/faq.jsx';
import Footer from '../../components/footer/footer';
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/actions/userAction";
import { getContactUs } from "../../redux/actions/homepageActions";
import { IsAdmin } from '../../helpers/helper';
import { useLayoutEffect } from 'react';


const Faq = (props) => {
  const dispatch = useDispatch();
  var isAdmin = IsAdmin();
  const { contactUs } = useSelector((state) => state.homeContactUs);
  const signOut = async () => {
    await dispatch(logOut());
    props.history.push("/");
  };
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(async ()=>{
    await dispatch(getContactUs());
  },[])
  return (
    <div>
      <Header profile  {...props} signOut={signOut} isAdmin={isAdmin} />
      <main className="container pad0">
        <FaqComponent />
      </main>
      {contactUs ? <Footer {...props} isAdmin={isAdmin} contactUs={contactUs.data} /> : ""}
    </div>
  );
};

export default Faq;