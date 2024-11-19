import React, { useState } from "react";
import BackButton from "../shared/back-button";
import { IoIosRefresh } from "react-icons/io";
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
  setRecalculate: React.Dispatch<React.SetStateAction<boolean>>;
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
  setRecalculate,
}) => {
  const sortedRecipes = recipes.sort(
    (a, b) => a.missedIngredientCount - b.missedIngredientCount
  );
  return (
    <>
      <div className="recipe-list-up">
        <BackButton
          setToFalsePage={[setListPage, setRecipePage]}
          setToTruePage={[setBasePage]}
          setToBasePage={setBasePage}
          backToBase={false}
        ></BackButton>
        <button
          className="refresh"
          onClick={() => {
            setRecalculate(true);
          }}
        >
          <IoIosRefresh size={24} />
        </button>
      </div>
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
