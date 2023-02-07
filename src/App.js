import { useState } from "react";

import { useFirestoreDocument } from "@react-query-firebase/firestore";

import LeftSideBar from "./practice/components/layout/LeftSideBar";

import Main from "./practice/components/layout/Main";

import { PracticeContext } from "./practice/contexts/PracticeContext";
import { getPractice } from "./practice/dataModels/practice/practiceModel";

import styled from "styled-components";

import { getAuth, signInWithEmailAndPassword } from "./utils/db/firebaseConfig";

import TextLogo from "./assets/logo/textMedix_Text_Logo.jpg";

const AppMain = styled.main`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
`;

function App() {
    const [user, setUser] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const auth = getAuth();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSignInEmail = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            setUser(userCredential.user);
        } catch (error) {
            console.log("Error Code: ", error.code, error.message);
        }
    };

    const practiceId = "Sk2WVueweMIQjWOa98ZJ";

    const practiceRef = getPractice(practiceId);

    // Provide the query to the hook
    const query = useFirestoreDocument(["practice"], practiceRef);

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    const practice = query.data;

    console.log("practice: ", practice.data());

    return user ? (
        <PracticeContext.Provider
            value={{ practiceId: practice.id, ...practice.data() }}
        >
            <AppMain>
                <LeftSideBar />

                <Main practiceId={practiceId} />
            </AppMain>
        </PracticeContext.Provider>
    ) : (
        <div>
            <h1>SignIn</h1>
            <img src={TextLogo} alt="logo" />
            <div>
                <input onChange={handleEmailChange} placeholder="email" />
                <input onChange={handlePasswordChange} placeholder="password" />
            </div>
            <button onClick={handleSignInEmail}>Sign in with Email</button>
        </div>
    );
}

export default App;
