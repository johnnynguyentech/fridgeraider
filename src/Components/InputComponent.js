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
        autoComplete="off"
        label="List an ingredient" 
        id="fullWidth" 
        sx={{ 
          bgcolor: 'white',
          // borderRadius: '4px 0 0 4px',
          '& fieldset': { border: 'none' },  // Remove default border
          height: '56px',  // Match button height
          flexGrow: 1,
          '& .MuiInputBase-root': {
            height: '56px', // Ensure consistent height
            alignItems: 'center', // Center text vertically
          },
          '& .MuiInputBase-input': {
            padding: '16.5px 14px' // Adjust padding to center text
          }
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
          backgroundColor: '#2e2e2e',
          backgroundColor: '#757575',
          // border: '1px solid white',
          borderRadius: '0', 
          height: '56px',  // Match text field height
          fontWeight: '600',
          padding: '0 16px', // Ensure padding is consistent
          '&:hover': {
            backgroundColor: '#3d3d3d',
          }
        }}
      >
        Add
      </Button>

    </Box>
  );
}

export default InputComponent;
