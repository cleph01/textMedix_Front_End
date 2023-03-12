import { useParams } from "react-router-dom";
import { useGetPatientByCellphone } from "../../../dataModels/practice/practiceModel";

import styled from "styled-components";
import { connect } from "react-redux";
import { sendChatMessage } from "../../../dataModels/practice/chatModel";
import { Alert, Snackbar } from "@mui/material";

import {
    openToastifyAlert,
    closeToastifyAlert,
    setSuccessMessage,
} from "../../../../redux/practice/actions/messageActions";

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

function ChatInputBox({ business, message, setSuccessMessage, businessUser }) {
    console.log("business User: ", businessUser);
    const { cellphone } = useParams();

    let patient = useGetPatientByCellphone(cellphone);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let chatMessage = e.target.elements[0].value;

        if (chatMessage !== "") {
            try {
                const messageObj = {
                    cellPhone: cellphone,
                    businessTwilioNumber: business.business.twilioNumber,
                    chatMessage: chatMessage,
                    businessId: business.businessId,
                    patientId: patient ? patient.patientId : null,
                    businessAuthor: `${businessUser.firstName} ${businessUser.lastName}`,
                };
                await sendChatMessage(messageObj);

                e.target.elements[0].value = "";

                setSuccessMessage({
                    message: "Message Sent",
                    severity: "success",
                    openToast: true,
                });
                console.log("Batch SMS/COnvo Document written: ");
            } catch (error) {
                console.log("Error: ", error);
                alert("Error Sending Chat: ", error);
            }
        } else {
            alert("Cannot Send Empty Message");
        }
    };

    return (
        <InputBox onSubmit={handleSubmit}>
            <Input placeholder="Message #general" />
            <Snackbar
                open={message.openToast}
                autoHideDuration={1000}
                onClose={closeToastifyAlert}
            >
                <Alert
                    onClose={closeToastifyAlert}
                    severity={message.severity}
                    sx={{ width: "90%" }}
                >
                    {message.message}
                </Alert>
            </Snackbar>
        </InputBox>
    );
}

const mapStateToProps = (state) => {
    return {
        business: state.business,
        message: state.message,
        businessUser: state.auth.user,
    };
};

export default connect(mapStateToProps, {
    openToastifyAlert,
    closeToastifyAlert,
    setSuccessMessage,
})(ChatInputBox);
