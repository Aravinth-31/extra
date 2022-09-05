import React from "react";
import "./testimonials.css";
import Header from '../../components/header/header';
import { logOut } from "../../redux/actions/userAction";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Slider from "react-slick";
import PhoneInput from 'react-phone-input-2';
import CountUp from "react-countup"

/*images*/
import group from "../../assets/images/testimonials/Group.svg";
import ideaclock from "../../assets/images/testimonials/idea_clock.png";
import ideaBrain from "../../assets/images/testimonials/idea_brain.png";
import helpSteps from "../../assets/images/testimonials/help_steps.png";
import percentage from "../../assets/images/testimonials/percentage.png";
import ideaBox from "../../assets/images/testimonials/idea_box.png";
import hybridPlatform from "../../assets/images/testimonials/hybrid_platform.png";
import employeePaced from "../../assets/images/testimonials/employee_paced.png";
import liveWebinars from "../../assets/images/testimonials/live_webinars.png";
import bigHeist from "../../assets/images/testimonials/big_heist.jpg";
import squidGame from "../../assets/images/testimonials/squid_game.jpg";
import champion from "../../assets/images/testimonials/champion.jpg";
import down_and_cross from "../../assets/images/testimonials/down_and_cross.jpg";
import room_to_escape from "../../assets/images/testimonials/room_to_escape.jpg";
import back_to_school from "../../assets/images/testimonials/back_to_school.jpg";
import bin_toss from "../../assets/images/testimonials/bin_toss.jpg";
import full_house from "../../assets/images/testimonials/full_house.jpg";
import keySight from "../../assets/images/testimonials/keysight_technologies.png";
import rbl_bank from "../../assets/images/testimonials/rbl_bank.png";
import quess from "../../assets/images/testimonials/quess.png";
import uno_minda from "../../assets/images/testimonials/uno_minda.png";
import tata from "../../assets/images/testimonials/tata.png";
import instagram from "../../assets/images/testimonials/instagram.png";
import facebook from "../../assets/images/testimonials/facebook.png";
import twitter from "../../assets/images/testimonials/twitter.png";
import linkedin from "../../assets/images/testimonials/linkedin.png";
import youtube from "../../assets/images/testimonials/youtube.png";
import topArrow from "../../assets/images/testimonials/top_arrow.png";
import kosmosLogo from "../../assets/images/testimonials/1kosmos.jpg";
import brotherLogo from "../../assets/images/testimonials/Brotherlogo.png";
import cglxFullLogo from "../../assets/images/testimonials/cglx-full-logo1.png";
import colliersLogo from "../../assets/images/testimonials/Colliers.png";
import cource5iLogo from "../../assets/images/testimonials/Course5i.jpg";
import i2eLogo from "../../assets/images/testimonials/i2eLogo.png";
import lucidatechnologiesLogo from "../../assets/images/testimonials/LucidaTechnologies.png";
import maricoLogo from "../../assets/images/testimonials/maricologo.png";
import medlineLogo from "../../assets/images/testimonials/Medline.png";
import merinoLogo from "../../assets/images/testimonials/Merino.jpg";
import metroserviceLogo from "../../assets/images/testimonials/MetroServices.png";
import tatacommunicationsLogo from "../../assets/images/testimonials/tatacommunications.png";
import yaraLogo from "../../assets/images/testimonials/yara.png";


import { useState } from "react";
import { useEffect } from "react";
import { addDemoRequest } from "../../redux/actions/commonActions";
import { ToastContainer } from "react-toastify";
import { failureAlert } from "../../helpers/helper";
import DemoRequestModal from "../../components/modal/demorequestmodal";

const Testimonials = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const banner = {
        dots: true,
        infinite: true,
        speed: 1500,
        slidesToShow: 1,
        slidesToScroll: 1,
        className: "testimonials-slider",
        autoplay: true,
        autoplaySpeed: 5000,
        // lazyLoad: "progressive"
        // fade:true
    };
    const games = {
        dots: true,
        infinite: true,
        arrows: false,
        speed: 1500,
        slidesToShow: 4,
        slidesToScroll: 4,
        // lazyLoad: "progressive",
        className: 'gameslider',
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            }
        ],

    };
    const companies = {
        dots: true,
        infinite: true,
        arrows: false,
        speed: 1500,
        slidesToShow: 4,
        slidesToScroll: 4,
        // lazyLoad: "progressive",
        className: 'gameslider',
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            }
        ],
    };

    const [details, setDetails] = useState({
        email: "",
        phoneNumber: "",
        companyName: ""
    })
    const [touched, setTouched] = useState({
        email: false,
        phoneNumber: false,
        companyName: false
    });
    const [validPhone, setValidPhone] = useState(true);
    const [dialCodeLength, setDialCodeLength] = useState(0);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [openDemoRequestModal, setOpenDemoRequestModal] = useState(false);

    const utm_source = new URLSearchParams(props.location.search).get('utm_source');
    const utm_campaign = new URLSearchParams(props.location.search).get('utm_campaign');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prevState => ({
            ...prevState,
            [name]: true
        }));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({ phoneNumber: true, companyName: true, email: true });
        setSubmitClicked(true);
    }
    useEffect(() => {
        const callBack = async () => {
            if (submitClicked) {
                if (JSON.stringify(validate()) === JSON.stringify({ email: "", phoneNumber: "", companyName: "" })) {
                    let phone = "";
                    if (details.phoneNumber !== "" && details.phoneNumber.length > dialCodeLength)
                        phone = details.phoneNumber;
                    let source = ""
                    if (utm_source)
                        source = utm_source
                    let campaign = ""
                    if (utm_campaign) {
                        if (utm_campaign.toLowerCase().includes("discovery"))
                            campaign = "Discovery";
                        else
                            campaign = "Search";
                    }
                    const response = await dispatch(addDemoRequest({ emailId: details.email, phone, companyName: details.companyName, source, campaign }));
                    if (response === 200) {
                        setOpenDemoRequestModal(true);
                        setDetails({ companyName: "", email: "", phoneNumber: "" });
                        setTouched({ phoneNumber: false, companyName: false, email: false });
                    }
                    else
                        failureAlert("Something went wrong! Try again later.");
                }
                setSubmitClicked(false);
            }
        }
        callBack();
    }, [submitClicked])

    const signOut = async () => {
        await dispatch(logOut());
        history.push("/");
    };

    function validateEmail(email) {
        // const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const re = /^\w+([\.\$\#\!\&\%\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(String(email).toLowerCase());
    }
    const validate = () => {
        const error = {
            email: "",
            phoneNumber: "",
            companyName: ""
        }
        if (touched.email && !validateEmail(details.email))
            error.email = "*Please enter valid email";
        if (touched.phoneNumber && !validPhone)
            error.phoneNumber = "*Please enter valid phone number";
        if (touched.companyName && details.companyName.length <= 1)
            error.companyName = "*Please enter valid company name";
        return error;
    }
    const errors = validate();

    return (
        <div className="testimonials-container">
            <Header signOut={signOut} {...props} />
            <ToastContainer position='bottom-center' />
            <div className="top">
                <img src={group} alt="" />
                <h4>Engage your hybrid teams anytime, anywhere with the first-ever and only SaaS tool of employee engagement</h4>
                <form onSubmit={(e) => e.preventDefault()}>
                    <h5>REQUEST DEMO</h5>
                    <div className="form-group">
                        {/* <label htmlFor="">Work email id*</label> */}
                        <input type="text" value={details.email} onChange={handleChange} name="email" className="form-field" onBlur={handleBlur} placeholder="Enter your work email id" />
                        <div className="error-message">{errors.email}</div>
                    </div>
                    <div className="form-group">
                        {/* <label htmlFor="">Company Name*</label> */}
                        <input type="text" value={details.companyName} onChange={handleChange} name="companyName" className="form-field" onBlur={handleBlur} placeholder="Enter your company name" />
                        <div className="error-message">{errors.companyName}</div>
                    </div>
                    <div className="form-group">
                        {/* <label htmlFor="">Phone Number</label> */}
                        <PhoneInput
                            type="numbers"
                            name="phoneNumber"
                            enableLongNumbers
                            placeholder="+91 xxxxx-xxxxx"
                            country="in"
                            onChange={(val, country, e, formattedValue) => {
                                if (country && country.dialCode)
                                    setDialCodeLength(country.dialCode.length);
                                if (country && ((country.format && formattedValue && formattedValue.length === country.format.length) || (val.length <= country.dialCode.length)))
                                    setValidPhone(true);
                                else
                                    setValidPhone(false);
                                setDetails((prevState) => ({
                                    ...prevState,
                                    phoneNumber: val
                                }))
                            }}
                            onBlur={() => handleBlur({ target: { name: "phoneNumber" } })}
                            value={details.phoneNumber}
                            id="phoneNo"
                        />
                        <div className="error-message">{errors.phoneNumber}</div>
                    </div>
                    <button onClick={handleSubmit} className="btn submit">Submit</button>
                    {/* <button className="btn download">DOWNLOAD ENGAGEMENT CALENDER</button> */}
                </form>
            </div>
            <div className="stats">
                <div className="stat1">
                    <h4 className="count" ><CountUp delay={2} end={85} duration={3} />+</h4>
                    <h5 className="desc">Ready-To-Play Gamifications</h5>
                </div>
                <div className="stat2">
                    <h4 className="count"><CountUp delay={2} end={4} duration={3} />lac+</h4>
                    <h5 className="desc">Employees Engaged</h5>
                </div>
                <div className="stat3">
                    <h4 className="count"><CountUp delay={2} end={12} duration={3} />+</h4>
                    <h5 className="desc">Countries Covered</h5>
                </div>
                <div className="stat4">
                    <h4 className="count"><CountUp delay={2} end={650} duration={3} />+</h4>
                    <h5 className="desc">Organizations Reached</h5>
                </div>
                <div className="stat5">
                    <h4 className="count"><CountUp delay={2} end={10} duration={3} />+</h4>
                    <h5 className="desc">Years EE Experience</h5>
                </div>
            </div>
            <div className="why-extramile">
                <h4>Why Extramile PLAY?</h4>
                <div className="points">
                    <div className="point">
                        <img src={ideaclock} alt="" />
                        <span>One-stop solution for EE</span>
                    </div>
                    <div className="point">
                        <img src={ideaBrain} alt="" />
                        <span>Credible with years of experience and learnings</span>
                    </div>
                    <div className="point">
                        <img src={helpSteps} alt="" />
                        <span>Creating a pull instead of push for engagement</span>
                    </div>
                    <div className="point">
                        <img src={percentage} alt="" />
                        <span>Cost-effective and consistent offerings</span>
                    </div>
                    <div className="point">
                        <img src={ideaBox} alt="" />
                        <span>New content every month to keep teams engaged</span>
                    </div>
                </div>
            </div>
            <div className="how-we-do">
                <h4>How We Do It</h4>
                <div className="group">
                    <img src={hybridPlatform} alt="" />
                    <img src={employeePaced} alt="" />
                    <img src={liveWebinars} alt="" />
                </div>
            </div>
            <div className="most-played-games">
                <h4>Most Played Games</h4>
                <div className="games">
                    <Slider {...games}>
                        <div><img src={bigHeist} alt="" /></div>
                        <div><img src={squidGame} alt="" /></div>
                        <div><img src={champion} alt="" /></div>
                        <div><img src={down_and_cross} alt="" /></div>
                        <div><img src={room_to_escape} alt="" /></div>
                        <div><img src={back_to_school} alt="" /></div>
                        <div><img src={full_house} alt="" /></div>
                        <div><img src={bin_toss} alt="" /></div>
                    </Slider>
                </div>
            </div>
            <div className="corporates-believes">
                <h4>Corporates believing in PLAY</h4>
                <div className="companies">
                    <Slider {...companies}>
                        <div><img src={keySight} alt="" /></div>
                        <div><img src={rbl_bank} alt="" /></div>
                        <div><img src={quess} alt="" /></div>
                        <div><img src={uno_minda} alt="" /></div>
                        <div><img src={kosmosLogo} alt="" /></div>
                        <div><img src={brotherLogo} alt="" /></div>
                        <div><img src={cglxFullLogo} alt="" /></div>
                        <div><img src={colliersLogo} alt="" /></div>
                        <div><img src={cource5iLogo} alt="" /></div>
                        <div><img src={i2eLogo} alt="" /></div>
                        <div><img src={lucidatechnologiesLogo} alt="" /></div>
                        <div><img src={maricoLogo} alt="" /></div>
                        <div><img src={medlineLogo} alt="" /></div>
                        <div><img src={merinoLogo} alt="" /></div>
                        <div><img src={metroserviceLogo} alt="" /></div>
                        <div><img src={tatacommunicationsLogo} alt="" /></div>
                        <div><img src={yaraLogo} alt="" /></div>
                    </Slider>
                </div>
            </div>
            {/* <div className="what-they-say">
                <h4>What they say about PLAY</h4>
                <div className="companies">
                    <Slider {...banner} >
                        <div className="company-card">
                            <img src={tata} alt="" className="logo" />
                            <div className="details">
                                <h5 className="name">TATA</h5>
                                <p className="review">Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore et aut iusto eligendi quam consequatur eius molestiae, laudantium reiciendis, dicta vitae nobis delectus provident, est natus ipsum. Illum, ducimus, quas ratione sequi suscipit officia optio at nobis rem consequatur, ullam nihil. Maiores possimus dolor dolorem harum, ipsum vel pariatur consequuntur?.</p>
                            </div>
                        </div>
                        <div className="company-card">
                            <img src={tata} alt="" className="logo" />
                            <div className="details">
                                <h5 className="name">TATA</h5>
                                <p className="review">Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore et aut iusto eligendi quam consequatur eius molestiae, laudantium reiciendis, dicta vitae nobis delectus provident, est natus ipsum. Illum, ducimus, quas ratione sequi suscipit officia optio at nobis rem consequatur, ullam nihil. Maiores possimus dolor dolorem harum, ipsum vel pariatur consequuntur?.</p>
                            </div>
                        </div>
                        <div className="company-card">
                            <img src={tata} alt="" className="logo" />
                            <div className="details">
                                <h5 className="name">TATA</h5>
                                <p className="review">Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore et aut iusto eligendi quam consequatur eius molestiae, laudantium reiciendis, dicta vitae nobis delectus provident, est natus ipsum. Illum, ducimus, quas ratione sequi suscipit officia optio at nobis rem consequatur, ullam nihil. Maiores possimus dolor dolorem harum, ipsum vel pariatur consequuntur?.</p>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div> */}
            <div className="bottom">
                <Link to={"/faq"}><button className="btn">Have Questions, Visit FAQ's</button></Link>
                <h4>Share This Page</h4>
                <div className="social-medias">
                    <a href="https://instagram.com/extramile_engage?igshid=r82948xcvyfg"><img src={instagram} alt="" /></a>
                    <a href="https://www.facebook.com/ExtraMileEngage/"><img src={facebook} alt="" /></a>
                    {/* <a href="https://www.twitter.com/"><img src={twitter} alt="" /></a> */}
                    <a href="https://www.linkedin.com/company/extramile-engage-mumbai/mycompany/"><img src={linkedin} alt="" /></a>
                    <a href="https://www.youtube.com/channel/UCKcWQ-_zBrH0fJmuCR_eUyg/videos"><img src={youtube} alt="" /></a>
                </div>
                <div className="goto-top" onClick={() => {
                    document.body.scrollTo({ top: 0, behavior: 'smooth' });
                    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
                }}>
                    <img src={topArrow} alt="" />
                    <span>Go To The Top</span>
                </div>
            </div>
            {
                openDemoRequestModal &&
                <DemoRequestModal modalid={"demo-request-modal"} toggle={openDemoRequestModal} setOpenDemoRequestModal={setOpenDemoRequestModal} thankonly />
            }
        </div>
    )
}

export default Testimonials;