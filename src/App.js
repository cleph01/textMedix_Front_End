import { useState, useEffect } from "react";

import {
    firebase,
    auth,
    getAuthenticationStatus,
} from "./utils/db/firebaseConfig";

import LeftSideBar from "./practice/components/layout/LeftSideBar";

import Main from "./practice/components/layout/Main";

import { getPractice } from "./practice/dataModels/practice/practiceModel";

import styled from "styled-components";

import SignIn from "./practice/components/auth/SignIn";
import Register from "./practice/components/auth/Register";

import { fetchUser } from "./redux/practice/actions/authActions";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import NoReferral from "./practice/components/auth/NoReferral";
import PaymentSuccess from "./practice/components/payments/PaymentSuccess";
import PaymentError from "./practice/components/payments/PaymentError";

const AppMain = styled.main`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
`;

function App({ user, fetchUser }) {
    useEffect(() => {
        fetchUser();
    }, []);

    console.log("isAuthenticated at App: ", getAuthenticationStatus());
    return getAuthenticationStatus() ? (
        <AppMain>
            <LeftSideBar />

            <Main />
            <PaymentSuccess />
        </AppMain>
    ) : (
        <Switch>
            <Route path="/register/:businessId/:userEmail">
                <Register />
            </Route>
            <Route path="/register/success">
                <PaymentSuccess />
            </Route>
            <Route path="/register/error">
                <PaymentError />
            </Route>
            <Route path="/">
                <SignIn />
            </Route>
        </Switch>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};

export default connect(mapStateToProps, { fetchUser })(App);
