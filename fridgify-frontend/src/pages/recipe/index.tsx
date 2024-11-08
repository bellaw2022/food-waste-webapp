import Ingredients from "@/components/ui/ingredients";

export const RecipePage = () => {
  const ingredients = [
    "Tomato",
    "Lettuce",
    "Cheese",
    "Bacon",
    "Onion",
    "Pickle",
    "Ketchup",
    "Mayo",
    "Mustard",
    "Relish",
    "Cucumber",
    "Carrot",
    "Radish",
    "Olive",
    "Pepper",
    "Garlic",
  ];

  const handleSelectionChange = (selectedIngredients: string[]) => {
    console.log("Selected ingredients:", selectedIngredients);
  };

  return (
    <div className="mx-4">
      <h1 className="text-3xl font-bold">Recipe Rec</h1>
      <Ingredients
        ingredients={ingredients}
        onSelectionChange={handleSelectionChange}
      ></Ingredients>
    </div>
  );
};
