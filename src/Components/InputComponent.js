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
        position: 'sticky',
        bottom: 0,
        gap: "8px",
        zIndex: 1000 // Ensure the component stays on top of other content
      }}
    >
      <TextField
        fullWidth
        autoComplete="off"
        label="Enter ingredients here..."
        id="fullWidth"
        className="poppins-regular"
        sx={{ 
          fontFamily: 'Poppins, sans-serif',
          bgcolor: 'white',
          borderRadius: '5px',
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
            fontFamily: 'Poppins, sans-serif',
            top: '50%', // Vertically center the label
            transform: 'translateY(-50%)', // Keep it aligned properly
            transition: 'opacity 0.2s ease-in-out, top 0.2s ease-in-out',
            opacity: inputValue ? 0 : 1, // Hide when typing
            pointerEvents: inputValue ? 'none' : 'auto', // Prevents interaction when hidden
            paddingLeft: "13px",
            fontSize: "14px"
          }
        }}
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <Button 
        className="poppins-regular"
        variant="contained" 
        size="large" 
        onClick={handleAddClick}
        sx={{ 
          color: 'white', 
          backgroundColor: '#363636',
          borderRadius: '5px', 
          border: "1px solid white",
          textTransform: "none",
          height: '44px',  // Match text field height
          fontWeight: '500',
          fontSize: "14px",
          padding: '0 16px', // Ensure padding is consistent
          '&:hover': {
            backgroundColor: 'grey',
          }
        }}
      >
        Add
      </Button>

    </Box>
  );
}

export default InputComponent;
