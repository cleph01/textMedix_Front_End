import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
} from "@mui/material";
import React, { useState } from "react";
import {
    useGetPracticePatients,
    useGetDoc,
    createChannelFromMember,
    practicePatientListQuery,
    getPatient,
} from "../../../dataModels/practice/practiceModel";

import SearchIcon from "@mui/icons-material/Search";
import {
    useFirestoreDocument,
    useFirestoreQueryData,
} from "@react-query-firebase/firestore";
import { connect } from "react-redux";

function Members({ businessId, setSelectedPatient, fetchReminders }) {
    const patientList = useGetPracticePatients(businessId);

    if (!patientList) {
        return <div>Loading...</div>;
    }

    console.log("patients in Reminder patients: ", patientList);
    return (
        <div>
            <Search />
            <div>
                {patientList.map((patient, index) => (
                    <Member
                        key={index}
                        patient={patient}
                        practiceId={businessId}
                        setSelectedPatient={setSelectedPatient}
                        fetchReminders={fetchReminders}
                    />
                ))}

                <div
                    className="Member"
                    style={{ cursor: "pointer", marginTop: "6px" }}
                >
                    <div className="MemberStatus online" />
                    cleverbot
                </div>
            </div>
        </div>
    );
}

const Member = ({
    patient,
    practiceId,
    setSelectedPatient,
    fetchReminders,
}) => {
    console.log("patient at Reminder patient: ", patient);

    const handleSelectPatient = (e) => {
        e.preventDefault();
        setSelectedPatient(patient);
        fetchReminders(patient?.id);
    };

    return (
        <div
            style={{
                cursor: "pointer",
                marginTop: "6px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "10px",
            }}
            onClick={handleSelectPatient}
            className="Member"
        >
            <div className="MemberStatus offline" />
            {patient.firstName + " " + patient.lastName}
        </div>
    );
};

const Search = () => {
    const [searchLabel, setSearchLabel] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchTermChange = (e) => {
        e.preventDefault();

        let value = e.target.value;

        setSearchTerm(value);
    };

    const handleSearchLabelChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setSearchLabel(value);
    };

    const handleSearch = (e) => {
        e.preventDefault();

        // const result = patients?.filter((patient) =>
        //     patient[searchLabel].startsWith(searchTerm)
        // );

        // setFilteredpatients(result);
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
                        <InputAdornment position="end">
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

const mapStateToProps = (state) => {
    return {
        businessId: state.business.businessId,
    };
};

export default connect(mapStateToProps, {})(Members);
