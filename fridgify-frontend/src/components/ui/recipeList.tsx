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

interface Props {
  setBasePage: React.Dispatch<React.SetStateAction<boolean>>;
  setListPage: React.Dispatch<React.SetStateAction<boolean>>;
  setRecipePage: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RecipeList {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

type CombinedProps = RecipeList & Props;

const RecipeList: React.FC<CombinedProps> = ({
  recipes,
  onSelectRecipe,
  setBasePage,
  setListPage,
  setRecipePage,
}) => {
  const sortedRecipes = recipes.sort(
    (a, b) => a.missedIngredientCount - b.missedIngredientCount
  );
  return (
    <>
      <BackButton
        setToFalsePage={[setListPage, setRecipePage]}
        setToTruePage={[setBasePage]}
        setToBasePage={setBasePage}
        backToBase={false}
      ></BackButton>
      <div className="recipes-list">
        {sortedRecipes.map((recipe, index) => (
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
