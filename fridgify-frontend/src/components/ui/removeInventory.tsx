import React, { useEffect, useState } from "react";
import "./removeInventory.css";
import { SlClose } from "react-icons/sl";
import axios from "axios";
import { useAppContext } from "../../AppContext";
let baseURL = import.meta.env.VITE_API_URL;

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  maxAmount: number;
  userproduce_id: number;
}

interface IngredientProps {
  ingredient: Ingredient;
  deleteIngredient: (name: string) => void; // Add delete function prop
  onAmountChange: (userproduce_id: number, newAmount: number) => void; // Callback for amount changes
}

interface Ingredients {
  ingredients: Ingredient[];
  setInventoryUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

const IngredientItem: React.FC<IngredientProps> = ({
  ingredient,
  deleteIngredient,
  onAmountChange,
}) => {
  // Initialize amount state with the default value (1 if undefined)
  const [amount, setAmount] = useState<string>(ingredient.amount || "1");

  // Handle input change for amount
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      // Allow the input to be empty
      setAmount(""); // Or setAmount("") if you want to show an empty field
      onAmountChange(ingredient.userproduce_id, 0);
      return;
    }
    const newAmount = parseFloat(e.target.value);

    if (!isNaN(newAmount) && newAmount >= 0) {
      setAmount(
        newAmount > ingredient.maxAmount
          ? ingredient.maxAmount.toString()
          : newAmount.toString()
      );
      onAmountChange(ingredient.userproduce_id, newAmount);
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
  setInventoryUpdated,
}) => {
  /*const ingredients = [
    { name: "Flour", unit: "g", amount: 1 },
    { name: "Sugar", unit: "tbsp", amount: 1 },
    { name: "Milk", unit: "ml", amount: 1 },
  ];*/
  //console.log("initial ingredients: ", initialIngredients);
  const { globalUserId, setGlobalUserId } = useAppContext();
  const [ingredients, setIngredients] =
    useState<Ingredient[]>(initialIngredients);
  const [userAmounts, setUserAmounts] = useState<Record<number, number>>({});

  const deleteIngredient = (name: string) => {
    setIngredients(
      ingredients.filter((ingredient) => ingredient.name !== name)
    );
  };

  const handleAmountChange = (userproduce_id: number, newAmount: number) => {
    setUserAmounts((prev) => ({
      ...prev,
      [userproduce_id]: newAmount, // Update the amount for the specific userproduce_id
    }));
  };

  useEffect(() => {
    setIngredients(initialIngredients);
  }, []);

  const handleSubmit = async () => {
    // Construct the data in the expected format
    const data = ingredients.reduce((result, ingredient) => {
      const userInputAmount = userAmounts[ingredient.userproduce_id] || 0;
      if (userInputAmount > 0) {
        result[ingredient.userproduce_id] =
          ingredient.maxAmount - userInputAmount; // Map userproduce_id to amount
      }
      return result;
    }, {} as Record<number, number>); // Backend expects a { userproduce_id: amount } object

    try {
      const response = await axios.put(
        baseURL + "/api/user/" + globalUserId + "/produce",
        data
      );

      const result = await response.data;
      setInventoryUpdated(true);
      console.log("Success:", result);
      alert("Successfully subtracted from inventory!");
    } catch (error) {
      console.error("Error during submission:", error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <div className="popup-section">
      <h1 className="popup-title">Ingredients List</h1>
      {ingredients.map((ingredient, index) => (
        <IngredientItem
          key={index}
          ingredient={ingredient}
          deleteIngredient={deleteIngredient}
          onAmountChange={handleAmountChange}
        />
      ))}
      <div className="popup-bottom">
        <div className="popup-empty"></div>
        <button className="popup-button" onClick={handleSubmit}>
          Subtract from inventory
        </button>
      </div>
    </div>
  );
};

export default IngredientList;
