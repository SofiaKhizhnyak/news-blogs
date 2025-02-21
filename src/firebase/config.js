import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvVhAMK49wXgyff8IqV7ozREQXp6ExNOg",
  authDomain: "newsandblogs-c3dcc.firebaseapp.com",
  projectId: "newsandblogs-c3dcc",
  storageBucket: "newsandblogs-c3dcc.firebasestorage.app",
  messagingSenderId: "841693659817",
  appId: "1:841693659817:web:c0618896f6315b6399dfb8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
