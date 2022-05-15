import React, {useState, useEffect, Component} from 'react'
import { Link } from "react-router-dom";
import axios from "axios";
// import { render } from '@testing-library/react';
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from '../components/LoginButton';

// ################################################################################
// Description:  lets users do Google, FB, or email login 
// 
// input:        NONE
// 
// return:       Buttons for google, email, or FB login
// ################################################################################
const Login = () => {
  const { loginWithRedirect , isAuthenticated } = useAuth0();

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
        <center><LoginButton/></center>
      </div>
    </div>
  );
}

export default Login;
