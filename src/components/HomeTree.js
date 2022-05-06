import React, { useEffect, useState } from "react";
import TreeView from "react-expandable-treeview";
import ModalComponent from "./ModalComponent";
import TreeLabel from "./TreeLabel";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

const HomeTree = (props) => {
  const [editSpouse, setEditSpouse] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [modalFirst, setModalFirst] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
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

  /*handle Modal first show is to show popup menu. */
  /*const data = [
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
    },
  ];*/
  const items = props.list[0];
  var children_array = [];
  console.log("items inside hometree: ", items);
  var x=0;

  const traverse = (kids, x, idx) => {
    //console.log("KIDS ", kids, x);
    if(kids) {
      children_array.push(kids.map( (kid ) => ({
        id: x = ++x,
        label: <TreeLabel
          onClick={handleModalFirstShow}
          onClick2={handleEditModalOpen}
            name={kid.first_name}
            id={x=++x}
            last={kid.last_name}
            dob={kid.birth}
            dod={kid.death}
            gender={kid.gender}
          />,
        children: kid.children ? traverse(kid.children, x) : null
      })) )
    }
    console.log("CHILDREN ARRAY ", children_array);
    return children_array.reverse()[0];
  };

  const data = [{
    id: x,
    label: items ? (
      <TreeLabel
        onClick={handleModalFirstShow}
        onClick2={handleEditModalOpen}
          name={items.first_name}
          id={x}
          last={items.last_name}
          dob={items.birth}
          dod={items.death}
          gender={items.gender}
      />
    ) : null,
    children: items ? (items.children.map( (child, idx) => ({
        id: x = ++idx,
        label: <TreeLabel
          onClick={handleModalFirstShow}
          onClick2={handleEditModalOpen}
          name={child.first_name}
          id={x=++idx}
          last={child.last_name}
          dob={child.birth}
          dod={child.death}
          gender={child.gender}
        />,
        children: child.children ? traverse(child.children, x, idx) : null
      })) ) : null
  }]

  const [nodes, setNodes] = useState(data);

  function remove(arr, id) {
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

  const editNode = (array, id, data) =>
    array.map((o) =>
      o.id === id
        ? {
            ...o,
            firstName: data?.firstName,
            lastname: data?.lastName,
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

  const handleFamilyMemberShow = (id) => {
    setTypeId(id);
    if (id !== 3) {
      setModalFirst(false);
      setFamilyMember(true);
    } else {
      const removed = remove(nodes, selectedId);
      setNodes(removed);
      setModalFirst(false);
    }
  };

  const announcements = [
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

  const update = (array, id, object) =>
    array.map((o) =>
      o.id === id
        ? { ...o, children: [...o.children, { ...object, pId: o?.id }] }
        : { ...o, children: update(o.children, id, object) }
    );

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

  useEffect(() => {
    if (edited !== null) {
      setTimeout(() => {
        setNodes(edited);
      }, 3000);
    }
  }, [edited]);

  console.log("nodes", nodes, "edited", edited);

  /* render all options in popup menu*/
  return (
    <div>
      <ModalComponent show={modalFirst} onClose={handleModalFirstClose}>
        <div>
          <ul className="-my-5 divide-y divide-gray-200">
            {announcements.map((announcement) => (
              <li key={announcement.id} className="py-5">
                <div className="relative p-1 rounded-sm">
                  <h3 className="text-sm font-bold text-gray-800">
                    <button
                      onClick={() => handleFamilyMemberShow(announcement.id)}
                      type="button"
                      className=" hover:text-indigo-500 focus:outline-none font-bold"
                    >
                      {/* Extend touch target to entire panel */}
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
                    type="button"
                    className=" hover:text-indigo-500 focus:outline-none font-bold"
                  >
                    {/* Extend touch target to entire panel */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    Edit Spouse
                  </button>
                </h3>
              </div>
            </li>
          </ul>
        </div>
      </ModalComponent>

      {/*input fields when user selects options */}
      <ModalComponent show={familyMember} onClose={handleFamilyMemberClose}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <h3 className="mb-5 text-lg leading-6 font-medium text-gray-900">
            Add Family Member
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
        renderNode={({ label, id }) => (
          <div onClick={() => setSelectedId(id)}>{label}</div>
        )}
      />
    </div>
  );
};

export default HomeTree;
