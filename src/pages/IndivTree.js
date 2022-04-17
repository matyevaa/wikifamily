import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import TreeList from "../components/TreeView";
import Tree from "../components/Tree";
import { Link } from "react-router-dom";

const IndivTree = (treeId) => {
  const [treeName, setTreeName] = useState(["no data"]);
  // const [treeIdentif, setItendif] = useState();


  const [showView, setShowView] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const [wantShare, setWantShare] = useState(false);
  const [collaboratorExist, setcollaboratorExist] = useState(false);
  const [collabID, setcollabID] = useState("");


  const [shareStart, setShareStart] = useState("");
  const [shareEnd, setShareEnd] = useState("");

  const [parent, setParent] = useState("");
  const [treeElements, updateTree] = useState([])

  const treeIdentif = treeId.match.params.treeId;

  // adding from /create
  const [dataDB, setData] = useState([]);
  let addLink = "/add/" + treeId.location['pathname'].slice(8,(treeId.location['pathname']).length - 7)
  // end add from /create

  useEffect(() => {
    // setItendif(treeId.location['pathname'].slice(8,(treeId.location['pathname']).length - 7));
    console.log("get name for tree: ")
    console.log(treeId.location['pathname'].slice(8,(treeId.location['pathname']).length - 7))
    getFamilyName(treeId.location['pathname'].slice(8,(treeId.location['pathname']).length - 7));

    // adding from /create
    getData(treeId.location['pathname'].slice(8,(treeId.location['pathname']).length - 7));
    // end add from /create

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

  const getTreeId = (treeID) => {
    return treeId.location['pathname'].slice(8,(treeId.location['pathname']).length - 7)
  }

  // adding from /create
  const getData = async(treeID) => {
    const result = await axios (`http://localhost:5000/api1/create`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .then(result => setData(result.data))
    .catch(err => console.log(err));
    console.log("in get data indivtree.js");
  };

  console.log("Get Data:", dataDB);

  const delData = async(individual_id) => {
    console.log("In Delete, individual_id is ", individual_id);
    await axios.delete (`http://localhost:5000/api1/deletejj/${individual_id}/${treeId.location['pathname'].slice(8,(treeId.location['pathname']).length - 7)}`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .catch(err => console.log(err));
    getData();
  };
  // end add from /create

  const getIndividual = async(individual_id) => {
    const result = await axios (`/api1/create/${individual_id}`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .catch(err => console.log(err));
    console.log("getData: " + result);
  };

  const updateData = async(individual_id) => {
    console.log("In Update, individual_id is ", individual_id);
    await axios.put (`http://localhost:5000/api1/put/${individual_id}`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .then(response => setData(response.data))
    .catch(err => console.log(err));
  };

  // sharing individuals// sets starting and end points, end points can be changed if keep clicking
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
          <div>
            <label>Family Tree Name</label>
            <input ref={parentRef} type="text" placeholder="Enter email of collaborator" name="parent" value={parent} onChange={(e) => setParent(e.target.value)}/>
          </div>
          <button className="add_btn" type="submit">Share Tree</button>
        </form>
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

    if(collaboratorExist == true) {
      setcollabID(result.data[1])
      console.log("in share function")
      const result = await axios (`http://localhost:5000/api2/share/${shareStart}/${shareEnd}/${treeIdentif}/${treeName['family_name']}/${collabID}`, {
        headers: { 'Content-Type': 'application/json'},
      });
    }
    console.log(result)

    let link = "http://localhost:3005/creator=" + JSON.parse(localStorage.getItem("userId")) +"/works"
  }

  const collaboratorEditing = async() => {
    console.log("in share function")
      const result = await axios.post (`http://localhost:5000/api2/share/${shareStart}/${shareEnd}/${treeIdentif}/${treeName['family_name']}/${collabID}`, {
      headers: { 'Content-Type': 'application/json'},
    });

    console.log(result)

  }

  const parentRef = useRef()

  return(
   <div className="centerDiv">
    <div className="content">
      <h1 className="subtopic text">Family tree ID: {treeName['family_name']}</h1>

      <div className="tree_center">
        <div class="tree_options">
          <h3 id="tree_view" onClick={() => { setShowView(showView => !showView); setShowGraph(false) } }>Tree View</h3>
          <h3 id="tree_graph" onClick={() => { setShowGraph(showGraph => !showGraph); setShowView(false) } }>Tree Graph</h3>
        </div>
      </div>

      { showView ? <TreeList list={dataDB}/> : null }
      { showGraph ? <Tree dataDB={dataDB}/> : null }

      {dataDB ? console.log("api: ", dataDB) : console.log("no api")}


      <div className="class_btn">
        <h3>Database Data</h3>
        <Link to={addLink} className="add_btn">Add Person</Link>

        {/* NEED TO CHANGE TO HOVER MOUSE CH TO POINTER */}
        <p>Click to <span className='hover_pointer' onClick={() => {changeConditon();}}>share</span> individuals</p>
        {sharingConditionShow()}



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
              <td>Family</td>
              <td>Parent</td>
              <td></td>
           </tr>
        </thead>
        <tbody>
        {dataDB ? console.log("api: ", dataDB) : console.log("no api")}

       {dataDB.map((item, idx) => (
          <tr key={idx}>
            {/* <td>{item.individual_id}</td> */}
            {shareContShow(item)}
            <td>{item.first_name}</td>
            <td>{item.last_name}</td>
            <td>{item.info}</td>
            <td>{item.gender}</td>
            <td>{item.birth}</td>
            <td>{item.death}</td>
            <td>{item.family_id}</td>
            <td>{item.parent}</td>
            <td>
              <Link to={`edit/${item.individual_id}`} className="edit_btn">Edit</Link>
              <button onClick={ () => delData(item.individual_id) } className="del_btn">Delete</button>
            </td>
          </tr>
        ))}
        </tbody>
       </table>
    </div>
    </div>
  );
}

export default IndivTree;
