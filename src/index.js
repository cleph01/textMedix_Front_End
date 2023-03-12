import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import {
    legacy_createStore as createStore,
    applyMiddleware,
    compose,
} from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import { composeWithDevTools } from "redux-devtools-extension";
import { Provider as ReduxProvider } from "react-redux";
import { rootReducer } from "./redux/practice/reducers";

const composedEnhancer = compose(
    applyMiddleware(logger, thunk),
    composeWithDevTools()
);
const store = createStore(rootReducer, composedEnhancer);

// const store = createStore(
//     rootReducer,
//     window.__REDUX_DEVTOOLS_EXTENSION && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <Router>
        <ReduxProvider store={store}>
            <App />
        </ReduxProvider>
    </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
