import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// ################################################################################
// Description:  Will remove user's data from localstorage and logout the user 
// 
// input:        NONE
// 
// return:       renders oauth logout button
// ################################################################################
const LogoutButton = () => {
  const { logout , isAuthenticated } = useAuth0();

  // for oauth login remove information from 
  const remLocal = () => {
      localStorage.removeItem("userId")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userName")
      localStorage.removeItem("loginVersion")
  }

  return (
    isAuthenticated && (
      <button id="log_gmail" className="accountBtns" onClick={() => { remLocal();logout();}}>
        Log Out
      </button>
    )
  )
}

export default LogoutButton
