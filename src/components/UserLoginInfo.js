import React from 'react';
import { useAuth0, User } from "@auth0/auth0-react";

//user.sub unique user identifier 

const UserLoginInfo = () => {
  const { user, isAuthenticated } = useAuth0();
  
  
  if (isAuthenticated == true){
    var uniqueLoginID = user.sub
    console.log(uniqueLoginID)
  }

  return(null)

}

export default UserLoginInfo


