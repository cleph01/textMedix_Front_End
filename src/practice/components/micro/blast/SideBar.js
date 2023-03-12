import { useState, useContext } from "react";

import { Button, TextField } from "@mui/material";

import { createSmsGroup } from "../../../dataModels/practice/smsBlastModel";

import { connect } from "react-redux";

function SideBar({ businessId }) {
    const [groupName, setGroupName] = useState();

    const handleGroupNameChange = (e) => {
        e.preventDefault();

        let value = e.target.value;

        setGroupName(value);
    };

    const handleGroupNameSumbit = (e) => {
        createSmsGroup(businessId, groupName);
        setGroupName("");
    };

    return (
        <div style={{ borderTop: "1px #eee solid", paddingTop: "5px" }}>
            <div style={{ padding: "8px 20px", marginTop: "15px" }}>
                Create New Group
            </div>

            <div className="text_area" style={{ padding: "5px" }}>
                <TextField
                    id="outlined-multiline-static"
                    label="Enter SMS Group Name"
                    rows={2}
                    value={groupName}
                    placeholder="Enter SMS Group Name"
                    inputProps={{ maxLength: 140 }}
                    sx={{ width: "100%", backgroundColor: "#eee" }}
                    onChange={handleGroupNameChange}
                />
                <Button
                    onClick={handleGroupNameSumbit}
                    variant="contained"
                    color="primary"
                >
                    Create Group
                </Button>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        businessId: state.business.businessId,
    };
};

export default connect(mapStateToProps, {})(SideBar);
