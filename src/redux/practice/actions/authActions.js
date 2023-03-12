import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth, db } from "../../../utils/db/firebaseConfig";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    QuerySnapshot,
    setDoc,
    where,
} from "firebase/firestore";

import { SET_MESSAGE } from "./messageActions";

import { SET_BUSINESS_ID } from "./businessProfileActions";

export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT = "LOGOUT";

export const SET_USER = "SET_USER";

export const UPDATE_USER_WITH_SUBSCRIPTION_STATUS =
    "UPDATE_USER_WITH_SUBSCRIPTION_STATUS";
export const SUBSCRIPTION_PAYMENT_FAILED = "SUBSCRIPTION_PAYMENT_FAILED";

export const fetchSubscriberStatus = (userId) => async (dispatch) => {
    try {
        const querySnapshot = await getDocs(
            collection(db, `user/${userId}/subscriptions`)
        );

        let doc;

        if (querySnapshot.length > 0) {
            querySnapshot.forEach((record) => {
                doc = record;
            });

            dispatch({
                type: UPDATE_USER_WITH_SUBSCRIPTION_STATUS,
                payload: doc,
            });

            return doc;
        }
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const message = `${errorCode}: ${errorMessage}`;

        dispatch({
            type: SUBSCRIPTION_PAYMENT_FAILED,
        });

        dispatch({
            type: SET_MESSAGE,
            payload: message,
        });
    }
};

export const register =
    (firstName, lastName, email, password, businessId) => (dispatch) => {
        try {
            const q = query(
                collection(db, "users"),
                where("email", "==", email)
            );

            const querySnapshot = getDocs(q);

            if (querySnapshot.length > 0) {
                dispatch({
                    type: SET_MESSAGE,
                    payload: "Account Exists. Please Sign In",
                });
            } else {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        console.log("UserCredential: ", userCredential);
                        const user = {
                            id: userCredential.user.uid,
                            firstName: firstName.toLowerCase(),
                            lastName: lastName.toLowerCase(),
                            email: userCredential.user.email,
                            imageURL: null,
                            businesses: [businessId],
                            createdAt: userCredential.user.metadata.createdAt,
                        };

                        const userRef = doc(
                            db,
                            "users",
                            userCredential.user.uid
                        );
                        setDoc(userRef, user, { merge: true });

                        dispatch({
                            type: REGISTER_SUCCESS,
                        });

                        dispatch({
                            type: SET_BUSINESS_ID,
                            payload: businessId,
                        });

                        dispatch({
                            type: SET_MESSAGE,
                            payload: "Account Created Successfuly",
                        });
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        let message;

                        switch (errorCode) {
                            case "auth/email-already-in-use":
                                message =
                                    "Email Already in Use. Please Sign In.";
                                break;

                            case "auth/weak-password":
                                message =
                                    "Password should be at least 6 characters";

                                break;
                            default:
                                message = `${errorCode}: ${errorMessage}`;
                                break;
                        }

                        dispatch({
                            type: REGISTER_FAIL,
                        });

                        dispatch({
                            type: SET_MESSAGE,
                            payload: message,
                        });
                    });
            }
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            const message = `${errorCode}: ${errorMessage}`;

            dispatch({
                type: REGISTER_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });
        }
    };

export const login = (email, password) => (dispatch) => {
    return signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // const user = userCredential.user;
            dispatch({
                type: LOGIN_SUCCESS,
            });
        })
        .catch((error) => {
            console.log("Login Error: ", error);
            const errorCode = error.code;
            const errorMessage = error.message;
            const message = `${errorCode}: ${errorMessage}`;

            dispatch({
                type: LOGIN_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: "No Record Found",
            });
        });
};

export const logout = () => (dispatch) => {
    signOut(auth)
        .then(() => {
            dispatch({
                type: LOGOUT,
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const message = `${errorCode}: ${errorMessage}`;

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });
        });
};

export const fetchUser = () => async (dispatch) => {
    dispatch({
        type: "FETCH_USER",
    });
    try {
        await auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                localStorage.setItem("isAuthenticated", true);

                console.log("Login Credential: ", currentUser.uid);

                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);

                console.log("docsnap: ", docSnap);
                if (docSnap.exists()) {
                    const user = { id: docSnap.id, ...docSnap.data() };

                    dispatch({
                        type: SET_USER,
                        payload: user,
                    });

                    dispatch({
                        type: SET_BUSINESS_ID,
                        payload: docSnap.data().businesses[0],
                    });

                    console.log("Href: ", window.location.href);
                    // Had to do it this way because if I useHistory.push
                    // or window.location.assign (or .href =) on successful
                    // registration in the component, it seems to crash into
                    // Stripe webhook callback and the user details that make it
                    // into the db is only Stripe's details
                    if (window.location.href.includes("/register")) {
                        window.location.href = "/";
                    }
                }
            } else {
                localStorage.removeItem("isAuthenticated");
                dispatch({
                    type: SET_USER,
                    payload: null,
                });
            }
        });
    } catch (error) {
        throw error;
    }
};
