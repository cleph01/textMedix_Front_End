import { useContext } from "react";
import { PracticeContext } from "../../../contexts/PracticeContext";
import { useFirestoreWriteBatch } from "@react-query-firebase/firestore";
import { db } from "../../../../utils/db/firebaseConfig";
import { useParams } from "react-router-dom";
import {
    useGetDoc,
    useGetPatientByCellphone,
} from "../../../dataModels/practice/practiceModel";

import {
    collection,
    addDoc,
    doc,
    writeBatch,
    Timestamp,
} from "firebase/firestore";

import styled from "styled-components";

const InputBox = styled.form`
    padding: 0px 20px 20px 20px;
`;

const Input = styled.input`
    box-sizing: border-box;
    font: inherit;
    width: 100%;
    padding: 8px;
    border: solid 2px;
    border-color: #aaa;
    border-radius: 6px;
    outline: none;

    &:focus {
        border-color: #666;
    }
`;

function ChatInputBox({ practiceId }) {
    const { cellphone } = useParams();

    const practice = useContext(PracticeContext);

    let patient = useGetPatientByCellphone(cellphone);

    const batch = writeBatch(db);

    const mutation = useFirestoreWriteBatch(batch);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let value = e.target.elements[0].value;

        if (value !== "") {
            try {
                // Adds Messag to be OutGoing Text Collection for Twilio
                const outTextDocRef = doc(collection(db, "textMessages"));

                console.log("Out Text Ref: ", outTextDocRef);

                batch.set(outTextDocRef, {
                    to: `+1${cellphone}`,
                    from: practice.twilioNumber,
                    body: value,
                });

                // Adds Message to Messages Subcollection under practice
                const convoDocRef = doc(
                    collection(
                        db,
                        `practice/${practiceId}/chats/${cellphone}/messages`
                    )
                );

                batch.set(convoDocRef, {
                    practice: doc(db, `practicees/${practiceId}`),
                    practiceTwilioNumber: practice.twilioNumber,
                    patientId: patient ? patient.patientId : null,
                    text: value,
                    direction: "out",
                    createdOn: Timestamp.fromDate(new Date()),
                });

                // await batch.commit();
                // await batch.commit();
                mutation.mutate();

                e.target.elements[0].value = "";

                console.log("Batch SMS/COnvo Document written: ");
            } catch (error) {
                console.log("Error submitting message: ", error);
            }
        } else {
            alert("Empty Message");
        }
    };

    return (
        <InputBox onSubmit={handleSubmit}>
            <Input placeholder="Message #general" />
        </InputBox>
    );
}

export default ChatInputBox;
