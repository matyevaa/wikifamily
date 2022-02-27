import React, {useState, useEffect} from 'react';
import axios from "axios";
import { useUserContext } from "../context/userContext";

/* we may need to make nav bar responsive:
 * depending on the screen size, the nav bar options and login btns turns into
 * hamburger menu (without logo though) */

function Navbar(props) {
  const [dataDB, setData] = useState(false);
  const [userInfo, setUserInfo] = useState([""]);
  const { user, logoutUser } = useUserContext();
  // const [userInfo, setUserInfo] = useState([]);

  //need to add the useEffect here
  useEffect(() => {
    getUserInfoLocal()
  }, []);

  // returns the user data (full name ID and email)
    /* const getUserInfo = async() => {
      const userData = await axios ('/api2/info', {
        mode: "no-cors",
        headers: { 'Content-Type': 'application/json'}
      })
      .catch(err => console.log(err));

      // console.log("inside getUserInfo, name: " + userData.data['0']['name'] + " " + userData.data['0']['id'] + " " + userData.data['0']['email']);
      // console.log(userData.data['0']);
      let temp = [userData.data['0']['name'], userData.data['0']['id'], userData.data['0']['email']];
      setUserInfo(temp);
      console.log("in gettingUserData: " + userInfo);
    };

    const facebookLogout = async() => {
      const result = await axios ('/api2/logout', {
        // mode: "cors",
        headers: { 'Content-Type': 'application/json'}
      })
      .catch(err => console.log(err));
      console.log(result);
      localStorage.removeItem("userId")
      window.location.href='http://localhost:3005/';
    };

    const loggedIn = async() => {
      const result = await axios ('/api2/isLoggedIn', {
        mode: "cors",
        headers: { 'Content-Type': 'application/json'}
      })
      .catch(err => console.log(err));
      setData(result.data);
      console.log("isLoggedIn:" + dataDB);
    }; */

    const getUserInfoLocal = () => {
    let tempName = JSON.parse(localStorage.getItem("userId"))
    let tempEmail = JSON.parse(localStorage.getItem("userEmail"))
    let temp = [tempName, tempEmail]

      if (tempName != null || tempEmail != null) {
        setData(true)
      }

      setUserInfo(temp)
    }

    const renderAuthButton = () => {
      // loggedIn();
      // getUserInfoLocal();

      if (dataDB == false) {
        console.log("Was not logged in");
        return  <button type="button" className="accountBtns leftButton"><a href="/login">Login</a></button>;
      } else {
        console.log("user name:" + userInfo[0]);
        console.log("user name:" + userInfo[1]);
        // getUserInfo(); // workds but makes api go into infinite loop
        return <div>
          <button className='accountBtns'>Welcome {JSON.parse(localStorage.getItem("userId"))}!</button>
          {/* <button className='accountBtns'>Welcome {user.displayName}!</button> */}
          <button type="button" className="accountBtns rightButton"  
          onClick={() => {handleLogout(); }}>Logout</button>
        </div>
      }
    }

    const handleLogout = () => {
      // console.log("before " + dataDB);
      setData(false);
      localStorage.removeItem("userId")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userId2")

      logoutUser()
      return "http://localhost:3005/"
      // console.log("after " + dataDB);
    }

    const navBarConditon = () => {
      // loggedIn();

      if (dataDB != false) {
        console.log("should show create tree");
        return <div><li id="nav_item"><a href="/create">CreateTree</a></li>
        <li id="nav_item"> <a href= { gettingUserId() }>Works</a></li></div>
      }
    }

    const gettingUserId = () => {
      let saved = JSON.parse(localStorage.getItem("userId"))

      return "http://localhost:3005/creator=" + saved + "/works"
      
    }
  
  return (
          <div className="nav">
            <div className="navLogo">
              <img className="logo"  src="/logo192_70x70.png" alt="wikiFamily Logo" />
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
            {/* <button type="button" onClick={getUserInfo}>see info</button> */}
              {renderAuthButton()}
            </div>
         </div>
        );

}

export default Navbar;