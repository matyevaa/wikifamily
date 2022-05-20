import React, {useState, useEffect, useRef} from 'react';
import TreeView from 'react-expandable-treeview';
import { BsFileEarmarkPerson } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from 'axios';
import HomeTree from "./HomeTree";

// ################################################################################
// # Description:  Will traverse through the family tree individuals
// # 
// # input:        props -- items: list of family tree members
//                          family: list of family tree members w extra info
// # 
// # return:       new1
// ################################################################################
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
  }, []);

  //  console.log("props for treeview ", props);
  //  console.log("items ", items);
  //  console.log("family ", family);
   var x = 0;

  // traverse childrens children
    const traverse = (kids, x, idx) => {
      //console.log("KIDS ", kids, x);
      if(kids) {
        children_array.push(kids.map( (kid ) => ({
          id: x = ++x,
          label: kid.first_name,
          last: kid.last_name,
          indiv_id: kid.individual_id,
          children: kid.children ? traverse(kid.children, x) : null
        })) )
      }
      //console.log("CHILDREN ARRAY ", children_array);
      return children_array.reverse()[0];
    };

      // traverse whole family tree starting with root --> children -> childrens children
     const data = [{
       id: x,
       label: items.first_name, // parent #1
       indiv_id: items.individual_id,
       last: items.last_name,
       children: items.children.map( (child, idx) => ({
           id: x = ++idx,
           label: child.first_name, // child of parent #1
           indiv_id: child.individual_id,
           last: child.last_name,
           children: child.children ? traverse(child.children, x, idx) : null
         }))
     }]

  // renders the individuals information for tree view
   return (
      <TreeView className="tree_item" data={data} renderNode={({label,indiv_id, last}) =>
        <div className="tree_text">{label} <BsFileEarmarkPerson onClick={toggleTooltip}/>
        </div> }/>
  )
 }

 // ################################################################################
// # Description:  Will render the final tree list view
// # 
// # input:       list   -- root individual and their descendants
//                treeId -- current tree ID
//                family -- root individual and descendants with full info
//                share  -- boolean on whether a user wants to share a family tree
//                collab -- [boolean on whether 'share tree' has been clicked, tree ID, tree name, id of collaborator]
// # 
// # return:       new1
// ################################################################################
 const TreeList = ({list, treeId, family, share, collab}) => {
   return (
     <div>

     {!list?.length ? null :
       <HomeTree list={list} treeId={treeId} share={share} collab={collab}/>
      }

    </div>
  )
}

export default TreeList;
