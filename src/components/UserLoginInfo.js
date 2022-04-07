import React from 'react';
import { useAuth0, User } from "@auth0/auth0-react";

//user.sub unique user identifier 
const UserLoginInfo = () => {
  const { user, isAuthenticated } = useAuth0();
  
  return (
    isAuthenticated && ( 
     <div>
        <h2>{user.sub}</h2> 
      </div>
    )
  )
}

export default UserLoginInfo

// //const UserLoginInfo = () => {

//     const { user, isAuthenticated } = useAuth0();

//     if (isAuthenticated == true){
//         console.log(user.sub)
//     }
// }
    
// //}

