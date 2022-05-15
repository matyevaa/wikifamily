import React, {useState, useEffect, useRef} from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';
//import FamilyTree from './FamilyTree';

// ################################################################################
// Description:  Form and API call for creating a new tree for a user
// 
// input:        NONE
// 
// return:       Form for new tree
// ################################################################################
const NewTreeForm = () => {
  const [parent, setParent] = useState("");
  let userId = JSON.parse(localStorage.getItem("userId"))
  let link = "http://localhost:3005/creator=" + userId +"/works"

  const history_ = useHistory();
const [treeElements, updateTree] = useState([])

  // API call for creating a new tree
  const createEmpty = async(e) => {
    console.log(userId + parent)

    e.preventDefault();
    await axios.post('http://localhost:5000/api1/createTree', {
      method:'POST',
      headers: { 'Content-Type': 'application/json'},
      user_id: userId, // user ID
      parent: parent,   // Tree name
    });
    
    // redirects user back to their works page
    window.location.href="http://localhost:3005/creator=" + userId +"/works"
  }


  const parentRef = useRef()

  function handleAddPerson(e){
    
    const parent = parentRef.current.value

    if (parent === '' ) return

    updateTree(prevTreeElements => {
      return [...prevTreeElements, {parent: parent/* , familyID: treeID */}]
    })

    parentRef.current.value = null

  }


  return (
    <div>
      <form id="target" action={link} encType="multipart/form-data" onSubmit={createEmpty}>
        <div>
          <label>Family Tree Name</label>
          <input ref={parentRef} type="text" placeholder="Enter a family tree name..." name="parent" value={parent} onChange={(e) => setParent(e.target.value)}/>
        </div>
          <button className="add_btn" type="submit"  onClick={handleAddPerson}>Create Tree</button>
      </form>
    </div>
  );
}


export default NewTreeForm;
