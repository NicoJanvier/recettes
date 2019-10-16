import { useRecipesState } from '../../contexts/recipes';

const initialData = {
  title: '',
  description: '',
  url: '',
  vegetarian: false,
}
export default function useRecipe(id) {
  const { recipes, isLoading: recipeLoading, deleteRecipe, updateRecipe, createRecipe } = useRecipesState();
  const recipe = recipes.find(({ _id }) => _id === id) || initialData;
  const onRemove = async () => deleteRecipe(recipe._id);
  const onSave = payload => {
    const fn = (id === "new") ? createRecipe : updateRecipe;
    return fn({ ...recipe, ...payload })
  }
  return {
    recipe: {
      ...recipe,
    },
    isLoading: recipeLoading,
    onRemove,
    onSave
  };
}
