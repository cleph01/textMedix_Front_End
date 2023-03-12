import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
    useGetPracticeSMSTemplates,
    getPracticeTemplateRef,
} from "../../../../dataModels/practice/smsBlastModel";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";

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
};

export default function TemplateModal({
    setBlastMessage,
    openTemplateModal,
    setOpenTemplateModal,
    businessId,
}) {
    console.log("businessID at template modal: ", businessId);
    const handleClose = () => setOpenTemplateModal(false);

    const templates = useGetPracticeSMSTemplates(businessId);

    if (!templates) {
        return <div>Loading...</div>;
    }

    console.log("Practice Templates: ", templates);

    return (
        <div>
            <Modal
                open={openTemplateModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Templates
                    </Typography>
                    {templates?.map((template, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setBlastMessage(template.message);
                                setOpenTemplateModal(false);
                            }}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "10px",
                                padding: "6px",
                                margin: "6px 0px",
                                cursor: "pointer",
                            }}
                        >
                            {template.message}
                        </div>
                    ))}
                </Box>
            </Modal>
        </div>
    );
}
