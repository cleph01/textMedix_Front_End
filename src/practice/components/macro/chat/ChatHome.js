import React from "react";
import { Switch, Route } from "react-router-dom";

import Messages from "../../micro/chat/Messages";
import ChatInputBox from "../../micro/chat/ChatInputBox";
import ChatMembers from "../../micro/chat/ChatMembers";
import ChatWelcome from "../../micro/chat/ChatWelcome";

import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex: 1;
    height: 100%;
`;

const MainSection = styled.section`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-right: 10px;
`;

const RightSidebar = styled.section`
    padding: 8px;
    border-left: 1px solid #eee;
    width: 150px;
`;

function ChatMain() {
    return (
        <Container>
            <MainSection>
                <Switch>
                    <Route path="/practice/chat/:cellphone">
                        <Messages />
                        <ChatInputBox />
                    </Route>
                    <Route path="/practice/chat">
                        <ChatWelcome />
                    </Route>
                </Switch>
            </MainSection>

            <RightSidebar>
                <ChatMembers />
            </RightSidebar>
        </Container>
    );
}

export default ChatMain;
