import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useRecipeStatus } from "./RecipeStatus";
import { useIngredientContext } from './IngredientContext';

// Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyA79zL44p6MhrQdoQu7EQMLB_a6oCgDapc",
//     authDomain: "fridge-raider.firebaseapp.com",
//     projectId: "fridge-raider",
//     storageBucket: "fridge-raider.firebasestorage.app",
//     messagingSenderId: "868922017790",
//     appId: "1:868922017790:web:c4ee9cee12d1def02a22af",
//     measurementId: "G-RWHSB098BS"
// };
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Create Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); //User id is user.uid
    const { setRecipeStatus } = useRecipeStatus();
    const { setIngredientArray } = useIngredientContext();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
        } catch (error) {
            console.error("Error during Google sign-in:", error);
        }
    };

    const signOutUser = async () => {
        try {
            await signOut(auth);
            setRecipeStatus("progress");
            setIngredientArray([]);
            setUser(null);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, signOutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);