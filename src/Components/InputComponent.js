import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useIngredientContext } from "../Contexts/IngredientContext";

function InputComponent() {
  const [inputValue, setInputValue] = useState('');
  const { ingredientArray, setIngredientArray } = useIngredientContext();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddClick();
      event.preventDefault(); // Prevent the default action to avoid form submission
    }
  };

  const handleAddClick = () => {
    if (inputValue.length > 0) { //Check if input is NOT empty
      const newIngredient = inputValue;
      setIngredientArray([...ingredientArray, newIngredient]);
      setInputValue(''); // Clear the input after adding
    }
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginTop: '12px',
        backgroundColor: '#2e2d2d',
        position: 'sticky',
        bottom: 0,
        zIndex: 1000 // Ensure the component stays on top of other content
      }}
    >
      <TextField 
        fullWidth 
        label="List an ingredient" 
        id="fullWidth" 
        sx={{ 
          bgcolor: 'white',
          borderRadius: '4px 0 0 4px',
          '& fieldset': { borderRight: 'none' }, 
          height: '56px',
          flexGrow: 1 // Take up remaining space
        }} 
        value={inputValue} 
        onChange={handleInputChange} 
        onKeyPress={handleKeyPress}
      />
      <Button 
        variant="contained" 
        size="large" 
        onClick={handleAddClick}
        sx={{ 
          color: 'secondary.main', 
          borderRadius: '0 4px 4px 0', 
          height: '56px', 
          fontWeight: '600' 
        }}
      >
        Add
      </Button>
    </Box>
  );
}

export default InputComponent;
