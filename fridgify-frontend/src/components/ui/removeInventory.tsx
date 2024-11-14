import React, { useState } from "react";
import "./removeInventory.css";
import { SlClose } from "react-icons/sl";

interface Ingredient {
  name: string;
  unit: string;
  amount: number;
}

interface IngredientProps {
  ingredient: Ingredient;
  deleteIngredient: (name: string) => void; // Add delete function prop
}

interface Ingredients {
  ingredients: Ingredient[];
}

const IngredientItem: React.FC<IngredientProps> = ({
  ingredient,
  deleteIngredient,
}) => {
  // Initialize amount state with the default value (1 if undefined)
  const [amount, setAmount] = useState<number>(ingredient.amount || 1);

  // Handle input change for amount
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value);
    if (!isNaN(newAmount) && newAmount >= 0) {
      setAmount(newAmount);
    }
  };

  const handleDelete = () => {
    deleteIngredient(ingredient.name);
  };

  return (
    <div className="popup-ingredient">
      <input
        type="number"
        value={amount}
        min="0"
        onChange={handleAmountChange} // Update state on input change
        className="popup-ingredient-amount"
      />
      <span className="popup-ingredient-unit">{ingredient.unit}</span>
      <span className="popup-ingredient-name">{ingredient.name}</span>
      <button className="popup-ingredient-delete" onClick={handleDelete}>
        <SlClose size={16}></SlClose>
      </button>
    </div>
  );
};

const IngredientList: React.FC<Ingredients> = ({
  ingredients: initialIngredients,
}) => {
  /*const ingredients = [
    { name: "Flour", unit: "g", amount: 1 },
    { name: "Sugar", unit: "tbsp", amount: 1 },
    { name: "Milk", unit: "ml", amount: 1 },
  ];*/

  const [ingredients, setIngredients] =
    useState<Ingredient[]>(initialIngredients);

  const deleteIngredient = (name: string) => {
    setIngredients(
      ingredients.filter((ingredient) => ingredient.name !== name)
    );
  };

  return (
    <div className="popup-section">
      <h1 className="popup-title">Ingredients List</h1>
      {ingredients.map((ingredient, index) => (
        <IngredientItem
          key={index}
          ingredient={ingredient}
          deleteIngredient={deleteIngredient}
        />
      ))}
      <div className="popup-bottom">
        <div className="popup-empty"></div>
        <button className="popup-button">Subtract from inventory</button>
      </div>
    </div>
  );
};

export default IngredientList;
