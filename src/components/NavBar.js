import React, {useState} from 'react';
import axios from "axios";

/* we may need to make nav bar responsive:
 * depending on the screen size, the nav bar options and login btns turns into
 * hamburger menu (without logo though) */

function Navbar(props) {
  const [dataDB, setData] = useState();
  const [userInfo, setUserInfo] = useState([]);

  // returns the user data (full name ID and email)
    const getUserInfo = async() => {
      const userData = await axios ('/api2/info', {
        mode: "no-cors",
        headers: { 'Content-Type': 'application/json'}
      })
      .catch(err => console.log(err));

      console.log("inside getUserInfo, name: " + userData.data['0']['name'] + " " + userData.data['0']['id'] + " " + userData.data['0']['email']);
      console.log(userData.data['0']);
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
    };

    const loggedIn = async() => {
      const result = await axios ('/api2/isLoggedIn', {
        mode: "cors",
        headers: { 'Content-Type': 'application/json'}
      })
      .catch(err => console.log(err));
      console.log("isLoggedIn: " + result.data);
      setData(result.data);
      console.log(dataDB);
    };

    const renderAuthButton = () => {
      loggedIn();
      
      console.log("in renderAuthButton " + dataDB);
      console.log("should output: " + userInfo)

      if (dataDB == false) {
        console.log("Was not logged in");
        return  <button type="button" className="accountBtns leftButton"><a href="/login">Login</a></button>;
      } else {
        console.log("Was logged in: " + userInfo[0]);
        // getUserInfo(); // workds but makes api go into infinite loop
        return <div>
          {/* <p>Welcome {userInfo[0]}</p> */}
          <button className='accountBtns' onClick={getUserInfo}>Welcome {userInfo[0]}!</button>
          <button type="button" className="accountBtns rightButton"  
          onClick={() => { facebookLogout(); handleLogout(); }}>Logout</button>
        </div>
      }
    }

    const handleLogout = () => {
      console.log("before " + dataDB);
      setData(false);
      console.log("after " + dataDB);
    }

    const navBarConditon = () => {
      loggedIn();

      if (dataDB != false) {
        console.log("should show create tree");
        return <li id="nav_item"><a href="/create">CreateTree</a></li>
      }
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