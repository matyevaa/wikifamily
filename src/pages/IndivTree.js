import React, {useState, useEffect} from 'react';


const IndivTree = (treeId) => {
//   const [treeIdT, settreeIdT] = useState("");

  useEffect(() => {
  }, []);

  const getFamilyTrees = () => {
    // Would call current /create but add in the tree id to get info
  }

  const getTreeId = () => {
    return treeId.location['pathname'].slice(8,(treeId.location['pathname']).length - 7)
  }

  
  return(
    <div className="content">
      <h1 className="subtopic text">Family tree ID: {getTreeId()}</h1>
      <p className="description text">Output individuals in tree here (copy/paste from curr /create)</p>
    </div>
  );
}

export default IndivTree;
