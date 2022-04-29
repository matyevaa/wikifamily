import React, {useState, useEffect, Component} from 'react'
import { Link } from "react-router-dom";
import axios from "axios";
// import { render } from '@testing-library/react';
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from '../components/LoginButton';





const Login = () => {
  const { loginWithRedirect , isAuthenticated } = useAuth0();

  useEffect(() => {
    // checkLogin();
  }, []);

  const checkLogin = async() => {
    const result = await axios ('/api2/login', {
      mode: "no-cors",
      headers: { 'Content-Type': 'application/json'}
    })
    .catch(err => console.log(err));
    console.log(result);
  };

  const facebookLogout = async() => {
    const result = await axios ('/api2/logout', {
      mode: "cors",
      headers: { 'Content-Type': 'application/json'}
    })
    .catch(err => console.log(err));
    console.log(result);
  };

  // Can use this with the sign up
  // <FacebookLoginButton onClick={() => alert("Hello")}>
  // <span>Custom text</span>
  // </FacebookLoginButton>

  return (

    <div className="content loginContainer">
      <div className='loginButton'>
        <FacebookLoginButton size='42px' onClick={(e) =>
            {e.preventDefault();
            window.location.href='http://localhost:3000/facebook/login';
        }}
        align='center'/>
      </div>
      <div className='loginButton'>
        <GoogleLoginButton size='42px' onClick={(e) =>
            {e.preventDefault();
            window.location.href='http://localhost:3000/google/login';
        }}
        align='center'/>
      </div>

      <h2 className='loginTxt'>or</h2>

      <div className='loginButton emailContainer'>
      {/* <button onClick={() => {loginWithRedirect()}}>
        Log in with Email
      </button> */}
        <center><LoginButton/></center>
      </div>
    </div>
  );
}

export default Login;
