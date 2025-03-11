
import React, { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { db } from "../Contexts/Firestore";
import { doc, onSnapshot } from "firebase/firestore";
import { useFinalRecipe } from "../Contexts/FinalRecipe";
import { useRecipeStatus } from "../Contexts/RecipeStatus";

function Menu() {
    const { user, signInWithGoogle, signOutUser } = useAuth();
    const { setFinalRecipe } = useFinalRecipe();
    const { setRecipeStatus } = useRecipeStatus();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [savedRecipes, setSavedRecipes] = useState([]);

    useEffect(() => {
        // Only set up Firestore listener if the user is logged in
        let unsubscribe = () => {}; // Default to empty function for cleanup

        if (user) {
            const userRef = doc(db, "users", user.uid);
            unsubscribe = onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    setSavedRecipes(docSnap.data().recipes || []);
                }
            });
        }

        // Cleanup Firestore listener on unmount or when user logs out
        return () => {
            unsubscribe(); // Unsubscribing from Firestore listener if necessary
        };
    }, [user]); // Run the effect when the user changes

    const handleRecipeClick = (recipe) => {
        setFinalRecipe(recipe.recipe); // Make sure you're passing the recipe content (steps, etc.)
        setRecipeStatus("complete"); // Set recipe status to "complete"
        setIsDropdownOpen(false);
    };

    return (
        <div className="Menu">
            {user && (
                <div className="dropdown poppins-regular">
                    <button 
                        className="dropdown-toggle poppins-regular" 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <i class="fa-solid fa-chevron-down"></i> Saved Recipes
                    </button>
                    <ul 
                        className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}
                    >
                        {savedRecipes.length > 0 ? (
                            savedRecipes.map((recipe) => (
                                <li className="poppins-regular" key={recipe.recipeId} onClick={() => handleRecipeClick(recipe)}>
                                    {recipe.title.length > 30 ? `${recipe.title.slice(0, 30)}...` : recipe.title}
                                </li>
                            ))
                        ) : (
                            <li>No saved recipes</li>
                        )}
                    </ul>
                </div>
            )}
            <button className="SignInButton poppins-regular" onClick={user ? signOutUser : signInWithGoogle}>
                <i class="fa-solid fa-user"></i>{user ? "Sign Out" : "Sign In"}
            </button>
        </div>
    );
}

export default Menu;
