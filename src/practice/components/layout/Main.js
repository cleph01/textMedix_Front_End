import React from "react";
import { Route } from "react-router-dom";

import { useFirestoreQueryData } from "@react-query-firebase/firestore";

import ReminderHome from "../macro/reminder/ReminderHome";
import BlastHome from "../macro/blast/BlastHome";
import HomeBody from "../macro/home/HomeBody";
import ChatHome from "../macro/chat/ChatHome";
import ReviewHome from "../macro/reviews/ReviewHome";
import TopInfluencers from "../macro/influencers/TopInfluencers";
import AllPatientsHome from "../macro/patients/AllPatientsHome";

import { db } from "../../../utils/db/firebaseConfig";

import styled from "styled-components";
import { practicePatientListQuery } from "../../dataModels/practice/practiceModel";
const Container = styled.section`
    flex: 1;
`;
function Main({ practiceId }) {
    return (
        <Container>
            <Route exact path="/">
                <HomeBody practiceId={practiceId} />
            </Route>
            <Route path="/practice/reminder">
                <ReminderHome />
            </Route>
            <Route path="/practice/sms">
                <BlastHome />
            </Route>
            <Route path="/practice/patients">
                <AllPatientsHome practiceId={practiceId} />
            </Route>
            <Route path="/practice/influencers">
                <TopInfluencers practiceId={practiceId} />
            </Route>
            <Route path="/practice/chat">
                <ChatHome practiceId={practiceId} />
            </Route>
            <Route path="/practice/reviews">
                <ReviewHome practiceId={practiceId} />
            </Route>
        </Container>
    );
}

export default Main;
