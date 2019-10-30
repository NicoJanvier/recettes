import React from "react";
import { usePlanningState } from "../../contexts/planning";
import { generateDateList } from "../../utils/date";

function getDays(planning, offset) {
  const days = generateDateList(offset).map(date => ({
    date,
    planningPoints: planning.filter(dateObj => dateObj.date === date)
  }));
  return days
}

function useDaysList() {
  const {
    planning,
    isError,
    updatePlanningPoint,
    createPlanningPoint,
    deletePlanningPoint,
    offsetState: [offset, setOffset],
  } = usePlanningState();

  const initialDays = getDays(planning, offset);
  const [days, setDays] = React.useState(initialDays);

  React.useEffect(() => {
    setDays(getDays(planning, offset))
  }, [planning, offset])

  const addDays = () => setOffset(off => off - 10);

  const updateDays = ({ planningPoint, add, remove }) =>
    setDays(days => {
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
      return days
    })

  const moveRecipe = ({ id, add, remove, recipe }) => {
    let planningPoint;
    if (add && remove) {
      planningPoint = planning.find(({ _id }) => _id === id);
      updateDays({ planningPoint, add, remove })
      updatePlanningPoint(planningPoint);
    } else if (add) {
      const { date } = add;
      planningPoint = { date, note: '', _id: 'placeholder', recipe };
      updateDays({ planningPoint, add })
      createPlanningPoint({ date, note: '', recipe: recipe._id });
    } else if (remove) {
      planningPoint = planning.find(({ _id }) => _id === id);
      updateDays({ planningPoint, remove })
      deletePlanningPoint(id);
    }
  }

  return { days, addDays, isError, moveRecipe };
}

export { useDaysList };
