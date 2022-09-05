import React from "react";
import "./sidemenubar.css";
import { Link } from "react-router-dom";
import SideBar from "../sidebar/sidebar";
const sideBarContents = [
  { title: "Home", redirectLink: "/" },
  { title: "AllGames", redirectLink: "/all-games" },
  { title: "Objectives", redirectLink: "" },
  { title: "Features", redirectLink: "" },
  { title: "Plans", redirectLink: "" },
  { title: "Payments", redirectLink: "" },
  { title: "Others", redirectLink: "" }
];
function SideMenuBar(props) {
    const ref = React.createRef();
    if (props.showMenu) {
        // const element = document.getElementById("sideMenuBar")
        const element = ref.current
        if (element)
            element.classList.add("show");
    }
    else {
        // const element = document.getElementById("sideMenuBar")
        const element = ref.current
        if (element)
            element.classList.remove("show");
    }
    var active = "Home";
    if (props.history && props.history.location && props.history.location.pathname && props.history.location.pathname.split("/")[1] !== "")
        active = props.history.location.pathname.split("/")[1];
    return (
        <div><div className="side-bar" ref={ref} id="sideMenuBar">
            <SideBar
                {...props}
                sidebartitle={""}
                sideBarContents={sideBarContents}
                active={active}
            />
        </div>
            {/* <div className="side-bar" id="sideMenuBar">
  if (props.showMenu) {
    const element = document.getElementById("sideMenuBar");
    if (element) element.classList.add("show");
  } else {
    const element = document.getElementById("sideMenuBar");
    if (element) element.classList.remove("show");
  }
  var active = "Home";
  if (
    props.history &&
    props.history.location &&
    props.history.location.pathname &&
    props.history.location.pathname.split("/")[1] !== ""
  )
    active = props.history.location.pathname.split("/")[1];
  return (
    <div>
      <div className="side-bar" id="sideMenuBar">
        <SideBar
          {...props}
          sidebartitle={""}
          sideBarContents={sideBarContents}
          active={active}
        />
      </div>
      {/* <div className="side-bar" id="sideMenuBar">
                <ul style={{}}>
                    <li className="active">
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/all-games'>All Games</Link>
                    </li>
                    <li>
                        <Link>Objectives</Link>
                    </li>
                    <li>
                        <Link>Feautres</Link>
                    </li>
                    <li>
                        <Link>Plans</Link>
                    </li>
                    <li>
                        <Link>Payments</Link>
                    </li>
                    <li>
                        <Link>Others</Link>
                    </li>
                </ul>
            </div> */}
      {/* {
                props.showMenu &&
                <div style={{ height: "100vh", position: "fixed", width: "100%", zIndex: "10" }} onClick={() => {
                    props.setShowMenu(prevState => !prevState);
                }}></div>
            } */}
    </div>
  );
}

export default SideMenuBar;
