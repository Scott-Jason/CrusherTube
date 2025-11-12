// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider,
    onAuthStateChanged,
    User
 } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmZG5lull7VZ02KnHANsuDnpe5afRp7Bg",
  authDomain: "crusher--tube.firebaseapp.com",
  projectId: "crusher--tube",
  appId: "1:923174781789:web:c2bff8cf84f219ba231eb4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

//Initiliaze firebase auth
const auth = getAuth(app);

/**
 * Signs the user in with a Google popup.
 * @returns A promise that resolves with the user's credentials.
 */
export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}


//signs user out, returns @returns a prommise that resolves when the user signs out
export function signOut(){
    return auth.signOut();
}

/**
 * Trigger a callback when user auth state changes.
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}