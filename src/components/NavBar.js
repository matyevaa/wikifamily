import React, {useState, useEffect, Fragment} from 'react';
import axios from "axios";
import LoginButton from "./LoginButton"
import { Auth0Provider } from '@auth0/auth0-react';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './LogoutButton';

/* we may need to make nav bar responsive:
 * depending on the screen size, the nav bar options and login btns turns into
 * hamburger menu (without logo though) */

// ################################################################################
// Description:  Navbar for the different pages users have access to 
//               if logged in -- shows works page
// 
// input:        props
// 
// return:       renders navbar 
// ################################################################################
function Navbar(props) {
  const [dataDB, setData] = useState(false);
  const [userInfo, setUserInfo] = useState([""]);

  const {
    isAuthenticated,
    user
  } = useAuth0();

  useEffect(() => {
    getUserInfoLocal()
  }, []);

    // differentiate between email login or third party
    const getUserInfoLocal = () => {
    let tempId = JSON.parse(localStorage.getItem("userId"))
    let loginVersion = JSON.parse(localStorage.getItem("loginVersion"))
    let tempName
    let tempEmail

      if (tempId != null && loginVersion == "thirdParty") {
        setData(true)
      }

      // if it was a third party login call for the API funct and set the
      // values in the localstorage 
      if (loginVersion == "thirdParty" && userInfo == "") {
        getInfo()

        tempName = JSON.parse(localStorage.getItem("userName"))
        tempEmail = JSON.parse(localStorage.getItem("userEmail"))
        tempId = JSON.parse(localStorage.getItem("userId"))
      }
      else if (loginVersion == "oauth") {
        // otherwise it was email login and get info from localstorage
            console.log("was oauth login")
            tempName = JSON.parse(localStorage.getItem("userName"))
            tempId = JSON.parse(localStorage.getItem("userId"))
            tempEmail = JSON.parse(localStorage.getItem("userEmail"))
      }

      // sets user info 
      let temp = [tempName, tempEmail, tempId]
      setUserInfo(temp)
    }

    // API call for getting the users info in the case they logged in w Google/FB
    const getInfo = async() => {
      const result = await axios (`http://localhost:3000/api2/getInfo/${JSON.parse(localStorage.getItem("userId"))}`, {
        headers: { 'Content-Type': 'application/json'}
      })
      .then(result => {localStorage.setItem("userName", JSON.stringify(result.data[0]))
      localStorage.setItem("userEmail", JSON.stringify(result.data[2]))})
      .catch(err => console.log(err));
    };

    // whether login button is shown or welcome logged in user
    const renderAuthButton = () => {
      if (dataDB == false && isAuthenticated == false) {
        console.log("Was not logged in");
        return  <button id="log" type="button" className="accountBtns leftButton"><a href="/login">Login</a></button>;
      } else {
        return <div>
          {console.log(userInfo)}
          <p id="welcome" className='accountBtns'>Welcome {userInfo[0]}!</p>
          {whichLogout()}
        </div>
      }
    }

    // removes information from the localstorage when logging out
    const handleLogout = () => {
      setData(false);

      localStorage.removeItem("userId")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userName")
      localStorage.removeItem("loginVersion")

      // redirects logged out user to the main homepage
      window.location.href ='http://localhost:3005/'
    }

    // differentiates bt what logout is necessary -- third party of oauth
    const whichLogout = () => {
      if (JSON.parse(localStorage.getItem("loginVersion")) == "thirdParty") {
        return <button type="button" className="accountBtns rightButton"
          onClick={() => {handleLogout(); }}>Logout</button>
      }
      else {
        return <div id= "LogoutButton" ><LogoutButton/></div>
      }
    }

    // If a user is logged in show the works page
    const navBarConditon = () => {
      if ((dataDB == false && isAuthenticated == true || (dataDB == true && isAuthenticated == false))) {
        // console.log("should show create tree");
        return <div>
        <li id="nav_item"> <a href= { gettingUserId() }>Works</a></li>
        </div>
      }
    }

    // returns the users specific works page given their user id
    const gettingUserId = () => {
      let saved = JSON.parse(localStorage.getItem("userId"))
      return "http://localhost:3005/creator=" + userInfo[2] + "/works"

    }

  return (
          <div className="nav">
            <div className="navLogo">
              <img className="logo"  src="/Wiki.png" alt="wikiFamily Logo" />
            </div>

            <div className="navLinks">
              <ul className="nav_list">
                <li id="nav_item" className="active"><a href="/">Home</a></li>
                {navBarConditon()}
                <li id="nav_item"><a href="/help">Help</a></li>
                <li id="nav_item"><a href="/about">About</a></li>
              </ul>
            </div>

            <div className="accountContainer">
              {renderAuthButton()}
            </div>
         </div>
        );

}

export default Navbar;
