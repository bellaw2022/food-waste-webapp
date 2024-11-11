import BackButton from "../shared/back-button";
interface CompleteRecipe {
  id: number;
  title: string;
  missedIngredientCount: number;
  usedIngredientCount: number;
  image: string;
  missedIngredients: string[];
  usedIngredients: string[];
  servings: number;
  cookingMinutes: number;
  prepMinutes: number;
  sourceURL: string;
  ingredients: { name: string; unit: string; amount: number }[];
}

const Recipe: React.FC<CompleteRecipe> = ({
  id,
  title,
  missedIngredientCount,
  usedIngredientCount,
  image,
  missedIngredients,
  usedIngredients,
  servings,
  cookingMinutes,
  prepMinutes,
  sourceURL,
  ingredients,
}) => {
  return (
    <>
      <div className="recipes-text">
        <h2 className="recipes-title">{title}</h2>
        <p className="recipes-used-count">-{usedIngredientCount}</p>
        <p className="recipes-missed-count">+{missedIngredientCount}</p>
      </div>
      <img src={image} alt={title} className="recipe-image" />
      <div className="ingredients-section">
        <div className="serving-section">{servings} serves</div>
        <div className="ingredient-list">
          {ingredients.map((ingredient, index) => (
            <div className="ingredient" key={index}>
              <div className="ingredient-amount">{ingredient.amount} </div>
              <div className="ingredient-unit"> {ingredient.unit}</div>
              <div className="ingredient-count"> {ingredient.name}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
