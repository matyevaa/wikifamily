import React from "react";
import { ReactComponent as PlusIcon } from "../assets/icon/plus.svg";

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
        {name} {last} <br /> {gender} <br /> {dob} <br />-{dod}
      </span>

      {/*button for popup menu. Plus icon inserts "+" into button*/}
      <button
        className="tree_label_btn"
        onClick={onClick}
        type="button"
      >
        <PlusIcon />
      {/*button for popup menu for spouse. Plus icon inserts "+" into button*/}
      </button>
      {spouse && (
        <>
          <span className="w-[5rem] h-[1px] bg-blue-primary"></span>
          <span className="ml-2 capitalize ">
            {spouse} {spouseLName} <br /> {spouseGender} <br /> {spouseDOB}{" "}
            <br />-{spouseDOD}
            {/* {allSpouses.find((v) => v.id === id)?.firstName} */}
          </span>

          <button
            className="tree_label_btn"
            onClick={onClick2}
            type="button">
            <PlusIcon />
          </button>
        </>
      )}
    </div>
  );
};

export default TreeLabel;
