import React from 'react';

/* Use "const Name" to initialize a function and return HTML code there
 * You can add any other JavaScript functions above the const Homepage
 * Make sure you have import statement on the top and export statement in the bottom.
 * Use this template to create other pages.
*/

// ################################################################################
// Description:  Homepage for WikiFamily -- features and background info abt website
// 
// input:        NONE
// 
// return:       WikiFamily tree creation info/ features
// ################################################################################
const Homepage = ({
}) => {
  return(
  <div className="centerDiv">
    <div className="content">
      <h1 className="subtopic text">How can you create your own family tree?</h1>
      <p className="description text">
        Creating your own family trees no longer requires having to download 
        software, instead, you can now create and keep track of your family 
        genealogy through WikiFamily an online platform to help counteract 
        unnecessary software. 
      </p>
      <p className="description text">Create an account with WikiFamily through 
        email, Facebook, or Google and start creating your own family tree today!</p>

      <h1 className="subtopic text">Creating family trees: A tutorial</h1>
      <iframe id="kaltura_player" src="https://cdnapisec.kaltura.com/p/391241/sp/39124100/embedIframeJs/uiconf_id/22119142/partner_id/391241?iframeembed=true&playerId=kaltura_player&entry_id=1_nqloaa1h&flashvars[localizationCode]=en&amp;flashvars[leadWithHTML5]=true&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;flashvars[hotspots.plugin]=1&amp;flashvars[Kaltura.addCrossoriginToIframe]=true&amp;&wid=1_h9459fc1" width="640" height="394" allowfullscreen webkitallowfullscreen mozAllowFullScreen allow="autoplay *; fullscreen *; encrypted-media *" sandbox="allow-forms allow-same-origin allow-scripts allow-top-navigation allow-pointer-lock allow-popups allow-modals allow-orientation-lock allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation" frameborder="0" title="WikiFamily"></iframe>
          <p>Music Credit: <a href='https://www.free-stock-music.com/mixaund-happy-day.html'>Mixaund</a></p>

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
