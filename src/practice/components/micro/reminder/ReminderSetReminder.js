import { useState } from "react";

import { createChannelFromMember } from "../../../dataModels/practice/practiceModel";
import { addReminder } from "../../../dataModels/practice/reminderModel";
import { useHistory } from "react-router-dom";
import {
    Avatar,
    Button,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
} from "@mui/material";

import TextsmsIcon from "@mui/icons-material/Textsms";

import NotificationDatePicker from "./NotificationDatePicker";
import TimePicker from "./TimePicker";

import moment from "moment";
import { connect } from "react-redux";
import TemplateModal from "../blast/modals/TemplateModal";
import { saveSmsTemplate } from "../../../dataModels/practice/smsBlastModel";

function ReminderSetReminder({
    selectedPatient,
    reminders,
    business,
    message,
}) {
    console.log("practice at Set Reminder: ", business);
    const [openTemplateModal, setOpenTemplateModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState();
    const [newTemplate, setNewTemplate] = useState();
    const [blastMessage, setBlastMessage] = useState("");
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
                practiceId: business.businessId,
                patientCell: selectedPatient.data().cellPhone,
                message: reminderMessage,
                practiceTwilioNumber: business.twilioNumber,
                sendOnDate: moment(date).format("l"),
                sendOnTime: convertTime(timeStr),
                createdOn: new Date(),
            };

            addReminder(dataObj);
        } else {
            alert("Selected a Patient first");
        }
    };

    const handleSaveSmsTemplate = () => {
        if (reminderMessage !== newTemplate && reminderMessage) {
            try {
                setNewTemplate(reminderMessage);
                saveSmsTemplate(business.businessId, reminderMessage);
            } catch (error) {
                console.log("Error Saving Sms Template: ", error.message);
            }
        } else {
            alert("Same Template Just Added or Field is Empty");
        }
    };

    return (
        <div
            style={{
                borderLeft: "1px solid #ccc",
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
                            practiceId={business.businessId}
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
                    {message && (
                        <p
                            style={{
                                border: "1px solid red",
                                color: "red",
                                padding: "10px",
                            }}
                        >
                            {message}
                        </p>
                    )}
                    <Button
                        disabled={false}
                        sx={{ width: "100%" }}
                        variant="contained"
                        color="primary"
                        onClick={onSubmit}
                    >
                        Sending
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
                        <div
                            style={{ cursor: "pointer" }}
                            onClick={() => setOpenTemplateModal(true)}
                        >
                            Templates
                        </div>
                        <div
                            style={{ cursor: "pointer" }}
                            onClick={handleSaveSmsTemplate}
                        >
                            Save to Templates
                        </div>
                    </div>
                </div>
            </div>
            <TemplateModal
                openTemplateModal={openTemplateModal}
                setOpenTemplateModal={setOpenTemplateModal}
                businessId={business.businessId}
                setSelectedTemplate={setSelectedTemplate}
                setBlastMessage={setBlastMessage}
            />
        </div>
    );
}

const SelectedPatient = ({ selectedPatient, reminders, practiceId }) => {
    const history = useHistory();

    const handleChatPatient = () => {
        createChannelFromMember(
            practiceId,
            selectedPatient.id,
            selectedPatient.data().cellPhone
        );
        history.push(
            `/practice/chat/${selectedPatient.data().cellPhone.slice(2)}`
        );
    };
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
            <div style={{ display: "flex", width: "100%" }}>
                <ListItemAvatar>
                    <Avatar
                        alt={`Charlie}`}
                        src={`https://placekitten.com/64/64`}
                    />
                </ListItemAvatar>
                <div style={{ fontWeight: "bold", flex: "1" }}>
                    {selectedPatient.data().displayName}
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginLeft: "10px",
                    }}
                >
                    <TextsmsIcon
                        onClick={handleChatPatient}
                        style={{ color: "#bbb" }}
                    />
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

const mapStateToProps = (state) => {
    return {
        business: state.business,
        message: state.message.message,
    };
};

export default connect(mapStateToProps, {})(ReminderSetReminder);
