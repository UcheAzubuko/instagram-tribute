import fb from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseApp = fb.initializeApp({
  apiKey: "AIzaSyBpo1M-1md3-sYmsG8hy_BUcNX8BeLceJE",
  authDomain: "test-6a28e.firebaseapp.com",
  projectId: "test-6a28e",
  storageBucket: "test-6a28e.appspot.com",
  messagingSenderId: "1033856438695",
  appId: "1:1033856438695:web:4520ca6153860156dae682",
  measurementId: "G-B3WRBJHDZ3",
});

const db = firebaseApp.firestore();
const auth = fb.auth();
const storage = fb.storage();

export { db, auth, storage, fb };
