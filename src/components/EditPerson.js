import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { useParams, Link } from "react-router-dom";

const EditPerson = (props) => {

  const [dataDB, setData] = useState([]);
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [info, setInfo] = useState("");
  const [gender, setGender] = useState("");
  const [family_id_FK, setFamily_id] = useState("");
  const [parent, setParent] = useState("");
  //const { individual_id } = useParams();

  const individual_id = props.match.params.id;
  console.log("Id of the person ", individual_id);

  const history = useHistory();

  const handleFormSubmit = async(e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api1/edit/${individual_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      first_name: first_name,
      last_name: last_name,
      info: info,
      gender: gender,
      family_id_FK: family_id_FK,
      parent: parent
    });
    history.push("/create");
  }

  useEffect(() => {
    getPersonById();
  }, []);

  const getPersonById = async() => {
    console.log("ind id: ", individual_id);
    const result = await axios (`http://localhost:5000/api1/create/${individual_id}`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .catch(err => console.log(err));
    setData(result.data);
  };
  console.log("Get Person By Id:", dataDB);


  return (
    <div>
      <form id="target" onSubmit={handleFormSubmit} method="PUT" action="{{url_for('create')}}" encType="multipart/form-data">

        <div>
          <label>First Name</label>
          <input type="text" placeholder="First Name" name="first_name" value={first_name} onChange={(e) => setFirst_name(e.target.value)}/>
        </div>

        <div>
          <label>Last Name</label>
          <input type="text" placeholder="Last Name" name="last_name" value={last_name} onChange={(e) => setLast_name(e.target.value)}/>
        </div>

        <div>
          <label>Description</label>
          <input type="text" placeholder="Info" name="info" value={info} onChange={(e) => setInfo(e.target.value)}/>
        </div>

        <div>
          <label>Gender</label>
          <input type="text" placeholder="Gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value)}/>
        </div>

        <div>
          <label>Family id</label>
          <input type="text" placeholder="Family id" name="family_id_FK" value={family_id_FK} onChange={(e) => setFamily_id(e.target.value)}/>
        </div>

        <div>
          <label>Parent id</label>
          <input type="text" placeholder="Parent id" name="parent" value={parent} onChange={(e) => setParent(e.target.value)}/>
        </div>

          <Link className="link" to="/create">Back to Create Tree</Link>
          <button className="edit_btn" type="submit">Edit Person</button>
      </form>
    </div>
  );
}

export default EditPerson;
