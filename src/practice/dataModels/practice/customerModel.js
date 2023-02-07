import { useEffect, useState } from "react";

import {
    collection,
    query,
    onSnapshot,
    doc,
    where,
    orderBy,
    setDoc,
    getDoc,
    Timestamp,
    addDoc,
    getDocs,
} from "firebase/firestore";

import { db } from "../../utils/db/firebaseConfig";

// Get the all patient info from patient collection in firestore
// using the Firestore reference path (ie. 'patients/${patientId}')
const useGetPatientById = (id) => {
    const [record, setRecord] = useState();

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, `patients/${id}`), (doc) => {
            setRecord(doc.data());
        });

        return unsubscribe;
    }, [id]);

    return record;
};

export { useGetPatientById };
