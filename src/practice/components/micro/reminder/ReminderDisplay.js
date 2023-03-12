import { useState } from "react";
import styled from "styled-components";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import moment from "moment";
import {
    getPatient,
    useGetDoc,
} from "../../../dataModels/practice/practiceModel";

import { useGetReminderByDate } from "../../../dataModels/practice/reminderModel";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 12px;
    width: 66%;
`;

const Wrapper = styled(Container)`
    width: 100%;
    max-height: 400px;
    flex: 1;
    overflow-y: scroll;
    border-top: 1px solid #ccc;
`;

const ReminderDisplay = ({ practiceId }) => {
    const [date, setDate] = useState(moment());

    //To get a copy of the native Date object that Moment.js wraps, use moment().toDate().
    //This will return a copy of the Date that the moment uses
    const reminders = useGetReminderByDate(date, practiceId);

    if (!reminders) {
        return <div>Loading...</div>;
    }

    let sortedReminders = {};

    reminders.forEach((reminder) => {
        if (!(reminder.data().sendOnTime in sortedReminders))
            sortedReminders[reminder.data().sendOnTime] = [];
        sortedReminders[reminder.data().sendOnTime].push({
            patientId: reminder.data().patientId,
            reminderId: reminder.id,
        });
    });

    console.log("SortedReminders: ", sortedReminders);
    return (
        <Container>
            <Header date={date} setDate={setDate} />
            <Display sortedReminders={sortedReminders} />
        </Container>
    );
};

const Display = ({ sortedReminders }) => {
    const data = [
        {
            patientId: "XViKB93K2NEycQEDalVO",
            time: "17:15",
            message: "message1",
            reminderId: "1",
        },
        {
            patientId: "QheybAMPA4NLgTAzDutJ",
            time: "18:15",
            message: "message2",
            reminderId: "2",
        },
        {
            patientId: "QheybAMPA4NLgTAzDutJ",
            time: "8:45",
            message: "message3",
            reminderId: "3",
        },
        {
            patientId: "XViKB93K2NEycQEDalVO",
            time: "10:30",
            message: "message1",
            reminderId: "4",
        },
    ];

    // let sortedReminders = {};

    // data.forEach((reminder) => {
    //     if (!(reminder.time in sortedReminders))
    //         sortedReminders[reminder.time] = [];
    //     sortedReminders[reminder.time].push({
    //         patientId: reminder.patientId,
    //         reminderId: reminder.reminderId,
    //     });
    // });

    // console.log(sortedReminders);

    return (
        <Wrapper>
            {Object.keys(sortedReminders).length > 0 ? (
                Object.entries(sortedReminders).map(([time, reminders]) => (
                    <DisplayItem time={time} reminders={reminders} />
                ))
            ) : (
                <div>No Reminders</div>
            )}
        </Wrapper>
    );
};

const ItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-right: 10px;
`;

const TimeBlock = styled.div`
    width: 55px;
    color: #898c8e;
`;

const Content = styled.div`
    display: flex;

    width: 100%;
`;

const UnOrderedList = styled.ul`
    display: flex;
    flex-direction: column;
    height: 100px;
    flex-wrap: wrap;
    width: inherit;
    overflow-x: scroll;
`;

const DisplayItem = ({ time, reminders }) => {
    return (
        <ItemContainer>
            <TimeBlock>{time}</TimeBlock>
            <Content>
                <UnOrderedList>
                    {reminders.map((reminder) => (
                        <Patient patientId={reminder.patientId} />
                    ))}
                </UnOrderedList>
            </Content>
        </ItemContainer>
    );
};

const Patient = ({ patientId }) => {
    const patient = useGetDoc(`/patients/${patientId}`);

    if (!patient) {
        return <div>Loading...</div>;
    }

    return <li>{`${patient.firstName} ${patient.lastName}`}</li>;
};

const DateHeader = styled.div`
    font-size: larger;
    font-weight: 700;
    margin: 12px 0px;
`;
const SubHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 12px;
`;

const ArrowWrapper = styled.div`
    margin-left: 12px;
    font-size: 8px;
`;

const TodayBtn = styled.div`
    border: 1px solid #898c8e;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
`;

const Header = ({ date, setDate }) => {
    const handleDateArrow = (num) => {
        if (num === 1) {
            setDate(moment(date).add(1, "days"));
        } else {
            setDate(moment(date).subtract(1, "days"));
        }
    };

    return (
        <Container>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                    views={["month", "day"]}
                    label="Pick a Date"
                    value={date}
                    onChange={(newValue) => {
                        console.log(typeof newValue, newValue);
                        setDate(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} helperText={null} />
                    )}
                />
            </LocalizationProvider>
            <DateHeader>{moment(date).format("ddd, MMM D")}</DateHeader>
            <SubHeader>
                <TodayBtn onClick={() => setDate(moment(Date.now()))}>
                    Today
                </TodayBtn>
                <ArrowWrapper>
                    <ArrowBackIosIcon onClick={() => handleDateArrow(-1)} />
                    <ArrowForwardIosIcon onClick={() => handleDateArrow(1)} />
                </ArrowWrapper>
            </SubHeader>
        </Container>
    );
};

export default ReminderDisplay;
