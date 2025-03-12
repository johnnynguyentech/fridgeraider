import React, { useContext, useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useFinalRecipe } from '../Contexts/FinalRecipe';
import { useIngredientContext } from '../Contexts/IngredientContext';
import { useRecipeStatus } from '../Contexts/RecipeStatus';
import { useAuth } from "../Contexts/AuthContext";
import { saveRecipe, deleteRecipe, isRecipeSaved } from "../Contexts/Firestore";

function Recipe() {
    const { finalRecipe } = useFinalRecipe();
    const { setIngredientArray } = useIngredientContext();
    const { setRecipeStatus } = useRecipeStatus();
    const { user, signInWithGoogle } = useAuth();

    const [isSaved, setIsSaved] = useState(false);
    const [recipeToSave, setRecipeToSave] = useState(null);

    useEffect(() => {
        if (user) {
            checkIfRecipeIsSaved();
        }
    }, [user, finalRecipe]);

    const checkIfRecipeIsSaved = async () => {
        if (user) {
            const saved = await isRecipeSaved(user.uid, finalRecipe);
            setIsSaved(saved);
        }
    };

    const handleSaveOrRemoveRecipe = async () => {
        if (!user) {
            // Store the recipe to save for when the user logs in
            setRecipeToSave(finalRecipe);
            signInWithGoogle();
            return;
        }

        if (isSaved) {
            await deleteRecipe(user.uid, finalRecipe);
        } else {
            await saveRecipe(user.uid, finalRecipe);
        }
        setIsSaved(!isSaved);
    };

    useEffect(() => {
        if (user && recipeToSave) {
            // Save the recipe after the user logs in
            saveRecipe(user.uid, recipeToSave).then(() => {
                setIsSaved(true); // Update the button state to show as saved
                setRecipeToSave(null); // Clear the saved recipe to avoid resaving
            });
        }
    }, [user, recipeToSave]); // This effect will run once the user logs in
    

    const handleStartOver = () => {
        setRecipeStatus("progress");
        setIngredientArray([]);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: {
            xs: '70vh', // mobile
            md: '80vh'  // desktop
        } }} className="InputForm">
            <div className="RecipeContainer poppins-regular" style={{ flex: '1', overflowY: 'auto', padding: '24px 36px', borderRadius: "5px", margin: "15px 0" }}>
                <div className='recipe-steps poppins-regular' dangerouslySetInnerHTML={{ __html: finalRecipe }} />
            </div>
            <div className="RestartContainer" style={{ borderTop: '1px solid #ddd' }}>
                <Button
                    fullWidth
                    className="poppins-regular"
                    variant="contained"
                    size="large"
                    sx={{
                        color: '#2e2e2e',
                        backgroundColor: 'white',
                        borderRadius: "5px",
                        height: '44px',
                        fontSize: '16px',
                        fontWeight: '500',
                        textTransform: "none",
                        mt: 2,
                        '&:hover': {
                            backgroundColor: '#cfcfcf',
                        }
                    }}
                    onClick={handleSaveOrRemoveRecipe}
                >
                    {isSaved ? "Saved ✅" : "Save Recipe"} 
                </Button>
                <Button
                    fullWidth
                    className="poppins-regular"
                    variant="contained"
                    size="large"
                    sx={{
                        color: 'black',
                        backgroundColor: '#EBB434',
                        borderRadius: "5px",
                        height: '44px',
                        fontSize: '16px',
                        fontWeight: '500',
                        textTransform: "none",
                        mt: 1,
                        '&:hover': {
                            backgroundColor: '#c7982c',
                        }
                    }}
                    onClick={handleStartOver}
                >
                    Start Over
                </Button>
            </div>
        </Box>
    );
}

export default Recipe;
