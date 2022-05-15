import React from 'react';

// ################################################################################
// Description:  Content pertaining WikiFamily and its creation
// 
// input:        NONE
// 
// return:       Content about WikiFamily and the developers
// ################################################################################
const About = ({
}) => {
  return(
  <div className="centerDiv">
    <div className="content">
      <h1 className="subtopic text">About Page</h1>
      <center>
      <div className="description text">
        <p>WikiFamily is the product of a 2021-2022 capstone project at <a className="intextRef" href="https://oregonstate.edu/">Oregon State University</a>.
        <br/><br/>The developing team includes:
          <ul>
            <li className="name">Alex Uong</li>
            <li className="name">Alima Matyeva</li>
            <li className="name">Daisy Ramirez</li>
          </ul>
        </p>
        <p>WikiFamily was created as an online platform to help counteract some issues noted from other family genealogy software which include downloading additional software, limited sharing functionalities, and a different representation of family trees for easy reading.
        <br/><br/>WikiFamily aims to be a user-friendly website that helps users understand their individual genealogy and provide an easy to read and encode family history for posterity.</p>
        <h2 id="acknowledgements" className="subtopic text">Acknowledgments</h2>
        <p>The WikiFamily developer team would like to acknowledge and thank <span className="name">Dr. Joseph Louis</span> for bringing this project idea to our attention and allowing us to contribute to his ideal family tree app.
          <br/><br/>The Wikifamily team would also like to thank professor <span className="name">Rob Hess</span> for guiding us in creating a tree view algorithm and our TA <span className="name">Matt Olson</span> for navigating us and tracking our success.
        </p>
      </div>
      </center>
    </div>
  </div>
  );
}

export default About;
