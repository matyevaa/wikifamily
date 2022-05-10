import React from "react";
import { ReactComponent as PlusIcon } from "../assets/icon/plus.svg";
import { BsFillPlusCircleFill } from 'react-icons/bs';
const TreeLabel = ({
  onClick,
  onClick2,
  name,
  spouse,
  last,
  dob,
  dod,
  spouseLName,
  spouseDOB,
  spouseDOD,
  gender,
  spouseGender,
}) => {
  return (
    <div className="flex items-center">
      <span className="mr-1 capitalize">
        {name} {last} <br /> {gender} <br /> {dob} - {dod}
      </span>

      <button
        className="tree_label_btn"
        onClick={onClick}
        type="button"
      >
        <PlusIcon className="plus" />
      </button>
      {spouse && (
        <>
          <span className="w-[5rem] h-[1px] bg-blue-primary"></span>
          <span className="ml-2 capitalize ">
            {spouse} {spouseLName} <br /> {spouseGender} <br /> {spouseDOB}{" "}
            <br />-{spouseDOD}
          </span>

          <button
            className="tree_label_btn"
            onClick={onClick2}
            type="button">
            <PlusIcon className="plus" />
          </button>
        </>
      )}
    </div>
  );
};

export default TreeLabel;
