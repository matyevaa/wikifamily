import React, {useState, useEffect, useRef} from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
//import FamilyTree from './FamilyTree';


const AddPerson = (tree_id) => {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [info, setInfo] = useState("");
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState("");
  const [death, setDeath] = useState("");
  const [family_id, setFamily_id] = useState("");
  const [parent, setParent] = useState("");

  const [treeElements, updateTree] = useState([])

  // const tree_id = props.match.params.id;

  const history = useHistory();

  // get current tree id
  console.log("pathname: " + tree_id.location['pathname'].slice(5,(tree_id.location['pathname']).length))
  let treeID = tree_id.location['pathname'].slice(5,(tree_id.location['pathname']).length)
  let link = "/treeID="+ treeID +"/create"
  // let link = "/treeID="+ tree_id +"/create"

  const savePerson = async(e) => {
    e.preventDefault();
    let getLink = "http://localhost:5000/api1/createjj/" + treeID
    await axios.post(getLink, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      first_name: first_name,
      last_name: last_name,
      info: info,
      gender: gender,
      birth: birth,
      death: death,
      // family_id: family_id,
      family_id: treeID,
      parent: parent,
    });
    
    // history.push("/create");
    history.push(link);
  }

  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const descRef = useRef()
  const genderRef = useRef()
  const birthRef = useRef()
  const deathRef = useRef()
  const parentRef = useRef()
  // const familyIDRef = useRef()

  function handleAddPerson(e){
    const firstName = firstNameRef.current.value
    const lastName = lastNameRef.current.value
    const desc = descRef.current.value
    const gender = genderRef.current.value
    const birth = birthRef.current.value
    const death = deathRef.current.value
    const parent = parentRef.current.value
    // const familyID = familyIDRef.current.value

    if (firstName === '' || lastName === '' || desc === '' || gender === '' || parent === "" /* || familyID === ''  */) return

    updateTree(prevTreeElements => {
      return [...prevTreeElements, {id: 1, firstName: firstName, lastName: lastName, description: desc, gender: gender, birth: birth, death: death, parent: parent/* , familyID: treeID */}]
    })

    console.log(firstName)
    firstNameRef.current.value = null
    lastNameRef.current.value = null
    descRef.current.value = null
    genderRef.current.value = null
    birthRef.current.value = null
    deathRef.current.value = null
    parentRef.current.value = null
    // familyIDRef.current.value = null
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

        {/* added code to line 135 */}

          <button className="add_btn" type="submit"  onClick={handleAddPerson}>Add Person</button>
      </form>
    </div>
  );
}

{/* <div>
          <label>Family id</label>
          {/* <input ref={familyIDRef} type="text" placeholder="Family id" name="family_id" value={family_id} onChange={(e) => setFamily_id(e.target.value)}/>
          <input type="text" value={treeID}/>
        </div>

        <div>
          <label>User ID</label>
          <input type="text" value={JSON.parse(localStorage.getItem("userId"))}/>
        </div> */}

export default AddPerson;
