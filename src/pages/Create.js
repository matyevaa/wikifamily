import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import { render } from "react-dom";
import Tree from "../components/Tree";
import axios from 'axios';
import TreeList from "../components/TreeView";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const Create = () => {

  const [dataDB, setData] = useState([]);
  const [shareStart, setShareStart] = useState("");
  const [shareEnd, setShareEnd] = useState("");
  const [showView, setShowView] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async() => {
    const result = await axios (`/api1/create`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .then(result => setData(result.data))
    .catch(err => console.log(err));
    console.log("in get data create.js");
  };
  console.log("Get Data:", dataDB);

  const getIndividual = async(individual_id) => {
    const result = await axios (`/api1/create/${individual_id}`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .catch(err => console.log(err));
    console.log("getData: " + result);
  };

  const delData = async(individual_id) => {
    console.log("In Delete, individual_id is ", individual_id);
    await axios.delete (`http://localhost:5000/api1/delete/${individual_id}`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .catch(err => console.log(err));
    getData();
  };

  const updateData = async(individual_id) => {
    console.log("In Update, individual_id is ", individual_id);
    await axios.put (`http://localhost:5000/api1/put/${individual_id}`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .then(response => setData(response.data))
    .catch(err => console.log(err));
  };

  /*
  // api call to share fragment of DB
  // send start indivID and end --> + email to share it with
  // will need to do check of whether or not email exists in user DB

  const shareEdit = async(id) => {
    console.log("individual id chosen is: ", id);
    // await axios.put (`http://localhost:5000/api1/put/${individual_id}`, {
    //   headers: { 'Content-Type': 'application/json'}
    // })
    // .then(response => setData(response.data))
    // .catch(err => console.log(err));
  }; */

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


  return (
  <div className="centerDiv">
    <div className="content">
      <h1 className="subtopic">Create Tree Page</h1>

      <div className="tree_center">
        <div class="tree_options">
          <h3 id="tree_view" onClick={() => { setShowView(showView => !showView); setShowGraph(false) } }>Tree View</h3>
          <h3 id="tree_graph" onClick={() => { setShowGraph(showGraph => !showGraph); setShowView(false) } }>Tree Graph</h3>
        </div>
      </div>

      { showView ? <TreeList list={dataDB}/> : null }
      { showGraph ? <Tree dataDB={dataDB}/> : null }

      <div className="class_btn">
        <h3>Database Data</h3>
        <Link to="/add" className="add_btn">Add Person</Link>
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
              <td>Children</td>
              <td></td>
           </tr>
        </thead>
        <tbody>
        {dataDB ? console.log("api: ", dataDB) : console.log("no api")}

       {dataDB.map((item, idx) => (
          <tr key={idx}>
            {/* <td>{item.individual_id}</td> */}
            <div onClick={() => sharingStartEnd(item.individual_id)}><td>{item.individual_id}</td></div>
            <td>{item.first_name}</td>
            <td>{item.last_name}</td>
            <td>{item.info}</td>
            <td>{item.gender}</td>
            <td>{item.birth}</td>
            <td>{item.death}</td>
            <td>{item.family_id}</td>
            <td>{item.parent}</td>
            <td>{item.children}</td>
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

export default Create;
