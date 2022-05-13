import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import TreeList from "../components/TreeView";
import Tree from "../components/Tree";
import { Link } from "react-router-dom";

const IndivTree = (treeId) => {
  const [treeName, setTreeName] = useState(["no data"]);

  const [showView, setShowView] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const [wantShare, setWantShare] = useState(false);
  const [executeListShare, setexecuteListShare] = useState(false);
  const [showErrorMsg, setshowErrorMsg] = useState(false);
  const [collaboratorExist, setcollaboratorExist] = useState();
  const [collabID, setcollabID] = useState("");
  const [sharingInfo, setsharingInfo] = useState([]);


  const [shareStart, setShareStart] = useState("");
  const [isTableShare, setisTableShare] = useState(false);

  const [parent, setParent] = useState("");

  const treeIdentif = treeId.match.params.treeId;

  const [dataDB, setData] = useState([]);
  const [dataFamily, setDataFamily] = useState([]);

  let addLink = "/add/" + treeId.location['pathname'].slice(8,(treeId.location['pathname']).length - 7)

  useEffect(() => {
    getFamilyName(treeIdentif);
    getWholeFamily();
    getData();
  }, []);

  const getFamilyName = async(treeID) => {
    console.log("asxdcfvgb")
    const result = await axios (`http://localhost:5000/api1/getTreeName/${treeID}`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .then(result => setTreeName(result.data[0]))
    .catch(err => console.log(err));
    console.log("treeName")
    console.log(treeName);
    console.log(result);
};

  const getData = async() => {
    const result = await axios (`http://localhost:5000/api1/create/${treeIdentif}`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .then(result => setData(result.data))
    .catch(err => console.log(err));
    console.log("in get data indivtree.js");
    console.log(dataDB)
  };

  const getWholeFamily = async() => {
    const result = await axios (`http://localhost:5000/api1/create-family/${treeIdentif}`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .then(result => setDataFamily(result.data))
    .catch(err => console.log(err));
    console.log("in get whole family: ", dataFamily);
  };


  const delData = async(individual_id) => {
    console.log("In Delete, individual_id is ", individual_id);
    await axios.delete (`http://localhost:5000/api1/delete/${individual_id}/${treeIdentif}`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .catch(err => console.log(err));
    window.location.reload(false);
    getData();
  };

  // sharing individuals// sets starting and end points, end points can be changed if keep clicking
  const sharingStartEnd = (id) => {
      setShareStart(id)
      console.log("startingid: " + id)
      setisTableShare(true)
      console.log("will do table share...")
  }

  // whether it has share indiv showing or not
  const shareContShow = (item) => {
    if (wantShare == false || wantShare == undefined) {
      return <td>{item.individual_id}</td>
    }
    else {
      return <div onClick={() => sharingStartEnd(item.individual_id)}><td>{item.individual_id}</td></div>
    }
  }

  // ch whether show share with person or not
  const sharingConditionShow = () => {
    if (wantShare == false || wantShare == undefined) {
      // dont show anything
    }
    else {
      return <form id="target" action={"http://localhost:3005/creator=" + JSON.parse(localStorage.getItem("userId")) +"/works"} encType="multipart/form-data" onSubmit={createEmpty}>
          <p className='text'>To share an individual first enter the email or ID of your chosen collaborator and click 'Verify Collaborator'. This will verify whether
            the collaborator is registered with WikiFamily.
            If sharing individuals through the table, click on the id of the individual you want to share. If you are using the tree list format click on
            the '...' under the users name. After choosing an individual to share click 'Share tree'. This will create a tree for your collaborator to edit,
            delete, and add individuals. Note that sharing an individual will share that individual and any descendants they may have.
          </p>
          <p className='text'>Collaborators that registered with WikiFamily through Google and Email please use your email. Facebook users please enter your user ID
            found in your Works page.</p>

            <div>
              <label className='text'>Collaborator's email or user ID</label>
              <input ref={parentRef} type="text" placeholder="Enter email or ID of collaborator" name="parent" value={parent} onChange={(e) => setParent(e.target.value)}/>
            </div>

            {showingErrpr()}
            {buttonShow()}
        </form>
    }
  }

  const ifSharingTable = () => {
    // for table sharing
    console.log("table sharing cond is" + isTableShare)
    if (isTableShare == true) {
      console.log("doing table share")
      collaboratorEditing(collabID);
    }
    else {
      setexecuteListShare(true)
    }
  }

  const buttonShow = () => {
    if (collaboratorExist == true) {
        return <div>
          <button className="add_btn" type="submit" onClick={()=>{setexecuteListShare(true); collaboratorEditing(collabID)}}>Share Tree</button>
          <button className="add_btn" type="submit" onClick={()=>{setsharingInfo([]); setcollaboratorExist(false)}}>Restart sharing individual</button>
          </div>
    }
    else {
      return <button className="btn add_btn " type="submit">Verify Collaborator</button>
    }
  }

  // ch bt true and false
  const changeConditon = () => {
    if (wantShare == false || wantShare == undefined) {
        setWantShare(true)
    }
    else {
      setWantShare(false)
    }
  }

  const createEmpty = async(e) => {
    e.preventDefault();
      const result = await axios.post (`http://localhost:3000/api2/emailExist`, {
      method:'POST',
      headers: { 'Content-Type': 'application/json'},
      email_share: parent,
    });

    setcollaboratorExist(result.data[0])
    console.log(result)
    let id
    if(result.data[0] == true) {
      setshowErrorMsg(false)

      id = result.data[1]
      // console.log(id)
      setcollaboratorExist(true)
      setcollabID(id)
      // for tree sharing
      setsharingInfo([executeListShare,treeIdentif,treeName['family_name'],id])

      // // for table sharing
      console.log(isTableShare)
    }
    else {
      console.log("user did not exist")
      setshowErrorMsg(true)
    }
  }

  const showingErrpr = () => {
    if (showErrorMsg == true) {
        return <p className='errorMsg'>User did not exist. Try a different sharing method (user ID/ email) or verify you have the correct information.</p>
    }
  }

  const collaboratorEditing = async(id) => {
    console.log("in share function")
    console.log(collabID)
    if (isTableShare == true) {
      const result = await axios.post (`http://localhost:5000/api2/share/${shareStart}/${treeIdentif}/${treeName['family_name']}/${id}`, {
        method:'POST',
        headers: { 'Content-Type': 'application/json'},
      });
      console.log("created tree with tableshare")
      console.log(result)
    }

    // set back to false after share w table
    setisTableShare(false)
  }

  // option to delete curr tree
  const delTree = () => {
    if (window.confirm("Deleting this tree will also delete all data related to the current tree. Are you sure you want to delete this tree?")) {
      console.log("DELETE THE TREE")
    }
    else {
      console.log("Do not delete tree")
    }
  }

  const parentRef = useRef()

  return(
   <div className="centerDiv">
    <div className="content">
      <h1 className="subtopic text"><span id="tree_name">{treeName['family_name']}</span> Family Tree</h1>

      <div className="tree_center">
        <div className="tree_options">
          <h3 id="tree_view" className='text' onClick={() => { setShowView(showView => !showView); setShowGraph(false) } }>Tree View</h3>
          <h3 id="tree_graph" className='text' onClick={() => { setShowGraph(showGraph => !showGraph); setShowView(false) } }>Tree Graph</h3>
        </div>
      </div>

      { showView ? <TreeList list={dataDB} treeId={treeId} family={dataFamily} share={wantShare} collab={sharingInfo}/> : null }
      { showGraph ? <Tree dataDB={dataDB}/> : null }

      {dataDB ? console.log("api: ", dataDB) : console.log("no api")}

      <div className="class_btn">
        <h3 id="dashboard" className='text'>Family Individuals Dashboard</h3>
        <div className="dash_tools">
          <Link to={addLink} id="btn add_btn" className="btns">Add Person</Link>
          <button id="shareBtn" onClick={() => {changeConditon();}}>Share Individuals</button>
          {sharingConditionShow()}
        </div>

      </div>
      <table className="result_table">
        <thead>
          <tr>
              <td>id</td>
              <td>First Name</td>
              <td>Last Name</td>
              <td>Info</td>
              <td>Gender</td>
              <td>Birth</td>
              <td>Death</td>
              <td>Parent</td>
              <td>Spouse</td>
              <td></td>
           </tr>
        </thead>
        <tbody>

       {dataFamily.map((item, idx) => (
          <tr key={idx} className="text">
            {shareContShow(item)}
            <td>{item.first_name}</td>
            <td>{item.last_name}</td>
            <td>{item.info}</td>
            <td>{item.gender}</td>
            <td>{item.birth}</td>
            <td>{item.death}</td>
            <td>{item.parent}</td>
            <td>{item.spouse}</td>
            <td id="table_btns">
              <Link to={`edit/${item.individual_id}`} className="btns" id="edit_btn">Edit</Link>
              <button onClick={ () => delData(item.individual_id) } className="btns" id="del_btn">Delete</button>
            </td>
          </tr>
        ))}
        </tbody>
       </table>
       <h3 className='text' id="family_size">Family size is: {dataFamily.length}</h3>
       <br></br><bt></bt>
       {/* <button className="add_tree_btn" onClick={() => {delTree();}}>Delete tree</button> */}
    </div>
    </div>
  );
}

export default IndivTree;
