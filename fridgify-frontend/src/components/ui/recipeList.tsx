import React, { useState } from "react";
import BackButton from "../shared/back-button";

import "./recipe.css";

interface Recipe {
  id: number;
  title: string;
  missedIngredientCount: number;
  usedIngredientCount: number;
  image: string;
  missedIngredients: string[];
  usedIngredients: string[];
}

interface RecipeList {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

const RecipeList: React.FC<RecipeList> = ({ recipes, onSelectRecipe }) => {
  return (
    <>
      <BackButton></BackButton>
      <div className="recipes-list">
        {recipes.map((recipe, index) => (
          <div
            key={index}
            className="recipes-card"
            onClick={() => onSelectRecipe(recipe)}
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              className="recipes-image"
            />
            <div className="recipes-text">
              <h2 className="recipes-title">{recipe.title}</h2>
              <p className="recipes-used-count">
                -{recipe.usedIngredientCount}
              </p>
              <p className="recipes-missed-count">
                +{recipe.missedIngredientCount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RecipeList;
