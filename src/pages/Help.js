import React from 'react';
import { Component } from 'react/cjs/react.production.min';
import YoutubeVideo from '../components/YoutubeVideo';
import seeID from '../style/seeID.png'; // with import
import newTree from '../style/createTree.png'; // with import
import sharingBtn from '../style/sharingBtn.png'; // with import
import sharingDots from '../style/sharingDots.png'; // with import
import treeViewExpanding from '../style/treeViewExpanding.png'; // with import
import preExpand from '../style/preExpand.png'; // with import
import postExpand from '../style/postExpand.png'; // with import

// ################################################################################
// Description:  Frequently asked questions or guidance with dificulties creating
//               a family tree
// 
// input:        NONE
// 
// return:       Q&A for family trees and a demo of how to create trees
// ################################################################################
class Help extends React.Component{
  render () {
    return(
    <div className="centerDiv">
      <div className = "content">
        <div className='Help'>
          <h1 className = "subtopic text">WikiFamily Tutorial</h1>
          <br></br><br></br>
          <YoutubeVideo videoId='mPZkdNFkNps' />
          <br></br><br></br>
          
          <h3 className='subtopic'>Commonly asked quesitons</h3>
          <ul>
            <li className='description listQs'><a href="#sharingDo?">What does share individua(s) do?</a></li>
            <li className='description listQs'><a href="#newTree">How to create a new tree?</a></li>
            <li className='description listQs'><a href="#sharingIndiv">How to share an individual(s)?</a></li>
            <li className='description listQs'><a href="#findingID">How to find your user ID?</a></li>
            <li className='description listQs'><a href="#viewTree">How to view a family tree?</a></li>
            {/* <li><a href="sharingDo"></a></li> */}
          </ul>


          <h1 className="subtopic text">Q & A</h1>
          {/* <p className="description text"></p> */}

          <br></br><br></br>
          <ul className='text'>
            <li id="sharingDo?" className='description helpQuestion'><strong>What does share individua(s) do?</strong></li>
              <p className='description '>Sharing an individual will allow users to take a selected 
                individual and find their descendants to share with a collaborator 
                via an email or user ID. This will create a new tree for the collaborator 
                containing the selected people. Adding, deleting, and editing of any individual 
                will be reflected in the original family tree.
              </p>

              <li id="newTree" className='description helpQuestion'><strong>How to create a new tree?</strong></li>
                <ul className='description'>
                  <li>In your works page, click on 'Create Tree'</li>
                  <img id="helpImgs" src={newTree} alt='creating new tree button'></img>
                  <li>Enter a family tree name and click 'Create Tree'</li>
                </ul>
                

              <li id="sharingIndiv" className="description helpQuestion"><strong>How to share an individual(s)?</strong></li>
                <ul className="description ">
                  <li>Click ‘Share Individual’</li>
                  <img id="helpImgs" src={sharingBtn} alt='sharing button'></img>
                  <ul>
                    <li>In the table form click on the user ID, in the tree list form click on the '...' of the individual you want to share</li>
                    <img id="helpImgs" src={sharingDots} alt='what to click for sharing'></img>
                  </ul>
                  <li>In the text box input the email or user ID of a collaborator</li>
                    <ul>
                      <li>Any collaborators must have an account with WikiFamily.</li>
                      <li>For collaborators who used Facebook to create an account 
                        with WikiFamily, if their email address or account is not 
                        verified on Facebook entering an email address will not 
                        share the tree correctly. Instead, enter the collaborator’s 
                        user ID found on their works page, otherwise for Google and 
                        Email logins use an email address.</li>
                    </ul>
                  <li>Then click ‘Verify Collaborator'. This will check if the collaborator exists with WikiFamily</li>
                    <ul><li>If the user does not exist, or you receive an error message please verify you have the correct email or ID</li></ul>
                  <li>Click on an individual to share, this will share that individual and their descendants</li>
                  <li>Click "Share Tree"</li>
                  <li>Once a tree is shared, your collaborator will be able to add, 
                    delete, or remove individuals that were shared and have this reflected in the original tree</li>
                </ul>

              <li id="findingID" className='description helpQuestion'><strong>How to find your user ID?</strong></li>
              <ul className='description '>
                <li>Go to the Works page</li>
                <li>Click ‘here’ to see your user ID</li>
                <br></br><br></br>
                <img id="helpImgs" src={seeID} alt='How to find your ID'></img>
              </ul>

              <li id="viewTree" className='description helpQuestion'><strong>How to view a family tree?</strong></li>
              <ul className='description '>
                <li>Once you have selected a tree to view on the works page, you will see “Tree View’ under the Family Tree name. </li>
                <li>Click on ‘Tree View’ and you will see the family tree in list form</li>
                <br></br>
                <img id="helpImgs" src={treeViewExpanding} alt='treeView'></img>
                <li>Clicking ‘+’ will expand the descendants of an individual</li>
                <img id="helpImgs" src={postExpand} alt='show expanded version'></img>
                <li>Clicking ‘-’ will minimize the descendants of an individual</li>
                <img id="helpImgs" src={preExpand} alt='show collapsed version'></img>
              </ul>
          </ul>
              
        </div>
      </div>
    </div>
    )
  }

}


export default Help;
