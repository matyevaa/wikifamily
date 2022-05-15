import React from "react";
import { useUserContext } from "../context/userContext";

// ################################################################################
// Description:  When logging in with Oauth sets user's name, email, and ID in the
//               local storage to later access for navbar/works purposes
// 
// input:        NONE
// 
// return:       NONE
// ################################################################################
const Dashboard = () => {
  const { user, logoutUser } = useUserContext();

    localStorage.setItem("userEmail", JSON.stringify(user.email))
    localStorage.setItem("userName", JSON.stringify(user.displayName))
    localStorage.setItem("userId", JSON.stringify(user.displayName))
    localStorage.setItem("loginVersion", JSON.stringify("oauth"))

    window.location.href="http://localhost:3005/creator=" + user.displayName + "/works"
}


export default Dashboard;
