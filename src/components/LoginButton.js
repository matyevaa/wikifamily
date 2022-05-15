import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// ################################################################################
// Description:  Handles oauth login for user 
// 
// input:        tree_id -- the current tree ID to add a new individual
// 
// return:       renders login button
// ################################################################################
const LoginButton = () => {
  const { loginWithRedirect , isAuthenticated } = useAuth0();

  // will help to differentiate bt third party and oauth login for navbar
  const setLoginVersion =() => {
    localStorage.setItem("loginVersion", JSON.stringify("oauth"))

  }

  return (
    !isAuthenticated && (
      <button id="login_btn" onClick={() => {loginWithRedirect(); setLoginVersion()}}>
        Log in with Email
      </button>
    )
  )
}

export default LoginButton
