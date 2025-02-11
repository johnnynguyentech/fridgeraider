
import React, { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { db } from "../Contexts/Firestore";
import { doc, getDoc } from "firebase/firestore";
import { useFinalRecipe } from "../Contexts/FinalRecipe";
import { useRecipeStatus } from "../Contexts/RecipeStatus";

function Menu() {
    const { user, signInWithGoogle, signOutUser } = useAuth();
    const { setFinalRecipe } = useFinalRecipe();
    const { setRecipeStatus } = useRecipeStatus();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [savedRecipes, setSavedRecipes] = useState([]);

    useEffect(() => {
        const fetchSavedRecipes = async () => {
            if (!user) return;

            const userRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                setSavedRecipes(docSnap.data().recipes || []);
            }
        };

        fetchSavedRecipes();
    }, [user]); // Reload recipes when user logs in/out

    const handleRecipeClick = (recipe) => {
        setFinalRecipe(recipe.recipe); // Make sure you're passing the recipe content (steps, etc.)
        setRecipeStatus("complete"); // Set recipe status to "complete"
        setIsDropdownOpen(false);
    };

    return (
        <div className="Menu">
            {user && (
                <div className="dropdown">
                    <button className="dropdown-toggle" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        Saved Recipes ▼
                    </button>
                    {isDropdownOpen && (
                        <ul className="dropdown-menu">
                            {savedRecipes.length > 0 ? (
                                savedRecipes.map((recipe) => (
                                    <li key={recipe.recipeId} onClick={() => handleRecipeClick(recipe)}>
                                        {recipe.title}
                                    </li>
                                ))
                            ) : (
                                <li>No saved recipes</li>
                            )}
                        </ul>
                    )}
                </div>
            )}
            <button className="SignInButton" onClick={user ? signOutUser : signInWithGoogle}>
                {user ? "Sign Out" : "Sign In"}
            </button>
        </div>
    );
}

export default Menu;