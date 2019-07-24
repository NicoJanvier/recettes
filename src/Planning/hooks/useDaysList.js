import React from "react";
import moment from "moment";
import {
  compareDateProperty,
} from "../../utils/date";

function useDaysList(recipes = []) {
  const [days, setDays] = React.useState([]);
  const [offset, setOffset] = React.useState(0);
  const addDays = () => setOffset(off => off - 10);

  const generateDateList = React.useCallback(() => {
    const startM = moment().add(offset, "d");
    const endM = moment().add(10, "d");
    const days = [];
    let day = startM.clone();
    while (day.isSameOrBefore(endM)) {
      days.push(day.format("YYYY-MM-DD"));
      day = day.clone().add(1, "d");
    }
    return days;
  }, [offset]);

  React.useEffect(() => {
    const daysList = generateDateList();
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
  }, [recipes, generateDateList]);

  return [days, setDays, addDays];
}

export { useDaysList };
