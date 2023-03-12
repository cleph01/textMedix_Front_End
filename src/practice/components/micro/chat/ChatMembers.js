import { useState } from "react";

import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
} from "@mui/material";

import {
    useGetPracticePatients,
    createChannelFromMember,
} from "../../../dataModels/practice/practiceModel";

import SearchIcon from "@mui/icons-material/Search";

import { connect } from "react-redux";

function Members({ businessId }) {
    const [filteredPatientList, setFilteredPatientList] = useState();

    const patientList = useGetPracticePatients(businessId);

    if (!patientList) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Search
                patientList={patientList}
                setFilteredPatientList={setFilteredPatientList}
            />
            <div>
                {filteredPatientList
                    ? filteredPatientList?.map((patient, i) => (
                          <Patient
                              key={i}
                              patient={patient}
                              practiceId={businessId}
                          />
                      ))
                    : patientList?.map((patient, i) => (
                          <Patient
                              key={i}
                              patient={patient}
                              practiceId={businessId}
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

const Patient = ({ patient, practiceId }) => {
    return (
        <div
            style={{
                cursor: "pointer",
                marginTop: "6px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "10px",
            }}
            onClick={() =>
                createChannelFromMember(
                    practiceId,
                    patient.id,
                    patient.cellPhone
                )
            }
            className="Member"
        >
            <div className="MemberStatus offline" />
            {patient.firstName + " " + patient.lastName}
        </div>
    );
};

const Search = ({ setFilteredPatientList, patientList }) => {
    const [searchLabel, setSearchLabel] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchTermChange = (e) => {
        e.preventDefault();

        let value = e.target.value;

        if (value === "") {
            setFilteredPatientList(patientList);
        }

        setSearchTerm(value);
    };

    const handleSearchLabelChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setSearchLabel(value);
    };

    const handleSearch = (e) => {
        // e.preventDefault();

        const result = patientList?.filter((patient) =>
            patient[searchLabel]
                .toLowerCase()
                .startsWith(
                    searchLabel === "cellPhone"
                        ? "+1" + searchTerm
                        : searchTerm.toLowerCase()
                )
        );

        setFilteredPatientList(result);
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
                    <MenuItem value={"cellPhone"}>Cell Number</MenuItem>
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
