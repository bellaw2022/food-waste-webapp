import { mul } from "@tensorflow/tfjs";
import BackButton from "../shared/back-button";
import React, { useState, useEffect } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { FaCircleMinus } from "react-icons/fa6";
import defaultImage from "../../Food.png";
import RemoveInventory from "./removeInventory";
import axios from "axios";

let baseURL = import.meta.env.VITE_API_URL;

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
}

type CombinedProps = { recipe: CompleteRecipe } & Props;

const Recipe: React.FC<CombinedProps> = ({
  recipe,
  setBasePage,
  setListPage,
  setRecipePage,
}) => {
  console.log("recipe: ", recipe);
  const [servings, setServings] = useState<number>(recipe.servings);
  const [scaledIngredients, setScaledIngredients] = useState(
    recipe.ingredients
  );
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [removeableIngredients, setRemoveableIngredients] = useState<
    {
      name: string;
      amount: number;
      unit: string;
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
    try {
      const response = await axios.get(baseURL + "/api/recipe/ingredients", {
        params: { ingredients: recipe.usedIngredients },
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
            ? (parsedAmount * multiplier).toString()
            : parsedAmount.toString(),
      };
    });
    return newIngredients;
  };

  useEffect(() => {
    fetchInitialIngredients();
    setServings(recipe.servings);
    setScaledIngredients(getScaledIngredients(recipe.servings));
  }, [recipe]);

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
        {recipe.instructions != null ? (
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
        <RemoveInventory ingredients={removeableIngredients}></RemoveInventory>
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
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: checkIngredient(ingredient.name)
                      ? "green"
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
          {recipe.instructions == null ? (
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