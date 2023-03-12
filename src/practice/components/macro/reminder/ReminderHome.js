import { useState } from "react";

import styled from "styled-components";

import Calendar from "../../micro/calendar/Calendar";

import ReminderSetReminder from "../../micro/reminder/ReminderSetReminder";

import ReminderDisplay from "../../micro/reminder/ReminderDisplay";

import ReminderMembers from "../../micro/reminder/ReminderMembers";
import {
    getRemindersByPatientId,
    useGetAllReminders,
    useGetRemindersByPatientId,
} from "../../../dataModels/practice/reminderModel";
import { connect } from "react-redux";

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
    height: 100%;
`;

const Notification = ({ businessId }) => {
    console.log("Practice Id at REminers: ", businessId);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [reminders, setReminders] = useState();
    const [calendarView, setCalendarView] = useState(false);

    const loadReminders = useGetAllReminders(businessId);

    const fetchReminders = async (patientId) => {
        let reminders = await getRemindersByPatientId(patientId, businessId);
        setReminders(reminders);
    };

    console.log("Load Reminders: ", loadReminders);
    console.log("Selected Patient: ", selectedPatient);
    console.log("Reminders at RemindersHOme: ", reminders ? reminders : null);

    return (
        <Container>
            <MainSection>
                <Header setCalendarView={setCalendarView} />
                <Body>
                    {calendarView ? (
                        <CalendarWrapper>
                            <Calendar
                                events={reminders ? reminders : loadReminders}
                            />
                        </CalendarWrapper>
                    ) : (
                        <ReminderDisplay practiceId={businessId} />
                    )}

                    <ReminderSetReminder
                        selectedPatient={selectedPatient}
                        reminders={reminders}
                    />
                </Body>

                {/* <AutoFillReminders /> */}
            </MainSection>
            <RightSidebar>
                <ReminderMembers
                    practiceId={businessId}
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
const Links = styled.div`
    display: flex;
    justify-content: space-apart;
`;
const ViewLink = styled.div`
    margin-left: 15px;
    border: 1px solid #898c8e;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
`;

const Header = ({ setCalendarView }) => {
    return (
        <HeaderContainer>
            <Recipient>
                <Name>Patient SMS Reminders </Name>
            </Recipient>
            <Links>
                <ViewLink onClick={() => setCalendarView(true)}>
                    Calendar View
                </ViewLink>
                <ViewLink onClick={() => setCalendarView(false)}>
                    Daily View
                </ViewLink>
            </Links>
        </HeaderContainer>
    );
};

const mapStateToProps = (state) => {
    return {
        businessId: state.business.businessId,
    };
};

export default connect(mapStateToProps, {})(Notification);
