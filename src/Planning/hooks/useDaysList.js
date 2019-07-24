import React from "react";
import moment from "moment";
import {
  compareDateProperty,
  generateDateList,
} from "../../utils/date";

function useDaysList(recipes = []) {
  const [days, setDays] = React.useState([]);
  const [offset, setOffset] = React.useState(0);
  const addDays = () => setOffset(off => off - 10);
  React.useEffect(() => {
    const daysList = generateDateList(
      moment().add(offset, "d"),
      moment().add(10, "d")
    );
    const allDays = recipes
      .map(recipe => recipe.dates.map(date => ({ date, recipe })))
      .flat()
      .sort(compareDateProperty);
    const mergedDays = daysList.map(date => ({
      date,
      recipes: allDays
        .filter(({ date: day }) => day === date)
        .map(({ recipe }) => recipe)
    }));
    setDays(mergedDays);
  }, [recipes, offset]);

  return [days, setDays, addDays];
}

export { useDaysList };
