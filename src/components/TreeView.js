import React, {useState, useEffect, useRef} from 'react';
import TreeView from 'react-expandable-treeview';
import { BsFileEarmarkPerson } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from 'axios';

 function TreeItem(props) {
   const ref = useRef();
   const toggleTooltip = () => ref.current.toggle();
   const items = props.item;
   var family = props.family;
   var wantShare = props.share;
   var collabID = props.collab;
   const [treeviewShare, settreeviewShare] = useState(false);
   const [idtoshare, setidtoshare] = useState("");
   var children_array = [];

   useEffect(() => {
    testSharing()
  }, []);

   console.log("props for treeview ", props);
  //  console.log("wantshare ", wantShare, " with id ", collabID);
   console.log("items ", items);
   console.log("family ", family);
   var x = 0;

    const traverse = (kids, x, idx) => {
      //console.log("KIDS ", kids, x);
      if(kids) {
        children_array.push(kids.map( (kid ) => ({
          id: x = ++x,
          label: kid.first_name,
          indiv_id: kid.individual_id,
          children: kid.children ? traverse(kid.children, x) : null
        })) )
      }
      //console.log("CHILDREN ARRAY ", children_array);
      return children_array.reverse()[0];
    };

    const testSharing = (id) => {
      console.log(id)
      setidtoshare(id)
      console.log(idtoshare + " "+ id + " and sharing condition is " + wantShare + " with ID ", collabID[3])
      settreeviewShare(true)
    }

    const sharingFunct = () => {
      console.log("in treeView " + collabID[0] + " " + idtoshare + " " + treeviewShare)
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

    const sharingShow = (indiv_id) => {
      if (wantShare == true) {
        return <div id="sharing_id" defaultValue={indiv_id} onClick={ () => {testSharing(indiv_id)}}>{indiv_id}</div>
      }
    }

    // would need to add parent id to items for sharing function

     const data = [{
       id: x,
       label: items.first_name, // parent #1
       indiv_id: items.individual_id,
       children: items.children.map( (child, idx) => ({
           id: x = ++idx,
           label: child.first_name, // child of parent #1
           indiv_id: child.individual_id,
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

      <TreeView className="tree_item" data={data} renderNode={({label,indiv_id}) =>
        <div className="test">{label} <BsFileEarmarkPerson onClick={toggleTooltip}/>
        
        {sharingShow(indiv_id)}
        {sharingFunct()}
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

 const TreeList = ({list, family, share, collab}) => {

   //console.log("count ", count);
   //console.log("list ", list);

   return (
    !list?.length ? null :
    <div>{list.map(f =>
      <div>
      <TreeItem key={f.individual_id} item={f} family={family} share={share} collab={collab}/>
    </div>)}
    </div>
    )
 }

export default TreeList;
