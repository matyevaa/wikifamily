import React from 'react';
import { useAuth0, User } from "@auth0/auth0-react";
import axios from "axios";

//user.sub unique user identifier 

const UserLoginInfo = () => {
  const { user, isAuthenticated } = useAuth0();
  const { chekcDB, setchekcDB } = (false);
  
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
  
  if (isAuthenticated == true){
    var uniqueLoginID = user.sub
    console.log(uniqueLoginID)

    let parsedId = uniqueLoginID.slice(6,(uniqueLoginID.length))

    // do navbar changes w this
    // use nickname for their name
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


