import { createContext, useContext, useState, useEffect } from "react";
import { auth, provider } from "./Firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { useRecipeStatus } from "./RecipeStatus";
import { useIngredientContext } from './IngredientContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
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
