import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDJ01L9Vo1VPx1LW2OUOvxeHZ05dyfgelE",
  authDomain: "my-first-project-raf.firebaseapp.com",
  databaseURL:
    "https://my-first-project-raf-default-rtdb.firebaseio.com",
  projectId: "my-first-project-raf",
  storageBucket:
    "my-first-project-raf.firebasestorage.app",
  messagingSenderId: "361432889853",
  appId:
    "1:361432889853:web:489a0f93b99893da858194",
  measurementId: "G-Z16FNRLP2G"
};

export const app = initializeApp(firebaseConfig);

export const API_KEY = firebaseConfig.apiKey;

export const DATABASE_URL =
  firebaseConfig.databaseURL;

// Google Client ID yahan baad me add karna
export const GOOGLE_CLIENT_ID =
  "361432889853-imhs5iuv4sfvskqv8i2je2jl2r328la4.apps.googleusercontent.com";


