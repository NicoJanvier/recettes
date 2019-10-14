import React from "react";
import { usePlanningState } from "../../contexts/planning";
import { generateDateList } from "../../utils/date";

function getDays(planning, offset) {
  if (planning.length > 0) {
    const days = generateDateList(offset).map(date => ({
      date,
      planningPoints: planning.filter(dateObj => dateObj.date === date)
    }));
    return days
  }
  return []
}

function reducer(state, { type, payload }) {
  let days;
  let offset;
  switch (type) {
    case 'fromRecipes':
      if (payload.planning.length === 0) return state;
      days = getDays(payload.planning, state.offset);
      return { ...state, days }
    case 'addDays':
      offset = state.offset - 10;
      days = getDays(payload.planning, offset);
      return { ...state, days, offset }
    case 'updateDays':
      const { planningPoint, add, remove } = payload;
      days = state.days;
      if (!!add) {
        const addDay = days.find(({ date }) => date === add.date);
        const { index = 0 } = add;
        planningPoint.date = add.date;
        addDay.planningPoints.splice(index, 0, { ...planningPoint, date: add.date })
      }
      if (!!remove) {
        const removeDay = days.find(({ date }) => date === remove.date);
        removeDay.planningPoints = removeDay.planningPoints.filter(({ _id }) => _id !== planningPoint._id);
      }
      return { ...state, days }
    default:
      break;
  }
}

function useDaysList() {
  const {
    planning,
    isError,
    updatePlanningPoint,
    createPlanningPoint,
    deletePlanningPoint,
  } = usePlanningState();
  
  const [{ days }, dispatch] = React.useReducer(reducer, { days: [], offset: 0 });

  const addDays = () => dispatch({ type: 'addDays', payload: { planning } });

  React.useEffect(() => {
    dispatch({ type: 'fromRecipes', payload: { planning } })
  }, [planning]);

  const moveRecipe = ({ id, add, remove, recipe }) => {
    let planningPoint;
    if (add && remove) {
      planningPoint = planning.find(({ _id }) => _id === id);
      dispatch({ type: 'updateDays', payload: { planningPoint, add, remove } });
      updatePlanningPoint(planningPoint);
    } else if (add) {
      const { date } = add;
      planningPoint = { date, note: '', _id: 'placeholder', recipe };
      dispatch({ type: 'updateDays', payload: { planningPoint, add } });
      createPlanningPoint({ date, note: '', recipe: recipe._id });
    } else if (remove) {
      planningPoint = planning.find(({ _id }) => _id === id);
      dispatch({ type: 'updateDays', payload: { planningPoint, remove } });
      deletePlanningPoint(id);
    }
  }

  return { days, addDays, isError, moveRecipe };
  }

  export { useDaysList };
