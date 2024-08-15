import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDs893U_CrYa9vf7BQgJ0W2_0G3WUJCxcw",
  authDomain: "my-app-tictactoe-game.firebaseapp.com",
  projectId: "my-app-tictactoe-game",
  storageBucket: "my-app-tictactoe-game.appspot.com",
  messagingSenderId: "633554043010",
  appId: "1:633554043010:web:835ef2e0895232c94eb49b",
  measurementId: "G-6SVZ3G5YLN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db};