import React, {useState, useEffect} from 'react';

 function TreeItem(props) {
   const {item} = props;
   const [collapsed, setCollapsed] = useState(item.collapsed);

   return <div className="tree_item">
    <span id="check" onClick={() => setCollapsed(!collapsed)}>{item.name}</span>
    {!collapsed && item.nodes &&
      <div class="treeView" style={{paddingLeft: "1rem"}}>
        <TreeList list={item.nodes}/>
      </div>
    }
  </div>
 }

 function TreeList(props) {
   const {list} = props;
   return <div>{list.map(f =>
            <TreeItem key={f.name} item={f}/>)}
          </div>;
 }

export default TreeList;
