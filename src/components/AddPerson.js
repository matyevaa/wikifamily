import React, {useState, useEffect, useRef} from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';

// ################################################################################
// Description:  Form and API call for adding a new individual to the DB
//
// input:        tree_id -- the current tree ID to add a new individual
//
// return:       add new person form
// ################################################################################
const AddPerson = (tree_id) => {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [info, setInfo] = useState("");
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState("");
  const [death, setDeath] = useState("");
  const [family_id, setFamily_id] = useState("");
  const [parent, setParent] = useState("");
  const [spouse, setSpouse] = useState("");
  const [treeElements, updateTree] = useState([])

  // current tree ID
  const tree = tree_id.match.params.id;

  const history = useHistory();

  let link = "/treeID="+ tree +"/create"
  // let link = "/treeID="+ tree_id +"/create"

  // Will add a new individual to the DB
  const savePerson = async(e) => {
    e.preventDefault();

    let getLink = "http://localhost:5000/api1/createadd/" + tree
    
    await axios.post(getLink, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      first_name: first_name,
      last_name: last_name,
      info: info,
      gender: gender,
      birth: birth,
      death: death,
      family_id: tree,
      parent: parent,
      spouse: spouse
    });

    history.push(link);
  }

  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const descRef = useRef()
  const genderRef = useRef()
  const birthRef = useRef()
  const deathRef = useRef()
  const parentRef = useRef()
  const spouseRef = useRef()

  function handleAddPerson(e){
    const firstName = firstNameRef.current.value
    const lastName = lastNameRef.current.value
    const desc = descRef.current.value
    const gender = genderRef.current.value
    const birth = birthRef.current.value
    const death = deathRef.current.value
    const parent = parentRef.current.value
    const spouse = spouseRef.current.value

    if (firstName === '' || lastName === '' || desc === '' || gender === '' || parent === "" || spouse === '') return

    updateTree(prevTreeElements => {
      return [...prevTreeElements, {id: 1, firstName: firstName, lastName: lastName, description: desc, gender: gender, birth: birth, death: death, parent: parent, spouse: spouse}]
    })

    console.log(firstName)
    firstNameRef.current.value = null
    lastNameRef.current.value = null
    descRef.current.value = null
    genderRef.current.value = null
    birthRef.current.value = null
    deathRef.current.value = null
    parentRef.current.value = null
    spouseRef.current.value = null
  }


  return (
    <div>
      <form id="target" method="POST" action={link} encType="multipart/form-data" onSubmit={savePerson}>

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
          <label>Birth</label>
          <input ref={birthRef} type="text" placeholder="Date of Birth" name="birth" value={birth} onChange={(e) => setBirth(e.target.value)}/>
        </div>

        <div>
          <label>Death</label>
          <input ref={deathRef} type="text" placeholder="Date of Death" name="death" value={death} onChange={(e) => setDeath(e.target.value)}/>
        </div>

        <div>
          <label>Parent</label>
          <input ref={parentRef} type="text" placeholder="Parent ID" name="parent" value={parent} onChange={(e) => setParent(e.target.value)}/>
        </div>

        <div>
          <label>Spouse</label>
          <input ref={spouseRef} type="text" placeholder="Spouse ID" name="spouse" value={spouse} onChange={(e) => setSpouse(e.target.value)}/>
        </div>


          <button class="btns" type="submit" onClick={handleAddPerson}>Add Person</button>
      </form>
    </div>
  );
}

export default AddPerson;
