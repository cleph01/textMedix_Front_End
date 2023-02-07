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

import { db } from "../../../utils/db/firebaseConfig";

// Get All the Blast Groups the patient has been assigned to
const useGetAllReminders = (practiceId) => {
    const [reminders, setReminders] = useState();

    useEffect(() => {
        const collectionRef = collection(db, "notifications");

        let q = query(collectionRef, where("practiceId", "==", practiceId));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setReminders(
                querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    title: doc.data().displayName,
                    start: new Date(
                        `${doc.data().sendOnDate} ${doc.data().sendOnTime}`
                    ),
                    ...doc.data(),
                }))
            );
        });

        return unsubscribe;
    }, [practiceId]);

    return reminders;
};

// Get All Reminders by patient id
const getRemindersByPatientId = async (patientId, practiceId) => {
    let reminders = [];

    const collectionRef = collection(db, "notifications");

    let q = query(
        collectionRef,
        where("patientId", "==", patientId),
        where("practiceId", "==", practiceId)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        reminders.push({
            reminderId: doc.id,
            ...doc.data(),
            title: doc.data().message,
            start: new Date(
                `${doc.data().sendOnDate} ${doc.data().sendOnTime}`
            ),
        });
    });

    return reminders;
};

const getReminderCollectionRef = () => {
    return collection(db, "notifications");
};

export {
    useGetAllReminders,
    getRemindersByPatientId,
    getReminderCollectionRef,
};
