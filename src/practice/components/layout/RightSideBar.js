import React from "react";

import { Route } from "react-router-dom";
import Members from "../micro/chat/ChatMembers";
import ReminderMembers from "../micro/reminder/ReminderMembers";

function RightSideBar({ practiceId }) {
    return (
        <div
            style={{
                padding: "20px",
                borderLeft: "solid 1px #ccc",
                width: "150px",
            }}
        >
            <Route exact path="/">
                <Members practiceId={practiceId} />
            </Route>

            <Route path="/practice/chat">
                <Members practiceId={practiceId} />
            </Route>

            <Route path="/practice/reminder">
                <ReminderMembers practiceId={practiceId} />
            </Route>

            <Route exact path="/practice/sms">
                <ReminderMembers practiceId={practiceId} />
            </Route>
        </div>
    );
}

export default RightSideBar;
