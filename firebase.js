import { initializeApp } from "firebase/app";
import * as firestore from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXT1hZqqhARm1-z_vR-apuESZSEIipBgc",
  authDomain: "practice-e00a8.firebaseapp.com",
  projectId: "practice-e00a8",
  storageBucket: "practice-e00a8.appspot.com",
  messagingSenderId: "725448911246",
  appId: "1:725448911246:web:55019e69d4599e5e649cdf",
  measurementId: "G-3F8M0H1NG6",
};

const app = initializeApp(firebaseConfig);
const db = firestore.getFirestore(app);

export { db, firestore };
