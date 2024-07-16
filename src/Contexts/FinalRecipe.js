// FinalRecipeContext.js
import React, { createContext, useContext, useState } from 'react';

const FinalRecipeContext = createContext();

const FinalRecipeProvider = ({ children }) => {
  const [finalRecipe, setFinalRecipe] = useState("Here is your recipe!");

  return (
    <FinalRecipeContext.Provider value={{ finalRecipe, setFinalRecipe }}>
      {children}
    </FinalRecipeContext.Provider>
  );
};

export const useFinalRecipe = () => {
  return useContext(FinalRecipeContext);
};

export { FinalRecipeProvider };
