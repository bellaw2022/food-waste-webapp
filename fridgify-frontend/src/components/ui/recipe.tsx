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

  useEffect(() => {
    setServings(recipe.servings);
  }, [recipe.servings]);

  const handleServingIncrease = () => {
    console.log("increase");
    setServings(servings + 1);
    recipe.servings += 1;
  };
  const handleServingDecrease = () => {
    console.log("decrease");
    if (servings > 0) {
      setServings(servings - 1);
      recipe.servings -= 1;
    }
  };

  return (
    <>
      <BackButton></BackButton>
      <div className="recipes-text">
        <h2 className="recipes-title">{recipe.title}</h2>
        <p className="recipes-used-count">-{recipe.usedIngredientCount}</p>
        <p className="recipes-missed-count">+{recipe.missedIngredientCount}</p>
      </div>
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      <div className="serving-section">
        <button></button>
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
          {recipe.ingredients.map((ingredient, index) => (
            <div className="ingredient" key={index}>
              <div className="ingredient-amount">{ingredient.amount} </div>
              <div className="ingredient-unit"> {ingredient.unit}</div>
              <div className="ingredient-count"> {ingredient.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="instructions">
        Refer to the following website: {recipe.sourceURL}
      </div>
    </>
  );
};

export default Recipe;
