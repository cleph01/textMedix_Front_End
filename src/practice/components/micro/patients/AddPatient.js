import { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { IconButton, ListItem, ListItemText, TextField } from "@mui/material";
import Papa from "papaparse";
import Input from "@mui/material/Input";
import { Delete } from "@mui/icons-material";
import styled from "styled-components";

import CircularProgress from "@mui/material/CircularProgress";

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

const Body = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
`;

const AddPatient = () => {
    const hiddenFileInput = useRef(null);
    const [parsedData, setParsedData] = useState(null);
    const [loadingCSV, setLoadingCSV] = useState(false);

    const handleClick = (event) => {
        setLoadingCSV(true);
        hiddenFileInput.current.click();
    };

    const changeHandler = (event) => {
        // console.log(event.target.files[0]);
        // Passing file data (event.target.files[0]) to parse using Papa.parse
        Papa.parse(event.target.files[0], {
            header: true,
            delimiter: ",",
            skipEmptyLines: true,
            complete: function (results) {
                console.log("pre parsed data: ", results.data);
                // Parsed Data Response in array format

                // Data Validation : check csv file column headers are correct
                const headers = [
                    "firstName",
                    "cellPhone",
                    "lastName",
                    "displayName",
                ];
                const parsedHeaderSet = new Set(Object.keys(results.data[0]));
                console.log("File First Row: ", Object.keys(results.data[0]));
                console.log("Parsed Header Set: ", parsedHeaderSet);
                if (parsedHeaderSet.size !== headers.length) {
                    alert("Column Header Size");
                } else {
                    for (let header of headers) {
                        if (!parsedHeaderSet.has(header)) {
                            alert("Incorrect Headers Format");
                        } else {
                            console.log("Parsed First row: ", parsedHeaderSet);
                            setParsedData(results.data);
                            setLoadingCSV(false);
                        }
                    }
                }
            },
        });
    };
    console.log("Parsed CSV: ", parsedData);

    const handleDeleteFromUpload = () => {
        alert("delete");
    };

    return (
        <Container>
            <MainSection>
                <Header />
                <Body>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-around",
                            marginTop: "20px",
                            width: "75%",
                            height: "50%",
                        }}
                    >
                        <h3>Add A New Patient</h3>
                        <TextField
                            sx={{ margin: "0px 3px", width: "60%" }}
                            onChange={() => {}}
                            value=""
                            id="scratchpad"
                            label="First Name"
                            variant="outlined"
                            name="firstName"
                        />
                        <TextField
                            sx={{ margin: "0px 3px", width: "60%" }}
                            onChange={() => {}}
                            value=""
                            id="scratchpad"
                            label="Last Name"
                            variant="outlined"
                            name="lastName"
                        />

                        <TextField
                            sx={{ margin: "0px 3px", width: "60%" }}
                            onChange={() => {}}
                            value=""
                            id="scratchpad"
                            label="Cell Phone"
                            variant="outlined"
                            name="cellphone"
                        />
                        <TextField
                            sx={{ margin: "0px 3px", width: "60%" }}
                            onChange={() => {}}
                            value=""
                            id="scratchpad"
                            label="Email"
                            variant="outlined"
                            name="email"
                        />
                        <div
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                padding: "10px",
                                boxShadow: "5px 5px 5px rgba(68, 68, 68, 0.6)",
                                marginRight: "10px",
                            }}
                        >
                            Submit
                        </div>
                    </div>
                    <div style={{ marginTop: "50px" }}>
                        {/* File Uploader */}
                        <input
                            ref={hiddenFileInput}
                            type="file"
                            name="file"
                            accept=".csv"
                            onChange={changeHandler}
                            style={{ display: "none", margin: "10px auto" }}
                        />
                    </div>
                    <div
                        onClick={handleClick}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            padding: "10px",
                            boxShadow: "5px 5px 5px rgba(68, 68, 68, 0.6)",
                            marginRight: "10px",
                            cursor: "pointer",
                        }}
                    >
                        {loadingCSV ? (
                            <CircularProgress size={20} />
                        ) : (
                            "Choose File"
                        )}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "20px",
                            width: "700px",
                            maxHeight: "300px",
                            overflowY: "scroll",
                        }}
                    >
                        {parsedData?.map((newPatient, i) => (
                            <ListItem
                                key={i}
                                style={{
                                    border: "1px solid #ccc",
                                    marginBottom: " 6px",
                                }}
                                alignItems="flex-start"
                                secondaryAction={
                                    <IconButton
                                        aria-label="comment"
                                        sx={{ cursor: "pointer" }}
                                        onClick={handleDeleteFromUpload}
                                    >
                                        <Delete />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary={`First: ${newPatient.firstName} Last: ${newPatient.lastName}`}
                                    secondary={`Display: ${newPatient.displayName} Cell: ${newPatient.cellPhone}`}
                                />
                            </ListItem>
                        ))}
                        {parsedData && (
                            <div
                                onClick={handleClick}
                                style={{
                                    marginBottom: "10px",
                                    width: "50px",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    padding: "10px",
                                    boxShadow:
                                        "5px 5px 5px rgba(68, 68, 68, 0.6)",
                                    cursor: "pointer",
                                }}
                            >
                                Upload
                            </div>
                        )}
                    </div>
                </Body>
            </MainSection>
        </Container>
    );
};

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    font-weight: bold;
    border-bottom: solid 1px #ccc;
`;

const Header = () => {
    const history = useHistory();
    return (
        <HeaderContainer>
            <div>Add a Patient</div>
            <div
                onClick={() => history.push("/practice/patients")}
                style={{ cursor: "pointer" }}
            >
                Back to Patient List
            </div>
        </HeaderContainer>
    );
};

export default AddPatient;
