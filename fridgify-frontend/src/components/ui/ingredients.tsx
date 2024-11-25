import React, { useState } from "react";
import "./ingredients.css";

interface Pairs {
  name: string;
  days: number;
  shelfPercentage: number;
}

interface IngredientsProps {
  ingredients: Pairs[];
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
    ingredient.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const sortedIngredients = filteredIngredients.sort((a, b) => a.days - b.days);

  const getDotColor = (days: number): string => {
    if (days < 4) return "red";
    if (days < 7) return "yellow";
    return "green";
  };

  return (
    <div>
      <div className="inv-title">Inventory</div>
      <input
        type="text"
        placeholder="Search ingredients..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      ></input>
      <div className="ingredients">
        {sortedIngredients
          .slice(0, showAll ? ingredients.length : 10)
          .map((ingredient, index) => (
            <button
              className={`ingredient-button ${
                selectedIngredients.includes(ingredient.name) ? "selected" : ""
              }`}
              key={index}
              onClick={() => handleIngredientClick(ingredient.name)}
            >
              {ingredient.name}
              <span
                className="dot"
                style={{
                  backgroundColor: getDotColor(ingredient.days),
                  borderRadius: "50%",
                  width: "8px",
                  height: "8px",
                  marginLeft: "8px",
                  display: "inline-block", //
                }}
              ></span>
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
