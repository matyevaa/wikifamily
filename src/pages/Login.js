import React, {useState, useEffect, Component} from 'react'
import { Link } from "react-router-dom";
import axios from "axios";
// import { render } from '@testing-library/react';
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";




const Login = () => {
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
        <FacebookLoginButton size='32px' onClick={(e) => 
            {e.preventDefault();
            window.location.href='http://localhost:3000/api2/facebook/login';
        }} 
        align='center'/>
      </div>
      <div className='loginButton'>
        <GoogleLoginButton size='32px' onClick={(e) => 
            {e.preventDefault();
            window.location.href='http://localhost:3000/api2/google/login';
        }} 
        align='center'/>
      </div>
    </div>
  );
}

export default Login;