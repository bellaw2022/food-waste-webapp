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
  sourceURL: string;
  ingredients: { name: string; unit: string; amount: number }[];
}

const Recipe: React.FC<{ recipe: CompleteRecipe }> = ({ recipe }) => {
  return (
    <>
      <BackButton></BackButton>
      <div className="recipes-text">
        <h2 className="recipes-title">{recipe.title}</h2>
        <p className="recipes-used-count">-{recipe.usedIngredientCount}</p>
        <p className="recipes-missed-count">+{recipe.missedIngredientCount}</p>
      </div>
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      <div className="ingredients-section">
        <div className="serving-section">{recipe.servings} serves</div>
        <div className="ingredient-list">
          {recipe.ingredients.map((ingredient, index) => (
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

export default Recipe;
