import { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { fetchUser } from "../../../../redux/practice/actions/authActions";
import { setBusiness } from "../../../../redux/practice/actions/businessProfileActions";
import Subscription from "../../payments/Subscription";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
`;

const DetailsWrapper = styled.article`
    width: 500px;
    border-radius: 10px;
`;

function HomeBody({ business, businessId, setBusiness }) {
    console.log("business at hombody: ", business, businessId);
    useEffect(() => {
        console.log("Useeffect at homebody");
        setBusiness(businessId);
        // fetchUser()
    }, [businessId]);

    if (business?.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <h1>
                Welcome {business?.practiceName}!! Help your patients help you
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

            <Subscription />

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

const mapStateToProps = (state) => {
    return {
        business: state.business.business,
        businessId: state.business.businessId,
    };
};

export default connect(mapStateToProps, { setBusiness })(HomeBody);
