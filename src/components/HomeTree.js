import React, { useEffect, useState, useRef } from "react";
import TreeView from "react-expandable-treeview";
import ModalComponent from "./ModalComponent";
import TreeLabel from "./TreeLabel";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';

const HomeTree = (props) => {
  const [editSpouse, setEditSpouse] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // console.log("HomeTree: ", props)
  console.log("HomeTree: Sharing boolean ", props.share)
  console.log("HomeTree: collab info ", props.collab)
  // console.log("HomeTree: share boolean ", props.share.match.params.share)

  // FOR SHARING VARS START
  var wantShare = props.share;
  var collabID = props.collab;
  const [treeviewShare, settreeviewShare] = useState(false);
  const [idtoshare, setidtoshare] = useState("");
  // SHARING VARS END

  console.log("tree id: ", props.treeId.match.params.treeId);
  const treeIdentif = props.treeId.match.params.treeId;

  const delData = async(individual_id) => {
    console.log("In Delete in homeTree, individual_id is ", individual_id);
    await axios.delete (`http://localhost:5000/api1/delete/${individual_id}/${treeIdentif}`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .catch(err => console.log(err));
    window.location.reload(false);
  };

  const [modalFirst, setModalFirst] = useState(false);

  const ref = useRef();
  const toggleTooltip = () => ref.current.toggle();

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

  const handleModalFirstShow = () => {
    setModalFirst(true);
    setFamilyMember(false);
  };

  const handleFamilyMemberClose = () => setFamilyMember(false);

  const items = props.list[0];
  var children_array = [];
  console.log("items inside hometree: ", items);
  var x=0;

  const traverse = (kids, b, idx) => {
    //console.log("KIDS ", kids, x);
    if(kids) {
      children_array.push(kids.map( (kid ) => ({
        id: b = ++b,
        indiv_id: kid.individual_id,
        label: <TreeLabel
            onClick={toggleTooltip}
            name={kid.first_name}
            indiv_id={kid.individual_id}
            id={b=++b}
            last={kid.last_name}
            dob={kid.birth}
            dod={kid.death}
            gender={kid.gender}
          />,
        children: kid.children ? traverse(kid.children, b) : null
      })) )
    }
    console.log("CHILDREN ARRAY ", children_array);
    return children_array.reverse()[0];
  };

    /*handle Modal first show is to show popup menu. */
  /*
  const data = [
    {
      id: 0,
      label: (
        <TreeLabel
          onClick={handleModalFirstShow}
          onClick2={handleEditModalOpen}
          name="A "
          id={0}
          last="Father"
          dob="2022-04-05"
          dod="2022-04-05"
          gender="male"
        />
      ),
      children: [],
      firstName: "A",
      lastName: "father",
      dob: "2022-04-05",
      dod: "2022-04-05",
      gender: "male",
      pId: 1,
      spouse: null,
    },
  ];
*/
  
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
          dob={items.birth}
          dod={items.death}
          gender={items.gender}
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
          dob={child.birth}
          dod={child.death}
          gender={child.gender}
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

  const addSpouse = (array, id, data) => {
    return array.map((o) =>
      o.id === id
        ? {
            ...o,
            spouse: data?.firstName,  //items
            spouseLName: data?.lastName, //items
            spouseDOB: data?.dateOfBirth, //items
            spouseDOD: data?.dateOfDeath, //items
            spouseGender: data?.gender, //items
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

  const editNode = (array, id, data) =>
    array.map((o) =>
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

  const editNodeSpouse = (array, id, data) =>
    array.map((o) =>
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
      delData(result_id);
      setModalFirst(false);
      console.log("in remove. we deleted the result id.");
      console.log("in remove. nodes are: ", nodes);
    }
  };

  const announcements = () => {
    if (selectedId === 0) {
      if (selectedData?.spouse === null) {
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
    } else if (selectedData?.spouse === null) {
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
    array.map((o) =>
      o.id === id
        ? { ...o, children: [...o.children, { ...object, pId: o?.id }] }
        : { ...o, children: update(o.children, id, object) }
    );

  console.log("selectedData", selectedData);

  const onSubmit = (data1) => {
    let uniqueId = uuidv4();
    let newNode = {
      id: uniqueId,
      label: (
        <TreeLabel
          id={uniqueId}
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
      let spouse = addSpouse(nodes, selectedId, data1);
      setNodes(spouse);
      setFamilyMember(false);
    } else if (typeId === 1) {
      const newArray = update(nodes, selectedId, newNode);
      setNodes(newArray);
      setFamilyMember(false);
    } else if (typeId === 4) {
      const edited = editNode(nodes, selectedId, data1);
      setEdited(edited);
      setNodes(edited);
      setFamilyMember(false);
    } else if (typeId === 5) {
      const editedSpouse = editNodeSpouse(nodes, selectedId, data1);
      setNodes(editedSpouse);
      setFamilyMember(false);
    }
    reset();
  };

  const removeSpouse = (array, id) => {
    let editiedSpouse = array.map((o) =>
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

    setNodes(editiedSpouse);
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

  // FOR SHARING FUNCT
  const testSharing = (id) => {
    console.log(id)
    setidtoshare(id)
    console.log("clicked on HOMETREE for share")
    console.log("HOMETREE " , idtoshare + " "+ id + " and sharing condition is " + wantShare + " with ID ", collabID[3])
    settreeviewShare(true)
  }

  const sharingShow = (indiv_id) => {
    if (wantShare == true) {
      return <div className='text' id="sharing_id" defaultValue={indiv_id} onClick={ () => {testSharing(indiv_id);}}>...</div>
    }
  }

  const sharingFunct = () => {
    console.log("in HomeTree " + collabID[0] + " " + idtoshare + " " + treeviewShare)

    if (collabID[0] == true && idtoshare != undefined && treeviewShare == true) {
      const result = axios.post (`http://localhost:5000/api2/share/${idtoshare}/${collabID[1]}/${collabID[2]}/${collabID[3]}`, {
        method:'POST',
      headers: { 'Content-Type': 'application/json'},
    });

    console.log("created tree with treelist")
    console.log(result)
    settreeviewShare(false)
    collabID[0] = false
  }
  }

  /* render all options in popup menu*/
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
                      onClick={() => handleFamilyMemberShow(announcement.id)}
                      //type="button"
                      className=" hover:text-indigo-500 focus:outline-none font-bold"
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

      {/*popup menu options styling*/}          
      <ModalComponent show={editSpouse} onClose={handleEditModalClose}>
        <div>
          <ul className="-my-5 divide-y divide-gray-200">
            <li className="py-5">
              <div className="relative p-1 rounded-sm">
                <h3 className="text-sm font-bold text-gray-800">
                  <button
                    onClick={() => handleFamilyMemberShow(5)}
                    //type="button"
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
                    onClick={() => removeSpouse(nodes, selectedId)}
                    //type="button"
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

      {/*input fields when user selects options */}   
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
                  className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  {...register("firstName")}
                  required
                  className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                  placeholder="Jane"
                />
              </div>
            </li>
            <li className="py-3">
              <div className="relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                <label
                  htmlFor="lastName"
                  className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  {...register("lastName")}
                  required
                  className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                  placeholder="Doe"
                />
              </div>
            </li>

            <li className="py-3">
              <div className="relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                <label
                  htmlFor="gender"
                  className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900"
                >
                  Gender
                </label>
                <input
                  type="text"
                  name="gender"
                  {...register("gender")}
                  required
                  className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                  placeholder="Male"
                />
              </div>
            </li>

            <li className="py-3">
              <div className="relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                <label
                  htmlFor="dateOfBirth"
                  className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900"
                >
                  Date of Birth
                </label>
                <input
                  {...register("dateOfBirth")}
                  required
                  type="date"
                  name="dateOfBirth"
                  className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                  placeholder="Doe"
                />
              </div>
            </li>
            <li className="py-3">
              <div className="relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
                <label
                  htmlFor="dateOfDeath"
                  className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900"
                >
                  Date of Death
                </label>
                <input
                  {...register("dateOfDeath")}
                  required
                  type="date"
                  name="dateOfDeath"
                  className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                  placeholder="Doe"
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

/*
      <TreeView
        data={nodes}
        renderNode={({ label, indiv_id, id }) => (
            <div onClick={() => {setSelectedId(id+1); setSelectedIndivId(indiv_id); toggleTooltip()}}>{label}
            <Popup ref={ref}>
              <div className="pop">
                <ul className="popup_ul">
                    <div id="centralize">

                      {console.log("INDIV: ", label.props)}
                      <div className="list_info">
                        <h3>Choose your operation:</h3>
                        {announcements.map((announcement) => (
                          <li key={announcement.id}>
                            <div>
                            <p id="result_id_p">{label ? (label.props.id === selectedId || label.props.id == 0 ? (result_id = label.props.indiv_id) : null) : null}</p>
                              <h3>
                                <button onClick={() => handleFamilyMemberShow(announcement.id, result_id)} type="button">
                                  {announcement.title}
                                </button>
                              </h3>
                            </div>
                          </li>
                        ))}
                      </div>
                    </div>
                </ul>
              </div>
            </Popup>
            </div>

        )}
      />
    </div>
  );
};

*/

export default HomeTree;
