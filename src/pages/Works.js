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

const Works = (userId) => {

  const [userIdT, setUserIdT] = useState("");
  const [id, setid] = useState("");

  const [dataDB_trees, setData_trees] = useState([]);
  const [shareStart, setShareStart] = useState("");
  const [shareEnd, setShareEnd] = useState("");
  const [wantShare, setWantShare] = useState(false);

  useEffect(() => {
    findingUserId();
    let saved = JSON.parse(localStorage.getItem("userId"))
    getFamilyTrees(saved);
  }, []);

  const sharingStartEnd = (id) => {
    console.log("individual id chosen is: ", id);
    if (shareStart == "") {
      setShareStart(id)
      console.log("start: " + id)
    }
    else {
      setShareEnd(id)
      console.log("end: " + id)
    }
    // setShareSE([shareSE +","+ id])
    // console.log(shareSE)
  }


  const findingUserId = () => {

    // console.log("pathname: " + userId.location['pathname'].slice(9,(userId.location['pathname']).length - 6))

    let temp = userId.location['pathname'].slice(9,(userId.location['pathname']).length - 6)
    // console.log("temp " + temp.toString())

    if (temp.toString() != null) { // user id passed in
      // console.log("What gonna put in localstorage " + temp)
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
        // need refresh twice or else wont show the 'welcome name"
        // add another parameter that would only be done once when first logging in
        // window.location.reload(false);
        // window.location.reload(false);
      }
    }
  }

  const createIndivTreeLinks = (treeId) => {
    // would call getFamilyTrees(userId) (get all family tree ids for this specific user)
    // parse through them to get the id/description

    return "http://localhost:3005/treeId=" + treeId + "/create"

  }

  const getFamilyTrees = async(user_id) => {
    const result = await axios ('http://localhost:5000/api1/listTrees/' + user_id, {
      headers: { 'Content-Type': 'application/json'}
    })
    .then(result => setData_trees(result.data))
    .catch(err => console.log(err));
    console.log("getFamilyTrees: ")
    console.log(dataDB_trees);
  };

  const treesOutput = () => {
    if (dataDB_trees == "" || dataDB_trees == null) {
      return <p className="description text">No Trees</p>
    }
    else{
      return <div>
      {dataDB_trees.map((item, idx) => (
        <tr key={idx}>
          <td className="description text"><a href= { createIndivTreeLinks(item.family_id) }>{item.family_name}</a></td>
        </tr>
      ))}</div>
    }
  }

    // ch bt true and false
    const changeConditon = () => {
      if (wantShare == false) {
          setWantShare(true)
      }
      else {
        setWantShare(false)
      }
    }

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
