import React, { useEffect, useState, useRef } from "react";
import TreeView from "react-expandable-treeview";
import ModalComponent from "./ModalComponent";
import TreeLabel from "./TreeLabel";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';

// ################################################################################
// Description:  Functions for tree list view
//
// input:
//
// return: Edit/modify/display family tree list view 
// ################################################################################
const HomeTree = (props) => {
  const [editSpouse, setEditSpouse] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  console.log("HomeTree: ", props.list)
  // console.log("HomeTree: Sharing boolean ", props.share)
  // console.log("HomeTree: collab info ", props.collab)
  // // console.log("HomeTree: share boolean ", props.share.match.params.share)

  // FOR SHARING VARS START
  var wantShare = props.share;
  var collabID = props.collab;
  const [treeviewShare, settreeviewShare] = useState(false);
  const [idtoshare, setidtoshare] = useState("");
  const [editOrAdd, seteditOrAdd] = useState(0) // 0 is not set, 4 is edit, 1 or 2 is add
  // SHARING VARS END
  function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
}

  // console.log("tree id: ", props.treeId.match.params.treeId);
  const treeIdentif = props.treeId.match.params.treeId;

  const delData = async(individual_id) => {
    console.log("In Delete in homeTree, individual_id is ", individual_id);
    await axios.delete (`http://localhost:5000/api1/delete/${individual_id}/${treeIdentif}`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .catch(err => console.log(err));
    window.location.reload(false);
  };

  // API call to edit an individual -- type: 1 -- regular edit, type: 2 -- spouse edit
  const editIndiv = async(/* e */userInf, tree_id, type) => {
    // e.preventDefault();
    console.log("persong being edited is: ", userInf)
    if (type == 1) {
      console.log("reg edit")
      await axios.put(`http://localhost:5000/api1/edit/${userInf.indiv_id}/${tree_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      first_name: userInf.firstName,
      last_name: userInf.lastName,
      info: userInf.label.props.information,
      gender: userInf.gender,
      birth: userInf.dateOfBirth,
      death: userInf.dateOfDeath,
      parent: userInf.label.props.parentID,
      spouse: userInf.label.props.spouse
    });
    }
    else if (type == 2) {
      console.log("spouse id to edit is: ", userInf.label.props.spouseID)
      await axios.put(`http://localhost:5000/api1/edit/${userInf.label.props.spouseID}/${tree_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      first_name: userInf.firstName,
      last_name: userInf.lastName,
      info: userInf.label.props.spouseInformation,
      gender: userInf.gender,
      birth: userInf.dateOfBirth,
      death: userInf.dateOfDeath,
      parent: userInf.label.props.spouseParent,
      spouse: userInf.indiv_id
    });
    }
    console.log("editIndiv: will be editing ", userInf.indiv_id)
    
  };

  // Will add a new individual to the DB -- type: 1 then spouse, 0 then child
  const savePerson = async(userInf, type) => {
    let getLink = "http://localhost:5000/api1/createadd/" + treeIdentif

    if(type == 0) {
      console.log("will be adding a new child ", type)

      await axios.post(getLink, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        first_name: userInf.firstName,
        last_name: userInf.lastName,
        info: "",// info: userInf.label.props.information,
        gender: userInf.gender,
        birth: userInf.dateOfBirth,
        death: userInf.dateOfDeath,
        family_id: treeIdentif,
        parent: selectedData.indiv_id,
        spouse: ""
      });
    }
    // its a spouse
    else if (type == 1) {
      console.log("will be adding a new spouse ", type)
      await axios.post(getLink, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      first_name: userInf.firstName,
      last_name: userInf.lastName,
      info: "",// info: userInf.label.props.information,
      gender: userInf.gender,
      birth: userInf.dateOfBirth,
      death: userInf.dateOfDeath,
      family_id: treeIdentif,
      parent: "",
      spouse: selectedData.indiv_id
    });
    }
    
  }


  const [modalFirst, setModalFirst] = useState(false);

  const ref = useRef();
  //const toggleTooltip = () => ref.current.toggle();

  var result_id = [];

  const [selectedIndivId, setSelectedIndivId] = useState(null);
  const [selectedId, setSelectedId] = useState(null); 
  const [selectedData, setSelectedData] = useState(null);

  const [familyMember, setFamilyMember] = useState(false);
  const [edited, setEdited] = useState(null);
  const [typeId, setTypeId] = useState(null);

  const handleEditModalClose = () => setEditSpouse(false);
  const handleEditModalOpen = () => setEditSpouse(true);
  const handleModalFirstClose = () => setModalFirst(false);

  const [NullChild, setNullChild] = useState(false);

  const handleModalFirstShow = () => {
    setModalFirst(true);
    setFamilyMember(false);
  };

  const handleFamilyMemberClose = () => setFamilyMember(false);

  const items = props.list[0];
  var children_array = [];
  // console.log("items inside hometree: ", items);
  var x=0;

  const traverse = (kids, b, idx) => {
    //console.log("KIDS ", kids, x);
    if(kids) {
      children_array.push(kids.map( (kid ) => ({
        id: b = ++b,
        indiv_id: kid.individual_id,
        label: <TreeLabel
            onClick={handleModalFirstShow}
            onClick2={handleEditModalOpen}
            name={kid.first_name}
            indiv_id={kid.individual_id}
            id={b=++b}
            last={kid.last_name}
            parentID={kid.parent}
            information={kid.info}
            dob={kid.birth}
            dod={kid.death}
            gender={kid.gender}
            spouse={kid.spouse ? kid.spouse[0].first_name : null}
            spouseLName={kid.spouse ? kid.spouse[0].last_name : null}
            spouseDOB={kid.spouse ? kid.spouse[0].birth : null}
            spouseID = {kid.spouse ? kid.spouse[0].individual_id : null}
            spouseInformation = {kid.spouse ? kid.spouse[0].info : null}
            spouseGender = {kid.spouse ? kid.spouse[0].gender : null}
            spouseParent = {kid.spouse ? kid.spouse[0].parent : null}
          />,
        children: kid.children ? traverse(kid.children, b) : null
      })) )
    }
    return children_array.reverse()[0];
  };

  /*Declaring and setting the tree with appropriate info */
  const data = [
    {
    id: x,
    indiv_id: items.individual_id,
    label: items ? (
      <TreeLabel
          //onClick={toggleTooltip}
          onClick={handleModalFirstShow}
          onClick2={handleEditModalOpen}
          indiv_id={items.individual_id}
          name={items.first_name}
          id={x}
          last={items.last_name}
          parentID={items.parent}
          information={items.info}
          dob={items.birth}
          dod={items.death}
          gender={items.gender}
          spouse={items.spouse ? items.spouse[0].first_name : null}
          spouseLName={items.spouse ? items.spouse[0].last_name : null}
          spouseDOB={items.spouse ? items.spouse[0].birth : null}
          spouseDOD={items.spouse ? items.spouse[0].death : null}
          spouseID = {items.spouse ? items.spouse[0].individual_id : null}
          spouseInformation = {items.spouse ? items.spouse[0].info : null}
          spouseGender = {items.spouse ? items.spouse[0].gender : null}
          spouseParent = {items.spouse ? items.spouse[0].parent : null}
      />
    ) : "loading",
    indiv_id: items ? (items.individual_id) : null,
    children: items ? (items.children.map( (child, idx) => ({
        id: x = ++idx,
        indiv_id: child.individual_id,
        label: <TreeLabel
          //onClick={toggleTooltip}
          onClick={handleModalFirstShow}
          onClick2={handleEditModalOpen}
          name={child.first_name}
          indiv_id={child.individual_id}
          id={x=++idx}
          last={child.last_name}
          parentID={child.parent}
          information={child.info}
          dob={child.birth}
          dod={child.death}
          gender={child.gender}
          spouse={child.spouse ? child.spouse[0].first_name : null}
          spouseLName={child.spouse ? child.spouse[0].last_name : null}
          spouseDOB={child.spouse ? child.spouse[0].birth : null}
          spouseDOD={child.spouse ? child.spouse[0].death : null}
          spouseID = {child.spouse ? child.spouse[0].individual_id : null}
          spouseInformation = {child.spouse ? child.spouse[0].info : null}
          spouseGender = {child.spouse ? child.spouse[0].gender : null}
          spouseParent = {child.spouse ? child.spouse[0].parent : null}
        />,
        children: child.children ? traverse(child.children, x, idx) : null
      })) ) : null
  }
];

  const [nodes, setNodes] = useState(data);

  function remove(arr, id) {
    console.log("in remove. array and selected id ", arr, id);
    return arr
      .filter((el) => el.id !== id)
      .map((el) => {
        if (!el.children || !Array.isArray(el.children)) return el;
        el.children = remove(el.children, id);
        return el;
      });
  }


  //Add spouse by assigning values to spouse variables of treelabel object and then rerender the treelabel element
  const addSpouse = (array, id, data) => {
    return !array ? null :array.map((o) =>
      o.id === id
        ? {
            ...o,
            spouse: data?.firstName,  
            spouseLName: data?.lastName, 
            spouseDOB: data?.dateOfBirth, 
            spouseDOD: data?.dateOfDeath, 
            spouseGender: data?.gender, 
            spouseId: o.id,
            label: (
              <TreeLabel
                onClick={handleModalFirstShow}
                onClick2={handleEditModalOpen}
                name={o?.firstName}
                last={o?.lastName}
                dob={o?.dob}
                dod={o?.dod}
                gender={o?.gender}
                spouse={data?.firstName}
                spouseLName={data?.lastName}
                spouseDOB={data?.dateOfBirth}
                spouseDOD={data?.dateOfDeath}
                spouseGender={data?.gender}
              />
            ),
          }
        : { ...o, children: addSpouse(o.children, id, data) }
    );
  };

  //Edit family member by changing values of the family member's variables and then rerender the treelabel element
  const editNode = (array, id, data) =>
    !array ? null :array.map((o) =>
      o.id === id
        ? {
            ...o,
            firstName: data?.firstName,
            lastName: data?.lastName,
            dob: data?.dateOfBirth,
            dod: data?.dateOfDeath,
            gender: data?.gender,
            spouse: o?.spouse,
            spouseLName: o?.spouseLName,
            spouseDOB: o?.spouseDOB,
            spouseDOD: o?.spouseDOD,
            spouseGender: o?.spouseGender,
            label: (
              <TreeLabel
                onClick={handleModalFirstShow}
                onClick2={handleEditModalOpen}
                name={data?.firstName}
                last={data?.lastName}
                dob={data?.dateOfBirth}
                dod={data?.dateOfDeath}
                gender={data?.gender}
                spouse={o?.spouse}
                spouseLName={o?.spouseLName}
                spouseDOB={o?.spouseDOB}
                spouseDOD={o?.spouseDOD}
                spouseGender={o?.spouseGender}
              />
            ),
          }
        : { ...o, children: editNode(o.children, id, data) }
    );

  //Edit family member spouse by changing values of the family member's spouse variables and then rerender the treelabel element  
  const editNodeSpouse = (array, id, data) =>
    !array ? null :array.map((o) =>
      o.id === id
        ? {
            ...o,
            spouse: data?.firstName,
            spouseLName: data?.lastName,
            spouseDOB: data?.dateOfBirth,
            spouseDOD: data?.dateOfDeath,
            spouseGender: data?.gender,
            label: (
              <TreeLabel
                onClick={handleModalFirstShow}
                onClick2={handleEditModalOpen}
                name={o?.firstName}
                last={o?.lastName}
                dob={o?.dob}
                dod={o?.dod}
                gender={o?.gender}
                spouse={data?.firstName}
                spouseLName={data?.lastName}
                spouseDOB={data?.dateOfBirth}
                spouseDOD={data?.dateOfDeath}
                spouseGender={data?.gender}
              />
            ),
          }
        : { ...o, children: editNodeSpouse(o.children, id, data) }
    );

  
  const handleFamilyMemberShow = (id, result_id) => {
    console.log("in handle modal, result_id is: ", result_id);
    reset({});
    setTypeId(id);
    if (id !== 3) {
      if (id === 4) {
        reset({
          ...selectedData,
          dateOfBirth: selectedData.dob,
          dateOfDeath: selectedData.dod,
        });
      }

      if (id === 5) {
        reset({
          ...selectedData,
          firstName: selectedData?.spouse,
          lastName: selectedData?.spouseLName,
          dateOfBirth: selectedData?.spouseDOB,
          dateOfDeath: selectedData?.spouseDOD,
          gender: selectedData?.spouseGender,
        });
      }

      setModalFirst(false);
      setFamilyMember(true);

    }

  /* if remove person is clicked */
    else {
      const removed = remove(nodes, selectedId);
      setNodes(removed);
      delData(selectedData.indiv_id);
      setModalFirst(false);
      console.log("in remove. we deleted the result id.");
      console.log("in remove. nodes are: ", nodes);
    }
  };

  /* Based on the if the the family member is the root or not, display the following options to the user when the user presses the + button 
  by the family member. 
  
  Root node doesn't have option to be removed, and add spouse will not show up as an option if family member already has spouse*/
  const announcements = () => {
    console.log("SELECTED", selectedData?.label.props.spouse ? selectedData.label.props.spouse : null);
    if (selectedId === 0) { {/*if selected family member is the root node*/}
      if (selectedData?.label.props.spouse === null) {  {/*if selected family member doesn't have a a spouse... */}
        return [
          {
            id: 1,
            title: "Add Child",
          },
          {
            id: 2,
            title: "Add Spouse",
          },

          {
            id: 4,
            title: "Edit Person",
          },
        ];
      } else {
        return [
          {
            id: 1,
            title: "Add Child",
          },
          {
            id: 4,
            title: "Edit Person",
          },
        ];
      }
    }

    else if (selectedData?.label.props.spouse === null) { {/*if selected family member doesn't have a a spouse... */}
      return [
        {
          id: 1,
          title: "Add Child",
        },
        {
          id: 2,
          title: "Add Spouse",
        },
        {
          id: 3,
          title: "Remove Person",
        },
        {
          id: 4,
          title: "Edit Person",
        },
      ];
    } else {
      return [
        {
          id: 1,
          title: "Add Child",
        },

        {
          id: 3,
          title: "Remove Person",
        },
        {
          id: 4,
          title: "Edit Person",
        },
      ];
    }
  };

  const update = (array, id, object) =>
    !array ? null: array.map((o) =>
      
    o.id === id
    ? o.children == null? { ...o, children: [o.children, { ...object, pId: o?.id }] }:  { ...o, children: [...o.children, { ...object, pId: o?.id }] }
    : { ...o, children: update(selectedData.children == null? selectedData.children : o.children, id, object) }
    // does not work when person only has one child
);

const checkSsz = (children) => {

}

  console.log("selectedData", selectedData);

  // TIME DELAY

  /*Based on entering data for new family member and pressing save, create new node */
  const onSubmit = (data1) => {
    console.log("curr data optionf or ", data1)
    let newNode = {
      id: x,
      label: (
        <TreeLabel
          id={x = ++x}
          onClick={handleModalFirstShow}
          onClick2={handleEditModalOpen}
          name={data1?.firstName}
          last={data1?.lastName}
          dob={data1?.dateOfBirth}
          dod={data1?.dateOfDeath}
          gender={data1?.gender}
        />
      ),
      children: [],
      firstName: data1?.firstName,
      lastName: data1?.lastName,
      dob: data1?.dateOfBirth,
      dod: data1?.dateOfDeath,
      gender: data1?.gender,
      spouse: null,
    };
    if (typeId === 2) {
      console.log("type two add spouse")

      let spouse = addSpouse(nodes, selectedId, data1);
      savePerson(data1, 1)

      setNodes(spouse);
      setFamilyMember(false);
    } else if (typeId === 1) {
      console.log("type 1 update/add child")
      // console.log("update array: ", nodes)

        console.log(nodes)
        const newArray = update(nodes, selectedId, newNode);
        console.log(newArray)
        savePerson(data1, 0)
        setNodes(newArray);

        // for adding a new child to a parent w out children or when adding a child to a parent w a spouse
        // || selectedData.props.spouse == null
      if (selectedData.children == null) {
        console.log("parent has not curr children")
        setNullChild(true)
    
        // parent has no children, add child to DB before list view
        // savePerson(data1, 0)
        console.log("should refresh")
        setNullChild(false)
        // refresh page
        setTimeout(() => {
          console.log("should wait six sec")
          window.location.reload(false);
        }, 3000);
        
      }
      
      
      setFamilyMember(false);
    } else if (typeId === 4) {
      console.log("type 4 editing")

      // console.log("nodes of ppl for edit: ")
      // console.log(nodes)
      // console.log(selectedId)
      const edited = editNode(nodes, selectedId, data1);
      editIndiv(data1, props.treeId.match.params.treeId, 1)
      
      console.log("ret from editNode")

      setEdited(edited);
      setNodes(edited);
      setFamilyMember(false);
    } else if (typeId === 5) {
      console.log("type 5 edit spouse")
      const editedSpouse = editNodeSpouse(nodes, selectedId, data1);
      editIndiv(data1, treeIdentif, 2)

      
      setNodes(editedSpouse);
      setFamilyMember(false);
    }
    seteditOrAdd(0)
    reset();
  };

  /*Remove spouse by setting spouse variables to values of null */
  const removeSpouse = (array, id) => {
    let editedSpouse = array.map((o) =>
      o.id === id
        ? {
            ...o,
            spouse: null,
            spouseLName: null,
            spouseDOB: null,
            spouseDOD: null,
            spouseGender: null,
            spouseId: null,
            label: (
              <TreeLabel
                onClick={handleModalFirstShow}
                onClick2={handleEditModalOpen}
                name={o?.firstName}
                last={o?.lastName}
                dob={o?.dob}
                dod={o?.dod}
                gender={o?.gender}
              />
            ),
          }
        : { ...o, children: editNodeSpouse(o.children, id, data) }
    );

    setNodes(editedSpouse);
    handleEditModalClose();
  };

  useEffect(() => {
    testSharing()
    if (edited !== null) {
      setTimeout(() => {
        setNodes(edited);
      }, 3000);
    }
  }, [edited]);

  // FOR SHARING FUNCTIONALITY
  // checks data -- sets value for id of the collaborator and sets wanting to do
  // a tree list share as true
  const testSharing = (id) => {
    // console.log(id)
    setidtoshare(id)
    // console.log("clicked on HOMETREE for share")
    // console.log("HOMETREE " , idtoshare + " "+ id + " and sharing condition is " + wantShare + " with ID ", collabID[3])
    settreeviewShare(true)
  }

  // Only shows the "..." when you want to share an individual
  const sharingShow = (indiv_id) => {
    if (wantShare == true) {
      // return <div className='text' id="sharing_id" defaultValue={indiv_id} onClick={ () => {testSharing(indiv_id);}}>...</div>
    }
  }

  // Only share individuals when sharing == true, and have all necessary data (tree id, collaborator ID, tree name)
  const sharingFunct = () => {
    // console.log("in HomeTree " + collabID[0] + " " + idtoshare + " " + treeviewShare)

    if (collabID[0] == true && idtoshare != undefined && treeviewShare == true) {
      const result = axios.post (`http://localhost:5000/api2/share/${idtoshare}/${collabID[1]}/${collabID[2]}/${collabID[3]}`, {
        method:'POST',
      headers: { 'Content-Type': 'application/json'},
    });

    // reset tree view sharing to false
    // console.log("created tree with treelist")
    // console.log(result)
    settreeviewShare(false)
    collabID[0] = false
  }
  }

  /* Based on announcement id, display correct popup menu options for each family member */
  //className="popup_form"
  return (
    <div>
      <ModalComponent show={modalFirst} onClose={handleModalFirstClose}>
        <div>
          <ul className="-my-5 divide-y divide-gray-200">
            {announcements().map((announcement) => (
              <li key={announcement.id} className="py-5">
                <div className="relative p-1 rounded-sm">
                  <h3 className="text-sm font-bold text-gray-800">
                    <button 
                      onClick={() => {handleFamilyMemberShow(announcement.id); seteditOrAdd(announcement.id); console.log("edit or add was ", announcement.id)}}
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      {announcement.title}
                    </button>
                  </h3>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </ModalComponent>

      {/*popup menu options for each family member's spouse (Edit/remove spouse)*/}
      <ModalComponent show={editSpouse} onClose={handleEditModalClose}>
        <div>
          <ul className="-my-5 divide-y divide-gray-200">
            <li className="py-5">
              <div className="relative p-1 rounded-sm">
                <h3 className="text-sm font-bold text-gray-800">
                  <button
                    onClick={() => handleFamilyMemberShow(5)}
                    className=" hover:text-indigo-500 focus:outline-none font-bold"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    Edit Spouse
                  </button>
                </h3>
              </div>
            </li>
            <li className="py-5">
              <div className="relative p-1 rounded-sm">
                <h3 className="text-sm font-bold text-gray-800">
                  <button
                    onClick={() => {removeSpouse(nodes, selectedId); delData(selectedData.label.props.spouseID); console.log("clicked delete spouse: ", nodes, " here is curr selected ", selectedData)}}
                    className=" hover:text-indigo-500 focus:outline-none font-bold"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    Remove Spouse
                  </button>
                </h3>
              </div>
            </li>
          </ul>
        </div>
      </ModalComponent>


      {/*Popup menu for adding/editing family member. Input fields includes first name, last name, gender, dob, and dod*/}
      {/*className="add_form"*/}
      <ModalComponent show={familyMember} onClose={handleFamilyMemberClose}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <h3 className="mb-5 text-lg leading-6 font-medium text-gray-900">
            Add/Edit Family Member
          </h3>
          <ul className="-my-3">
            <li className="py-3">
              <div className="relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                <label
                  htmlFor="FirstName"
                  className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs text-base font-medium text-gray-900"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  {...register("firstName")}
                  required
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Jane"
                  defaultValue={selectedData && editOrAdd == 4? selectedData.label.props.name : ""}
                />
              </div>
            </li>
            <li className="py-3">
              <div className="relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                <label
                  htmlFor="lastName"
                  className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs text-base font-medium text-gray-900"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  {...register("lastName")}
                  required
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Doe"
                  defaultValue={selectedData && editOrAdd == 4 ? selectedData.label.props.last : ""}
                />
              </div>
            </li>

            <li className="py-3">
              <div className="relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                <label
                  htmlFor="gender"
                  className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs text-base font-medium text-gray-900"
                >
                  Gender
                </label>
                <input
                  type="text"
                  name="gender"
                  {...register("gender")}
                  required
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  defaultValue={selectedData && editOrAdd == 4 ? selectedData.label.props.gender : ""}
                />
              </div>
            </li>

            <li className="py-3">
              <div className="relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                <label
                  htmlFor="dateOfBirth"
                  className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs text-base font-medium text-gray-900"
                >
                  Date of Birth
                </label>
                <input
                  {...register("dateOfBirth")}
                  required
                  type="date"
                  name="dateOfBirth"
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Doe"
                  defaultValue={selectedData && editOrAdd == 4 ? selectedData.label.props.dob : ""}
                />
              </div>
            </li>
            <li className="py-3">
              <div className="relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                <label
                  htmlFor="dateOfDeath"
                  className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs text-base font-medium text-gray-900"
                >
                  Date of Death
                </label>
                <input
                  {...register("dateOfDeath")}
                  required
                  type="date"
                  name="dateOfDeath"
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Doe"
                  defaultValue={!selectedData && editOrAdd == 4 ? selectedData.label.props.dod : ""}
                />
              </div>
            </li>
          </ul>
          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              // onClick={handleFamilyMemberClose}
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Save
            </button>
          </div>
        </form>
      </ModalComponent>

      <TreeView
        data={nodes}
        renderNode={(data) => (
          <div
            onClick={() => {
              setSelectedId(data.id);
              setSelectedData(data);
              console.log("nodeData", data);
            }}
          >
            {data.label}

            {sharingShow(data.indiv_id)}
            {sharingFunct()}
          </div>
        )}
      />
    </div>
  );
};

export default HomeTree;
