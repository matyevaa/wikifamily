import React from "react";
import { useUserContext } from "../context/userContext";

const Dashboard = () => {
  const { user, logoutUser } = useUserContext();

    localStorage.setItem("userEmail", JSON.stringify(user.email))
    localStorage.setItem("userName", JSON.stringify(user.displayName))
    localStorage.setItem("userId", JSON.stringify(user.displayName))
    localStorage.setItem("loginVersion", JSON.stringify("oauth"))

    window.location.href="http://localhost:3005/creator=" + user.displayName + "/works"
}


export default Dashboard;
