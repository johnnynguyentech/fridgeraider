import React, { useEffect, useState } from 'react';
import InputComponent from './InputComponent';
import { Box, Button } from '@mui/material';
import { useIngredientContext } from '../Contexts/IngredientContext';
import { useRecipeStatus } from '../Contexts/RecipeStatus';
import { useFinalRecipe } from '../Contexts/FinalRecipe';

const API_KEY = process.env.REACT_APP_MY_API_KEY;

function InputForm() {
    const { ingredientArray, setIngredientArray } = useIngredientContext();
    const { setRecipeStatus } = useRecipeStatus();
    const { setFinalRecipe } = useFinalRecipe();
    const [ingredientItems, setIngredientItems] = useState([]);
    const [messages, setMessages] = useState([]);

    const handleDeleteIngredient = (index) => {
        const newIngredientArray = ingredientArray.filter((_, i) => i !== index);
        setIngredientArray(newIngredientArray);
    };

    useEffect(() => {
        const items = ingredientArray.map((ingredient, index) => (
            <li className="ingredientListItem" key={index}>
                <span className="ingredientText">{ingredient}</span>
                <div className="dots"></div>
                <button className="deleteIngredientButton recipe-font" onClick={() => handleDeleteIngredient(index)}>X</button>
            </li>
        ));
        setIngredientItems(items);
    }, [ingredientArray]);

    const handleGenerate = () => {
        if (ingredientArray.length > 0) {
            let prompt;
            const ingredientsCopy = [...ingredientArray]; // Make a copy of the array
            if (ingredientsCopy.length === 1) {
                prompt = `Create a delicious recipe that contains but not limited to ${ingredientsCopy[0]}. Start the response with, "Our FridgeRaider chefs would like to share with you the recipe for". Put the description in a <p> tag and the steps in a <ol> and <li> tag. End with "Enjoy!" wrapped in a <p> tag.`;
            } else {
                const lastIngredient = ingredientsCopy.pop();
                prompt = `Create a delicious recipe that contains but not limited to ${ingredientsCopy.join(', ')}, and ${lastIngredient}.  Start the response with, "Our FridgeRaider chefs would like to share with you the recipe for". Put the description in a <p> tag and the steps in a <ol> and <li> tag. End with "Enjoy!" wrapped in a <p> tag.`;
            }
            setRecipeStatus("loading");
            handleSend(prompt);
        }
    };

    const handleSend = async (prompt) => {
        const newMessage = {
            message: prompt,
            sender: "user",
            direction: "outgoing"
        };

        const newMessages = [...messages, newMessage]; // Include previous messages and the new message
        setMessages(newMessages);
        await processMessageToChatGPT(newMessages);
    };

    const processMessageToChatGPT = async (chatMessages) => {
        const apiMessages = chatMessages.map((messageObject) => ({
            role: messageObject.sender === "ChatGPT" ? "assistant" : "user",
            content: messageObject.message
        }));

        const systemMessage = {
            role: "system",
            content: "Explain all concepts in a friendly and clear manner."
        };

        const apiRequestBody = {
            model: "gpt-3.5-turbo",
            messages: [systemMessage, ...apiMessages]
        };

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiRequestBody)
            });
            const data = await response.json();
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT",
                    direction: "incoming"
                }
            ]);
            setFinalRecipe(data.choices[0].message.content);
            setRecipeStatus("complete");
        } catch (error) {
            console.error('Error processing message to ChatGPT:', error);
            setRecipeStatus("error");
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: {
            xs: '70vh', // mobile
            md: '80vh'  // desktop
          } }} className="InputForm">
            <div className="IngredientItems" style={{ flex: '1', overflowY: 'auto', borderRadius: "0", margin: "15px 0" }}>
                <h3 className='recipe-font' style={{textDecoration: "underline", margin: "0", color:"#454444", paddingBottom: "12px"}}>INGREDIENTS</h3>
                <ul className="IngredientsList recipe-font">
                    {ingredientItems}
                </ul>
            </div>
            <div className="InputContainer" style={{ borderTop: '1px solid #ddd' }}>
                <InputComponent />
                <Button
                    className="rubik-dirt-regular"
                    id="GenerateRecipeButton"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                        color: 'secondary.main',
                        backgroundColor: '#2e2e2e',
                        // border: '1px solid white',
                        borderRadius: 0,
                        height: '56px',
                        fontSize: '22px',
                        fontWeight: '700',
                        mt: 1,
                        '&:hover': {
                            backgroundColor: '#3d3d3d',
                        }
                    }}
                    onClick={handleGenerate}
                >
                    GENERATE RECIPE
                </Button>

            </div>
        </Box>
    );
}

export default InputForm;
