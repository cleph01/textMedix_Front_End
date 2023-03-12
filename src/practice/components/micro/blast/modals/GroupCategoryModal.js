import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
    Modal,
    ListItemText,
    Avatar,
    ListItemAvatar,
    IconButton,
    ListItem,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

import {
    addPatientToGroup,
    removePatientFromGroup,
    practicePatientListQuery,
    useGetDoc,
    getDocById,
    getPatientsByIdArr,
} from "../../../../dataModels/practice/smsBlastModel";
import { Delete, Edit } from "@mui/icons-material";

import {
    useFirestoreDocumentData,
    useFirestoreQueryData,
} from "@react-query-firebase/firestore";
import { useGetPracticePatients } from "../../../../dataModels/practice/practiceModel";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    maxHeight: "1050px",
    overflowY: "scroll",
};

const GroupCategoryModal = ({
    openGroupModal,
    setOpenGroupModal,
    businessId,
    groupModalCategory,
}) => {
    const handleClose = () => setOpenGroupModal(false);

    console.log(
        "Selected Group in Group Modal: ",
        groupModalCategory?.id,
        businessId
    );

    const selectedGroupDoc = useGetDoc(
        `practice/${businessId}/smsGroups/${groupModalCategory?.id}`
    );

    if (!selectedGroupDoc) {
        return <div>Loading...</div>;
    }

    console.log("Group Members in Group Modal: ", selectedGroupDoc);

    return (
        <div>
            <Modal
                open={openGroupModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "large",
                                fontWeight: "bold",
                            }}
                        >
                            {selectedGroupDoc?.groupName}
                        </div>
                        <UnAssignedPatientDropDown
                            businessId={businessId}
                            members={selectedGroupDoc?.members}
                            groupId={groupModalCategory?.id}
                        />
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <div style={{ marginBottom: "10px" }}>
                            Current Member of Groups : (
                            {selectedGroupDoc?.members?.length})
                        </div>

                        {
                            //Had to use 2 question marks to protect against initial
                            // state being contrived by me at useState. Modal breaks otherwise
                            selectedGroupDoc?.members?.map(
                                (patientId, index) => (
                                    <GroupItem
                                        key={index}
                                        groupId={groupModalCategory?.id}
                                        businessId={businessId}
                                        patientId={patientId}
                                    />
                                )
                            )
                        }
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

const UnAssignedPatientDropDown = ({ businessId, members, groupId }) => {
    const currMemberSet = new Set(members);

    const [newMemberId, setNewMemberId] = useState("");
    console.log("members at unAssigned Patient: ", members);

    const patientList = useGetPracticePatients(businessId);

    if (!patientList) {
        return <div>Loading...</div>;
    }

    console.log("patientList at unAssigned Patient: ", patientList);
    let unAssignedPatients = patientList.filter(
        (record) => !currMemberSet.has(record.id)
    );

    // console.log("Patient ID at dropdown: ", patientId);
    console.log("All Patient IDs in dropdown: ", patientList);
    console.log("Current Members: ", members);
    console.log("Unassigned Patients at DropDown: ", unAssignedPatients);
    // console.log("UnassignedGroups: ", unAssignedGroups);

    const handleAddToGroup2 = (event) => {
        console.log("dafuq");
        setNewMemberId(event.target.value);
        addPatientToGroup(groupId, businessId, event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="group-category-select-label">
                    Add To Group
                </InputLabel>
                <DropDownArea
                    unAssignedPatients={unAssignedPatients}
                    handleAddToGroup2={handleAddToGroup2}
                    newMemberId={newMemberId}
                />
            </FormControl>
        </Box>
    );
};

const DropDownArea = ({
    unAssignedPatients,
    newMemberId,
    handleAddToGroup2,
}) => {
    const [patients, setPatients] = useState();

    return (
        <Select
            labelId="group-category-select-label"
            id="group-category-select"
            value={newMemberId}
            label="Add To Group"
            onChange={handleAddToGroup2}
        >
            {unAssignedPatients?.map((patient, i) => (
                <MenuItem key={i} value={patient.id}>
                    {`${patient.firstName} ${patient.lastName}`}
                </MenuItem>
            ))}
        </Select>
    );
};

const GroupItem = ({ groupId, businessId, patientId }) => {
    const handleDeleteFromGroup = (e) => {
        removePatientFromGroup(groupId, businessId, patientId);
        // console.log("GroupID: ", groupId, businessId, patientId);
    };

    const patient = useGetDoc(`practice/${businessId}/patients/${patientId}`);

    if (!patient) {
        return <div>Loading...</div>;
    }

    return (
        <ListItem
            style={{ border: "1px solid #ccc", marginBottom: " 6px" }}
            alignItems="flex-start"
            secondaryAction={
                <IconButton
                    aria-label="comment"
                    sx={{ cursor: "pointer" }}
                    onClick={handleDeleteFromGroup}
                >
                    <Delete />
                </IconButton>
            }
        >
            <ListItemText
                primary={`${patient.firstName} ${patient.lastName}`}
            />
        </ListItem>
    );
};

export default GroupCategoryModal;
