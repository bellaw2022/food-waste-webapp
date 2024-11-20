import Ingredients from "@/components/ui/ingredients";
import React, { useState, useEffect } from "react";
import "./index.css";
import NoRecipesModal from "@/components/ui/noRecipesModal";
import RecipeList from "../../components/ui/recipeList";
import Recipe from "../../components/ui/recipe";
import axios from "axios";
import { useOAuth } from "@/hooks";


const baseURL = import.meta.env.VITE_API_URL;

interface BackendIngredient {
  userproduce_id: number;
  produce_name: string;
  quantity: number;
  unit: string;
  purchase_date: string; // Date as string in 'YYYY-MM-DD' format
  expiration_date: string; // Date as string in 'YYYY-MM-DD' format
}
interface BackendData {
  data: BackendIngredient[];
}
interface Ingredient {
  name: string;
  days: number;
}

interface Recipe {
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
  ingredients: { name: string; unit: string; amount: string }[];
  instructions: string[];
}

export const RecipePage: React.FC = () => {
  const { userId } = useOAuth();
  const globalUserId = userId;
  console.log("userid: ", userId);

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

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
    instructions: [],
  });
  // whether or not the button is clicked - true if loading or already loaded
  const [loading, setLoading] = useState(false);
  const [showNoRecipesModal, setShowNoRecipesModal] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>();

  const [basePage, setBasePage] = useState<boolean>(true);
  const [listPage, setListPage] = useState<boolean>(false);
  const [recipePage, setRecipePage] = useState<boolean>(false);

  const [searchOption, setSearchOption] = useState<number>(1);

  const [isAI, setIsAI] = useState<boolean>(false);

  const handleNoRecipe = () => {
    setShowNoRecipesModal(false);
    setBasePage(true);
    setListPage(false);
    setRecipePage(false);
  };

  const handleSearchOptionChange = (option: number) => {
    setSearchOption(option);
    console.log("search option changed to ", option);
  };

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
      const response = await axios.get(baseURL + "/api/recipe/recipe_by_id", {
        params: { id: selectedRecipe.id.toString() },
      });

      const data: CompleteRecipe = await response.data;
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
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setRecipePage(true);
      setBasePage(false);
      setListPage(false);
    }
  };

  useEffect(() => {
    if (basePage) {
      // Clear the recipe list when baseRecipe changes to true
      setRecipes([]);
      retrieveIngredients();
      setSelectedIngredients([]);
      setCompleteRecipe({
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
        instructions: [],
      });
      setIsAI(false);
      console.log("zero everything");
    }
  }, [basePage]);

  const retrieveIngredients = async () => {
    try {
      const response = await axios.get<BackendData>(
        baseURL + "/api/user/" + globalUserId + "/produce"
      );
      const responseData = await response.data;
      console.log(responseData);
      const fetchedIngredients: Ingredient[] = responseData.data.map((item) => {
        const expirationDate = new Date(item.expiration_date);
        const today = new Date();
        const daysUntilExpiration = Math.ceil(
          (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        return {
          name: item.produce_name,
          days: daysUntilExpiration,
        };
      });
      setIngredients(fetchedIngredients);
    } catch (error) {
      console.error("Error fetching inventory in retrieveIngredients: ", error);
    }
  };

  const searchRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        baseURL + "/api/recipe/recipes_by_ingredients",
        {
          ingredients: selectedIngredients,
          userId: globalUserId,
          option: searchOption,
        }
      );

      const data = await response.data;

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
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
      //setGenerateRecipes(true);
      setRecipePage(false);
      setBasePage(false);
      setListPage(true);
      if (recipes.length > 0) {
        setShowNoRecipesModal(true);
      }
    }
  };

  const searchAIRecipe = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/recipe/ai/${globalUserId}`, {
        ingredients: selectedIngredients,
        preferences: {},
      });

      const data = await response.data;

      setCompleteRecipe(data);
      console.log(completeRecipe);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setRecipePage(true);
      setBasePage(false);
      setListPage(false);
      setIsAI(true);
    }
  };

  return (
    <div className="mx-4">
      <h1 className="text-3xl font-bold">Recipe Rec</h1>
      {basePage && (
        <>
          <Ingredients
            ingredients={ingredients}
            onSelectionChange={handleSelectionChange}
          ></Ingredients>
          <div className="option">
            <h2 className="option-text">Option</h2>
            <div className="option-buttons">
              <button
                className={`option-button ${
                  searchOption === 1 ? "selected" : ""
                }`}
                onClick={() => handleSearchOptionChange(1)}
              >
                Maximize existing ingredients usage
              </button>
              <button
                className={`option-button ${
                  searchOption !== 1 ? "selected" : ""
                }`}
                onClick={() => handleSearchOptionChange(2)}
              >
                Minimize missing ingredients usage
              </button>
            </div>
          </div>
          <div className="recipe-buttons">
            <button
              className="recipe-button"
              onClick={searchAIRecipe}
              disabled={loading}
            >
              {loading ? "Searching..." : "Generate AI Recipes"}
            </button>
            <button
              className="recipe-button"
              onClick={searchRecipes}
              disabled={loading}
            >
              {loading ? "Searching..." : "Generate Recipes"}
            </button>
          </div>
        </>
      )}

      {listPage &&
        (recipes.length > 0 ? (
          <RecipeList
            recipes={recipes}
            onSelectRecipe={handleRecipeSelection}
            setBasePage={setBasePage}
            setListPage={setListPage}
            setRecipePage={setRecipePage}
          ></RecipeList>
        ) : (
          showNoRecipesModal && (
            <NoRecipesModal
              onClose={() => setShowNoRecipesModal(false)}
              setBasePage={setBasePage}
              setListPage={setListPage}
              setRecipePage={setRecipePage}
            />
          )
        ))}

      {recipePage && (
        <Recipe
          recipe={completeRecipe}
          setBasePage={setBasePage}
          setListPage={setListPage}
          setRecipePage={setRecipePage}
          isAI={isAI}
        ></Recipe>
      )}
    </div>
  );
};
