import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout , isAuthenticated } = useAuth0();

  const remLocal = () => {
      localStorage.removeItem("userId")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userName")
      localStorage.removeItem("loginVersion")
  }

  return (
    isAuthenticated && (
      <button onClick={() => { remLocal();logout();}}>
        Log Out
      </button>
    )
  )
}

export default LogoutButton
