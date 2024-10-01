import React, { useState } from 'react';

const RecipeRecommendationPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [creativeRecipes, setCreativeRecipes] = useState([]);

    const handleGetRecipes = async () => {
        // Fetch from external recipe API
        const response = await fetch('https://api.spoonacular.com/recipes/findByIngredients?ingredients=apple,banana');  // Adjust API URL
        const data = await response.json();
        setRecipes(data);
    };

    const handleGetCreativeRecipes = async () => {
        // Fetch from GPT API (you can build this in your Flask backend)
        const response = await fetch('http://127.0.0.1:5000/api/gpt-creative-recipe');  // Your backend GPT API
        const data = await response.json();
        setCreativeRecipes(data.creative_recipes);
    };

    return (
        <div>
            <h2>Recipe Recommendation</h2>
            <div>
                <button onClick={handleGetRecipes}>Get Recipes from API</button>
                <ul>
                    {recipes.map((recipe) => (
                        <li key={recipe.id}>{recipe.title}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h3>Creative Recipes (by GPT)</h3>
                <button onClick={handleGetCreativeRecipes}>Get Creative Recipes</button>
                <ul>
                    {creativeRecipes.map((recipe, index) => (
                        <li key={index}>{recipe}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RecipeRecommendationPage;
