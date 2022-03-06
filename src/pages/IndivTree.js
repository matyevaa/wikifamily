import React, {useState, useEffect} from 'react';
import axios from 'axios';

// adding from /create
import Tree from "../components/Tree";
import { Link } from "react-router-dom";
// end add from /create

const IndivTree = (treeId) => {
  const [treeName, setTreeName] = useState(["no data"]);
  const [treeIdentif, setItendif] = useState();

  // adding from /create
  const [dataDB, setData] = useState([]);
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
    const result = await axios (`http://localhost:5000/api1/createjj/${treeID}`, {
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

  
  return(
    <div className="content">
      <h1 className="subtopic text">Family tree ID: {treeName['family_name']}</h1>

      <Tree dataDB={dataDB}/>

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
              <td></td>
           </tr>
        </thead>
        <tbody>
        {dataDB ? console.log("api: ", dataDB) : console.log("no api")}

       {dataDB.map((item, idx) => (
          <tr key={idx}>
            <td>{item.individual_id}</td>
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
  );
}

export default IndivTree;
