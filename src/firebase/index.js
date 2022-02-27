// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCbiZ2V4fHBPjYE0ZKvQwoBpnYr91dqu4k",
    authDomain: "wikifamily-a2c39.firebaseapp.com",
    projectId: "wikifamily-a2c39",
    storageBucket: "wikifamily-a2c39.appspot.com",
    messagingSenderId: "63362121680",
    appId: "1:63362121680:web:a93cb9e058bb8fa5c9c3d5",
    measurementId: "G-2B2M52R0EC"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);