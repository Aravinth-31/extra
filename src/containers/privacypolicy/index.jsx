import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../../components/header/header';
import Footer from "../../components/footer/footer";
import { logOut } from '../../redux/actions/userAction';
import { getContactUs } from '../../redux/actions/homepageActions';
import { IsAdmin } from '../../helpers/helper';

const PrivaryPolicy = (props) => {
  useEffect(async () => {
    window.scrollTo(0, 0);
    if (!contactUs) {
      await dispatch(getContactUs());
    }
  }, [])
  const dispatch = useDispatch();
  const isAdmin = IsAdmin();
  const ContactUs = useSelector((state) => state.homeContactUs);
  const { contactUs } = ContactUs;
  const signOut = async () => {
    await dispatch(logOut());
    props.history.push("/");
  };
  return (
    <div>
      <Header {...props} profile signOut={signOut} />
      <main className="container c-container ">
        <div className="privacy-terms">
          <h5>ExtraMile Privacy Policy</h5>
          <span>Last Updated: July 16, 2021</span>
          <div className="privacy-terms-card">
            <p>
              Your privacy is important, both for you and for us at ExtraMile Play. We will do our very best to ensure that the data you let us process is handled in a secure way, with your integrity in focus. This privacy policy describes what data we collect, how and why we use it and where you can find out more.
            </p>
          </div>
          <div className="privacy-terms-card">
            <h4>How we use your Personal Data?</h4>
            <p>We use your Personal Data for operational purposes only. For example, we may use your information to send you administrative communications either about your account with us or about features of our Site, including any changes to this Privacy Policy. Whatever the purpose may be, we will only collect information to the extent reasonably necessary to fulfill your requests and our legitimate business objectives. We attempt to limit access to Personal Data about you to employees who we believe reasonably need to come into contact with that information to provide products or services to you or in order to do their jobs.</p>
            <p>We may occasionally employ other companies to perform services necessary for our internal operations, such as companies that personalize our web pages, process credit card transactions, analyze customers' interaction with our Site, and process consumer surveys. </p>
            <p>We will disclose Personal Data when we believe in good faith that disclosure is required by law (e.g., court order or subpoena) or such disclosure helps enforce:
              <ul className="numeric">
                <li key={'terms'}>(i) Our Terms of Use, contests, sweepstakes, promotions, or game rules;</li>
                <li key={'security'}>(ii) Protect your safety or security, including the safety and security of your property; or</li>
                <li key={'safety'}>(iii) Protect the safety and security of our website or third parties.</li>
              </ul>
            </p>
            <p>The security of your data is important to us and our third party vendors. When you enter sensitive information (such as credit card number and/or GST number, Pan number or other details) on our site or an affiliate sign up page, registration or order forms, both we and our third party vendors encrypt that information using secure socket layer technology (SSL).</p>
            <p>We follow generally accepted industry standards to protect the Personal Data submitted to us, both during transmission and once we receive it. No method of transmission over the Internet, or method of electronic storage, is 100% secure.</p>
          </div>
          <div className="privacy-terms-card">
            <h4>Information about Cookies:</h4>
            <p>We use cookies and/or similar technologies to analyze customer behavior, administer the website, track users’ movements, and to collect information about users. This is done in order to personalize and enhance your experience with us.</p>
            <p>A cookie is a tiny text file stored on your computer. Cookies store information that is used to help make sites work. Only we can access the cookies created by our website. You can control your cookies at the browser level. Choosing to disable cookies may hinder your use of certain functions.</p>
            <p>We use cookies for the following purposes:
              <ul className="decimal">
                <li key={'neccessary'}>
                  <h4>Necessary cookies – </h4>
                  these cookies are required for you to be able to use some important features on our website, such as logging in. These cookies don’t collect any Personal Data.
                </li>
                <li key={'functionality'}>
                  <h4>Functionality cookies – </h4>
                  these cookies provide functionality that makes using our service more convenient and makes providing more personalized features possible. For example, they might remember your name and e-mail in comment forms so you don’t have to re-enter this information next time when commenting.
                </li>
                <li key={'analytics'}>
                  <h4>Analytics cookies – </h4>
                  these cookies are used to track the use and performance of our website and services.
                </li>
                <li key={'advertising'}>
                  <h4>Advertising cookies – </h4>
                  these cookies are used to deliver advertisements that are relevant to you and to your interests. In addition, they are used to limit the number of times you see an advertisement. They are usually placed to the website by advertising networks with the website operator’s permission. These cookies remember that you have visited a website and this information is shared with other organizations such as advertisers. Often targeting or advertising cookies will be linked to site functionality provided by the other organization.
                </li>
              </ul>
              You can remove cookies stored in your computer via your browser settings.
            </p>
            <p>We use Google Analytics to measure traffic on our website. Google has their own Privacy Policy which you can review here. If you’d like to opt out of tracking by Google Analytics, visit the Google Analytics opt-out page.</p>
            <p>We reserve the right at any time to
              <ul className="numeric">
                <li key={'privacy'}>(i) change the terms of this Privacy Policy;</li>
                <li key={'including'}>(ii) change the Terms of Use, including eliminating or modifying any content on or feature of the Website; or</li>
                <li key={'charges'}>(iii) change/charge any fees or charges for use of the services.</li>
              </ul>
            </p>
            <p>Any changes we make shall be effective immediately from the notice, which we may give either by posting the new notice on the website or via electronic mail. Your use of the services after such notice will be deemed acceptance of such changes. Be sure to review changes in the Privacy Policy and Privacy Notice periodically to ensure your familiarity with the most current version. You will always be able to tell when the version was last updated by checking the "Last Revised date in the header of this Privacy Policy.</p>
          </div>
          <div className="privacy-terms-card">
            <h4>Contact Information:</h4>
            <p>If you have any questions, complaints or comments regarding our Privacy Policy Statement, you can contact us at:
              <ul>
                <li key={'road'}>Bajaj Nivas, Linking Road, Khar west</li>
                <li key={'mumbai'}>Mumbai - 400 052</li>
                <li key={'email'}>Email – <span>
                  <a href="mailto: tech@extramile.in">tech@extramile.in</a>
                </span>
                </li>
              </ul>
            </p>
          </div>
        </div>
      </main>
      {contactUs && !isAdmin ? <Footer {...props} isAdmin={isAdmin} contactUs={contactUs.data} /> : ""}
    </div>
  );
};

export default PrivaryPolicy;
