import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

// ################################################################################
// # Description:  Form and API call to edit an individual given their ID
// # 
// # input:        props -- holds the id of the indivdual being edited
// # 
// # return:       edit form
// ################################################################################
const EditPerson = (props) => {
  const [dataDB, setData] = useState([]);
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [info, setInfo] = useState("");
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState("");
  const [death, setDeath] = useState("");
  const [family_id, setFamily_id] = useState("");
  const [parent, setParent] = useState("");
  const [spouse, setspouse] = useState("");

  const individual_id = props.match.params.id;
  const tree_id = props.match.params.treeId;

  console.log("the tree is " + tree_id)

  const history = useHistory();

  // Link for the specific tree view
  let link = "/treeID="+ tree_id +"/create"

  // API call to edit an individual
  const handleFormSubmit = async(e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api1/edit/${individual_id}/${tree_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      first_name: first_name,
      last_name: last_name,
      info: info,
      gender: gender,
      birth: birth,
      death: death,
      family_id: family_id,
      parent: parent,
      spouse: spouse
    });
    
    history.push(link);
  }

  const preloadedValues = {
   first_name: dataDB[0] ? dataDB[0].first_name : "oh nono"
 }

  const { reset, register } = useForm({
   defaultValues: preloadedValues
  });

  useEffect(() => {
    getPersonById();
  }, []);

  // gets a users data given their ID for default values when editing
  const getPersonById = async() => {
    console.log("ind id: ", individual_id);
    const result = await axios (`http://localhost:5000/api1/getInfo/${individual_id}`, {
      headers: { 'Content-Type': 'application/json'},
      method: "GET",
    })
    .then(result => {
      setData(result.data);

      setFirst_name(result.data[0][0])
      setLast_name(result.data[0][1])
      setInfo(result.data[0][2])
      setGender(result.data[0][3])
      setBirth(result.data[0][4])
      setDeath(result.data[0][5])
      setParent(result.data[0][6])
      setspouse(result.data[0][7])

      reset(result.data)
    })
    .catch(err => console.log(err));
  };
  console.log("Get Person By Id:", dataDB);

  return (
    <div>
      <form id="target" onSubmit={handleFormSubmit} method="PUT" action={link} encType="multipart/form-data">

      <div>
          <label>First Name</label>
          <input type="text" placeholder="First Name" defaultValue={first_name} onChange={(e) => setFirst_name(e.target.value) }/>
        </div>

        <div>
          <label>Last Name</label>
          <input type="text" placeholder="Last Name" defaultValue={last_name} name="last_name" value={last_name} onChange={(e) => setLast_name(e.target.value)}/>
        </div>

        <div>
          <label>Description</label>
          <input type="text" placeholder="Info" name="info" defaultValue={info} value={info} onChange={(e) => setInfo(e.target.value)}/>
        </div>

        <div>
          <label>Gender</label>
          <input type="text" placeholder="Gender" name="gender" defaultValue={gender} value={gender} onChange={(e) => setGender(e.target.value)}/>
        </div>

        <div>
          <label>Birth</label>
          <input type="text" placeholder="Date of Birth" name="birth" defaultValue={birth} value={birth} onChange={(e) => setBirth(e.target.value)}/>
        </div>

        <div>
          <label>Death</label>
          <input type="text" placeholder="Date of Death" name="death" defaultValue={death} value={death} onChange={(e) => setDeath(e.target.value)}/>
        </div>

        <div>
          <label>Parent id</label>
          <input type="text" placeholder="Parent id" name="parent" defaultValue={parent} value={parent} onChange={(e) => setParent(e.target.value)}/>
        </div>

        <div>
          <label>Spouse id</label>
          <input type="text" placeholder="Spouse id" name="Spouse" defaultValue={spouse} value={spouse} onChange={(e) => setspouse(e.target.value)}/>
        </div>

          <Link className="link" to={link}>Back to Create Tree</Link>
          {<button class="btns" type="submit">Edit Person</button>}
      </form>
    </div>
  );
}

export default EditPerson;
