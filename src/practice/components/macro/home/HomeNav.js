import { Link } from "react-router-dom";

import styled from "styled-components";

const Container = styled.div`
    padding-bottom: 5px;
    margin-bottom: 5px;
`;

const Title = styled.p`
    font-size: large;
    padding: 0px 20px;
`;

function HomeNav() {
    return (
        <Container>
            <Title>Menu</Title>
            <Link to="/">Home</Link>
            <Link to="/practice/chat">Chat Room</Link>

            <Link to="/practice/patients">All Patients</Link>
            <Link to="/practice/reminder">View Reminders</Link>
            <Link to="/practice/sms">Send Blast</Link>
            <Link to="/practice/reviews">Google Reviews</Link>
        </Container>
    );
}

export default HomeNav;
