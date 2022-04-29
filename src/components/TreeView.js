import React, {useState, useEffect, useRef} from 'react';
import TreeView from 'react-expandable-treeview';
import { BsFileEarmarkPerson } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


 function TreeItem(props) {
   const ref = useRef();
   const toggleTooltip = () => ref.current.toggle();
   const items = props.item;
   var family = props.family;
   var children_array = [];
   console.log("items ", items);
   console.log("family ", family);
   var x = 0;

    const traverse = (kids, x, idx) => {
      //console.log("KIDS ", kids, x);
      if(kids) {
        children_array.push(kids.map( (kid ) => ({
          id: x = ++x,
          label: kid.first_name,
          children: kid.children ? traverse(kid.children, x) : null
        })) )
      }
      //console.log("CHILDREN ARRAY ", children_array);
      return children_array.reverse()[0];
    };

     const data = [{
       id: x,
       label: items.first_name, // parent #1
       children: items.children.map( (child, idx) => ({
           id: x = ++idx,
           label: child.first_name, // child of parent #1
           children: child.children ? traverse(child.children, x, idx) : null
         }))
     }]

     /* for pop up window with detailed info
     const search = (label) => {
       console.log("label" , label);
       var res = family.filter(item => {
         return item.first_name === label
       })
       console.log("res", res[0]);
       var person = res[0];
       return person;
     }
     */

   return (

      <TreeView class="tree_item" data={data} renderNode={({label}) =>
        <div>{label} <BsFileEarmarkPerson onClick={toggleTooltip}/>
          <Popup ref={ref}>
            <div className="pop">
              <ul className="person_info">
                { /*
                  <div id="centralize">
                  <div id="jon"></div>
                  <div className="list_info">
                    <li><span>First Name:</span> {search(label).first_name}</li>
                    <li><span>Last Name:</span> {search(label).last_name}</li>
                    <li><span>Information:</span> {search(label).info}</li>
                    <li><span>Gender:</span> {search(label).gender}</li>
                    <li><span>Date of Birth:</span> {search(label).birth}</li>
                    <li><span>Date of Death:</span> {search(label).death}</li>
                  </div>
                  </div>
                */}
              </ul>
            </div>
          </Popup>
        </div> }/>
  )
 }

 const TreeList = ({list, family}) => {

   //console.log("count ", count);
   //console.log("list ", list);

   return (
    !list?.length ? null :
    <div>{list.map(f =>
      <div>
      <TreeItem key={f.individual_id} item={f} family={family}/>
    </div>)}
    </div>
    )
 }

export default TreeList;
