import { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const TimePicker = ({ time, setTime }) => {
    const handleChange = (event) => {
        const { name, value } = event.target;
        setTime((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Box
            sx={{
                minWidth: 165,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <FormControl fullWidth>
                <InputLabel id="hour-label">H</InputLabel>
                <Select
                    labelId="hour-label"
                    id="demo-simple-select"
                    name="hour"
                    value={time.hour}
                    label="Hr"
                    onChange={handleChange}
                >
                    <MenuItem value={"1"}>1</MenuItem>
                    <MenuItem value={"2"}>2</MenuItem>
                    <MenuItem value={"3"}>3</MenuItem>
                    <MenuItem value={"4"}>4</MenuItem>
                    <MenuItem value={"5"}>5</MenuItem>
                    <MenuItem value={"6"}>6</MenuItem>
                    <MenuItem value={"7"}>7</MenuItem>
                    <MenuItem value={"8"}>8</MenuItem>
                    <MenuItem value={"9"}>9</MenuItem>
                    <MenuItem value={"10"}>10</MenuItem>
                    <MenuItem value={"11"}>11</MenuItem>
                    <MenuItem value={"12"}>12</MenuItem>
                </Select>
            </FormControl>
            <div sx={{ margin: "50px 50px" }}> : </div>
            <FormControl fullWidth>
                <InputLabel id="hour-label">M</InputLabel>
                <Select
                    labelId="hour-label"
                    id="demo-simple-select"
                    name="minute"
                    value={time.minute}
                    label="Min"
                    onChange={handleChange}
                >
                    <MenuItem value={"00"}>00</MenuItem>
                    <MenuItem value={"15"}>15</MenuItem>
                    <MenuItem value={"30"}>30</MenuItem>
                    <MenuItem value={"45"}>45</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="meridiem-label">P</InputLabel>
                <Select
                    labelId="meridiem-label"
                    id="demo-simple-select"
                    name="meridiem"
                    value={time.meridiem}
                    label="PM"
                    onChange={handleChange}
                >
                    <MenuItem value={"AM"}>AM</MenuItem>
                    <MenuItem value={"PM"}>PM</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default TimePicker;
