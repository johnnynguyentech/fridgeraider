import React, { useContext } from 'react';
import { Box, Button } from '@mui/material';
import { useFinalRecipe } from '../Contexts/FinalRecipe';
import { useIngredientContext } from '../Contexts/IngredientContext';
import { useRecipeStatus } from '../Contexts/RecipeStatus';
import { useAuth } from "../Contexts/AuthContext";

function Recipe() {
    const { finalRecipe } = useFinalRecipe();
    const { setIngredientArray } = useIngredientContext();
    const { setRecipeStatus } = useRecipeStatus();
    const { user, signInWithGoogle } = useAuth();

    const handleStartOver = () => {
        setRecipeStatus("progress");
        setIngredientArray([]);
    };

    const handleSaveRecipe = () => {
        if(user){
            console.log("saved")
        }else{
            signInWithGoogle();
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: {
            xs: '70vh', // mobile
            md: '80vh'  // desktop
          } }} className="InputForm">
            <div className="RecipeContainer" style={{ flex: '1', overflowY: 'auto', padding: '44px', borderRadius: "0", margin: "15px 0" }}>
                <h3 className='recipe-heading recipe-font'>THE ULTIMATE DISH</h3>
                <div className='recipe-steps recipe-font' dangerouslySetInnerHTML={{ __html: finalRecipe }} />
            </div>
            <div className="RestartContainer" style={{ borderTop: '1px solid #ddd' }}>
                {/* <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                        color: '#2e2e2e',
                        backgroundColor: 'white',
                        borderRadius: 0,
                        height: '56px',
                        fontSize: '22px',
                        fontWeight: '700',
                        mt: 2,
                        '&:hover': {
                            backgroundColor: '#e6e6e6',
                        }
                    }}
                    onClick={handleSaveRecipe}
                >
                    Save Recipe
                </Button> */}
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                        color: 'secondary.main',
                        backgroundColor: '#2e2e2e',
                        borderRadius: 0,
                        // border: '1px solid white',
                        height: '56px',
                        fontSize: '22px',
                        fontWeight: '700',
                        mt: 1,
                        '&:hover': {
                            backgroundColor: '#3d3d3d',
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
