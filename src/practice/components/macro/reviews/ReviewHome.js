import { useState } from "react";

import styled from "styled-components";

import SideBarFilter from "../../micro/reviews/SideBarFilter";

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
    padding: 8px;
    border-left: 1px solid #eee;
    width: 200px;
`;

const Body = styled.section`
    display: flex;
    flex-direction: column;
`;

const ReviewHome = () => {
    const [selectedPatient, setSelectedPatient] = useState({});

    const practiceId = "fpVAtpBjJLPUanlCydra";

    return (
        <Container>
            <MainSection>
                <Header />
                <Body>
                    <Review />
                    <Review />
                    <Review />
                    <Review />
                </Body>

                {/* <AutoFillReminders /> */}
            </MainSection>
            <RightSidebar>
                <SideBarFilter practiceId={practiceId} />
            </RightSidebar>
        </Container>
    );
};

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;

    padding: 10px 20px;
    font-weight: bold;
    border-bottom: solid 1px #ccc;
`;

const All = styled.div`
    font-weight: bold;
`;
const NeedsResponse = styled.div`
    color: #e1e1e1;
    margin-left: 10px;
`;

const Recipient = styled.div``;

const Header = () => {
    return (
        <HeaderContainer>
            <All>All Reviews</All>
            <NeedsResponse>Needs Responses</NeedsResponse>
        </HeaderContainer>
    );
};

const Review = () => {
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
            <div style={{ display: "flex", width: "50%" }}>
                <div style={{ fontWeight: "bold" }}>display name</div>
                <div style={{ display: "flex", marginLeft: "10px" }}>
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
                </div>
            </div>

            <div style={{ margin: "10px 0px" }}>
                text text text text text text text text text text text text text
                text text text text text text text text text text text text text
                text text text text text text text text text text text text text
                text text text text text
            </div>
            <div style={{ display: "flex", flex: 1 }}>
                <input style={{ flex: "1" }} type="text" />
                <button
                    style={{
                        background: "blue",
                        width: "75px",
                        marginLeft: "5px",
                        color: "#eee",
                        padding: "6px",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Reply
                </button>
            </div>
        </div>
    );
};

export default ReviewHome;
