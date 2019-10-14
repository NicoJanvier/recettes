import { useRecipesState } from '../../contexts/recipes';
// import { usePlanningState } from '../../contexts/planning';

const initialData = {
  title: '',
  description: '',
  url: '',
  vegetarian: false,
  // dates: [],
}
export default function useRecipe(id) {
  const { recipes, isLoading: recipeLoading, deleteRecipe, updateRecipe, createRecipe } = useRecipesState();
  // const { planning, isLoading: planningLoading } = usePlanningState();
  const recipe = recipes.find(({ _id }) => _id === id) || initialData;
  // const planningPoints = planning
  //   .filter(({ recipe: { _id: recipeId} }) => recipeId === recipe._id)
  //   .map(({ date, note, _id }) => ({ date, note, _id }));
  const onRemove = async () => deleteRecipe(recipe._id);
  const onSave = payload => {
    const fn = (id === "new") ? createRecipe : updateRecipe;
    return fn({ ...recipe, ...payload })
  }
  return {
    recipe: {
      ...recipe,
      // dates: planningPoints,
    },
    isLoading: recipeLoading,// || planningLoading,
    onRemove,
    onSave
  };
}
