// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBAl1ANunsjsv8FFUu3wu3kRfv4kngCEDc",
    authDomain: "textmedix.firebaseapp.com",
    databaseURL: "https://textmedix-default-rtdb.firebaseio.com",
    projectId: "textmedix",
    storageBucket: "textmedix.appspot.com",
    messagingSenderId: "82703550622",
    appId: "1:82703550622:web:ebee8e621cc3109a77538f",
    measurementId: "G-G5BQLPB7GM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore();

export { db, getAuth, signInWithEmailAndPassword,  };
