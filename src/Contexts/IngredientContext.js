// IngredientContext.js
import React, { createContext, useContext, useState } from 'react';

const IngredientContext = createContext();

export const IngredientProvider = ({ children }) => {
  const [ingredientArray, setIngredientArray] = useState([]);

  return (
    <IngredientContext.Provider value={{ ingredientArray, setIngredientArray }}>
      {children}
    </IngredientContext.Provider>
  );
};

export const useIngredientContext = () => {
  return useContext(IngredientContext);
};
