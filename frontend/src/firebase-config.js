// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAe8ChZAHHnqayCKTYX_IkiO-6l8s742qU",
  authDomain: "first-project-67637.firebaseapp.com",
  projectId: "first-project-67637",
  storageBucket: "first-project-67637.appspot.com",
  messagingSenderId: "642816197732",
  appId: "1:642816197732:web:40d8b043ff9eb139a14b71",
  measurementId: "G-2FECJ2HPF9",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
