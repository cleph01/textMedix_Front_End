import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import TextLogo from "../../../assets/logo/textMedix_Text_Logo.jpg";
import { Button, Grid, TextField, Link } from "@mui/material";
import styled from "styled-components";

import { register } from "../../../redux/practice/actions/authActions";

import { connect } from "react-redux";
import { getAuthenticationStatus } from "../../../utils/db/firebaseConfig";
import Subscription from "../payments/Subscription";

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

const Register = ({ setIsNewAccount, register, message }) => {
    const history = useHistory();

    const { userEmail, businessId } = useParams();

    console.log(userEmail, businessId);

    const [creds, setCreds] = useState({
        firstName: "",
        lastName: "",
        email: userEmail,
        password: "",
    });

    const handleCredsChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setCreds({
            ...creds,
            [name]: value,
        });
    };

    const handleRegister = async () => {
        register(
            creds.firstName,
            creds.lastName,
            creds.email,
            creds.password,
            businessId
        );
    };

    return (
        <Container>
            <Wrapper>
                {!getAuthenticationStatus() ? (
                    <>
                        <Logo>
                            <img src={TextLogo} alt="logo" />
                        </Logo>
                        <Header>Register</Header>
                        <TextField
                            onChange={handleCredsChange}
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            autoComplete="firstName"
                            autoFocus
                        />
                        <TextField
                            onChange={handleCredsChange}
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="lastName"
                            autoFocus
                        />
                        <TextField
                            onChange={handleCredsChange}
                            value={userEmail}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            onChange={handleCredsChange}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />

                        <Button
                            disabled={false}
                            onClick={handleRegister}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                    </>
                ) : (
                    <>
                        <Subscription />

                        <Button
                            disabled={false}
                            onClick={() => history.push("/")}
                            type="success"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Go to Home Page
                        </Button>
                    </>
                )}

                <Grid container>
                    <Grid item xs>
                        <Link href="#" variant="body2">
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="/" variant="body2">
                            {"Already have an account? Sign In"}
                        </Link>
                    </Grid>
                </Grid>
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

export default connect(mapStateToProps, { register })(Register);
