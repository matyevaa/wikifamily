import React from 'react';

/* Use "const Name" to initialize a function and return HTML code there
 * You can add any other JavaScript functions above the const Homepage
 * Make sure you have import statement on the top and export statement in the bottom.
 * Use this template to create other pages.
*/

const Homepage = ({
}) => {
  return(
  <div className="centerDiv">
    <div className="content">
      <h1 className="subtopic text"><strong>How can you create your own family tree?</strong></h1>
      <p className="description text">
        Creating your own family trees no longer requires having to download 
        software, instead, you can now create and keep track of your family 
        genealogy through WikiFamily an online platform to help counteract 
        unnecessary software. 
      </p>
      <p className="description text">Create an account with WikiFamily through 
        email, Facebook, or Google and start creating your own family tree today!</p>

      <h1 className="subtopic text">Related topic on creating family trees</h1>
      <p className="description text">VIDEO DEMO WILL BE PUT HERE</p>

      <h1 className="subtopic text">Available Features</h1>
      <p className="description text">
        WikiFamily aims to bring new features that are not so easily available in other  
        family tree genealogy software. As such features available to WikiFamily users include
      </p>
      <ul className="description text">
        <li>Logging in and creating accounts through Google or Facebook or a traditional email address</li>
        <li>Create or own several family trees</li>
        <li>Collapse individuals and their descendants</li>
        <li>Sharing an individual and their descendants</li>
          <ul><li>Adding, editing, or deleting individuals in a shared tree will be reflected in the original tree </li></ul>
        <li>Viewing a family tree in a list form or through a traditional family tree</li>
          <ul><li>Example pictures added</li></ul>
        <li>Family tree data is managed through a database</li>
      </ul>
    </div>
  </div>
  );
}


export default Homepage;
