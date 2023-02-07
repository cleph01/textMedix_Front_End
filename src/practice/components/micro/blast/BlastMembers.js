import { useState, useEffect } from "react";
import {
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
} from "@mui/material";

import InputAdornment from "@mui/material/InputAdornment";

import {
    useGetPracticePatients,
    useGetDoc,
    createChannel,
    getPatients,
} from "../../../dataModels/practice/practiceModel";

import SearchIcon from "@mui/icons-material/Search";

function Members({ practiceId, setSelectedPatient }) {
    const members = useGetPracticePatients(practiceId);

    const [filteredMembers, setFilteredMembers] = useState();
    const [originalMembers, setOriginalMembers] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const patients = await getPatients(members);
            setFilteredMembers(patients);
            setOriginalMembers(patients);
        };

        fetchData().catch((error) => console.log("Error: ", error));
    }, [members]);

    console.log("First Fetch: ", members);

    console.log("Set Filtered Cusomers: ", filteredMembers);
    return (
        <div>
            <Search
                setFilteredMembers={setFilteredMembers}
                filteredMembers={filteredMembers}
                originalMembers={originalMembers}
            />
            <div>
                {filteredMembers?.map((member, index) => (
                    <Member
                        key={index}
                        member={member}
                        practiceId={practiceId}
                        setSelectedPatient={setSelectedPatient}
                    />
                ))}

                <div
                    style={{ cursor: "pointer", marginTop: "6px" }}
                    className="Member"
                >
                    <div className="MemberStatus online" />
                    cleverbot
                </div>
            </div>
        </div>
    );
}

const Member = ({ member, practiceId, setSelectedPatient }) => {
    return (
        <div
            style={{ cursor: "pointer", marginTop: "6px" }}
            onClick={() => setSelectedPatient(member)}
            className="Member"
        >
            <div className="MemberStatus offline" />
            {member?.displayName}
        </div>
    );
};

const Search = ({ setFilteredMembers, filteredMembers, originalMembers }) => {
    const [searchLabel, setSearchLabel] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchTermChange = (e) => {
        e.preventDefault();

        let value = e.target.value;

        if (value === "") {
            setFilteredMembers(originalMembers);
        }

        setSearchTerm(value);
    };

    const handleSearchLabelChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setSearchLabel(value);
    };

    const handleSearch = (e) => {
        e.preventDefault();

        const result = filteredMembers?.filter((patient) =>
            patient[searchLabel]
                .toLowerCase()
                .startsWith(searchTerm.toLowerCase())
        );

        setFilteredMembers(result);
    };

    return (
        <div className="search_bar">
            <FormControl fullWidth>
                <InputLabel id="search-label">Search</InputLabel>
                <Select
                    labelId="search-label"
                    id="demo-simple-select"
                    name="search-label"
                    value={searchLabel}
                    label="Search By:"
                    onChange={handleSearchLabelChange}
                >
                    <MenuItem value={"firstName"}>First Name</MenuItem>
                    <MenuItem value={"lastName"}>Last Name</MenuItem>
                    <MenuItem value={"cellNumber"}>Cell Number</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{ m: 1 }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                    Search
                </InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type="text"
                    value={searchTerm}
                    placeholder="Search..."
                    onChange={handleSearchTermChange}
                    endAdornment={
                        <InputAdornment position="start">
                            <IconButton
                                aria-label="search for new term"
                                onClick={handleSearch}
                                edge="end"
                            >
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Search"
                />
            </FormControl>
        </div>
    );
};

export default Members;
