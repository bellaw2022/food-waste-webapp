import Ingredients from "@/components/ui/ingredients";
import React, { useState } from "react";
import "./index.css";
import NoRecipesModal from "@/components/ui/noRecipesModal";
import RecipeList from "../../components/ui/recipeList";
import Recipe from "../../components/ui/recipe";

interface Recipe {
  /*title: string;
  number: number;
  pictureUrl: string;
  ingredients: string[];
  instructions: string[];
  index: number;*/

  id: number;
  title: string;
  missedIngredientCount: number;
  usedIngredientCount: number;
  image: string;
  missedIngredients: string[];
  usedIngredients: string[];
}

interface CompleteRecipe {
  id: number;
  title: string;
  missedIngredientCount: number;
  usedIngredientCount: number;
  image: string;
  missedIngredients: string[];
  usedIngredients: string[];
  servings: number;
  sourceURL: string;
  ingredients: { name: string; unit: string; amount: number }[];
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
  const [completeRecipe, setCompleteRecipe] = useState<CompleteRecipe>({
    id: 0,
    title: "",
    missedIngredientCount: 0,
    usedIngredientCount: 0,
    image: "",
    missedIngredients: [],
    usedIngredients: [],
    servings: 0,
    sourceURL: "",
    ingredients: [],
  });
  // whether or not the button is clicked - true if loading or already loaded
  const [loading, setLoading] = useState(false);
  const [showNoRecipesModal, setShowNoRecipesModal] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>();
  const [generateRecipes, setGenerateRecipes] = useState<boolean>(false);

  const handleSelectionChange = (selectedIngredients: string[]) => {
    console.log("Selected ingredients:", selectedIngredients);
    setSelectedIngredients(selectedIngredients);
  };

  const handleRecipeSelection = async (selectedRecipe: Recipe) => {
    console.log("Selected recipe: " + selectedRecipe.title);
    setSelectedRecipe(selectedRecipe);

    try {
      /*
        title, image, servings, cookingMinutes, prepMinutes, ingredients, sourceURL
        */
      const response = await fetch(
        "http://127.0.0.1:5000/api/recipe/recipe_by_id",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: selectedRecipe.id.toString() }),
        }
      );
      if (response.ok) {
        const data: CompleteRecipe = await response.json();
        console.log(data);
        const updatedData = {
          ...data, // Spread the existing data
          missedIngredientCount: selectedRecipe.missedIngredientCount,
          usedIngredientCount: selectedRecipe.usedIngredientCount,
          missedIngredients: selectedRecipe.missedIngredients,
          usedIngredients: selectedRecipe.usedIngredients,
          id: selectedRecipe.id,
        };
        setCompleteRecipe(updatedData);
        console.log(updatedData);
        console.log(completeRecipe);
      } else {
        console.error("Error fetching recipes");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
    }
  };

  const searchRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/recipe/recipes_by_ingredients",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ingredients: selectedIngredients }),
        }
      );
      if (response.ok) {
        const data = await response.json();

        const fetchedRecipes: Recipe[] = data.recipes.map((recipe: any) => ({
          id: recipe.id,
          title: recipe.title,
          missedIngredientCount: recipe.missedIngredientCount,
          usedIngredientCount: recipe.usedIngredientCount,
          image: recipe.image,
          missedIngredients: recipe.missedIngredients, // If missedIngredients is a string array
          usedIngredients: recipe.usedIngredients, // If usedIngredients is a string array
        }));

        console.log(fetchedRecipes);
        setRecipes(fetchedRecipes);
        console.log(recipes);
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
      {recipes.length < 1 && (
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
            <Recipe recipe={completeRecipe}></Recipe>
          )
        ) : (
          showNoRecipesModal && (
            <NoRecipesModal onClose={() => setShowNoRecipesModal(false)} />
          )
        ))}
    </div>
  );
};
