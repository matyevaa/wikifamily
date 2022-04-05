import './style/App.css';
/* import pages */
import Homepage from './pages/Homepage.js';
import Create from './pages/Create.js';
import Help from './pages/Help.js';
import Login from './pages/Login.js';
import About from './pages/About.js';
import Works from './pages/Works.js';
import IndivTree from './pages/IndivTree';
import FirebaseLogin from './pages/FirebaseLogin'
import Navbar from './components/NavBar.js';
import AddPerson from './components/AddPerson.js';
import EditPerson from './components/EditPerson.js';
import LoginButton from './components/LoginButton';
import NewEmpty from './components/NewTreeForm';
import React, { useState } from 'react';



/* special library and its components to perform redirection easily */
import {
  BrowserRouter as Router, // store the components and its routes as an object
  Route, // a statement that holds the specific path of the app and the component's name, renders it once it matches the URL
  Switch, // renders the default components once the app rendered, switches between routes as needed
  Link, // like HREF in HTML but also allows you to redirect to the specific component based on its path
  Redirect,
  useParams,
  useRouteMatch
} from "react-router-dom"; // more about that here: https://www.pluralsight.com/guides/how-to-set-react-router-default-route-redirect-to-home

// try localhost:3000/help to check how it works
// NavBar is here so that it always shows up no matter which page is that

function App() {
  return (
    <div>
      <Navbar/>
      <Router>
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route path="/create" component={Create} />
          <Route path="/help" component={Help} />
          <Route path="/about" component={About} />
          <Route path="/add/:id" component={AddPerson} render={(id) => <AddPerson {...id}/>}/>
          <Route path="/creator=:id/works" component={Works} render={(userId) => <Works {...userId}/>}/>
          <Route path="/treeId=:treeId/create" component={IndivTree} render={(treeId) => <IndivTree {...treeId}/>}/>
          <Route path="/login" component={Login} />
          <Route path="/new" component={NewEmpty} />
          {/* <Route path="/emailLogin" component={FirebaseLogin} /> */}
          <Route path="/emailLogin" component={LoginButton} />
          <Route path="/treeID=:treeId/edit/:id" component={EditPerson} render={(treeID, props) => <EditPerson {...props}/>} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
