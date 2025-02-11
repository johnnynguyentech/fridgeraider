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
            <div className="RecipeContainer" style={{ flex: '1', overflowY: 'auto', padding: '44px' }}>
                <h3 className='kalam-bold' style={{textDecoration: "underline", margin: "0", color: "#454444"}}>THE ULTIMATE DISH</h3>
                <div className="kalam-bold" dangerouslySetInnerHTML={{ __html: finalRecipe }} />
            </div>
            <div className="RestartContainer" style={{ borderTop: '1px solid #ddd' }}>
                {/* <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                        color: '#2e2e2e',
                        backgroundColor: 'white',
                        border: '1px solid white',
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
                        border: '1px solid white',
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
