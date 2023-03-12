import TextLogo from "../../../assets/logo/textMedix_Text_Logo.jpg";

import styled from "styled-components";

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
    width: 395px;
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

const NoReferral = () => {
    return (
        <Container>
            <Wrapper>
                <Logo>
                    <img src={TextLogo} alt="logo" />
                </Logo>
                <Header>
                    Referral Link Needed to Register - Please Reach Out to the
                    Administrator for the Referral Link.
                </Header>
            </Wrapper>
        </Container>
    );
};

export default NoReferral;
