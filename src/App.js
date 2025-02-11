// import './App.css';
// import React from 'react';
// import { Container, Typography } from '@mui/material';
// import InputForm from './Components/InputForm';
// import { IngredientProvider } from './Contexts/IngredientContext';
// import { RecipeStatusProvider, useRecipeStatus } from './Contexts/RecipeStatus';
// import Recipe from './Components/Recipe';
// import Loading from './Components/Loading';
// import { FinalRecipeProvider } from './Contexts/FinalRecipe';
// import Menu from './Components/Menu';
// import { AuthProvider } from './Contexts/AuthContext';

// function Content() {
//   const { recipeStatus } = useRecipeStatus();

//   let pageContent;
//   if (recipeStatus === 'progress') {
//     pageContent = <InputForm />;
//   } else if (recipeStatus === 'loading') {
//     pageContent = <Loading/>
//   } else if (recipeStatus === 'complete') {
//     pageContent = <Recipe />;
//   } else {
//     pageContent = <h2>Sorry, we've run into an issue.</h2>;
//   }

//   return (
//     <Container
//       maxWidth="sm"
//       style={{
//         flex: 1,
//         marginTop: "24px", // Default margin for larger screens
//         '@media (max-width: 600px)': {
//           marginTop: "16px", // Adjust margin for smaller screens
//         }
//       }}
//     >
//       <div className="HeadingContainer">
//         <h1 className='rubik-dirt-regular'>FridgeRaider</h1>
//         <Typography variant="body1" sx={{ color: "primary.main", fontWeight: '600' }}>Tell us what's in your fridge. We'll come up with the recipe.</Typography>
//       </div>
//       {pageContent}
//     </Container>
//   );
// }

// function App() {
//   return (
//       <RecipeStatusProvider>
//         <IngredientProvider>
//           <FinalRecipeProvider>
//             <AuthProvider>
//               <div className="App">
//                 <Menu />
//                 <Content />
//               </div>
//             </AuthProvider>
//           </FinalRecipeProvider>
//         </IngredientProvider>
//       </RecipeStatusProvider>
//   );
// }

// export default App;

import './App.css';
import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import InputForm from './Components/InputForm';
import { IngredientProvider } from './Contexts/IngredientContext';
import { RecipeStatusProvider, useRecipeStatus } from './Contexts/RecipeStatus';
import Recipe from './Components/Recipe';
import Loading from './Components/Loading';
import { FinalRecipeProvider } from './Contexts/FinalRecipe';
import Menu from './Components/Menu';
import { AuthProvider } from './Contexts/AuthContext';

const Content = () => {
  const { recipeStatus } = useRecipeStatus();

  let pageContent;
  if (recipeStatus === 'progress') {
    pageContent = <InputForm />;
  } else if (recipeStatus === 'loading') {
    pageContent = <Loading />;
  } else if (recipeStatus === 'complete') {
    pageContent = <Recipe />;
  } else {
    pageContent = <h2>Sorry, we've run into an issue.</h2>;
  }

  return (
    <Container
      maxWidth="sm"
      style={{
        flex: 1,
        minHeight: '100vh',
        paddingBottom: '50px', // Prevent bottom content from being covered
      }}
    >
      <div className="HeadingContainer">
        <h1 className='rubik-dirt-regular'>FridgeRaider</h1>
        <Typography variant="body1" sx={{ color: "primary.main", fontWeight: '600' }}>Tell us what's in your fridge. We'll come up with the recipe.</Typography>
      </div>
      {pageContent}
    </Container>
  );
}

function App() {
  const [height, setHeight] = useState(window.innerHeight);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    // Detect viewport height change when the keyboard opens/closes
    const handleResize = () => {
      setHeight(window.innerHeight);
      if (window.innerHeight < height) {
        setIsKeyboardOpen(true); // Keyboard opened
      } else {
        setIsKeyboardOpen(false); // Keyboard closed
        // Scroll to the top of the page once the keyboard is closed
        window.scrollTo(0, 0);
      }
    };

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Clean up the listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [height]);

  useEffect(() => {
    // Dynamically update body height when the keyboard is shown/hidden
    if (isKeyboardOpen) {
      // Prevent body from scrolling when keyboard is open
      document.body.style.height = `${height}px`;
      document.body.style.overflow = 'hidden';
    } else {
      // Allow scrolling when keyboard is closed
      document.body.style.height = 'auto';
      document.body.style.overflow = 'auto';
    }
  }, [height, isKeyboardOpen]);

  return (
    <RecipeStatusProvider>
      <IngredientProvider>
        <FinalRecipeProvider>
          <AuthProvider>
            <div className="App">
              <Menu />
              <Content />
            </div>
          </AuthProvider>
        </FinalRecipeProvider>
      </IngredientProvider>
    </RecipeStatusProvider>
  );
}

export default App;
