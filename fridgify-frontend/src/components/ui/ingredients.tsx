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
  // keep track of selected ingredients
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  // whether or not to display all ingredients or just the first 10
  const [showAll, setShowAll] = useState(false);
  // user input in search bar
  const [searchQuery, setSearchQuery] = useState("");
  const handleIngredientClick = (ingredient: string) => {
    const newSelectedIngredients = selectedIngredients.includes(ingredient)
      ? selectedIngredients.filter((i) => i !== ingredient)
      : [...selectedIngredients, ingredient];

    setSelectedIngredients(newSelectedIngredients);
    onSelectionChange(newSelectedIngredients);
  };

  const toggleShowAll = () => setShowAll(!showAll);

  // Filter ingredients based on the search query
  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search ingredients..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      ></input>
      <div className="ingredients">
        {filteredIngredients
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
        {filteredIngredients.length > 10 && (
          <button onClick={toggleShowAll} className="ingredient-button">
            {showAll ? "▲" : "... ▼"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Ingredients;
