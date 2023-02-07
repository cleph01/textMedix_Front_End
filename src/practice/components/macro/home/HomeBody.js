import { useFirestoreDocument } from "@react-query-firebase/firestore";
import styled from "styled-components";
import { getPractice } from "../../../dataModels/practice/practiceModel";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
`;

const DetailsWrapper = styled.article`
    width: 500px;
    border-radius: 10px;
`;

function HomeBody() {
    const practiceId = "fpVAtpBjJLPUanlCydra";

    // Access the client
    const queryRef = getPractice(practiceId);

    // Provide the query to the hook
    const query = useFirestoreDocument(["practice"], queryRef);

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    const practice = query.data;

    return (
        <Container>
            <h1>
                Welcome {practice.practiceName}!! Help your patients help you
                grow your practice.
            </h1>
            <h2>
                Modern Easy-to-use tools to help patients reach, promote, and
                help YOU grow.
            </h2>
            <div>
                <h3>Attract more patients and keep them coming back.</h3>
                <h4>Reviews</h4>
                Improve your reputation
                <h4>Website to SMS Chat</h4> Capture website leads Text
                Marketing Grow with text campaigns patient <h4>ShoutOuts</h4>{" "}
                Promotes you to their inner circle
            </div>

            {/* <img
                src="https://cms.podium.com/wp-content/uploads/2022/04/HN-Homepage-2.gif"
                alt="texting"
            />
            <img
                src="https://cms.podium.com/wp-content/uploads/2022/03/HN-Homepage-1.gif"
                alt="reviews"
            /> */}
        </Container>
    );
}

export default HomeBody;
