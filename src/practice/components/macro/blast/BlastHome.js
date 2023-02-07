import { useState, useEffect, useCallback, useMemo } from "react";

import { collection, addDoc, Timestamp } from "firebase/firestore";

import { db } from "../../../../utils/db/firebaseConfig";

import BlastMembers from "../../micro/blast/BlastMembers";

import GroupListModal from "../../micro/blast/modals/GroupListModal";

import {
    Avatar,
    Button,
    FormControl,
    FormControlLabel,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import {
    useGetAllGroups,
    useGetPatientGroups,
} from "../../../dataModels/practice/practiceModel";

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

const Body = styled.section`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const BlastHome = () => {
    const [time, setTime] = useState({ hour: "", minute: "", meridiem: "" });
    const [date, setDate] = useState(null);
    const [searchLabel, setSearchLabel] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState();
    const [reminderMessage, setReminderMessage] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [groupMembers, setGroupMembers] = useState([]);

    const practiceId = "fpVAtpBjJLPUanlCydra";

    const handleMesssageChange = (e) => {
        e.preventDefault();
        setReminderMessage(e.target.value);
    };

    const handleSearchTermChange = (e) => {
        e.preventDefault();

        let value = e.target.value;

        setSearchTerm(value);
    };

    const handleSearchLabelChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setSearchLabel(value);
    };

    console.log("Found patient: ");

    const onSubmit = async (e) => {
        e.preventDefault();

        if (selectedPatient.firstName) {
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
                practiceId: "fpVAtpBjJLPUanlCydra",
                patientCell: selectedPatient.cellNumber,
                message: reminderMessage,
                practiceTwilioNumber: "+19144001284",
                // sendOnDate: moment(date).format("l"),
                sendOnTime: convertTime(timeStr),
                createdOn: Timestamp.fromDate(new Date()),
            };

            const docRef = await addDoc(
                collection(db, "notifications"),
                dataObj
            );

            if (docRef.id) {
                console.log("Notication Saved: ", docRef.id);
            }

            console.log("Add Reminder Data Obj: ", dataObj);
        } else {
            alert("Select a patient first");
        }
    };

    console.log("Select Date: ", date);
    console.log("Selected patient at Blast Home: ", selectedPatient);

    return (
        <Container>
            <MainSection>
                <Header />
                <Body>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "750px",
                            flex: "1",
                            margin: "0px 10px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <h1>Your Groups</h1>
                            <div
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    padding: "10px",
                                    boxShadow:
                                        "5px 5px 5px rgba(68, 68, 68, 0.6)",
                                }}
                            >
                                Add New Group
                            </div>
                        </div>

                        <Groups
                            practiceId={practiceId}
                            setOpenModal={setOpenModal}
                            setGroupMembers={setGroupMembers}
                        />
                    </div>

                    {/* {selectedPatient && (
                        <SelectedPatient
                            selectedPatient={selectedPatient}
                            practiceId={practiceId}
                        />
                    )} */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "end",
                            padding: "10px",
                        }}
                    >
                        <CellPhoneBox />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: "1",

                                marginLeft: "10px",
                            }}
                        >
                            {selectedPatient && (
                                <SelectedPatient
                                    selectedPatient={selectedPatient}
                                    practiceId={practiceId}
                                />
                            )}
                            <div
                                style={{
                                    justifyContent: "center",
                                    padding: "8px",
                                }}
                            >
                                Send SMS to Who:
                                <RadioButtonsGroup />
                            </div>
                            <InputRecipients />
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

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onSubmit}
                            >
                                Submit
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
                </Body>
            </MainSection>
            <RightSidebar>
                <BlastMembers
                    practiceId={practiceId}
                    setSelectedPatient={setSelectedPatient}
                />
            </RightSidebar>
            <GroupListModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                groupMembers={groupMembers}
            />
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
                <Name>SMS Center </Name>
            </Recipient>
        </HeaderContainer>
    );
};

const PhoneContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 300px;
    height: 380px;
    border: 1px solid #000000;
    border-radius: 0.5rem;
    background-color: #2c2a2a;
    box-shadow: 5px 5px 5px rgba(68, 68, 68, 0.6);
`;

const PhoneScreenWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: end;
    border: 1px solid #000000;
    border-radius: 0.5rem;
    margin-top: 0.25rem;
    padding: 0.75rem;
    width: 85%;
    height: 85%;
    font-size: 0.75rem;
    background-color: #ffffff;
`;

const PhoneMessages = styled.div`
    margin-top: 10px;
    display: flex;
    flex-direction: column;
`;

const MyMessage = styled(PhoneMessages)`
    align-items: flex-end;
    color: white;
    margin-left: 2%;
    position: relative;
`;

const Message = styled.div`
    border-radius: 5px;
    padding: 8px 15px;
    margin-top: 5px;
    margin-bottom: 5px;
    display: inline-block;
    text-align: left;
    background: rgb(0, 120, 254);
`;

const PhoneButton = styled.div`
    padding: 0.5rem;
    border: 1px solid #000000;
    border-radius: 50%;
    margin-top: 0.25rem;
    background-color: #ffffff;
`;

const LastMessage = styled(Message)``;

const CellPhoneBox = () => {
    return (
        <PhoneContainer>
            <PhoneScreenWrapper>
                <MyMessage>
                    <Message>bla</Message>
                    <Message last>Send a Message</Message>
                </MyMessage>
            </PhoneScreenWrapper>
            <PhoneButton></PhoneButton>
        </PhoneContainer>
    );
};

const RecipientInput = styled.input`
    font: inherit;
    border: 1px solid transparent;

    &hover {
        border-color: #ccc;
    }
`;

const ConfirmButton = styled.button`
    border-radius: 5px;
    background: transparent;
`;

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 50px;
`;

const InputRecipients = () => {
    return (
        <HeaderContainer>
            <InputWrapper>
                <RecipientInput placeholder="Enter Name" />
                <RecipientInput placeholder="Enter Number" />
            </InputWrapper>
            <ConfirmButton>Attach</ConfirmButton>
        </HeaderContainer>
    );
};

const RadioButtonsGroup = () => {
    return (
        <FormControl>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="OneContact"
                name="radio-buttons-group"
                sx={{ flexDirection: "row" }}
            >
                <FormControlLabel
                    value="OneContact"
                    control={<Radio />}
                    label="One Contact"
                />
                <FormControlLabel
                    value="MultipleContacts"
                    control={<Radio />}
                    label="Multiple Contacts"
                />
                <FormControlLabel
                    value="SelectGroup"
                    control={<Radio />}
                    label="Select Group(s)"
                />
                <FormControlLabel
                    value="Manual"
                    control={<Radio />}
                    label="Manual Entry"
                />
            </RadioGroup>
        </FormControl>
    );
};

const Groups = ({ practiceId, setOpenModal, setGroupMembers }) => {
    const groups = useGetAllGroups(practiceId);

    console.log("Groups: ", groups);

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",

                padding: "10px",
            }}
        >
            {groups?.map((group, index) => (
                <CategoryBox
                    setOpenModal={setOpenModal}
                    group={group}
                    setGroupMembers={setGroupMembers}
                />
            ))}
        </div>
    );
};
const SelectedPatient = ({ selectedPatient, practiceId }) => {
    const groups = useGetPatientGroups(practiceId, selectedPatient.id);

    console.log("custoemr group: ", groups);
    return (
        <>
            <div>Selected Patient</div>

            <ListItem
                alignItems="flex-start"
                secondaryAction={
                    <>
                        <IconButton aria-label="comment">
                            <Delete />
                        </IconButton>
                        <IconButton aria-label="comment">
                            <Edit />
                        </IconButton>
                    </>
                }
            >
                <ListItemAvatar>
                    <Avatar
                        alt={selectedPatient.displayName}
                        src="/static/images/avatar/1.jpg"
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={`Display Name: ${selectedPatient.displayName}`}
                    secondary={
                        <div style={{ display: "flex" }}>
                            <div>
                                <Typography
                                    sx={{ display: "inline" }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    First Name: {selectedPatient.firstName}
                                </Typography>
                                <div>
                                    <Typography
                                        sx={{ display: "inline" }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        Last Name: {selectedPatient.lastName}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography
                                        sx={{ display: "inline" }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        Cell Phone: {selectedPatient.cellPhone}{" "}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography
                                        sx={{ display: "inline" }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        Email: {selectedPatient.email}
                                    </Typography>
                                </div>
                            </div>
                            <div
                                style={{
                                    borderLeft: "1px solid #ccc",
                                    paddingLeft: "10px",
                                    marginLeft: "10px",
                                }}
                            >
                                {groups?.length > 0
                                    ? "Already in following groups:"
                                    : "** Not Part of an SMS Group Yet **"}
                                {groups?.map((group, index) => (
                                    <Typography
                                        sx={{ display: "inline" }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        <li>{group.groupName}</li>
                                    </Typography>
                                ))}
                            </div>
                        </div>
                    }
                />
            </ListItem>
        </>
    );
};

const CategoryBox = ({ group, setOpenModal, setGroupMembers }) => {
    return (
        <div
            onClick={() => {
                setGroupMembers({
                    groupName: group.groupName,
                    members: group.members,
                });
                setOpenModal(true);
            }}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "9px",
                marginTop: "9px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ffffff",
                    border: "1px solid #000000",
                    borderRadius: "0.5rem",
                    padding: "0.5rem",
                    boxShadow: "5px 5px 5px rgba(68, 68, 68, 0.6)",
                }}
            >
                <div>{group?.groupName}</div>
                <div>({group?.members.length})</div>
            </div>
        </div>
    );
};

export default BlastHome;
