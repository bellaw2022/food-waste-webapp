import Ingredients from "@/components/ui/ingredients";
import React, { useState } from "react";
import "./index.css";
import NoRecipesModal from "@/components/ui/noRecipesModal";
import RecipeList from "../../components/ui/recipeList";

interface Recipe {
  title: string;
  number: number;
  pictureUrl: string;
  ingredients: string[];
  instructions: string[];
  index: number;
}

export const RecipePage: React.FC = () => {
  const ingredients = [
    "Tomato",
    "Lettuce",
    "Cheese",
    "Bacon",
    "Onion",
    "Pickle",
    "Ketchup",
    "Mayo",
    "Mustard",
    "Relish",
    "Cucumber",
    "Carrot",
    "Radish",
    "Olive",
    "Pepper",
    "Garlic",
  ];

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  // whether or not the button is clicked - true if loading or already loaded
  const [loading, setLoading] = useState(false);
  const [showNoRecipesModal, setShowNoRecipesModal] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>();
  const [generateRecipes, setGenerateRecipes] = useState<boolean>(false);

  const handleSelectionChange = (selectedIngredients: string[]) => {
    console.log("Selected ingredients:", selectedIngredients);
    setSelectedIngredients(selectedIngredients);
  };

  const handleRecipeSelection = (selectedRecipe: Recipe) => {
    console.log("Selected recipe: " + selectedRecipe.title);
    setSelectedRecipe(selectedRecipe);
  };

  const searchRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: selectedIngredients }),
      });
      if (response.ok) {
        const data: Recipe[] = await response.json();
        setRecipes(data);
        console.log(data);
      } else {
        console.error("Error fetching recipes");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
      setGenerateRecipes(true);
    }
  };

  return (
    <div className="mx-4">
      <h1 className="text-3xl font-bold">Recipe Rec</h1>
      {recipes.length === 0 && (
        <>
          <Ingredients
            ingredients={ingredients}
            onSelectionChange={handleSelectionChange}
          ></Ingredients>
          <button
            className="recipe-button"
            onClick={searchRecipes}
            disabled={loading}
          >
            {loading ? "Searching..." : "Generate Recipes"}
          </button>
        </>
      )}

      {generateRecipes &&
        (recipes.length > 0 ? (
          selectedRecipe == null ? (
            <RecipeList
              recipes={recipes}
              onSelectRecipe={handleRecipeSelection}
            ></RecipeList>
          ) : (
            <div>{selectedRecipe.title}</div>
          )
        ) : (
          showNoRecipesModal && (
            <NoRecipesModal onClose={() => setShowNoRecipesModal(false)} />
          )
        ))}
    </div>
  );
};
