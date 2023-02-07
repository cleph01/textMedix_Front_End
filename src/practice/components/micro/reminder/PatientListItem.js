import React from "react";

import { ListItem, ListItemText } from "@mui/material";
import moment from "moment/moment";

const PatientListItem = ({ patient, setSelectedPatient }) => {
    return (
        <ListItem
            sx={{ mt: 3, boxShadow: 3 }}
            style={{ backgroundColor: "#fafafa" }}
            onClick={() => setSelectedPatient(patient)}
        >
            <ListItemText
                primary={`${patient.firstName} ${patient.lastName}`}
                secondary={
                    <>
                        <span>{patient.cellNumber}</span>
                        <br />
                        <span>{patient.email}</span>
                        <br />
                        <span>
                            Joined on:{" "}
                            {moment(patient.created).format(
                                "MM/DD/yyyy h:mm a"
                            )}
                        </span>
                    </>
                }
            />
        </ListItem>
    );
};

export default PatientListItem;
