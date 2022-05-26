import React from 'react';
import { useAuth0, User } from "@auth0/auth0-react";
import axios from "axios";

//user.sub unique user identifier 
// ################################################################################
// # Description:  Will assign unique IDs for email users and call loginApi to
//                 insert it into the DB if it does not exist. Will set localstorage
//                 values that will be used for navbar and works page.
// # 
// # input:        NONE
// # 
// # return:       NULL
// ################################################################################
const UserLoginInfo = () => {
  const { user, isAuthenticated } = useAuth0();
  const { chekcDB, setchekcDB } = (false);
  
  // API call to add an individual into the user DB -- if they do not exist they
  // will be added, otherwise do nothing
   const putInDB = async(parsedId) => {
    const result = await axios (`http://localhost:3000/api2/addEmailLogin/${parsedId}/${user.email}/${user.nickname}`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .then(result => {localStorage.setItem("userName", JSON.stringify(result.data[0]))
    localStorage.setItem("userEmail", JSON.stringify(result.data[2]))})
    .catch(err => console.log(err));
    // console.log("navbar: " + result.data);

    setchekcDB(true)
  };
  
  if (isAuthenticated == true){ //if user is logged in...
    var uniqueLoginID = user.sub  //obtain unique login ID

    // remove the "oauth|" from the unique ID for the DB
    let parsedId = uniqueLoginID.slice(6,(uniqueLoginID.length))

    // do navbar changes w this
    // oauth does not use first and last name -- use nickname for their name
    // nickname is their email before the @company.com
    localStorage.setItem("userId", JSON.stringify(parsedId))
    localStorage.setItem("userEmail", JSON.stringify(user.email))
    localStorage.setItem("userName", JSON.stringify(user.nickname))
    localStorage.setItem("oauth_first", JSON.stringify(true))

    if (chekcDB == false) {
      putInDB(parsedId)
    }
    
  }

  return(null)

}

export default UserLoginInfo


