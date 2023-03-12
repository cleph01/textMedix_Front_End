import { useState, useEffect } from "react";
import { DataArray } from "@mui/icons-material";
import { useFirestoreWriteBatch } from "@react-query-firebase/firestore";
import { dblClick } from "@testing-library/user-event/dist/click";
import {
    collection,
    Timestamp,
    addDoc,
    doc,
    getDoc,
    query,
    where,
    updateDoc,
    arrayUnion,
    arrayRemove,
    writeBatch,
    onSnapshot,
} from "firebase/firestore";

import { db } from "../../../utils/db/firebaseConfig";

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

// Get All patients by patient id / Path
const getPatientsByIdArr = async (patientIdArr) => {
    const members = await Promise.all(
        await patientIdArr.map(async (patientId) => {
            const docRef = await getDoc(doc(db, `patients/${patientId}`));
            return { ...docRef.data(), id: docRef.id };
        })
    );

    return members;
};

const useGetPracticeGroupList = (practiceId) => {
    const [groups, setGroups] = useState();

    useEffect(() => {
        const collectionRef = collection(
            db,
            `practice/${practiceId}/smsGroups`
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

const useGetPatientGroupsList = (practiceId, patientId) => {
    const [groups, setGroups] = useState();

    useEffect(() => {
        const collectionRef = collection(
            db,
            `practice/${practiceId}/smsGroups`
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

const addPatientToGroup = async (groupId, practiceId, patientId) => {
    console.log(
        "group Id, practiceId, patientID AddPatient: ",
        groupId,
        practiceId,
        patientId
    );
    const docRef = doc(db, `practice/${practiceId}/smsGroups`, groupId);

    // Atomically add a new region to the "regions" array field.
    await updateDoc(docRef, {
        members: arrayUnion(patientId),
    });
};

const removePatientFromGroup = async (groupId, practiceId, patientId) => {
    console.log("remove patient args: ", groupId, practiceId, patientId);
    const docRef = doc(db, `practice/${practiceId}/smsGroups`, groupId);

    // Atomically remove a region from the "members" array field.
    await updateDoc(docRef, {
        members: arrayRemove(patientId),
    });
};

const practicePatientListQuery = (practiceId) => {
    return query(collection(db, `practice/${practiceId}/patients`));
};

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

const getDocById = (collectionPath, docId) => {
    console.log("collectionPath + docId: ", collectionPath, docId);
    return doc(db, collectionPath, docId);
};

const addSmsDocs = async (dataArr) => {
    const batch = writeBatch(db);

    dataArr.forEach((textData) => {
        const ref = doc(collection(db, "textMessages"));

        batch.set(ref, textData);
    });

    return await batch.commit();
};

const useGetPracticeSMSTemplates = (practiceId) => {
    const [templates, setTemplates] = useState([]);
    useEffect(() => {
        const collectionRef = collection(
            db,
            `practice/${practiceId}/smsTemplates`
        );

        let q = query(collectionRef);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setTemplates(
                querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            );
        });

        return unsubscribe;
    }, []);

    return templates;
};

const saveSmsTemplate = async (practiceId, blastMessage) => {
    const docRef = await addDoc(
        collection(db, `practice/${practiceId}/smsTemplates`),
        {
            message: blastMessage,
            createdOn: new Date(),
        }
    );

    // console.log("DeCreF: ", docRef);
    if (docRef.id) {
        console.log("New SMS Template Created: ", docRef.id);
    } else {
        console.log("Something went wrong saving the SMS Template");
    }
};

const getPracticeTemplateRef = (practiceId) => {
    return query(collection(db, `practice/${practiceId}/smsTemplates`));
};
export {
    createSmsGroup,
    getPatientsByIdArr,
    useGetPracticeGroupList,
    useGetPatientGroupsList,
    addPatientToGroup,
    removePatientFromGroup,
    practicePatientListQuery,
    useGetDoc,
    getDocById,
    addSmsDocs,
    useGetPracticeSMSTemplates,
    saveSmsTemplate,
    getPracticeTemplateRef,
};
