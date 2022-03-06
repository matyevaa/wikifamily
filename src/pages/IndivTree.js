import React, {useState, useEffect} from 'react';
import axios from 'axios';

const IndivTree = (treeId) => {
  const [dataDB, setData] = useState(["no data"]);
  const [treeIdentif, setItendif] = useState();

  useEffect(() => {
    // setItendif(treeId.location['pathname'].slice(8,(treeId.location['pathname']).length - 7));
    console.log("get name for tree: ")
    console.log(treeId.location['pathname'].slice(8,(treeId.location['pathname']).length - 7))
    getFamilyName(treeId.location['pathname'].slice(8,(treeId.location['pathname']).length - 7));
    
  }, []);

  const getFamilyName = async(treeID) => {
    console.log("asxdcfvgb")
    const result = await axios (`http://localhost:5000/api1/getTreeName/${treeID}`, {
      headers: { 'Content-Type': 'application/json'}
    })
    .then(result => setData(result.data[0]))
    .catch(err => console.log(err));
    console.log("datadb")
    console.log(dataDB);
    console.log(result);
};

  const getTreeId = () => {
    return treeId.location['pathname'].slice(8,(treeId.location['pathname']).length - 7)
  }

  
  return(
    <div className="content">
      <h1 className="subtopic text">Family tree ID: {dataDB['family_name']}</h1>
      <p className="description text">Output individuals in tree here (copy/paste from curr /create)</p>
    </div>
  );
}

export default IndivTree;
