import React from 'react';
import { useAuth0, User } from "@auth0/auth0-react";

//user.sub unique user identifier 

const UserLoginInfo = () => {
  const { user, isAuthenticated } = useAuth0();
  
  
  if (isAuthenticated == true){
    var uniqueLoginID = user.sub
    console.log(uniqueLoginID)

    let parsedId = uniqueLoginID.slice(6,(uniqueLoginID.length))

    // do navbar changes w this
    // use nickname for their name
    localStorage.setItem("userId", JSON.stringify(parsedId))
    localStorage.setItem("userEmail", JSON.stringify(user.email))
    localStorage.setItem("userName", JSON.stringify(user.nickname))
  }

  return(null)

}

export default UserLoginInfo


