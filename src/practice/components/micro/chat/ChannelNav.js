import { useGetPatientByCellphone } from "../../../dataModels/practice/practiceModel";

import { useGetChatChannels } from "../../../dataModels/practice/chatModel";

import { Link } from "react-router-dom";

import styled from "styled-components";
import { connect } from "react-redux";

const Container = styled.div`
    border-top: 1px #eee solid;
    padding-top: 5px;
`;

const Title = styled.p`
    font-size: large;
    padding: 0px 20px;
`;

function ChannelNav({ businessId }) {
    console.log("Business ID at Channel Nav: ", businessId);

    const channels = useGetChatChannels(businessId);

    console.log("Channels at channel Nav: ", channels);

    return (
        <Container>
            <Title>Open Channels</Title>
            <Link to="/practice/chat/"># Help Desk</Link>
            {channels.map((channel, index) => (
                <ChannelListItem
                    key={index}
                    businessId={businessId}
                    channel={channel}
                />
            ))}
        </Container>
    );
}

const ChannelListItem = ({ channel, businessId }) => {
    const author = useGetPatientByCellphone(businessId, channel.id);

    return (
        <Link to={`/practice/chat/${channel.id}`}>
            #{" "}
            {author?.firstName
                ? `${author?.firstName} ${author?.lastName}`
                : channel.id}
        </Link>
    );
};

const mapStateToProps = (state) => {
    return {
        businessId: state.business.businessId,
    };
};

export default connect(mapStateToProps, {})(ChannelNav);
