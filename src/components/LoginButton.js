import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect , isAuthenticated } = useAuth0();

  const setLoginVersion =() => {
    // localStorage.setItem("userId", JSON.stringify("oauth_noId"))
    //     localStorage.setItem("userName", JSON.stringify("oauth_noName"))
    //     localStorage.setItem("userEmail", JSON.stringify("oauth_noEmail"))
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
