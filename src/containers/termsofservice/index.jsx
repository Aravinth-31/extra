import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../../components/header/header';
import Footer from "../../components/footer/footer";
import { logOut } from '../../redux/actions/userAction';
import { getContactUs } from '../../redux/actions/homepageActions';
import { IsAdmin } from '../../helpers/helper';
const TermsofService = (props) => {
  useEffect(async () => {
    window.scrollTo(0, 0);
    if (!contactUs) {
      await dispatch(getContactUs());
    }
  },[])
  const isAdmin = IsAdmin();
  const ContactUs = useSelector((state) => state.homeContactUs);
  const { contactUs } = ContactUs;
  const dispatch = useDispatch();
  return (
    <div>
      <Header {...props} profile />
      <main className="container c-container ">
        <div className="privacy-terms">
          <h5>Terms of Service</h5>
          <span>Effective Date: Jan 10, 2021</span>
          <div className="privacy-terms-card">
            <h4>Terms</h4>
            <p>By accessing the website at <a href="https://www.extramileplay.com">https://www.extramileplay.com</a>, you are agreeing to be bound by these terms of service, all applicable laws, and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>
          </div>
          <div className="privacy-terms-card">
            <h4>Account</h4>
            <p>Your organization will provide your personal information to create the account and will have access to modify on need basis. Upon signing up to your account, you will be considered as user of the account and will have access to the website as per the role assigned to you by your organization. You are entirely responsible for maintaining the confidentiality of your account. Furthermore, you are entirely responsible for any and all activities that occur under your account. You agree to notify Extramileplay immediately of any unauthorized use of your account or any other breach of security. Extramileplay will not be liable for any loss that you may incur as a result of someone else using your account, either with or without your knowledge so long as the security or data breach is not attributable to any fraud, negligence, security breach, or misconduct on part of Extramileplay. However, you could be held liable for losses incurred by Extramileplay or another party due to unauthorized use of your account.</p>
          </div>
          <div className="privacy-terms-card">
            <h4>Disclaimer</h4>
            <p>The materials on Extramileplay’s website are provided on an 'as is' basis. Extramileplay makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, Extramileplay does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
          </div>
          <div className="privacy-terms-card">
            <h4> Data Privacy</h4>
            <p>Personal Information submitted by you or collected from your organization, whether on or through this website or otherwise and other information collected from you for the purpose of providing access to website shall be securely stored on servers hosted by a reputed Internet Service Provider (“ISP”) for a period of active contract meeting the prescribed industry security standards. Your Personal Information shall not be disclosed in any circumstances except pursuant to a valid and subsisting order of a court or other judicial, quasi-judicial or government body under applicable laws. The Website is committed to protect the security of your Personal Information and uses reasonable efforts and security measures, including, a variety of security technologies and procedures to help protect such information from any unauthorized access, use or disclosure. However, the website shall not be liable for retaining your Personal Information beyond a period of 1 day from the date of deactivation of the contract.</p>
          </div>
          <div className="privacy-terms-card">
            <h4>Publicity</h4>
            <p>Extramileplay may in its reasonable discretion include the name and/or logo of companies who are using Extramileplay in promotional activities for the purpose of referring to the user as a user of Extramileplay’s products and services.</p>
          </div>
          <div className="privacy-terms-card">
            <h4>Links</h4>
            <p>Extramileplay has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Extramileplay of the site. Use of any such linked website is at the user's own risk.</p>
          </div>
          <div className="privacy-terms-card">
            <h4>Modifications</h4>
            <p>Extramileplay may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
          </div>
          <div className="privacy-terms-card">
            <h4>Governing Law</h4>
            <p>These terms and conditions are governed by and construed in accordance with the laws of government of India and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
          </div>
          <div className="privacy-terms-card">
            <h4>Refund Policy</h4>
            <p>Refunds will only be given for subscriptions of more than 3 months that are cancelled within 7 days of the effective date of the subscription. Otherwise, there will be no refund.</p>
          </div>
        </div>
      </main>
      {contactUs && !isAdmin ? <Footer {...props} isAdmin={isAdmin} contactUs={contactUs.data} /> : ""}
    </div>
  );
};

export default TermsofService;
