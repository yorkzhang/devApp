/*!

=========================================================
* Light Bootstrap Dashboard PRO React - v2.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom/client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "assets/scss/light-bootstrap-dashboard-pro-react.scss?v=2.0.0";
import "assets/css/demo.css";

// 登入畫面
import NewLoginPage from "NewLoginPage";
// Redux
import { Provider } from 'react-redux';
import store from './ReduxStore/reduxIndex'
// AADB2C
import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from './AADB2C/authConfig'
import { MsalProvider} from "@azure/msal-react";
import { BrowserRouter, Route, Switch, Redirect  } from "react-router-dom";
import Register from "views/Register/Register";
import ClientMail from "views/ClientMail/ClientMail";

export const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
  <Provider store={store}>
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
          <Switch>
              <Route exact path="/register/:code" render={(props) => <Register />} />
              <Route path="/clientmail" render={(props) => <ClientMail />} />
              <Route path="/" render={(props) => <NewLoginPage />} />
          </Switch>
       </BrowserRouter>
    </MsalProvider>
  </Provider>
  </>
);