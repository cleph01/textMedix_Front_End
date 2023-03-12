import { useState } from "react";

import BlastMembers from "../../micro/blast/BlastMembers";

import GroupCategoryModal from "../../micro/blast/modals/GroupCategoryModal";

import SelectedPatientModal from "../../micro/blast/modals/SelectedPatientModal";

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
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SmsIcon from "@mui/icons-material/Sms";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CircularProgress from "@mui/material/CircularProgress";

import {
    addSmsDocs,
    getPatientsByIdArr,
    useGetPracticeGroupList,
    saveSmsTemplate,
} from "../../../dataModels/practice/smsBlastModel";

import styled from "styled-components";
import TemplateModal from "../../micro/blast/modals/TemplateModal";
import { connect } from "react-redux";

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
    width: 250px;
`;

const Body = styled.section`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const BlastHome = ({ business }) => {
    const [searchLabel, setSearchLabel] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sendToSMSGroup, setsendToSMSGroup] = useState(null);
    const [sendToSMSManual, setSendToSMSManual] = useState();
    const [selectedPatient, setSelectedPatient] = useState({ patientId: "" });
    const [blastMessage, setBlastMessage] = useState("");
    const [openGroupModal, setOpenGroupModal] = useState(false);
    const [openSelectedPatientModal, setOpenSelectedPatientModal] =
        useState(false);
    const [openTemplateModal, setOpenTemplateModal] = useState(false);
    const [groupModalCategory, setGroupModalCategory] = useState({ id: "bla" });

    const [blastOption, setBlastOption] = useState("manual");

    const [manualEntries, setManualEntries] = useState([]);

    const [groups, setGroups] = useState();

    const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);

    const [selectedTemplate, setSelectedTemplate] = useState();
    const [newTemplate, setNewTemplate] = useState();

    const deleteManualEntry = (number) => {
        setManualEntries((prev) =>
            prev.filter((entry) => entry.cellPhone !== number)
        );
    };

    const handleMesssageChange = (e) => {
        e.preventDefault();
        setBlastMessage(e.target.value);
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

    const onSubmit = async (e) => {
        if (blastOption === "group") {
            if (!sendToSMSGroup || sendToSMSGroup.members.length === 0) {
                alert("No Group Selected or Members are 0");
            } else {
                e.preventDefault();
                console.log(sendToSMSGroup);

                const smsList = await getPatientsByIdArr(
                    sendToSMSGroup.members
                );
                console.log("Send to SMS LIST: ", smsList);
                setSubmitBtnDisabled(true);

                try {
                    const batchAwait = await addSmsDocs(
                        smsList.map((entry) => ({
                            to: entry.cellPhone,
                            from: business.twilioNumber,
                            body: blastMessage,
                        }))
                    );

                    console.log("Batch Await response: ", batchAwait);
                } catch (error) {
                    console.log(
                        "error on batch: ",
                        error + ":" + error.message
                    );
                }
            }
        } else {
            if (manualEntries.length === 0) {
                alert("No Manual Numbers added");
            } else {
                e.preventDefault();
                // console.log(
                //     "Manual Entries: ",
                //     manualEntries.map((entry) => ({
                //         to: entry.cellPhone,
                //         from: business.twilioNumber,
                //         body: blastMessage,
                //     }))
                // );

                setSubmitBtnDisabled(true);

                try {
                    const batchAwait = await addSmsDocs(
                        manualEntries.map((entry) => ({
                            to: entry.cellPhone,
                            from: business.twilioNumber,
                            body: blastMessage,
                        }))
                    );

                    console.log("Batch Await response: ", batchAwait);
                } catch (error) {
                    console.log(
                        "error on batch: ",
                        error + ":" + error.message
                    );
                }
            }
        }
    };

    const handleSaveSmsTemplate = () => {
        if (blastMessage !== newTemplate && blastMessage) {
            try {
                setNewTemplate(blastMessage);
                saveSmsTemplate(business.businessId, blastMessage);
            } catch (error) {
                console.log("Error Saving Sms Template: ", error.message);
            }
        } else {
            alert("Same Template Just Added or Field is Empty");
        }
    };

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
                        <h1>Your Groups</h1>

                        <Groups
                            businessId={business.businessId}
                            setOpenGroupModal={setOpenGroupModal}
                            setGroupModalCategory={setGroupModalCategory}
                            setsendToSMSGroup={setsendToSMSGroup}
                            setBlastOption={setBlastOption}
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            borderTop: "1px solid #ccc",
                            padding: "10px",
                        }}
                    >
                        <div
                            style={{
                                padding: "8px",
                            }}
                        >
                            {blastOption === "group" ? (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    <div style={{ marginLeft: "5px" }}>
                                        {sendToSMSGroup?.groupName ||
                                            "Select A Group"}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        display: "flex",

                                        flexWrap: "wrap",
                                        padding: "6px",
                                        maxHeight: "250px",

                                        marginBottom: "3px",
                                        overflowY: "scroll",
                                    }}
                                >
                                    {manualEntries.map((contact, i) => (
                                        <ManualEntry
                                            key={i}
                                            contact={contact}
                                            deleteManualEntry={
                                                deleteManualEntry
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div
                            style={{
                                maxWidth: "350px",
                                borderLeft: "1px solid #ccc",
                                paddingLeft: "8px",
                            }}
                        >
                            Send SMS to Who:
                            <RadioButtonsGroup
                                setBlastOption={setBlastOption}
                                blastOption={blastOption}
                            />
                            {blastOption === "manual" && (
                                <InputRecipients
                                    setManualEntries={setManualEntries}
                                    manualEntries={manualEntries}
                                />
                            )}
                            <TextField
                                id="outlined-multiline-static"
                                label="Message To Send"
                                multiline
                                rows={4}
                                value={blastMessage}
                                onChange={handleMesssageChange}
                                placeholder="Enter Message"
                                inputProps={{ maxLength: 140 }}
                                sx={{ width: "100%" }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onSubmit}
                                disabled={submitBtnDisabled}
                            >
                                {submitBtnDisabled ? (
                                    <CircularProgress size={22} />
                                ) : (
                                    "Submit"
                                )}
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
                </Body>
            </MainSection>
            <RightSidebar>
                <BlastMembers
                    businessId={business.businessId}
                    setSelectedPatient={setSelectedPatient}
                    manualEntries={manualEntries}
                    setManualEntries={setManualEntries}
                    setOpenSelectedPatientModal={setOpenSelectedPatientModal}
                />
            </RightSidebar>

            <SelectedPatientModal
                openSelectedPatientModal={openSelectedPatientModal}
                setOpenSelectedPatientModal={setOpenSelectedPatientModal}
                businessId={business.businessId}
                selectedPatient={selectedPatient}
            />
            <GroupCategoryModal
                openGroupModal={openGroupModal}
                setOpenGroupModal={setOpenGroupModal}
                groupModalCategory={groupModalCategory}
                businessId={business.businessId}
            />
            <TemplateModal
                openTemplateModal={openTemplateModal}
                setOpenTemplateModal={setOpenTemplateModal}
                businessId={business.businessId}
                setSelectedTemplate={setSelectedTemplate}
                setBlastMessage={setBlastMessage}
            />
        </Container>
    );
};

const EntryItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 15px;

    padding: 6px;
    background-color: #ccc;
    color: #1c76d2;
    margin-right: 3px;
    margin-bottom: 3px;
`;

const ManualEntry = ({ contact, deleteManualEntry }) => {
    return (
        <EntryItem>
            {contact.displayName || contact.cellPhone} {"  "}
            <HighlightOffIcon
                sx={{ marginLeft: "8px" }}
                onClick={() => deleteManualEntry(contact.cellPhone)}
            />
        </EntryItem>
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
    padding: 16px;
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

const InputRecipients = ({ manualEntries, setManualEntries }) => {
    const [cellphone, setCellphone] = useState({
        formatted: "",
        raw: "",
    });

    const handleCellChange = (e) => {
        e.preventDefault();

        // this is where we'll call our future formatPhoneNumber function that we haven't written yet.
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        // we'll set the input value using our setInputValue

        setCellphone({
            formatted: formattedPhoneNumber,
            raw: formattedPhoneNumber.replace(/[^\d]/g, ""),
        });
    };

    const formatPhoneNumber = (value) => {
        // if input value is falsy eg if the user deletes the input, then just return
        if (!value) return value;

        // clean the input for any non-digit values.
        const phoneNumber = value.replace(/[^\d]/g, "");

        // phoneNumberLength is used to know when to apply our formatting for the phone number
        const phoneNumberLength = phoneNumber.length;

        // we need to return the value with no formatting if its less then four digits
        // this is to avoid weird behavior that occurs if you  format the area code to early

        if (phoneNumberLength < 4) return phoneNumber;

        // if phoneNumberLength is greater than 4 and less the 7 we start to return
        // the formatted number
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        }

        // finally, if the phoneNumberLength is greater then seven, we add the last
        // bit of formatting and return it.
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
            3,
            6
        )}-${phoneNumber.slice(6, 10)}`;
    };

    const handleAttachNumber = () => {
        if (
            manualEntries.some(
                (entry) => entry.cellPhone === `+1${cellphone.raw}`
            )
        ) {
            alert("Number Already Included");
        } else {
            setManualEntries((prev) => [
                ...prev,
                { cellPhone: `+1${cellphone.raw}` },
            ]);
        }

        setCellphone({
            formatted: "",
            raw: "",
        });
    };

    return (
        <HeaderContainer>
            <InputWrapper>
                <RecipientInput
                    onChange={handleCellChange}
                    value={cellphone.formatted}
                    placeholder="Enter Number"
                />
            </InputWrapper>
            <ConfirmButton onClick={handleAttachNumber}>Attach</ConfirmButton>
        </HeaderContainer>
    );
};

const RadioButtonsGroup = ({ blastOption, setBlastOption }) => {
    const handleChange = (event) => {
        setBlastOption(event.target.value);
    };
    return (
        <FormControl>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="OneContact"
                name="radio-buttons-group"
                sx={{ flexDirection: "row" }}
                value={blastOption}
                onChange={handleChange}
            >
                <FormControlLabel
                    value="group"
                    control={<Radio />}
                    label="Select Group(s)"
                />
                <FormControlLabel
                    value="manual"
                    control={<Radio />}
                    label="Manual Entry"
                />
            </RadioGroup>
        </FormControl>
    );
};

const Groups = ({
    businessId,
    setsendToSMSGroup,
    setOpenGroupModal,
    setGroupModalCategory,
    setBlastOption,
}) => {
    const groupList = useGetPracticeGroupList(businessId);

    if (!groupList) {
        return <div>Loading...</div>;
    }

    console.log("Groups: ", groupList);

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",

                padding: "10px",
            }}
        >
            {groupList?.map((group, index) => (
                <CategoryBox
                    key={index}
                    setOpenGroupModal={setOpenGroupModal}
                    group={group}
                    setGroupModalCategory={setGroupModalCategory}
                    setsendToSMSGroup={setsendToSMSGroup}
                    setBlastOption={setBlastOption}
                />
            ))}
        </div>
    );
};
const SelectedPatient = ({ selectedPatient, businessId, groups }) => {
    // const groups = useGetPatientGroups(businessId, selectedPatient.id);

    // console.log("custoemr group: ", groups);
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
                                {/* {groups?.length > 0
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
                                ))} */}
                            </div>
                        </div>
                    }
                />
            </ListItem>
        </>
    );
};

const CategoryBox = ({
    group,
    setOpenGroupModal,
    setGroupModalCategory,
    setsendToSMSGroup,
    setBlastOption,
}) => {
    return (
        <div
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
                <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        setGroupModalCategory(group);
                        setOpenGroupModal(true);
                    }}
                >
                    {group?.groupName}
                </div>
                <div style={{ margin: "12px 0px" }}>
                    ({group?.members.length})
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "#1c76d2",
                        width: "100px",
                    }}
                >
                    <SmsIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                            setsendToSMSGroup(group);
                            setBlastOption("group");
                        }}
                    />
                    <GroupAddIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                            setGroupModalCategory(group);
                            setOpenGroupModal(true);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        business: state.business,
    };
};

export default connect(mapStateToProps, {})(BlastHome);
