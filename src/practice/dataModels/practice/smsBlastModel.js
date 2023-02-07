import { collection, Timestamp, addDoc, doc, getDoc } from "firebase/firestore";

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
            return { id: docRef.id, ...docRef.data() };
        })
    );

    return members;
};

export { createSmsGroup, getPatientsByIdArr };
