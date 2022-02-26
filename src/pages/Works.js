import React, {useState, useEffect} from 'react';


const Works = (userId) => {
  const [userIdT, setUserIdT] = useState("");
  const [id, setid] = useState("");

  useEffect(() => {
    findingUserId();
  }, []);

  const findingUserId = () => {
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
  }

  const createIndivTreeLinks = (treeId) => {
    // would call getFamilyTrees(userId) (get all family tree ids for this specific user)
    // parse through them to get the id/description

    return "http://localhost:3005/treeId=" + treeId + "/create"
    
  }

  const handleNewTree = () => {
    // would create a new empty tree for user --> implement after family table set
  }
  
  return(
    <div className="content">
      <h1 className="subtopic text">Here are your works!</h1>
      <button className="add_tree_btn">Create New Tree</button>
      <p className="description text"><a href= { createIndivTreeLinks(5) }>indiv family tree</a></p>
      <p className="description text"><a href= { createIndivTreeLinks(10) }>indiv family tree</a></p>
      <p className="description text"><a href= { createIndivTreeLinks(15) }>indiv family tree</a></p>
      <p className="description text"><a href= { createIndivTreeLinks(20) }>indiv family tree</a></p>
    </div>
  );
}

export default Works;
