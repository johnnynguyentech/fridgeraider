
import React, { useEffect, useState, useRef } from 'react';
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
    
    // Reference for IngredientViewport
    const ingredientViewportRef = useRef(null);

    const handleDeleteIngredient = (index) => {
        const newIngredientArray = ingredientArray.filter((_, i) => i !== index);
        setIngredientArray(newIngredientArray);
    };

    useEffect(() => {
        const items = ingredientArray.map((ingredient, index) => (
            <li className="ingredientListItem poppins-regular" key={index}>
                <span className="ingredientText">{ingredient}</span>
                <div className="dots"></div>
                <button className="deleteIngredientButton poppins-regular" onClick={() => handleDeleteIngredient(index)}>ⓧ</button>
            </li>
        ));
        setIngredientItems(items);
    }, [ingredientArray]);

    // Scroll to bottom when ingredientItems change
    useEffect(() => {
        if (ingredientViewportRef.current) {
            ingredientViewportRef.current.scrollTop = ingredientViewportRef.current.scrollHeight;
        }
    }, [ingredientItems]);

    const handleGenerate = () => {
        if (ingredientArray.length > 0) {
            let prompt;
            const ingredientsCopy = [...ingredientArray]; // Make a copy of the array
            if (ingredientsCopy.length === 1) {
                prompt = `Create a delicious recipe that contains but not limited to ${ingredientsCopy[0]}. Start the response with, "Our FridgeRaider chefs would like to share with you the recipe for". Put the description in a <p> tag and the steps in a <ol> and <li> tag. End with "Enjoy!🧑‍🍳" wrapped in a <p> tag.`;
            } else {
                const lastIngredient = ingredientsCopy.pop();
                prompt = `Create a delicious recipe that contains but not limited to ${ingredientsCopy.join(', ')}, and ${lastIngredient}.  Start the response with, "Our FridgeRaider chefs would like to share with you the recipe for". Put the description in a <p> tag and the steps in a <ol> and <li> tag. End with "Enjoy!🧑‍🍳" wrapped in a <p> tag.`;
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
            <div className="IngredientItems" style={{ flex: '1', display: 'flex', flexDirection: 'column', overflowY: 'auto', borderRadius: "5px", margin: "15px 0" }}>
                <h3 className='poppins-bold' style={{ margin: "0", padding: "10px 10px 20px 10px", fontWeight: "500", color: "white" }}>
                    Tell us what's in your fridge. We'll come up with the recipe.
                </h3>
                <hr />
                <br />
                <div className='IngredientViewport' ref={ingredientViewportRef} style={{ flex: '1', maxHeight: 'calc(100% - 280px)', overflowY: 'auto' }}>
                    <ul className="IngredientsList recipe-font">
                        {ingredientItems}
                    </ul>
                </div>
                <div className="InputContainer" style={{ borderTop: '1px solid #ddd' }}>
                    <p className="poppins-regular" style={{ color: "white", marginTop: "12px", textAlign: "left", fontSize: "14px" }}><i class="fa-regular fa-file-lines"></i>List an ingredient</p>
                    <InputComponent />
                    <Button
                        className="poppins-regular"
                        id="GenerateRecipeButton"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                            color: 'black',
                            backgroundColor: '#EBB434;',
                            borderRadius: "5px",
                            height: '44px',
                            fontSize: '16px',
                            fontWeight: '500',
                            textTransform: "none",
                            mt: 1.5,
                            '&:hover': {
                                backgroundColor: '#c7982c',
                            }
                        }}
                        onClick={handleGenerate}
                    >
                        <i class="fa fa-utensils"></i> Generate Recipe
                    </Button>
                </div>
            </div>
        </Box>
    );
}

export default InputForm;
