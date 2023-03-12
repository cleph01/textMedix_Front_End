import { useEffect, useState } from "react";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
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
    writeBatch,
} from "firebase/firestore";

import { db } from "../../../utils/db/firebaseConfig";

// Get the all patient info from patient collection in firestore
// using the Firestore reference path (ie. 'patients/${patientId}')
const useGetDoc = (path) => {
    const [record, setRecord] = useState();

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, path), (doc) => {
            setRecord(doc.data());
        });

        return unsubscribe;
    }, [path]);

    return record;
};

// Get the patient by Phone Number
const useGetPatientByCellphone = (businessId,cellphone) => {
    const [patient, setPatient] = useState();

    useEffect(() => {
        const collectionRef = collection(db, `practice/${businessId}/patients`);

        let q = query(
            collectionRef,
            where("cellPhone", "==", `+1${cellphone}`)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) =>
                setPatient({
                    patientId: doc.id,
                    ...doc.data(),
                })
            );
        });

        return unsubscribe;
    }, [cellphone]);

    return patient;
};

// Get All patients tied
// (ie. Messages bw. practice and that patient)
const useGetPracticePatients = (practiceId) => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const collectionRef = collection(db, `practice/${practiceId}/patients`);

        let q = query(collectionRef);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setMembers(
                querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            );
        });

        return unsubscribe;
    }, [practiceId]);

    return members;
};

// const getpracticepatients = (practiceId) => {

//         const collectionRef = collection(db, "practice-patient-relationship");

//         let q = query(collectionRef, where("practiceId", "==", practiceId));

//         const query = useFirestoreQueryData(["products"], q);

//     return members;
// };

// Get All patients by patient id / Path
const getPatients = async (patients) => {
    const members = await Promise.all(
        await patients.map(async (patient) => {
            const docRef = await getDoc(doc(db, patient.patient.path));
            return { id: docRef.id, ...docRef.data() };
        })
    );

    return members;
};

// Create Channel When Someone From Member List in Chat Window
// is Clicked
const createChannelFromMember = async (practiceId, patientId, cellPhone) => {
    console.log(
        "practiceId, patientId, cellPhone: ",
        practiceId,
        patientId,
        cellPhone
    );

    try {
        setDoc(doc(db, `practice/${practiceId}/chats`, cellPhone.slice(2)), {
            patientId: patientId,
        });

        console.log("New Channel Created");
    } catch (error) {
        console.log("Error Creating new Channel: ", error);
    }
};

// Create Channel When Name/Number is Enterd in Chal Welcome Window
// and "Start Chat Button is Clicked"
const createChannelFromOneOff = async (practiceId, cellphone) => {
    console.log(
        "cellPhone in CreateChannelFromOne Off: ",

        cellphone
    );

    try {
        const patientCollectionRef = collection(db, "patients");

        let q = query(
            patientCollectionRef,
            where("cellPhone", "==", `+1${cellphone}`)
        );

        const querySnapshot = await getDocs(q);

        var patient;

        querySnapshot.forEach((doc) => {
            patient = { patientId: doc.id, ...doc.data() };
        });

        await setDoc(doc(db, `chats/${practiceId}/channels`, cellphone), {
            patientId: patient === undefined ? null : patient.patientId,
        });

        console.log("New Channel Created from One Off: ", cellphone);

        return "good";
    } catch (error) {
        console.log("Error Creating new Channel: ", error);

        return "error";
    }
};

// Get All the Blast Groups the practice Created
const useGetAllGroups = (practiceId) => {
    const [groups, setGroups] = useState();

    useEffect(() => {
        const collectionRef = collection(
            db,
            `practicees/${practiceId}/smsGroups`
        );

        let q = query(collectionRef);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setGroups(
                querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            );
        });

        return unsubscribe;
    }, []);

    return groups;
};

// Get All the Blast Groups the patient has been assigned to
const useGetPatientGroups = (practiceId, patientId) => {
    const [groups, setGroups] = useState();

    useEffect(() => {
        const collectionRef = collection(
            db,
            `practicees/${practiceId}/smsGroups`
        );

        let q = query(
            collectionRef,
            where("members", "array-contains", patientId)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setGroups(
                querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            );
        });

        return unsubscribe;
    }, []);

    return groups;
};

const createSmsGroup = async (practiceId, groupName) => {
    console.log("practiceId and GroupName: ", practiceId, groupName);
    try {
        const docRef = await addDoc(
            collection(db, `practice/${practiceId}/smsGroups`),
            {
                groupName: groupName,
                members: [],
                createdOn: Timestamp.fromDate(new Date()),
            }
        );

        // console.log("DeCreF: ", docRef);
        if (docRef.id) {
            console.log("New SMS Group Created: ", docRef.id);
        } else {
            console.log("Something went wrong creating the SMS Group");
        }
    } catch (error) {
        console.log("Error Creating new SMS Group: ", error);
    }
};

const practicePatientListQuery = (practiceId) => {
    return query(collection(db, `practice/${practiceId}/patients`));
};

const getPatient = (path) => {
    return doc(db, path);
};

const getPatientRef = (practiceId, patientId) => {
    return doc(db, `practice/${practiceId}/patients/${patientId}`);
};
const getPractice = (practiceId) => {
    return doc(db, `practice/${practiceId}`);
};

export {
    useGetDoc,
    useGetPracticePatients,
    createChannelFromMember,
    createChannelFromOneOff,
    useGetAllGroups,
    useGetPatientGroups,
    createSmsGroup,
    useGetPatientByCellphone,
    practicePatientListQuery,
    getPatients,
    getPatient,
    getPatientRef,
    getPractice,
};
