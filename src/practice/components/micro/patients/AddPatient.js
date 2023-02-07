import { TextField } from "@mui/material";
import React from "react";

const AddPatient = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                height: "100%",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                    marginTop: "20px",
                    width: "75%",
                    height: "50%",
                }}
            >
                <h3>Add A New Patient</h3>
                <TextField
                    sx={{ margin: "0px 3px", width: "60%" }}
                    onChange={() => {}}
                    value=""
                    id="scratchpad"
                    label="First Name"
                    variant="outlined"
                    name="firstName"
                />
                <TextField
                    sx={{ margin: "0px 3px", width: "60%" }}
                    onChange={() => {}}
                    value=""
                    id="scratchpad"
                    label="Last Name"
                    variant="outlined"
                    name="lastName"
                />

                <TextField
                    sx={{ margin: "0px 3px", width: "60%" }}
                    onChange={() => {}}
                    value=""
                    id="scratchpad"
                    label="Cell Phone"
                    variant="outlined"
                    name="cellphone"
                />
                <TextField
                    sx={{ margin: "0px 3px", width: "60%" }}
                    onChange={() => {}}
                    value=""
                    id="scratchpad"
                    label="Email"
                    variant="outlined"
                    name="email"
                />
                <div
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        padding: "10px",
                        boxShadow: "5px 5px 5px rgba(68, 68, 68, 0.6)",
                        marginRight: "10px",
                    }}
                >
                    Submit
                </div>
            </div>
        </div>
    );
};

export default AddPatient;
