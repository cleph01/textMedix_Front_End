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
import SmsIcon from "@mui/icons-material/Sms";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

import {
    useGetPracticePatients,
    useGetDoc,
    createChannel,
    getPatient,
    practicePatientListQuery,
} from "../../../dataModels/practice/practiceModel";

import SearchIcon from "@mui/icons-material/Search";

import {
    useFirestoreDocument,
    useFirestoreQueryData,
} from "@react-query-firebase/firestore";
import { connect } from "react-redux";

function Members({
    businessId,
    setSelectedPatient,
    manualEntries,
    setManualEntries,
    setOpenSelectedPatientModal,
}) {
    const patientList = useGetPracticePatients(businessId);

    if (!patientList) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Search />
            <div>
                {patientList?.map((patient, index) => (
                    <Member
                        key={index}
                        patient={patient}
                        businessId={businessId}
                        setSelectedPatient={setSelectedPatient}
                        manualEntries={manualEntries}
                        setManualEntries={setManualEntries}
                        setOpenSelectedPatientModal={
                            setOpenSelectedPatientModal
                        }
                    />
                ))}

                {/* <div
                    style={{ cursor: "pointer", marginTop: "6px" }}
                    className="Member"
                >
                    <div className="MemberStatus online" />
                    cleverbot
                </div> */}
            </div>
        </div>
    );
}

const Member = ({
    patient,
    businessId,
    setSelectedPatient,
    manualEntries,
    setManualEntries,
    setOpenSelectedPatientModal,
}) => {
    const handleAttachNumber = () => {
        if (
            manualEntries.some((entry) => entry.cellPhone === patient.cellPhone)
        ) {
            alert("Number Already Included");
        } else {
            setManualEntries((prev) => [
                ...prev,
                {
                    displayName: patient.firstName + " " + patient.lastName,
                    cellPhone: patient.cellPhone,
                },
            ]);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                marginTop: "6px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "10px",
            }}
            // onClick={() => setSelectedPatient(memberData.data())}
            className="Member"
        >
            <div className="MemberStatus offline">
                {patient.firstName + " " + patient.lastName}
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#1c76d2",
                }}
            >
                <SmsIcon
                    sx={{ marginRight: "10px" }}
                    onClick={handleAttachNumber}
                />
                <GroupAddIcon
                    sx={{ marginRight: "12px" }}
                    onClick={() => {
                        setSelectedPatient({
                            ...patient,
                            patientId: patient.id,
                        });
                        setOpenSelectedPatientModal(true);
                    }}
                />
            </div>
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

const mapStateToProps = (state) => {
    return {
        businessId: state.business.businessId,
    };
};

export default connect(mapStateToProps, {})(Members);
