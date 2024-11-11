import React, { useState } from "react";
import BackButton from "../shared/back-button";

import "./recipe.css";

interface Recipe {
  title: string;
  number: number;
  pictureUrl: string;
  ingredients: string[];
  instructions: string[];
  index: number;
}

interface RecipeList {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

const RecipeList: React.FC<RecipeList> = ({ recipes, onSelectRecipe }) => {
  return (
    <>
      <BackButton></BackButton>
      <div className="recipe-list">
        {recipes.map((recipe, index) => (
          <div
            key={index}
            className="recipe-card"
            onClick={() => onSelectRecipe(recipe)}
          >
            <h2 className="recipe-title">{recipe.title}</h2>
            <img
              src={recipe.pictureUrl}
              alt={recipe.title}
              className="recipe-image"
            />
            <p className="recipe-number">{+recipe.number}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default RecipeList;
