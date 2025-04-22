// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAn2scQBdmqlBq9Zz26t_Q39SbaJhdRX1E",
    authDomain: "forsah-3fad5.firebaseapp.com",
    projectId: "forsah-3fad5",
    storageBucket: "forsah-3fad5.firebasestorage.app",
    messagingSenderId: "941114687602",
    appId: "1:941114687602:web:05eeb7c66c118a9bad42eb"
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
export const storage = getStorage(firebase);