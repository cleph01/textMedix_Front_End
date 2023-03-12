import { useState } from "react";

import { Link, Route, Switch, useParams, useHistory } from "react-router-dom";
import {
    Avatar,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    ListItemAvatar,
    MenuItem,
    OutlinedInput,
    Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";

import {
    practicePatientListQuery,
    getPatient,
    getPatientRef,
    getPatients,
    useGetPracticePatients,
    useGetDoc,
} from "../../../dataModels/practice/practiceModel";

import AddPatient from "../../micro/patients/AddPatient";
import {
    useFirestoreDocument,
    useFirestoreDocumentData,
    useFirestoreQueryData,
} from "@react-query-firebase/firestore";
import { connect } from "react-redux";

const Container = styled.div`
    display: flex;
    flex: 1;
    height: 100%;
`;

const MainSection = styled.section`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-right: 10px;
`;

const RightSidebar = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-left: 1px solid #eee;
    width: 450px;
`;

const Body = styled.section`
    display: flex;
    flex-direction: column;
    overflow: scroll;
`;

const AllPatientsHome = ({ businessId }) => {
    const [filteredPatientList, setFilteredPatientList] = useState(null);

    const patientList = useGetPracticePatients(businessId);

    if (!patientList) {
        return <div>Loading...</div>;
    }

    console.log("patientList: ", patientList);
    return (
        <Container>
            <Switch>
                <Route path="/practice/patients/add">
                    <AddPatient />
                </Route>
                <Route path="/practice/patients">
                    <MainSection>
                        <Body>
                            <Header
                                patientList={patientList}
                                filteredPatientList={filteredPatientList}
                                setFilteredPatientList={setFilteredPatientList}
                            />
                            {filteredPatientList
                                ? filteredPatientList?.map((patient, i) => (
                                      <Patient key={i} patient={patient} />
                                  ))
                                : patientList?.map((patient, i) => (
                                      <Patient key={i} patient={patient} />
                                  ))}
                        </Body>
                    </MainSection>
                    <RightSidebar>
                        <Switch>
                            <Route path="/practice/patients/:patientId">
                                <div
                                    style={{
                                        width: "100%",
                                        display: "grid",
                                        placeItems: "center",
                                    }}
                                >
                                    <PatientWindow businessId={businessId} />
                                </div>
                            </Route>
                            <Route path="/practice/patients">
                                <div
                                    style={{
                                        width: "100%",
                                        display: "grid",
                                        placeItems: "center",
                                    }}
                                >
                                    <h3>Selected Patient</h3>
                                    <Avatar
                                        alt="Charlie"
                                        src="https://placekitten.com/64/64"
                                        sx={{ width: 76, height: 76 }}
                                    />
                                    <h4>Display Name: Charlie Montoya</h4>
                                    <div style={{ display: "flex" }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    margin: "10px 0px",
                                                }}
                                            >
                                                First Name: John
                                            </div>
                                            <div
                                                style={{
                                                    margin: "10px 0px",
                                                }}
                                            >
                                                Last Name: Doe
                                            </div>
                                            <div
                                                style={{
                                                    margin: "10px 0px",
                                                }}
                                            >
                                                cellNumber: 555.555.5555
                                            </div>
                                            <div
                                                style={{
                                                    margin: "10px 0px",
                                                }}
                                            >
                                                email: email@email.com
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    margin: "10px 0px",
                                                }}
                                            >
                                                Current Groups:
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Route>
                        </Switch>
                    </RightSidebar>
                </Route>
            </Switch>
        </Container>
    );
};

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 10px 20px;
    font-weight: bold;
    border-bottom: solid 1px #ccc;
`;

const Header = ({
    patientList,
    filteredPatientList,
    setFilteredPatientList,
}) => {
    const history = useHistory();

    return (
        <HeaderContainer>
            <Search
                patientList={patientList}
                filteredPatientList={filteredPatientList}
                setFilteredPatientList={setFilteredPatientList}
            />
            <div
                style={{ cursor: "pointer", marginLeft: "35px" }}
                onClick={() => history.push("/practice/patients/add")}
            >
                Add Patient
            </div>
        </HeaderContainer>
    );
};

const PatientWindow = ({ businessId }) => {
    const { patientId } = useParams();

    const patient = useGetDoc(`practice/${businessId}/patients/${patientId}`);

    if (!patient) {
        return <div>Loading...</div>;
    }

    console.log("Patient at patien home: ", patient);

    const patientData = patient.data;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "16px",
            }}
        >
            <h3>Selected Patient</h3>
            <Avatar
                alt="Charlie"
                src="https://placekitten.com/64/64"
                sx={{ width: 76, height: 76 }}
            />
            <h4>
                Display Name:{" "}
                {patientData.firstName + " " + patientData.lastName}
            </h4>
            <div style={{ display: "flex" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div style={{ margin: "10px 0px" }}>
                        First Name: {patientData.firstName}
                    </div>
                    <div style={{ margin: "10px 0px" }}>
                        Last Name: {patientData.lastName}
                    </div>
                    <div style={{ margin: "10px 0px" }}>
                        cellNumber: {patientData.cellPhone}
                    </div>
                    <div style={{ margin: "10px 0px" }}>email: 'email'</div>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div style={{ margin: "10px 0px" }}>Current Groups:</div>
                </div>
            </div>
        </div>
    );
};

const Patient = ({ patient }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #454545",
                borderRadius: "3px",
                margin: "10px",
                padding: "10px",
            }}
        >
            <Link
                to={`/practice/patients/${patient.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
            >
                <div style={{ display: "flex", width: "50%" }}>
                    <ListItemAvatar>
                        <Avatar
                            alt="Charlie"
                            src="https://placekitten.com/64/64"
                        />
                    </ListItemAvatar>
                    <div style={{ fontWeight: "bold" }}>
                        {patient.displayName}
                    </div>
                    {/* <div style={{ display: "flex", marginLeft: "10px" }}>
                        <div
                            style={{
                                backgroundColor: "transparent",
                                color: "#ffd700",
                            }}
                        >
                            &#9733;
                        </div>
                        <div
                            style={{
                                backgroundColor: "transparent",
                                color: "#ffd700",
                            }}
                        >
                            &#9733;
                        </div>
                        <div
                            style={{
                                backgroundColor: "transparent",
                                color: "#ffd700",
                            }}
                        >
                            &#9733;
                        </div>
                        <div
                            style={{
                                backgroundColor: "transparent",
                                color: "#ffd700",
                            }}
                        >
                            &#9733;
                        </div>
                        <div
                            style={{
                                backgroundColor: "transparent",
                                color: "#ccc",
                            }}
                        >
                            &#9733;
                        </div>
                    </div> */}
                </div>
                <div style={{ display: "flex", marginTop: "10px" }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div style={{ margin: "10px 0px" }}>
                            First Name: {patient.firstName}
                        </div>
                        <div style={{ margin: "10px 0px" }}>
                            Last Name: {patient.lastName}
                        </div>
                        <div style={{ margin: "10px 0px" }}>
                            cellNumber: {patient.cellPhone.slice(2)}
                        </div>
                        <div style={{ margin: "10px 0px" }}>
                            email: member.email
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div>Current Groups:</div>
                    </div>
                </div>
            </Link>
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
                .startsWith(searchTerm.toLowerCase())
        );

        setFilteredPatientList(result);
    };

    return (
        <div style={{ display: "flex", width: "100%" }}>
            <FormControl sx={{ width: "160px" }}>
                <InputLabel id="search-label">Search By: </InputLabel>
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
            <FormControl sx={{ ml: "3px", width: "100%" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                    Search
                </InputLabel>
                <OutlinedInput
                    sx={{ width: "100%" }}
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

export default connect(mapStateToProps, {})(AllPatientsHome);
