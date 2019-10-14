import { usePlanningState } from "../../contexts/planning";
import { useRecipesState } from "../../contexts/recipes";

function useEnhancedRecipes() {
  const { planning, isError: planningError } = usePlanningState();
  const { recipes, isError: recipesError } = useRecipesState();
  const enhancedRecipes = recipes.map((recipe) => {
    const sortedPlannings = planning
      .filter(({ recipe: { _id: recipeId} }) => recipe._id === recipeId)
      .map(({ date }) => date)
      .sort((a, b) => a > b ? -1 : 1)
    return {
      ...recipe,
      lastDate: sortedPlannings.length ? sortedPlannings[0] : "",
    }
  });

  return {
    isLoading: planningError || recipesError,
    recipes: enhancedRecipes,
  };
}

export { useEnhancedRecipes };