import fb from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";
import { getAnalytics } from "firebase/compat/analytics";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from "firebase/compat/app-check";

const firebaseApp = fb.initializeApp({
  apiKey: "AIzaSyChpqvN5Fmp_BgzANBqU_MvcSGTJWmGyB4",
  authDomain: "instagram-tribute.firebaseapp.com",
  projectId: "instagram-tribute",
  storageBucket: "instagram-tribute.appspot.com",
  messagingSenderId: "871713787286",
  appId: "1:871713787286:web:25f60316c0c79422cde1b7",
  measurementId: "G-WSGFNDVN65",
});

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LfVT1QdAAAAAEL2c9nss1hHfpHSNOnW2xHdwjkr"),
  isTokenAutoRefreshEnabled: true,
});

getAnalytics(firebaseApp);
appCheck(firebaseApp);

const db = firebaseApp.firestore();
const auth = fb.auth();
const storage = fb.storage();

export { db, auth, storage, fb };
