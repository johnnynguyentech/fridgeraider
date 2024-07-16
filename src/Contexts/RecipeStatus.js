// RecipeStatusContext.js
import React, { createContext, useContext, useState } from 'react';

const RecipeStatusContext = createContext();

export const RecipeStatusProvider = ({ children }) => {
  const [recipeStatus, setRecipeStatus] = useState('progress');

  return (
    <RecipeStatusContext.Provider value={{ recipeStatus, setRecipeStatus }}>
      {children}
    </RecipeStatusContext.Provider>
  );
};

export const useRecipeStatus = () => {
  return useContext(RecipeStatusContext);
};
