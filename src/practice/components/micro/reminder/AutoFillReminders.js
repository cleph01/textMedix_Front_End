import { useState } from "react";

import { Button, ListItem, ListItemText, TextField } from "@mui/material";

function AutoFillReminders() {
    const [reminders, setReminders] = useState([
        {
            id: "R6O1CPHACsmjvjWxzaFN",
            text: "Canned Reminder  ",
        },
        {
            id: "R6O1CPHACsmjvjWxzaFN",
            text: "Reminder: Lorem Ipsum  ",
        },
        {
            id: "R6O1CPHACsmjvjWxzaFN",
            text: "Reminder: Lorem Ipsum  ",
        },
    ]);

    return (
        <div
            style={{
                height: "69%",
                padding: "8px",
            }}
        >
            Saved Reminders
            <div style={{ overflow: "scroll", height: "100%" }}>
                {reminders.map((reminder) => (
                    <ReminderListItem reminder={reminder} />
                ))}
            </div>
        </div>
    );
}

const ReminderListItem = ({ reminder }) => {
    console.log("Reminder: ", reminder);

    return (
        <ListItem sx={{ mt: 3, boxShadow: 3, backgroundColor: "#eee" }}>
            <ListItemText primary={reminder.text} secondary={reminder.text} />
        </ListItem>
    );
};
export default AutoFillReminders;
