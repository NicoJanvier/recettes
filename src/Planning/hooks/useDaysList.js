import React from "react";
import moment from "moment";
import { useRecipesState } from "../../contexts/recipes";

function generateDateList(offset) {
  const startM = moment().add(offset, "d");
  const endM = moment().add(10, "d");
  const days = [];
  let day = startM.clone();
  while (day.isSameOrBefore(endM)) {
    days.push(day.format("YYYY-MM-DD"));
    day = day.clone().add(1, "d");
  }
  return days;
}

function getDays(recipes, offset) {
  if (recipes.length > 0) {
    const days = generateDateList(offset)
      .map(date => ({
        date,
        recipes: recipes
          .filter(({ dates }) => dates.map(d => d.date).includes(date))
      }));
    return days
  }
  return []
}

function reducer(state, action) {
  let days;
  let offset;
  switch (action.type) {
    case 'fromRecipes':
      if (action.payload.recipes.length === 0) return state;
      days = getDays(action.payload.recipes, state.offset);
      return { ...state, days }
    case 'addDays':
      offset = state.offset - 10;
      days = getDays(action.payload.recipes, offset);
      return { ...state, days, offset }
    case 'updateDays':
      const { recipe, add, remove } = action.payload;
      days = state.days;
      if (!!add) {
        const addDay = days.find(({ date }) => date === add.date);
        const { index = recipe.dates.length } = add;
        let note = "";
        if (!!remove) {
          note = recipe.dates.find(({date}) => date === remove.date).note;
        }
        recipe.dates.push({ date: add.date, note });
        addDay.recipes.splice(index, 0, recipe);
      }
      if (!!remove) {
        const removeDay = days.find(({ date }) => date === remove.date);
        recipe.dates = recipe.dates.filter(({ date }) => date !== remove.date);
        removeDay.recipes = removeDay.recipes.filter(({ _id }) => _id !== recipe._id);
      }
      return { ...state, days }
    default:
      break;
  }
}

function useDaysList() {
  const { recipes, isError, updateRecipe } = useRecipesState();
  const [{ days }, dispatch] = React.useReducer(reducer, { days: [], offset: 0 });

  const addDays = () => dispatch({ type: 'addDays', payload: { recipes } });

  React.useEffect(() => {
    dispatch({ type: 'fromRecipes', payload: { recipes } })
  }, [recipes]);

  const moveRecipe = ({ id, add, remove }) => {
    const recipe = recipes.find(({ _id }) => _id === id);
    dispatch({ type: 'updateDays', payload: { recipe, add, remove } });
    updateRecipe(recipe); //recipe is being mutated in the dispatch method...
  }

  return { days, addDays, isError, moveRecipe };
}

export { useDaysList };
