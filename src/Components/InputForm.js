import React, { useEffect, useState } from 'react';
import InputComponent from './InputComponent'; // Adjust the path if needed
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
                {ingredient}
                <button className="deleteIngredientButton" onClick={() => handleDeleteIngredient(index)}>X</button>
            </li>
        ));
        setIngredientItems(items);
    }, [ingredientArray]);

    const handleGenerate = () => {
        if (ingredientArray.length > 0) {
            let prompt;
            const ingredientsCopy = [...ingredientArray]; // Make a copy of the array
            if (ingredientsCopy.length === 1) {
                prompt = `Create a delicious recipe that contains but not limited to ${ingredientsCopy[0]}. Start the response with, "Our FridgeRaider chefs would like to share with you the recipe for". Put the description in a <p> tag and the steps in a <ol> and <li> tag.`;
            } else {
                const lastIngredient = ingredientsCopy.pop();
                prompt = `Create a delicious recipe that contains but not limited to ${ingredientsCopy.join(', ')}, and ${lastIngredient}.  Start the response with, "Our FridgeRaider chefs would like to share with you the recipe for". Put the description in a <p> tag and the steps in a <ol> and <li> tag.`;
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
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '78vh' }} className="InputForm">
            <div className="IngredientItems" style={{ flex: '1', overflowY: 'auto', padding: '20px' }}>
                <ul className="IngredientsList">
                    {ingredientItems}
                </ul>
            </div>
            <div className="InputContainer" style={{ borderTop: '1px solid #ddd' }}>
                <InputComponent />
                <Button
                    id="GenerateRecipeButton"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ color: 'secondary.main', height: '56px', fontSize: '26px', fontWeight: '700', mt: 2 }}
                    onClick={handleGenerate}
                >
                    GENERATE RECIPE
                </Button>
            </div>
        </Box>
    );
}

export default InputForm;
