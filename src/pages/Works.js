import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import { render } from "react-dom";
import Tree from "../components/Tree";
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import TreeList from "../components/TreeView";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

// ################################################################################
// Description:  Lists a user's trees and allows users to create new trees
// 
// input:        userId -- the current user
// 
// return:       trees owned by the current user 
// ################################################################################
const Works = (userId) => {

  const [userIdT, setUserIdT] = useState("");
  const [id, setid] = useState("");
  const [dataDB_trees, setData_trees] = useState([]);
  const [shareStart, setShareStart] = useState("");
  const [shareEnd, setShareEnd] = useState("");
  const [wantShare, setWantShare] = useState(false);

  let finalID = userId.id
  

  useEffect(() => {
    findingUserId();
    let saved = JSON.parse(localStorage.getItem("userId"))
    getFamilyTrees(saved);
  }, []);

  // find the user ID and set it to the localstorage 
  const findingUserId = () => {
    let temp = userId.location['pathname'].slice(9,(userId.location['pathname']).length - 6)
    console.log("temp " + temp.toString())
    console.log("temp " + temp)

    if (temp != null && JSON.parse(localStorage.getItem("loginVersion") != '"oauth"')) {
      console.log("What gonna put in localstorage n was third" + temp)
      localStorage.setItem("userId", JSON.stringify(temp))
    }

    // if used the api to llogin
    if (JSON.parse(localStorage.getItem("loginVersion") != '"oauth"')) {
      console.log("was third party login " + temp)
      localStorage.setItem("loginVersion", JSON.stringify("thirdParty"))
      if(JSON.parse(localStorage.getItem("userName")) == null) {
        // need refresh twice or else wont show the 'welcome name"
        // add another parameter that would only be done once when first logging in
        // window.location.reload(false);
        // window.location.reload(false);
      }
    }
  }

  // creates link for the specific family tree
  const createIndivTreeLinks = (treeId) => {
    return "http://localhost:3005/treeId=" + treeId + "/create"
  }

  // gets list of all the family trees that belong to the current user
  const getFamilyTrees = async(user_id) => {
    const result = await axios ('http://localhost:5000/api1/listTrees/' + user_id, {
      headers: { 'Content-Type': 'application/json'}
    })
    .then(result => setData_trees(result.data))
    .catch(err => console.log(err));
    console.log("getFamilyTrees: ")
    console.log(dataDB_trees);
  };

  // if there are no trees output msg to user otherwise list the trees
  const treesOutput = () => {
    if (dataDB_trees == "" || dataDB_trees == null) {
      return <p className="description text">No Trees</p>
    }
    else{
      return <div>
                {dataDB_trees.map((item, idx) => (
                  <tr key={idx}>
                    <div id='indivTree'>
                      <td className="description text indivTree"><a href= { createIndivTreeLinks(item.family_id) }>{item.family_name}</a></td>
                      </div>
                  </tr>
                ))}
              </div>
    }
  }

    // ch bt true and false for wanting to see a user's user ID
    const changeConditon = () => {
      if (wantShare == false) {
          setWantShare(true)
      }
      else {
        setWantShare(false)
      }
    }

    // whether or not to show the users ID
    const userIdconditionShow = () => {
      if (wantShare == false || wantShare == undefined) {
        // dont show anything
      }
      else {
        return <div>
          <p id="user_id" className='text btn_center'>{JSON.parse(localStorage.getItem("userId"))}</p>
        </div>
      }
    }


  return (
  <div className="centerDiv">
    <div className="content">
      <h1 className="subtopic">Your Works</h1>

      <center><p className='hover_pointer text' onClick={() => {changeConditon();}}> Click here to see your user ID</p></center>
      {userIdconditionShow()}

      <div className="btn_center"><button className="add_tree_btn" onClick={() => {window.location.href="http://localhost:3005/new"}}>Create New Tree</button></div>
      {treesOutput()}
    </div>
  </div>
  );
}

export default Works;
