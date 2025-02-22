// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import authentication module
import { getAnalytics } from "firebase/analytics"; // Analytics (optional)
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCze7YD4UO5Kx6zH5kkPwDhzg4FHJ9c_zg",
  authDomain: "my-chat-club.firebaseapp.com",
  projectId: "my-chat-club",
  storageBucket: "my-chat-club.firebasestorage.app",
  messagingSenderId: "590368891491",
  appId: "1:590368891491:web:0cb9da14b88ee2678e4e56",
  measurementId: "G-S1RLMK0WZ5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Optional, for analytics
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); 


export { auth, db }; // Export the auth instance to use in other parts of the app
