import React from "react";
import {
  compareDateProperty,
  generateDateList,
  addDays
} from "../../utils/date";

function useDaysList(recipes = []) {
  const [days, setDays] = React.useState([]);
  React.useEffect(() => {
    if (recipes.length !== 0) {
      const allRecipes = recipes;
      const allDays = allRecipes
        .map(recipe => recipe.dates.map(date => ({ date, recipe })))
        .flat()
        .sort(compareDateProperty);
      const fullDaysList = generateDateList(
        allDays[0].date,
        allDays[allDays.length - 1].date
      );

      const mergedDays = fullDaysList.map(date => ({
        date,
        recipes: allDays
          .filter(({ date: day }) => day === date)
          .map(({ recipe }) => recipe)
      }));

      const lastDate = mergedDays[mergedDays.length - 1].date;
      const emptyDays = [];
      for (let offset = 1; offset <= 7; offset++) {
        const newDay = { date: addDays(lastDate, offset), recipes: [] };
        emptyDays.push(newDay);
      }

      setDays([...mergedDays, ...emptyDays]);
    }
  }, [recipes]);
  return [days, setDays];
}

export { useDaysList };