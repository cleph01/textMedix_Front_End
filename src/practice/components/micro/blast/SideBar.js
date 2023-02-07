import { useState } from "react";

import { Button, TextField } from "@mui/material";

import { createSmsGroup } from "../../../dataModels/practice/smsBlastModel";

function SideBar() {
    const [groupName, setGroupName] = useState();

    const practiceId = "fpVAtpBjJLPUanlCydra";

    const handleGroupNameChange = (e) => {
        e.preventDefault();

        let value = e.target.value;

        setGroupName(value);
    };

    const handleGroupNameSumbit = (e) => {
        createSmsGroup(practiceId, groupName);
        setGroupName("");
    };

    console.log("Group Name: ", groupName);
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

export default SideBar;
