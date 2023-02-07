import { useContext } from "react";

import {
    useGetChatChannels,
    useGetDoc,
    useGetPatientByCellphone,
} from "../../../dataModels/practice/practiceModel";

import { PracticeContext } from "../../../contexts/PracticeContext";

import { Link } from "react-router-dom";

import styled from "styled-components";

const Container = styled.div`
    border-top: 1px #eee solid;
    padding-top: 5px;
`;

const Title = styled.p`
    font-size: large;
    padding: 0px 20px;
`;

function ChannelNav() {
    const practice = useContext(PracticeContext);

    const channels = useGetChatChannels(practice.practiceId);

    return (
        <Container>
            <Title>Open Channels</Title>
            <Link to="/practice/chat/"># Help Desk</Link>
            {channels.map((channel, index) => (
                <ChannelListItem key={index} index={index} channel={channel} />
            ))}
        </Container>
    );
}

const ChannelListItem = ({ channel, handleIdChange, index }) => {
    const author = useGetPatientByCellphone(channel.id);
    console.log("Author: ", author);
    return (
        <Link key={index} to={`/practice/chat/${channel.id}`}>
            # {author?.displayName ? author?.displayName : channel.id}
        </Link>
    );
};

export default ChannelNav;
