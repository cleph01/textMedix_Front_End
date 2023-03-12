import { useState } from "react";

import TextLogo from "../../../assets/logo/textMedix_Text_Logo.jpg";
import { Button, Grid, TextField, Link } from "@mui/material";
import styled from "styled-components";

import { register } from "../../../redux/practice/actions/authActions";

import { connect } from "react-redux";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../utils/db/firebaseConfig";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 375px;
`;

const Header = styled.h3`
    text-align: center;
    margin-top: -15px;
`;

const Logo = styled.div`
    img {
        width: 350px;
        height: auto;
    }
`;

const Subscription = ({ setIsNewAccount, register, message, user }) => {
    console.log("user: ", user);
    // const app = getApp();
    // const payments = getStripePayments(app, {
    //     productsCollection: "products",
    //     customersCollection: "users",
    // });

    const handleSubscribe = async () => {
        //     const session = await createCheckoutSession(payments, {
        //         price: "price_1MkCF9LmipqRMDP1kjIwQTHT",
        //         mode: "subscription",
        //     });
        //     window.location.assign(session.url);
        //     const checkoutSession = {
        //         mode: "subscription",
        //         price: "price_1MkCF9LmipqRMDP1kjIwQTHT",
        //         success_url: window.location.origin,
        //         cancel_url: window.location.origin,
        //     };

        // const docRef = await db
        //     .collection("customers")
        //     .doc(user.userId)
        //     .collection("checkout_sessions")
        //     .add(checkoutSession);

        // Add a new document with a generated id.
        const docRef = await addDoc(
            collection(db, `users/${user.id}/checkout_sessions`),
            {
                price: "price_1MkCF9LmipqRMDP1kjIwQTHT", // price id from you products price in the stripe dashboard
                // success_url: window.location.origin, // return user to this screen on successful purchase
                // cancel_url: window.location.origin, // return user to this screen on failes purchase
                success_url: "http:localhost:3000/register/success",
                cancel_url: "http:localhost:3000/register/error",
            }
        );

        console.log("stripe docRef: ", docRef);

        // Wait for the CheckoutSession to get attached by the extension
        onSnapshot(docRef, (snap) => {
            console.log("stripe snap: ", snap);
            const { error, url } = snap.data();
            if (error) {
                // Show an error to your customer and then inspect your function logs.
                alert(`An error occured: ${error.message}`);
            }
            if (url) {
                window.location.assign(url);
            }
        });

        // Wait for the CheckoutSession to get attached by the extension

        // if (docRef.id) {
        //     // We have a session, let's redirect to Checkout
        //     // Init Stripe
        //     const stripe = loadStripe(
        //         "pk_test_51MjtMsLmipqRMDP1KsY7NFeGCcYpScuRbWfWkJUDoju8wTbjypNG2eJwoS5cNYAfIGura3kYePoMqacpdZqQ8vsq00jLWcZAUf"
        //     );
        //     await stripe.redirectToCheckout({ sessionId: docRef.id });
        // }
        // docRef.onSnapshot(async (snap) => {
        //     const { error, sessionId } = snap.data();

        //     if (error) {
        //         // Show an error to your customer and inspect
        //         // Your cloud function logs in the Firebase console
        //         alert("An error occurred: ", error.message);
        //     }

        //     if (sessionId) {
        //         // We have a session, let's redirect to Checkout
        //         // Init Stripe
        //         const stripe = loadStripe(
        //             "pk_test_51MjtMsLmipqRMDP1KsY7NFeGCcYpScuRbWfWkJUDoju8wTbjypNG2eJwoS5cNYAfIGura3kYePoMqacpdZqQ8vsq00jLWcZAUf"
        //         );
        //         await stripe.redirectToCheckout({ sessionId });
        //     }
        // });
    };

    return (
        <Container>
            <Wrapper>
                <Logo>
                    <img src={TextLogo} alt="logo" />
                </Logo>
                <Header>$150 / month</Header>

                <Button
                    disabled={false}
                    onClick={handleSubscribe}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Subscribe
                </Button>
                {message && (
                    <p
                        style={{
                            border: "1px solid red",
                            color: "red",
                            padding: "10px",
                        }}
                    >
                        {message}
                    </p>
                )}
            </Wrapper>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        message: state.message.message,
    };
};

export default connect(mapStateToProps, {})(Subscription);
