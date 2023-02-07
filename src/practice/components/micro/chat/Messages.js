import { useParams, Link } from "react-router-dom";

import {
    useGetChatMessages,
    useGetDoc,
    useGetPatientByCellphone,
} from "../../../dataModels/practice/practiceModel.js";

import styled from "styled-components";

const Container = styled.div`
    flex: 1;
    padding: 10px 20px 10px 20px;
    line-height: 1.3;
    overflow: auto;
`;

const EndOfMessages = styled.div`
    text-align: center;
    color: hsl(200, 50%, 50%);
    padding: 5px;
`;

const Message = styled.div`
    margin: 5px 0px;
    display: flex;
`;

const MessageWithAvatar = styled(Message)`
    margin-top: 10px;
`;
const MessageNoAvatar = styled(Message)`
    margin-left: 38px;
`;

const Avatar = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 3px;
    background-size: cover;
    background-position: center center;
    background-color: #fefefe;
    background-image: url(https://placekitten.com/64/64);
`;

const Author = styled.div`
    margin-left: 8px;
`;

const UserName = styled.span`
    font-weight: bold;
    font-size: 90%;
`;

const TimeStamp = styled.span`
    color: #999;
    font-size: 80%;
`;

const Day = styled.div`
    display: flex;
    align-items: center;
`;

const DayLine = styled.div`
    flex: 1;
    height: 1px;
    background: #ccc;
`;

const DayText = styled.div`
    font-weight: bold;
    padding: 10px;
    font-size: 80%;
`;

const MessageContent = styled.div``;

function Messages({ practiceId }) {
    const { cellphone } = useParams();

    console.log("Cellphone at Messages: ", cellphone);

    const messages = useGetChatMessages(
        `practice/${practiceId}/chats/${cellphone}/messages`
    );

    return (
        <Container>
            <Header />
            <EndOfMessages>That's every message!</EndOfMessages>
            {messages.map((message, index) => {
                const previous = messages[index - 1];
                const showDay = false;
                const showAvatar =
                    !previous ||
                    message.patientPhoneNumber !== previous.patientPhoneNumber;
                return showAvatar ? (
                    <FirsMessageFromUser key={index} message={message} />
                ) : (
                    <div key={index}>
                        <MessageNoAvatar>
                            <MessageWithAvatar>
                                {message.text}
                            </MessageWithAvatar>
                        </MessageNoAvatar>
                    </div>
                );
            })}
            {/* <ChatMembers practiceId={practiceId} /> */}
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

const Name = styled.div``;
const CellPPhone = styled.div`
    font-size: smaller;
    margin-left: 15px;
`;

const Recipient = styled.div``;

const Header = () => {
    const { cellphone } = useParams();

    const patient = useGetPatientByCellphone(cellphone);

    return (
        <HeaderContainer>
            <Recipient>
                <Name>
                    @ {patient?.displayName ? patient?.displayName : cellphone}
                </Name>
                {patient?.displayName && <CellPPhone>{cellphone}</CellPPhone>}
            </Recipient>
            <Link to="/practice/chat">New Message</Link>
        </HeaderContainer>
    );
};

const FirsMessageFromUser = ({ message, showDay }) => {
    const author = useGetDoc(`patients/${message.patientId}`);

    console.log(" author: ", author);
    return (
        <div>
            {showDay && (
                <Day>
                    <DayLine />
                    <DayText>12/6/2018</DayText>
                    <DayLine />
                </Day>
            )}

            <MessageWithAvatar>
                <Avatar />
                <Author>
                    <div>
                        <UserName>
                            {/* {author && author.displayName}{" "} */}
                        </UserName>
                        <TimeStamp>
                            {/* {message.createdOn.toDate()} */}
                        </TimeStamp>
                    </div>
                    <MessageContent>{message.text}</MessageContent>
                </Author>
            </MessageWithAvatar>
        </div>
    );
};
export default Messages;
