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

// Get All Influencers for a practiceId
const useGetInfluencers = (practiceId) => {
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        const collectionRef = collection(
            db,
            `practice/${practiceId}/influencers`
        );

        let q = query(collectionRef);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setDocs(
                querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            );
        });

        return unsubscribe;
    }, [practiceId]);

    return docs;
};

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

// Get All patients by patient id / Path
const getInfluencers = async (InfluencersArray) => {
    const influencers = await Promise.all(
        await InfluencersArray.map(async (influencer) => {
            const docRef = await getDoc(doc(db, `patients/${influencer.id}`));
            return { id: docRef.id, ...docRef.data() };
        })
    );

    return influencers;
};

const getInfluencerList = (practiceId) => {
    const collectionRef = collection(db, `practice/${practiceId}/influencers`);

    return query(collectionRef);
};

const getInfluencerDoc = (influencerId) => {
    return getDoc(doc(db, `patients/${influencerId}`));
};

const getInfluencerRef = (influencerId) => {
    return doc(db, `patients/${influencerId}`);
};

export {
    useGetInfluencers,
    useGetPatientById,
    getInfluencers,
    getInfluencerList,
    getInfluencerDoc,
    getInfluencerRef,
};
