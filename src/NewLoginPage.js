import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "assets/scss/light-bootstrap-dashboard-pro-react.scss?v=2.0.0";
import "assets/css/demo.css";
import AdminLayout from "layouts/Admin.js";

//AADB2C
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from 'AADB2C/authConfig';

const NewLoginPage = () =>{
    //AADB2C
    const { instance } = useMsal();
    const { accounts } = useMsal();

    return (
        <>
        {/* 登入驗證成功會進到Dashboard畫面，若登出則跳轉回登入驗證畫面 */}
        {
        accounts[0]?.localAccountId !== undefined
        ?
            <AuthenticatedTemplate>
                <BrowserRouter>
                    <Switch>
                        <Route path="/admin" render={(props) => <AdminLayout />} />
                        <Redirect from="/" to="/admin/dashboard" />
                    </Switch>
                </BrowserRouter>
            </AuthenticatedTemplate>
        :
            <UnauthenticatedTemplate>
                <div>You out Lol</div>
                <button onClick={()=>{ instance.loginRedirect(loginRequest) }}>BTN-準備登入</button>
                {instance.loginRedirect(loginRequest)}
            </UnauthenticatedTemplate>
        }
        </>
    );
}

export default NewLoginPage