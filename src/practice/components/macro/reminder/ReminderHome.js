import { useState } from "react";

import styled from "styled-components";

import Calendar from "../../micro/calendar/Calendar";

import ReminderSetReminder from "../../micro/reminder/ReminderSetReminder";

import ReminderMembers from "../../micro/reminder/ReminderMembers";
import {
    getRemindersByPatientId,
    useGetAllReminders,
    useGetRemindersByPatientId,
} from "../../../dataModels/practice/reminderModel";

const CalendarWrapper = styled.div`
    .fc {
        width: 700px;
        height: 700px;
    }
`;

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

const Body = styled.section`
    display: flex;
`;

const Notification = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [reminders, setReminders] = useState();

    const practiceId = "fpVAtpBjJLPUanlCydra";

    const loadReminders = useGetAllReminders(practiceId);

    const fetchReminders = async (patientId) => {
        let reminders = await getRemindersByPatientId(patientId, practiceId);
        setReminders(reminders);
    };

    console.log("Load Reminders: ", loadReminders);
    console.log("Selected Patient: ", selectedPatient);
    console.log("Reminders at RemindersHOme: ", reminders ? reminders : null);

    return (
        <Container>
            <MainSection>
                <Header />
                <Body>
                    <CalendarWrapper>
                        <Calendar
                            events={reminders ? reminders : loadReminders}
                        />
                    </CalendarWrapper>
                    <ReminderSetReminder
                        selectedPatient={selectedPatient}
                        reminders={reminders}
                    />
                </Body>

                {/* <AutoFillReminders /> */}
            </MainSection>
            <RightSidebar>
                <ReminderMembers
                    practiceId={practiceId}
                    setSelectedPatient={setSelectedPatient}
                    fetchReminders={fetchReminders}
                />
            </RightSidebar>
        </Container>
    );
};

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
    return (
        <HeaderContainer>
            <Recipient>
                <Name>@name</Name>
                <CellPPhone>bla</CellPPhone>
            </Recipient>
        </HeaderContainer>
    );
};

export default Notification;
