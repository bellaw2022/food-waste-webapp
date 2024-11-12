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

  const checkIngredient = (ingredientName: string): boolean => {
    // Return true if ingredient exists in usedIngredients, false if in missedIngredients
    return !recipe.missedIngredients.includes(ingredientName);
  };

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
          <div className="ingredients-title">Ingredients</div>
          <div className="ingredient-list">
            {scaledIngredients.map((ingredient, index) => (
              <div className="ingredient" key={index}>
                <div className="ingredient-amount">
                  {parseFloat(ingredient.amount.toFixed(1))}{" "}
                </div>
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
          <a
            href={recipe.sourceURL}
            target="_blank"
            rel="noopener noreferrer"
            className="instructions-text"
          >
            Refer to this website
          </a>
        </div>
      </div>
    </>
  );
};

export default Recipe;
