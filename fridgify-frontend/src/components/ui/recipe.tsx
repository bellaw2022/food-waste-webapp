import { mul } from "@tensorflow/tfjs";
import BackButton from "../shared/back-button";
import React, { useState, useEffect } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { FaCircleMinus } from "react-icons/fa6";
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

const Recipe: React.FC<{ recipe: CompleteRecipe }> = ({ recipe }) => {
  console.log("recipe: ", recipe);
  const [servings, setServings] = useState<number>(recipe.servings);
  const [scaledIngredients, setScaledIngredients] = useState(
    recipe.ingredients
  );

  const getScaledIngredients = (newServings: number) => {
    const multiplier = newServings / recipe.servings;

    const newIngredients = recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      amount: ingredient.amount * multiplier,
    }));
    return newIngredients;
  };

  useEffect(() => {
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
    <>
      <BackButton></BackButton>
      <div className="recipe">
        <div className="recipe-text">
          <h2 className="recipe-title">{recipe.title}</h2>
          <p className="recipe-used-count">-{recipe.usedIngredientCount}</p>
          <p className="recipe-missed-count">+{recipe.missedIngredientCount}</p>
        </div>
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
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
          <div className="ingredient-list">
            {scaledIngredients.map((ingredient, index) => (
              <div className="ingredient" key={index}>
                <div className="ingredient-amount">
                  {parseFloat(ingredient.amount.toFixed(1))}{" "}
                </div>
                <div className="ingredient-unit"> {ingredient.unit}</div>
                <div className="ingredient-count"> {ingredient.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="instructions">
          Refer to the following website: {recipe.sourceURL}
        </div>
      </div>
    </>
  );
};

export default Recipe;
