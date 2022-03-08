import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const Works = (userId) => {
  const [userIdT, setUserIdT] = useState("");
  const [id, setid] = useState("");
  const [dataDB, setData] = useState([]);

  useEffect(() => {
    findingUserId();
    getFamilyTrees();
  }, []);

  const findingUserId = () => {
    // if (isAuthenticated == true) {
    //   localStorage.setItem("userId", JSON.stringify(user.nickname))
    // }


    console.log("pathname: " + userId.location['pathname'].slice(9,(userId.location['pathname']).length - 6))

    let temp = userId.location['pathname'].slice(9,(userId.location['pathname']).length - 6)
    console.log("temp " + temp.toString())
    
    if (temp.toString() != null) { // user id passed in
      console.log("What gonna put in localstorage " + temp)
      localStorage.setItem("userId", JSON.stringify(temp))
    }
    else { // user id not passed in
      let saved = JSON.parse(localStorage.getItem("userId"))
      window.location.href="http://localhost:3005/creator=" + saved + "/works"
    }

    // if used the api to llogin 
    if (JSON.parse(localStorage.getItem("loginVersion") != '"oauth"')) {
      localStorage.setItem("loginVersion", JSON.stringify("thirdParty"))
      if(JSON.parse(localStorage.getItem("userName")) == null) {
        window.location.reload(false);
        window.location.reload(false);
      }
    }
  }

  const createIndivTreeLinks = (treeId) => {
    // would call getFamilyTrees(userId) (get all family tree ids for this specific user)
    // parse through them to get the id/description

    return "http://localhost:3005/treeId=" + treeId + "/create"
    
  }

  const getFamilyTrees = async() => {
    const result = await axios (`/api1/listTrees`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .then(result => setData(result.data))
    .catch(err => console.log(err));
    console.log("getFamilyTrees: ")
    console.log(dataDB);
  };

  const treesOutput = () => {
    if (dataDB == "" || dataDB == null) {
      return <p className="description text">No Trees</p>
    }
    else{
      return <div>
      {dataDB.map((item, idx) => (
        <tr key={idx}>
          <td className="description text"><a href= { createIndivTreeLinks(item.family_id) }>{item.family_name}</a></td>
        </tr>
      ))}</div>
    }
    
  }

  
  return(
    <div className="content">
      <h1 className="subtopic text">Here are your works!</h1>
      <button className="add_tree_btn">Create New Tree (does nothing rn)</button>
      {/* <p className="description text"><a href= { createIndivTreeLinks(10) }>indiv family tree</a></p> */}

      {treesOutput()}
    </div>
  );
}

export default Works;
