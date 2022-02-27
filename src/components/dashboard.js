import React from "react";
import { useUserContext } from "../context/userContext";

const Dashboard = () => {
  const { user, logoutUser } = useUserContext();

  //save the user info in localStorage for now
  // const setUserInfoLocal = () => {
    localStorage.setItem("userEmail", JSON.stringify(user.email))
    localStorage.setItem("userId", JSON.stringify(user.displayName))
  // }

  return (
    <div>
      <h1>Dashboard </h1>
      <h2>Name : {user.displayName}</h2>
      <h2>Email : {user.email}</h2>
      <button onClick={logoutUser}>Log out</button>
    </div>
  );
};

export default Dashboard;
