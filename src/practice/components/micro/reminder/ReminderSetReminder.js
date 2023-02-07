import { useState, useContext } from "react";
import { PracticeContext } from "../../../contexts/PracticeContext";
import { useFirestoreCollectionMutation } from "@react-query-firebase/firestore";
import { getReminderCollectionRef } from "../../../dataModels/practice/reminderModel";
import { Link } from "react-router-dom";
import {
    Avatar,
    Button,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
} from "@mui/material";

import NotificationDatePicker from "./NotificationDatePicker";
import TimePicker from "./TimePicker";

import moment from "moment";

function ReminderSetReminder({ selectedPatient, reminders }) {
    const addReminderCollectionRef = getReminderCollectionRef();

    const addDocMutation = useFirestoreCollectionMutation(
        addReminderCollectionRef
    );
    const practice = useContext(PracticeContext);

    console.log("practice Context at Set Reminder: ", practice);

    const [reminderMessage, setReminderMessage] = useState("");
    const [time, setTime] = useState({ hour: "", minute: "", meridiem: "" });
    const [date, setDate] = useState(null);

    const handleMesssageChange = (e) => {
        e.preventDefault();
        setReminderMessage(e.target.value);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (selectedPatient) {
            const timeStr = `${time.hour}:${time.minute} ${time.meridiem}`;

            const convertTime = (timeStr) => {
                const [time, modifier] = timeStr.split(" ");
                let [hours, minutes] = timeStr.split(":");
                if (hours === "12") {
                    hours = "00";
                }
                if (modifier === "PM") {
                    hours = parseInt(hours, 10) + 12;
                }
                return `${hours}:${minutes.split(" ")[0]}`;
            };

            const dataObj = {
                patientId: selectedPatient.id,
                practiceId: practice.practiceId,
                patientCell: selectedPatient.cellPhone,
                message: reminderMessage,
                practiceTwilioNumber: practice.twilioNumber,
                sendOnDate: moment(date).format("l"),
                sendOnTime: convertTime(timeStr),
                createdOn: new Date(),
            };

            addDocMutation.mutate(dataObj);
        } else {
            alert("Selected a Patient first");
        }
    };

    return (
        <div
            style={{
                borderTop: "1px #eee solid",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                flex: "1",
            }}
        >
            <div style={{ width: "96%" }}>
                <div>
                    {selectedPatient && (
                        <SelectedPatient
                            selectedPatient={selectedPatient}
                            reminders={reminders}
                        />
                    )}
                    <NotificationDatePicker date={date} setDate={setDate} />
                    <TimePicker time={time} setTime={setTime} />
                </div>
                <div>
                    <TextField
                        id="outlined-multiline-static"
                        label="Message To Send"
                        multiline
                        rows={4}
                        value={reminderMessage}
                        onChange={handleMesssageChange}
                        placeholder="Enter Message"
                        inputProps={{ maxLength: 140 }}
                        sx={{ width: "100%" }}
                    />
                </div>
                <div>
                    {addDocMutation.isError && (
                        <p>{addDocMutation.error.message}</p>
                    )}
                    <Button
                        disabled={addDocMutation.isLoading}
                        sx={{ width: "100%" }}
                        variant="contained"
                        color="primary"
                        onClick={onSubmit}
                    >
                        {addDocMutation.isLoading ? "...Sending" : "Submit"}
                    </Button>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "6px",
                            fontSize: "small",
                            color: "grey",
                        }}
                    >
                        <div>Templates</div>
                        <div>Save to Templates</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const SelectedPatient = ({ selectedPatient, reminders }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #454545",
                borderRadius: "3px",
                margin: "10px",
                padding: "10px",
            }}
        >
            <div style={{ display: "flex", width: "50%" }}>
                <ListItemAvatar>
                    <Avatar
                        alt={`Charlie}`}
                        src={`https://placekitten.com/64/64`}
                    />
                </ListItemAvatar>
                <div style={{ fontWeight: "bold" }}>
                    {selectedPatient.displayName}
                </div>
                <div style={{ display: "flex", marginLeft: "10px" }}>
                    <div
                        style={{
                            backgroundColor: "transparent",
                            color: "#ffd700",
                        }}
                    >
                        &#9733;
                    </div>
                    <div
                        style={{
                            backgroundColor: "transparent",
                            color: "#ffd700",
                        }}
                    >
                        &#9733;
                    </div>
                    <div
                        style={{
                            backgroundColor: "transparent",
                            color: "#ffd700",
                        }}
                    >
                        &#9733;
                    </div>
                    <div
                        style={{
                            backgroundColor: "transparent",
                            color: "#ffd700",
                        }}
                    >
                        &#9733;
                    </div>
                    <div
                        style={{
                            backgroundColor: "transparent",
                            color: "#ccc",
                        }}
                    >
                        &#9733;
                    </div>
                </div>
            </div>
            <div style={{ marginTop: "6px" }}>Reminders as of Today:</div>
            <div style={{ display: "flex" }}>
                <ul>
                    {reminders?.map((reminder) => (
                        <li>
                            {reminder.message} - to be sent:{" "}
                            {reminder.sendOnDate} @ {reminder.sendOnTime}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const PatientListItem = ({ selectedPatient }) => {
    return (
        <ListItem
            sx={{ mt: 3, boxShadow: 3 }}
            style={{ backgroundColor: "#fafafa" }}
        >
            <ListItemText
                primary={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
                secondary={
                    <>
                        <span>{selectedPatient.cellNumber}</span>
                        <br />
                        <span>{selectedPatient.email}</span>
                        <br />
                        <span>
                            Joined on:{" "}
                            {moment(selectedPatient.created).format(
                                "MM/DD/yyyy h:mm a"
                            )}
                        </span>
                    </>
                }
            />
        </ListItem>
    );
};

export default ReminderSetReminder;
