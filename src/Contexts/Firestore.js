import { getFirestore, doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { app } from "./Firebase";

const db = getFirestore(app);

// Function to extract the recipe title
const extractTitle = (recipeHtml) => {
    const regex = /<p>.*?the recipe for\s+(.+?)(?=\s*<\/p>)/i;
    const match = recipeHtml.match(regex);

    if (match) {
        let title = match[1].trim();

        const adjectives = [
            "a", "an", "the", "delectable", "delicious", "delightful","dish called", "mouthwatering", "mouth-watering", "tasty", "amazing", "scrumptious",
            "hearty", "spicy", "savory", "crispy", "juicy", "fluffy", "rich", "succulent",
            "flavorful", "creamy", "zesty", "heavenly"
        ];

        while (adjectives.some(adj => title.toLowerCase().startsWith(adj + " "))) {
            title = title.replace(new RegExp("^(" + adjectives.join("|") + ")\\s+", "i"), "");
        }

        title = title.replace(/[:.!]+$/, '').trim();
        return title;
    }

    return "Untitled Recipe"; 
};

// Check if a recipe is already saved
export const isRecipeSaved = async (userId, finalRecipe) => {
    try {
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const savedRecipes = docSnap.data().recipes || [];
            return savedRecipes.some(recipe => recipe.recipe === finalRecipe);
        }
        return false;
    } catch (error) {
        console.error("Error checking if recipe is saved:", error);
        return false;
    }
};

// Save a recipe to Firestore (prevents duplicates)
export const saveRecipe = async (userId, finalRecipe) => {
    try {
        const recipeTitle = extractTitle(finalRecipe);
        const recipeId = uuidv4();

        const recipeData = {
            title: recipeTitle,
            recipe: finalRecipe,
            recipeId: recipeId
        };

        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const savedRecipes = docSnap.data().recipes || [];

            if (savedRecipes.some(recipe => recipe.recipe === finalRecipe)) {
                console.log("Recipe already saved.");
                return;
            }

            await updateDoc(userRef, {
                recipes: arrayUnion(recipeData)
            });
        } else {
            await setDoc(userRef, {
                recipes: [recipeData]
            });
        }

        console.log("Recipe saved successfully!");
    } catch (error) {
        console.error("Error saving recipe:", error);
    }
};

// Remove a saved recipe from Firestore
export const deleteRecipe = async (userId, finalRecipe) => {
    try {
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) return;

        const savedRecipes = docSnap.data().recipes || [];
        const recipeToRemove = savedRecipes.find(recipe => recipe.recipe === finalRecipe);

        if (recipeToRemove) {
            await updateDoc(userRef, {
                recipes: arrayRemove(recipeToRemove)
            });
            console.log("Recipe removed successfully!");
        }
    } catch (error) {
        console.error("Error removing recipe:", error);
    }
};

export { db };

