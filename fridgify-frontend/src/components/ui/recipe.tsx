import { mul } from "@tensorflow/tfjs";
import BackButton from "../shared/back-button";
import React, { useState, useEffect } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { FaCircleMinus } from "react-icons/fa6";
import defaultImage from "../../Food.png";
import RemoveInventory from "./removeInventory";
import axios from "axios";
import { useAppContext } from "../../AppContext";
import { API_URL } from "@/api/constants";

let baseURL = import.meta.env.VITE_API_URL;
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "ngrok-skip-browser-warning": "69420",
    "Content-Type": "application/json",
  },
});

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

interface Props {
  setBasePage: React.Dispatch<React.SetStateAction<boolean>>;
  setListPage: React.Dispatch<React.SetStateAction<boolean>>;
  setRecipePage: React.Dispatch<React.SetStateAction<boolean>>;
  isAI: boolean;
}

type CombinedProps = { recipe: CompleteRecipe } & Props;

const Recipe: React.FC<CombinedProps> = ({
  recipe,
  setBasePage,
  setListPage,
  setRecipePage,
  isAI,
}) => {
  console.log("recipe: ", recipe);
  //const { globalUserId, setGlobalUserId } = useAppContext();
  const userIdString = localStorage.getItem("user_id");
  if (!userIdString)
    throw new Error("Could not fetch user_id from local_storage");
  const globalUserId = parseInt(userIdString);
  //const globalUserId = 38;
  const [servings, setServings] = useState<number>(recipe.servings);
  const [scaledIngredients, setScaledIngredients] = useState(
    recipe.ingredients
  );
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [inventoryUpdated, setInventoryUpdated] = useState<boolean>(false);
  const [removeableIngredients, setRemoveableIngredients] = useState<
    {
      name: string;
      amount: string;
      unit: string;
      maxAmount: number;
      userproduce_id: number;
    }[]
  >([]);
  function parseAmount(amount: string): number | string {
    const parsedAmount = parseFloat(amount);

    // Check if parsedAmount is a valid number
    if (!isNaN(parsedAmount)) {
      return parsedAmount; // Return as number for calculations
    } else {
      return amount; // Return as-is if it can't be converted
    }
  }

  const fetchInitialIngredients = async () => {
    console.log("fetching ingredient units ", recipe.usedIngredients);
    try {
      const response = await axiosClient.post("/recipe/ingredients", {
        ingredients: recipe.usedIngredients,
        user_id: globalUserId,
      });

      const data = await response.data;

      setRemoveableIngredients(data);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  const handlePopup = () => {
    setShowPopup(!showPopup);
  };

  const checkIngredient = (ingredientName: string): boolean => {
    // Return true if ingredient exists in usedIngredients, false if in missedIngredients
    return !recipe.missedIngredients.includes(ingredientName);
  };

  const getScaledIngredients = (newServings: number) => {
    const multiplier = newServings / recipe.servings;

    const newIngredients = recipe.ingredients.map((ingredient) => {
      const parsedAmount = parseAmount(ingredient.amount);
      return {
        ...ingredient,
        amount:
          typeof parsedAmount === "number"
            ? (parsedAmount * multiplier).toFixed(2).toString()
            : parsedAmount.toString(),
      };
    });
    return newIngredients;
  };

  useEffect(() => {
    fetchInitialIngredients();
    setServings(recipe.servings);
    setScaledIngredients(getScaledIngredients(recipe.servings));
    setShowPopup(false);
  }, [recipe, inventoryUpdated]);

  const handleServingIncrease = () => {
    setServings((prevServings) => {
      const updatedServings = prevServings + 1;
      setScaledIngredients(getScaledIngredients(updatedServings));

      return updatedServings;
    });

    //recipe.servings += 1;
  };
  const handleServingDecrease = () => {
    if (servings > 0) {
      setServings((prevServings) => {
        const updatedServings = prevServings - 1;
        setScaledIngredients(getScaledIngredients(updatedServings));
        return updatedServings;
      });

      //recipe.servings -= 1;
    }
  };

  return (
    <div className="recipe-page">
      <div className="recipe-top">
        {isAI ? (
          <BackButton
            setToFalsePage={[setRecipePage, setBasePage]}
            setToTruePage={[setListPage]}
            setToBasePage={setBasePage}
            backToBase={true}
          ></BackButton>
        ) : (
          <BackButton
            setToFalsePage={[setRecipePage, setBasePage]}
            setToTruePage={[setListPage]}
            setToBasePage={setBasePage}
            backToBase={false}
          ></BackButton>
        )}
        <button className="recipe-subtract-button" onClick={handlePopup}>
          Subtract Ingredients
        </button>
      </div>
      {showPopup && (
        <RemoveInventory
          ingredients={removeableIngredients}
          setInventoryUpdated={setInventoryUpdated}
        ></RemoveInventory>
      )}
      <div className="recipe">
        <div className="recipe-text">
          <h2 className="recipe-title">{recipe.title}</h2>
          <p className="recipe-used-count">-{recipe.usedIngredientCount}</p>
          <p className="recipe-missed-count">+{recipe.missedIngredientCount}</p>
        </div>
        <img
          src={recipe.image || defaultImage}
          alt={recipe.title}
          className="recipe-image"
        />
        <div className="serving-section">
          <FaCircleMinus
            onClick={handleServingDecrease}
            style={{ cursor: "pointer" }}
          ></FaCircleMinus>
          <div className="serving-text">{servings} serves</div>
          <FaCirclePlus
            onClick={handleServingIncrease}
            style={{ cursor: "pointer" }}
          ></FaCirclePlus>
        </div>
        <div className="ingredients-section">
          <div className="ingredients-title">Ingredients</div>
          <div className="ingredient-list">
            {scaledIngredients.map((ingredient, index) => (
              <div className="ingredient" key={index}>
                <div className="ingredient-amount">{ingredient.amount} </div>
                <div className="ingredient-unit"> {ingredient.unit}</div>
                <div className="ingredient-title"> {ingredient.name}</div>
                <span
                  className="ingredient-circle"
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: checkIngredient(ingredient.name)
                      ? "transparent"
                      : "red",
                    display: "inline-block",
                    marginLeft: "10px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="instructions">
          <div className="instructions-title"> Instructions</div>
          {recipe.instructions == null || recipe.instructions.length < 1 ? (
            <a
              href={recipe.sourceURL}
              target="_blank"
              rel="noopener noreferrer"
              className="instructions-text"
            >
              Refer to this website
            </a>
          ) : (
            recipe.instructions.map((instruction, index) => (
              <div key={index} className="instructions-step">
                {instruction}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipe;
