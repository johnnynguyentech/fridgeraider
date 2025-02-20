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
      {/* <TextField 
        fullWidth 
        autoComplete="off"
        label="List an ingredient" 
        id="fullWidth" 
        sx={{ 
          bgcolor: 'white',
          borderRadius: '5px 0 0 5px',
          '& fieldset': { border: 'none' },  // Remove default border
          height: '36px',  // Match button height
          flexGrow: 1,
          '& .MuiInputBase-root': {
            height: '36px', // Ensure consistent height
            alignItems: 'center', // Center text vertically
          },
          '& .MuiInputBase-input': {
            padding: '0px 14px' // Adjust padding to center text
          }
        }} 
        value={inputValue} 
        onChange={handleInputChange} 
        onKeyPress={handleKeyPress}
      /> */}
      <TextField
        fullWidth
        autoComplete="off"
        label="list an ingredient"
        id="fullWidth"
        sx={{ 
          bgcolor: 'white',
          borderRadius: '5px 0 0 5px',
          '& fieldset': { border: 'none' }, // Remove default border
          height: '44px', // Match button height
          flexGrow: 1,
          '& .MuiInputBase-root': {
            height: '44px', // Ensure consistent height
            alignItems: 'center',
          },
          '& .MuiInputBase-input': {
            padding: '0px 14px',
          }
        }}
        InputLabelProps={{
          shrink: false, // Prevents automatic floating
          sx: {
            top: '50%', // Vertically center the label
            transform: 'translateY(-50%)', // Keep it aligned properly
            transition: 'opacity 0.2s ease-in-out, top 0.2s ease-in-out',
            opacity: inputValue ? 0 : 1, // Hide when typing
            pointerEvents: inputValue ? 'none' : 'auto', // Prevents interaction when hidden
            paddingLeft: "13px",
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
          backgroundColor: '#757575',
          // border: '1px solid white',
          borderRadius: '0 5px 5px 0', 
          textTransform: "lowercase",
          height: '44px',  // Match text field height
          fontWeight: '600',
          padding: '0 16px', // Ensure padding is consistent
          '&:hover': {
            backgroundColor: '#ebb434',
          }
        }}
      >
        Add
      </Button>

    </Box>
  );
}

export default InputComponent;
