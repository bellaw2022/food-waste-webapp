import React, { useState } from "react";
import "./ingredients.css";

interface IngredientsProps {
  ingredients: string[];
  onSelectionChange: (selectedIngredients: string[]) => void;
}

const Ingredients: React.FC<IngredientsProps> = ({
  ingredients,
  onSelectionChange,
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const [showAll, setShowAll] = useState(false);

  const handleIngredientClick = (ingredient: string) => {
    const newSelectedIngredients = selectedIngredients.includes(ingredient)
      ? selectedIngredients.filter((i) => i !== ingredient)
      : [...selectedIngredients, ingredient];

    setSelectedIngredients(newSelectedIngredients);
    onSelectionChange(newSelectedIngredients);
  };

  const toggleShowAll = () => setShowAll(!showAll);

  return (
    <div className="ingredients">
      {ingredients
        .slice(0, showAll ? ingredients.length : 10)
        .map((ingredient, index) => (
          <button
            className={`ingredient-button ${
              selectedIngredients.includes(ingredient) ? "selected" : ""
            }`}
            key={index}
            onClick={() => handleIngredientClick(ingredient)}
          >
            {ingredient}
          </button>
        ))}
      {ingredients.length > 10 && (
        <button onClick={toggleShowAll} className="ingredient-button">
          {showAll ? "Show Less" : "More..."}
        </button>
      )}
    </div>
  );
};

export default Ingredients;
