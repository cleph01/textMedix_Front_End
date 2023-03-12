import { useEffect, useState } from "react";
import {
    collection,
    Timestamp,
    addDoc,
    doc,
    getDoc,
    query,
    onSnapshot,
    orderBy,
    writeBatch,
    where,
} from "firebase/firestore";

import { db } from "../../../utils/db/firebaseConfig";

// Get All Open Chat Channels for a given practiceId
// Each Channel represents and indivial User/CellPhone Number
const useGetChatChannels = (practiceId) => {
    const [channels, setChannels] = useState([]);

    useEffect(() => {
        const collectionRef = collection(db, `practice/${practiceId}/chats/`);

        let q = query(collectionRef);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setChannels(
                querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            );
        });

        return unsubscribe;
    }, []);

    return channels;
};

// Get All Chat Messages in that Chat Channel
// (ie. Messages bw. practice and that patient)
const useGetChatMessages = (businessId, cellphone) => {
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        const collectionRef = collection(
            db,
            `practice/${businessId}/chats/${cellphone}/messages`
        );

        let q = query(collectionRef, orderBy("createdOn"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setDocs(
                querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            );
        });

        return unsubscribe;
    }, [businessId, cellphone]);

    return docs;
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

const sendChatMessage = async (dataObj) => {
    const {
        cellPhone,
        businessTwilioNumber,
        chatMessage,
        businessId,
        patientId,
        businessAuthor,
    } = dataObj;
    // Adds Messag to be OutGoing Text Collection for Twilio
    const outTextDocRef = doc(collection(db, "textMessages"));

    const batch = writeBatch(db);

    batch.set(outTextDocRef, {
        to: `+1${cellPhone}`,
        from: businessTwilioNumber,
        body: chatMessage,
    });

    // Adds Message to Messages Subcollection under practice
    const convoDocRef = doc(
        collection(db, `practice/${businessId}/chats/${cellPhone}/messages`)
    );

    batch.set(convoDocRef, {
        practice: doc(db, `practicees/${businessId}`),
        practiceTwilioNumber: businessTwilioNumber,
        patientId: patientId,
        text: chatMessage,
        direction: "out",
        businessAuthor: businessAuthor,
        createdOn: new Date(),
    });

    return await batch.commit();
};

// Get the patient by Phone Number
const useGetFirstMessagePatientByCellphone = (businessId, message) => {
    const [patient, setPatient] = useState();

    useEffect(() => {
        if (message.direction === "out") {
            setPatient(null);
        } else {
            const collectionRef = collection(
                db,
                `practice/${businessId}/patients`
            );

            let q = query(
                collectionRef,
                where("cellPhone", "==", `${message.patientPhoneNumber}`)
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
        }
    }, []);

    return patient;
};

// Get the patient by Phone Number
const useGetPatientByCellphone = (businessId, cellphone) => {
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

export {
    createSmsGroup,
    getPatientsByIdArr,
    useGetChatChannels,
    useGetChatMessages,
    sendChatMessage,
    useGetFirstMessagePatientByCellphone,
    useGetPatientByCellphone,
};
