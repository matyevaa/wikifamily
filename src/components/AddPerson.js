import React, {useState, useEffect, useRef} from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
//import FamilyTree from './FamilyTree'; 


const AddPerson = () => {

  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [info, setInfo] = useState("");
  const [gender, setGender] = useState("");
  const [family_id_FK, setFamily_id] = useState("");

  const [treeElements, updateTree] = useState([]) 

  const history = useHistory();

  const savePerson = async(e) => {
    e.preventDefault();
    await axios.post('/api1/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      first_name: first_name,
      last_name: last_name,
      info: info,
      gender: gender,
      family_id_FK: family_id_FK
    });
    history.push("/create");
  }

 
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const descRef = useRef()
  const genderRef = useRef()
  const familyIDRef = useRef()

  function handleAddPerson(e){
    const firstName = firstNameRef.current.value  
    const lastName = lastNameRef.current.value
    const desc = descRef.current.value
    const gender = genderRef.current.value
    const familyID = familyIDRef.current.value

    if (firstName === '' || lastName === '' || desc === '' || gender === '' || familyID === '' ) return
    
    updateTree(prevTreeElements => {
      return [...prevTreeElements, {id: 1, firstName: firstName, lastName: lastName, description: desc, gender: gender, familyID: familyID}]
    })
    console.log(firstName)
    firstNameRef.current.value = null
    lastNameRef.current.value = null
    descRef.current.value = null
    genderRef.current.value = null
    familyIDRef.current.value = null
    
  }
    





  return (
    <div>
      <form id="target" method="POST" action="{{url_for('create')}}" encType="multipart/form-data" onSubmit={savePerson}>

        <div>
          <label>First Name</label>
          <input ref={firstNameRef} type="text" placeholder="First Name" name="first_name" value={first_name} onChange={(e) => setFirst_name(e.target.value)}/>
        </div>

        <div>
          <label>Last Name</label>
          <input ref={lastNameRef} type="text" placeholder="Last Name" name="last_name" value={last_name} onChange={(e) => setLast_name(e.target.value)}/>
        </div>

        <div>
          <label>Description</label>
          <input ref={descRef} type="text" placeholder="Info" name="info" value={info} onChange={(e) => setInfo(e.target.value)}/>
        </div>

        <div>
          <label>Gender</label>
          <input ref={genderRef} type="text" placeholder="Gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value)}/>
        </div>

        <div>
          <label>Family id</label>
          <input ref={familyIDRef} type="text" placeholder="Family id" name="family_id_FK" value={family_id_FK} onChange={(e) => setFamily_id(e.target.value)}/>
        </div>

          <button className="add_btn" type="submit"  onClick={handleAddPerson}>Add Person</button>
      </form>
    </div>
  );
}

export default AddPerson;
