import styled from "styled-components";

import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
} from "@mui/material";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 12px 0px;
`;

const Label = styled.div`
    font-weight: bold;
    margin-bottom: 6px;
`;

const Hr = styled.hr`
    flex: 1;
    height: 1px;
    background: #ccc;

    margin: 25px 6px;
`;

const SideBarFilter = () => {
    return (
        <Container>
            <Header>
                <Label>Filter</Label>
                <Label>Reset</Label>
            </Header>
            <Hr />
            <input
                style={{
                    padding: "6px",
                    border: "1px solid #ccc",
                    borderRadius: "12px",
                }}
                placeholder="Search Keywords"
            />
            <Hr />
            <Label>Date Range</Label>
            <input
                style={{
                    padding: "6px",
                    border: "1px solid #ccc",
                    borderRadius: "3px",
                }}
                placeholder="All Dates"
            />
            <Hr />
            <Label>Ratings</Label>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "0px 5px",
                }}
            >
                <div
                    style={{
                        width: "48%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div style={{ fontSize: "75%", color: "grey" }}>
                        Min Rating
                    </div>
                    <FormControl fullWidth>
                        <InputLabel id="search-label">1 Star</InputLabel>
                        <Select
                            labelId="search-label"
                            id="demo-simple-select"
                            name="search-label"
                            label=""
                        >
                            <MenuItem value={"firstName"}>First Name</MenuItem>
                            <MenuItem value={"lastName"}>Last Name</MenuItem>
                            <MenuItem value={"cellNumber"}>
                                Cell Number
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "48%",
                    }}
                >
                    <div style={{ fontSize: "75%", color: "grey" }}>
                        Min Rating
                    </div>
                    <FormControl fullWidth>
                        <InputLabel id="search-label">5 Stars</InputLabel>
                        <Select
                            labelId="search-label"
                            id="demo-simple-select"
                            name="search-label"
                            label=""
                        >
                            <MenuItem value={"firstName"}>First Name</MenuItem>
                            <MenuItem value={"lastName"}>Last Name</MenuItem>
                            <MenuItem value={"cellNumber"}>
                                Cell Number
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <hr />
        </Container>
    );
};

export default SideBarFilter;
