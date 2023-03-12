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

export const SET_BUSINESS = "SET_BUSINESS";
export const SET_BUSINESS_ID = "SET_BUSINESS_ID";
export const SET_BUSINESS_INITIATED = "SET_BUSINESS_INITIATED";

export const setBusiness = (businessId) => async (dispatch) => {
    
    dispatch({ type: SET_BUSINESS_INITIATED });

    try {
        const docRef = doc(db, "practice", businessId);
        const docSnap = await getDoc(docRef);

        console.log("docsnap: ", docSnap);
        if (docSnap.exists()) {
            const business = { id: docSnap.id, ...docSnap.data() };

            dispatch({
                type: SET_BUSINESS,
                payload: business,
            });
        }
    } catch (error) {
        console.log("Error: ", error);

        const errorCode = error.code;
        const errorMessage = error.message;
        const message = `${errorCode}: ${errorMessage}`;

        dispatch({
            type: SET_MESSAGE,
            payload: message,
        });
    }
};
