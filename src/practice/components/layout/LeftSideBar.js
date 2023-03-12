import styled from "styled-components";

import { Route } from "react-router-dom";

import ChannelNav from "../micro/chat/ChannelNav";
import HomeNav from "../macro/home/HomeNav";
import ReminderNav from "../micro/reminder/ReminderNav";
import BlastSideBar from "../micro/blast/SideBar";

import { logout } from "../../../redux/practice/actions/authActions";
import { connect } from "react-redux";

const Container = styled.section`
    background: #454545;
    color: #fff;
    width: 225px;
    display: flex;
    flex-direction: column;

    & a {
        font-size: 90%;
        padding: 4px 20px;
        display: block;
        text-decoration: none;
        color: #fff;
        cursor: pointer;
    }
`;

const UserSection = styled.div`
    padding: 20px;
    display: flex;
    align-items: center;

    & img {
        border-radius: 50%;
        margin-right: 10px;
        height: 32px;
    }
`;

const LogoutButton = styled.button`
    font: inherit;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    text-decoration: underline;
    display: inline;
    cursor: pointer;
    font-size: 80%;
    color: white;
`;

function LeftSideBar({ user, logout }) {
    console.log("user, logout at LeftSideBar: ", user, logout);
    return (
        <Container>
            <UserSection>
                <User user={user} logout={logout} />
            </UserSection>
            <nav>
                <HomeNav />

                <Route path="/practice/chat">
                    <ChannelNav />
                </Route>

                <Route path="/practice/reminder">
                    <ReminderNav />
                </Route>

                <Route path="/practice/sms">
                    <BlastSideBar />
                </Route>
            </nav>
        </Container>
    );
}

const User = ({ user, logout }) => {
    console.log("user, logout at User: ", user, logout);

    if (!user) return;
    
    return (
        <>
            <picture>
                <source
                    srcSet="https://placekitten.com/64/64"
                    type="image/webp"
                />
                <img
                    className="UserImage"
                    alt="whatever"
                    src="https://placekitten.com/64/64"
                />
            </picture>

            <div>
                <div>{`${user?.firstName} ${user?.lastName}`}</div>
                <div>
                    <LogoutButton onClick={logout}>log out</LogoutButton>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => {
    return { user: state.auth.user };
};

export default connect(mapStateToProps, { logout })(LeftSideBar);
