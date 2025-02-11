import './App.css';
import React from 'react';
import { Container, Typography } from '@mui/material';
import InputForm from './Components/InputForm';
import { IngredientProvider } from './Contexts/IngredientContext';
import { RecipeStatusProvider, useRecipeStatus } from './Contexts/RecipeStatus';
import Recipe from './Components/Recipe';
import Loading from './Components/Loading';
import { FinalRecipeProvider } from './Contexts/FinalRecipe';
import Menu from './Components/Menu';
import { AuthProvider } from './Contexts/AuthContext';

function Content() {
  const { recipeStatus } = useRecipeStatus();

  let pageContent;
  if (recipeStatus === 'progress') {
    pageContent = <InputForm />;
  } else if (recipeStatus === 'loading') {
    pageContent = <Loading/>
  } else if (recipeStatus === 'complete') {
    pageContent = <Recipe />;
  } else {
    pageContent = <h2>Sorry, we've run into an issue.</h2>;
  }

  return (
    <Container maxWidth="sm" style={{ flex: 1, marginTop: "24px" }}>
      <Menu />
      <div className="HeadingContainer">
        <h1 className='rubik-dirt-regular'>FridgeRaider</h1>
        <Typography variant="body1" sx={{ color: "primary.main", fontWeight: '600' }}>Tell us what's in your fridge. We'll come up with the recipe.</Typography>
      </div>
      {pageContent}
    </Container>
  );
}

function App() {
  return (
      <RecipeStatusProvider>
        <IngredientProvider>
          <FinalRecipeProvider>
            <AuthProvider>
              <div className="App">
                <Content />
              </div>
            </AuthProvider>
          </FinalRecipeProvider>
        </IngredientProvider>
      </RecipeStatusProvider>
  );
}

export default App;
