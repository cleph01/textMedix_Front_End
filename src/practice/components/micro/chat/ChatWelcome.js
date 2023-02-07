import { useState } from "react";
import { useHistory } from "react-router-dom";

import styled from "styled-components";

import { createChannelFromOneOff } from "../../../dataModels/practice/practiceModel";

const Container = styled.div`
    height: 100%;
`;

const Header = styled.header`
    padding: 20px;
`;

const Body = styled.div``;
function ChatWelcome() {
    return (
        <Container>
            <Header>
                <InputNumber />
                <h1>Connect the way patients prefer.</h1>
                <div>
                    Because TextMedix immediately takes the conversation to
                    text, patients can stay connected on their terms while you
                    manage all the incoming messages from one web enabled
                    device.
                </div>
            </Header>
            <Body>
                <picture>
                    <img
                        style={{ width: "600px", height: "auto" }}
                        alt="webchat"
                        src="https://cms.podium.com/wp-content/uploads/2022/04/HN-Webchat-2.gif"
                    />
                </picture>
            </Body>
        </Container>
    );
}

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    font-weight: bold;
    border-bottom: solid 1px #ccc;
`;

const RecipientInput = styled.input`
    font: inherit;
    border: 1px solid transparent;
    padding: 16px;
    &hover {
        border-color: #ccc;
    }
`;

const ConfirmButton = styled.button`
    border-radius: 5px;
    background: transparent;
`;

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 50px;
`;
const InputNumber = () => {
    const history = useHistory();

    const practiceId = "fpVAtpBjJLPUanlCydra";

    const [cellphone, setCellphone] = useState({
        formatted: "",
        raw: "",
    });

    const handleCellChange = (e) => {
        e.preventDefault();

        // this is where we'll call our future formatPhoneNumber function that we haven't written yet.
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        // we'll set the input value using our setInputValue

        setCellphone({
            formatted: formattedPhoneNumber,
            raw: formattedPhoneNumber.replace(/[^\d]/g, ""),
        });
    };

    const formatPhoneNumber = (value) => {
        // if input value is falsy eg if the user deletes the input, then just return
        if (!value) return value;

        // clean the input for any non-digit values.
        const phoneNumber = value.replace(/[^\d]/g, "");

        // phoneNumberLength is used to know when to apply our formatting for the phone number
        const phoneNumberLength = phoneNumber.length;

        // we need to return the value with no formatting if its less then four digits
        // this is to avoid weird behavior that occurs if you  format the area code to early

        if (phoneNumberLength < 4) return phoneNumber;

        // if phoneNumberLength is greater than 4 and less the 7 we start to return
        // the formatted number
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        }

        // finally, if the phoneNumberLength is greater then seven, we add the last
        // bit of formatting and return it.
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
            3,
            6
        )}-${phoneNumber.slice(6, 10)}`;
    };

    const handleStartChatClick = async (e) => {
        e.preventDefault();

        if (cellphone.raw.length < 10) {
            alert("Phone Num Incomplete");
        } else {
            const response = await createChannelFromOneOff(
                practiceId,
                cellphone.raw
            );

            if (response !== "error") {
                history.push(`/practice/chat/${cellphone.raw}`);
            }
        }
    };

    console.log("celphone at Blast Welcome: ", cellphone.raw);
    return (
        <HeaderContainer>
            <InputWrapper>
                <RecipientInput
                    placeholder="Enter Number"
                    onChange={handleCellChange}
                    value={cellphone.formatted}
                />
            </InputWrapper>
            <ConfirmButton onClick={handleStartChatClick}>
                Start Chat
            </ConfirmButton>
        </HeaderContainer>
    );
};

export default ChatWelcome;
