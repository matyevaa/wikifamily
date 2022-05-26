import React from "react";
import { ReactComponent as PlusIcon } from "../assets/icon/plus.svg";


// ################################################################################
// # Description:  Component representing each family member
// # 
// # input: family member fields such as name, last name, gender, dob, dod and the equivalent fields for a spouse if present.         
// # 
// # return: A family member with fields above represented
// ################################################################################

//Define treelabel object with necessary variables
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
        {name} {last} <br />({dob ? dob : "?" } - {dod ? dod : "?"}) {/* Datafields of children that are being displayed on the tree to the user*/}
      </span>

      {/*button for popup menu.*/}
      <button
        onClick={onClick}
        //type="button"
        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-blue-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusIcon /> {/*Plus icon inserts "+" into button*/}
      </button>

      {spouse && (
        <>
          <span className="line"><hr/></span>
          <span className="ml-2 capitalize ">
            {spouse} {spouseLName} <br /> ({spouseDOB ? spouseDOB : "?"} - {spouseDOD ? spouseDOD : "?"}) {/* Datafields of spouse that are being displayed on the tree to the user*/}
          </span>
          
          {/*button for popup menu for spouse. */}
          <button
            onClick={onClick2}
            //type="button"
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-blue-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon /> {/*Plus icon inserts "+" into button*/}
          </button>
        </>
      )}
    </div>
  );
};

export default TreeLabel;
