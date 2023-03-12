import { useState } from "react";
import { useHistory } from "react-router-dom";

import TextLogo from "../../../assets/logo/textMedix_Text_Logo.jpg";
import { Button, Grid, TextField, Link } from "@mui/material";
import styled from "styled-components";

import { login } from "../../../redux/practice/actions/authActions";
import { connect } from "react-redux";

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

const SignIn = ({ setIsNewAccount, login, message }) => {
    const history = useHistory();

    const [creds, setCreds] = useState({
        email: "",
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

    const handleSignIn = async () => {
        login(creds.email, creds.password);
    };

    return (
        <Container>
            <Wrapper>
                <Logo>
                    <img src={TextLogo} alt="logo" />
                </Logo>
                <Header>SignIn</Header>

                <TextField
                    onChange={handleCredsChange}
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
                    onClick={handleSignIn}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign In
                </Button>
                <Grid container>
                    <Grid item xs>
                        <Link href="#" variant="body2">
                            Forgot password?
                        </Link>
                    </Grid>
                    {/* <Grid item>
                        <div onClick={() => setIsNewAccount(true)}>
                            {"Don't have an account? Register"}
                        </div>
                    </Grid> */}
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

export default connect(mapStateToProps, { login })(SignIn);
