import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import { render } from "react-dom";
import Tree from "../components/Tree";
import axios from 'axios';

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const Create = () => {

  const [dataDB, setData] = useState([]);

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


  return (
    <div className="content">
      <h1 className="subtopic text">Create Tree Page</h1>
      <Tree/>


      <div className="class_btn">
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
            <td>{item.family_id}: {item.family_name}</td>
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

export default Create;
