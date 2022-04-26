import React, {useState, useEffect} from 'react';
import TreeView from 'react-expandable-treeview';

 function TreeItem(props) {
   const items = props.item;
   var count = props.count;
   var children_array = [];
   console.log("props ", items);
   console.log("count ", count);
   var x = 0;

    const traverse = (kids, x, idx) => {
      console.log("KIDS ", kids, x);
      if(kids) {
        children_array.push(kids.map( (kid ) => ({
          id: x = ++x,
          label: kid.first_name,
          children: kid.children ? traverse(kid.children, x) : null
        })) )
      }
      console.log("CHILDREN ARRAY ", children_array);
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


   return (

      <TreeView class="tree_item" data={data} renderNode={({label}) => <div>{label}</div>}/>

  )
 }

 const TreeList = ({list, count}) => {

   console.log("count ", count);
   console.log("list ", list);

   return (
    !list?.length ? null :
    <div>{list.map(f =>
      <div>
      <TreeItem key={f.individual_id} item={f} count={count}/>
    </div>)}
    </div>
    )
 }

export default TreeList;
