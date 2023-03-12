import { useEffect } from "react";
import { connect } from "react-redux";
import { fetchSubscriberStatus } from "../../../redux/practice/actions/authActions";

function PaymentSuccess({ user }) {
    useEffect(() => {
        const updatedUser = fetchSubscriberStatus(user.id);

        console.log("UpdatedUser at success page: ", updatedUser);
    }, [user]);

    return <div>PaymentSuccess</div>;
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};

export default connect(mapStateToProps, { fetchSubscriberStatus })(
    PaymentSuccess
);
