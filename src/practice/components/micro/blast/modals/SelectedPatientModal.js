import { useState, useEffect } from "react";
import {
    Box,
    Modal,
    ListItemText,
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
    useGetPracticeGroupList,
    useGetPatientGroupsList,
} from "../../../../dataModels/practice/smsBlastModel";
import { Delete } from "@mui/icons-material";

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

const SelectedPatientModal = ({
    openSelectedPatientModal,
    setOpenSelectedPatientModal,
    businessId,
    selectedPatient,
}) => {
    const handleClose = () => setOpenSelectedPatientModal(false);

    console.log("Selected Patient in Modal: ", selectedPatient);
    // Define a query reference using the Firebase SDK
    const groupList = useGetPatientGroupsList(
        businessId,
        selectedPatient?.patientId
    );

    if (!groupList) {
        return <div>Loading...</div>;
    }
    console.log(
        "Selected patient at Selected Patient Modal: ",
        selectedPatient
    );
    console.log("PatientGroups in Selected Patient Modal: ", groupList);

    return (
        <div>
            <Modal
                open={openSelectedPatientModal}
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
                            {`${selectedPatient.firstName} ${selectedPatient.lastName}`}
                        </div>
                        <NewGroupDropDown
                            businessId={businessId}
                            patientId={selectedPatient?.patientId}
                        />
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <div style={{ marginBottom: "10px" }}>
                            Current Member of Groups:
                        </div>
                        {groupList.map((group, index) => (
                            <GroupItem
                                key={index}
                                group={group}
                                businessId={businessId}
                                patientId={selectedPatient?.patientId}
                            />
                        ))}
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

const NewGroupDropDown = ({ businessId, patientId }) => {
    const [newGroupId, setNewGroupId] = useState("");
    const [unAssignedGroups, setUnAssignedGroups] = useState();

    console.log("New Group Id: ", newGroupId);

    const handleAddToGroup = (event) => {
        setNewGroupId(event.target.value);
        addPatientToGroup(event.target.value, businessId, patientId);
    };

    const groupList = useGetPracticeGroupList(businessId);

    // if (!groupList) {
    //     return <div>Loading...</div>;
    // }

    useEffect(() => {
        setUnAssignedGroups(
            groupList?.filter((group) => !group.members.includes(patientId))
        );
    }, [groupList]);

    // setUnAssignedGroups((prev) =>
    //     groups.filter((group) => !group.members.includes(patientId))
    // );

    console.log("Patient ID at dropdown: ", patientId);
    console.log("Groups in dropdown: ", groupList);

    console.log("UnassignedGroups: ", unAssignedGroups);
    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                    Add To Group
                </InputLabel>
                <Select
                    defaultValue={""}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={newGroupId}
                    label="Add To Group"
                    onChange={handleAddToGroup}
                >
                    {unAssignedGroups?.map((group, i) => (
                        <MenuItem key={i} value={group.id}>
                            {group.groupName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};
const GroupItem = ({ group, businessId, patientId }) => {
    const handleDeleteFromGroup = (e) => {
        removePatientFromGroup(group.id, businessId, patientId);
        // console.log("GroupID: ", group);
    };

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
            <ListItemText primary={group.groupName} />
        </ListItem>
    );
};

export default SelectedPatientModal;
