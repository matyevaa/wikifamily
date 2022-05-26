import React, {useState, useEffect, useRef} from 'react';
import { ReactComponent as PlusIcon } from "../assets/icon/plus.svg";
import { BsFileEarmarkPerson } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const TreeLabel = ({
  onClick,
  onClick2,
  name,
  spouse,
  last,
  dob,
  dod,
  information,
  spouseLName,
  spouseDOB,
  spouseDOD,
  spouseInformation,
  gender,
  spouseGender,
}) => {

  const ref = useRef();
  const toggleTooltip = () => ref.current.toggle();

  return (
    <div className="flex items-center">
      <span className="indiv_info">
        {name} {last} <br />({dob ? dob : "?" } - {dod ? dod : "?"})
      </span>

      <button className="info_btn" onClick={toggleTooltip}><BsFileEarmarkPerson className="info_icon"/></button>
      <Popup ref={ref}>
           <div className="pop">
             <ul className="person_info">
              <div id="centralize">
                {/*}<div id="jon"></div>*/}
                  <div className="list_info">
                    <li><span>First Name: </span>{name ? name : "?"}</li>
                    <li><span>Last Name: </span>{last ? last : "?"}</li>
                    <li><span>Information: </span>{information ? information : "?"}</li>
                    <li><span>Gender: </span>{gender ? gender : "?"}</li>
                    <li><span>Date of Birth: </span>{dob ? dob : "?"}</li>
                    <li><span>Date of Death: </span>{dod ? dod : "?"}</li>
                  </div>
                </div>
             </ul>
           </div>
         </Popup>

      {/*button for popup menu. Plus icon inserts "+" into button*/}
      <button
        onClick={onClick}
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
          <button className="info_btn" onClick={toggleTooltip}><BsFileEarmarkPerson className="info_icon"/></button>
          <Popup ref={ref}>
               <div className="pop">
                 <ul className="person_info">
                  <div id="centralize">
                    {/*}<div id="jon"></div>*/}
                      <div className="list_info">
                        <li><span>First Name: </span>{spouse ? spouse : "?"}</li>
                        <li><span>Last Name: </span>{spouseLName ? spouseLName : "?"}</li>
                        <li><span>Information: </span>{spouseInformation ? spouseInformation : "?"}</li>
                        <li><span>Gender: </span>{spouseGender ? spouseGender : "?"}</li>
                        <li><span>Date of Birth: </span>{spouseDOB ? spouseDOB : "?"}</li>
                        <li><span>Date of Death: </span>{spouseDOD ? spouseDOD : "?"}</li>
                      </div>
                    </div>
                 </ul>
               </div>
             </Popup>
          <button
            onClick={onClick2}
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
