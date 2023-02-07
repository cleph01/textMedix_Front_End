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
} from "@mui/material";

import { getPatientsByIdArr } from "../../../../dataModels/practice/smsBlastModel";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";

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

const BasicModal = ({ openModal, setOpenModal, groupMembers }) => {
    const [members, setMembers] = useState();

    const handleClose = () => setOpenModal(false);

    useEffect(() => {
        const fetchData = async () => {
            const membersResult = await getPatientsByIdArr(
                groupMembers.members
            );
            setMembers(membersResult);
        };

        fetchData().catch((error) => console.log("Error: ", error));
    }, [groupMembers.members]);

    console.log(groupMembers, members);
    return (
        <div>
            <Modal
                open={openModal}
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
                            {groupMembers.groupName}
                        </div>
                        <div
                            style={{
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                                padding: "10px",
                            }}
                        >
                            Add to Group
                        </div>
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        {members?.reverse().map((member, index) => (
                            <GroupMember key={index} member={member} />
                        ))}
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

const GroupMember = ({ member }) => {
    return (
        <Link to={`/practice/patients/${member.id}`}>
            <ListItem
                style={{ border: "1px solid #ccc" }}
                alignItems="flex-start"
                secondaryAction={
                    <IconButton aria-label="comment">
                        <Delete />
                    </IconButton>
                }
            >
                <ListItemAvatar>
                    <Avatar
                        alt={member.displayName}
                        src="/static/images/avatar/1.jpg"
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={`Display Name: ${member.displayName}`}
                    secondary={
                        <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            Cell Phone: {member.cellPhone}{" "}
                        </Typography>
                    }
                />
            </ListItem>
        </Link>
    );
};

export default BasicModal;
