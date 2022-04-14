import React, {useState, useEffect} from 'react';
import TreeView from 'react-expandable-treeview';

 function TreeItem(props) {
   const items = props.item;
   const [collapsed, setCollapsed] = useState();

   //const hasSub = items.Children.length > 0;
   //const renderSub = collapsed && hasSub;

   /*
   <span id="check" onClick={toggle }>{items}</span>
   {
     (collapsed && items) ?
     <div class="treeView" style={{paddingLeft: "1rem"}}>
       { <TreeList list={items}/>}
     </div> : <p>Nope</p>
   }
   */
   const toggle = React.useCallback(() => setCollapsed(!collapsed), [collapsed]);
   console.log("props ", items);
   console.log("collapse ", collapsed);

   var n = 0;

   const data = [
     {
       id: n,
       label: items.ParentName,
       children: [
         {
           id: n+1,
           label: items.Child1,
           children: [ {
             id: n+2,
             label: items.Child2,
             children: [ {
               id: n+3,
               label: items.Child3,
               children: [ {
                 id: n+4,
                 label: items.Child4,
                 children: [ {
                   id: n+5,
                   label: items.Child5,
                   children: [ {
                     id: n+6,
                     label: items.Child6,
                     children: [ {
                       id: n+7,
                       label: items.Child7,
                       children: [ {
                         id: n+8,
                         label: items.Child8,
                         children: [ {
                           id: n+9,
                           label: items.Child9,
                           children: [ {
                             id: n+10,
                             label: items.Child10,
                           children: [ {
                             id: n+11,
                             label: items.Child11,
                           children: [ {
                             id: n+12,
                             label: items.Child12,
                             children: [ {
                               id: n+13,
                               label: items.Child13,
                               children: [ {
                                 id: n+14,
                                 label: items.Child14
                                    }]
                                  }]
                                }]
                              }]
                            }] // 10
                          }] // 9
                        }] // 8
                     }], // 7
                   }] // 6
                  }]
                }]
               }]
             }]
           }]
        }]

   return (
      <TreeView class="tree_item" data={data} renderNode={({label}) => <div>{label}</div>}/>
  )
 }

 function TreeList(props) {
   const {list} = props;
   console.log("list ", list);

   return (
    !list?.length ? null :
    <div>{list.map(f =>
      <div>
      <TreeItem key={f.individual_id} item={f}/>
    </div>)}
    </div>
    )
 }

export default TreeList;
