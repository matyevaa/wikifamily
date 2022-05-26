import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './style/ThemeContext';

const domain = process.env.REACT_APP_AUTH0_DOMAIN; //auth0 domain
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID; //auth0 client id

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Auth0Provider
          domain={domain}
          clientId={clientId}
          redirectUri={window.location.origin}>
          <App />
        </Auth0Provider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);