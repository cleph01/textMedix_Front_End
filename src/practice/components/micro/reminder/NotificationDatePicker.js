import { useState } from "react";

import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PatientListItem from "./PatientListItem";

const NotificationDatePicker = ({ date, setDate, selectedPatient }) => {
    return (
        <div style={{ minWidth: "165px" }}>
            {/* {selectedPatient.firstName && (
                <PatientListItem patient={selectedPatient} />
            )} */}
            {/* <pre>{`Date Picker: ${date}`}</pre> */}
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                    label="Pick a Date"
                    value={date}
                    onChange={(newValue) => {
                        setDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
        </div>
    );
};

export default NotificationDatePicker;
