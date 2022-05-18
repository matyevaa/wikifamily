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
      <span className="indiv_info">
        {name} {last} <br />({dob ? dob : "?" } - {dod ? dod : "?"})
      </span>

      {/*button for popup menu. Plus icon inserts "+" into button*/}
      <button
        onClick={onClick}
        //type="button"
        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-blue-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusIcon />
      {/*button for popup menu for spouse. Plus icon inserts "+" into button*/}
      </button>
      {spouse && (
        <>
          <span className="line"><hr/></span>
          <span className="ml-2 capitalize ">
            {spouse} {spouseLName} <br /> ({spouseDOB ? spouseDOB : "?"} - {spouseDOD ? spouseDOD : "?"})
          </span>

          <button
            onClick={onClick2}
            //type="button"
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-blue-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon />
          </button>
        </>
      )}
    </div>
  );
};

export default TreeLabel;
