import React, {useState, useEffect, Fragment} from 'react';
import axios from "axios";
import LoginButton from "./LoginButton"
import { Auth0Provider } from '@auth0/auth0-react';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './LogoutButton';

/* we may need to make nav bar responsive:
 * depending on the screen size, the nav bar options and login btns turns into
 * hamburger menu (without logo though) */

function Navbar(props) {
  const [dataDB, setData] = useState(false);
  const [userInfo, setUserInfo] = useState([""]);

  const {
    isAuthenticated,
    user
  } = useAuth0();


  //need to add the useEffect here
  useEffect(() => {
    getUserInfoLocal()
    // getInfo()
  }, []);

    const getUserInfoLocal = () => {
    let tempId = JSON.parse(localStorage.getItem("userId"))
    let loginVersion = JSON.parse(localStorage.getItem("loginVersion"))

    let tempName
    let tempEmail

      if (tempId != null && loginVersion == "thirdParty") {
        setData(true)
      }

      if (loginVersion == "thirdParty" && userInfo == "") {
        getInfo()

        tempName = JSON.parse(localStorage.getItem("userName"))
        tempEmail = JSON.parse(localStorage.getItem("userEmail"))
        tempId = JSON.parse(localStorage.getItem("userId"))
      }
      else if (loginVersion == "oauth" && isAuthenticated == true) {
        console.log("was oauth login")
            tempName = user.name
            tempId = user.nickname
            tempEmail = user.email

            localStorage.setItem("userId", JSON.stringify(user.nickname))
            localStorage.setItem("userName", JSON.stringify(user.nickname))
      }

      let temp = [tempName, tempEmail, tempId]
      setUserInfo(temp)
    }

    const getInfo = async() => {
      const result = await axios (`http://localhost:3000/api2/getInfo/${JSON.parse(localStorage.getItem("userId"))}`, {
        headers: { 'Content-Type': 'application/json'}
      })
      .then(result => {localStorage.setItem("userName", JSON.stringify(result.data[0]))
      localStorage.setItem("userEmail", JSON.stringify(result.data[2]))})
      .catch(err => console.log(err));
      // console.log("navbar: " + result.data);

    };

    const renderAuthButton = () => {
      if (dataDB == false && isAuthenticated == false) {
        console.log("Was not logged in");
        return  <button id="log" type="button" className="accountBtns leftButton"><a href="/login">Login</a></button>;
      } else {
        return <div>
          {console.log(userInfo)}
          <button id="welcome" className='accountBtns'>Welcome {userInfo[0]}!</button>
          {whichLogout()}
        </div>
      }
    }

    const handleLogout = () => {
      setData(false);

      localStorage.removeItem("userId")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userName")
      localStorage.removeItem("loginVersion")

      window.location.href ='http://localhost:3005/'
    }

    const whichLogout = () => {
      if (JSON.parse(localStorage.getItem("loginVersion")) == "thirdParty") {
        return <button type="button" className="accountBtns rightButton"
          onClick={() => {handleLogout(); }}>Logout</button>
      }
      else {
        return <div id= "LogoutButton"><LogoutButton/></div>
      }
    }

    const navBarConditon = () => {
      if ((dataDB == false && isAuthenticated == true || (dataDB == true && isAuthenticated == false))) {
        // console.log("should show create tree");
        return <div>
        <li id="nav_item"> <a href= { gettingUserId() }>Works</a></li>
        </div>
      }
    }

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
