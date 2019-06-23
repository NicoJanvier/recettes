import React from "react";
const PlanningStateContext = React.useContext();
const PlanningDispatchContext = React.useContext();

const PLANNING = {
  unplanned: [
    RecipeModel,
    ...
  ],
  planned: [
    {
      date: "2019-06-25",
      recipe: RecipeModel
    }
  ]
};

function planningReducer(state, action) {
  switch (action.type) {
    case "add": {
      return { meals: [...state.meals, action.payload] };
    }
    case "remove": {
      return { count: state.count - 1 };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
function CountProvider({ children }) {
  const [state, setCount] = React.useReducer(planningReducer, { meals: [] });
  return (
    <PlanningStateContext.Provider value={state}>
      <PlanningDispatchContext.Provider value={setCount}>
        {children}
      </PlanningDispatchContext.Provider>
    </PlanningStateContext.Provider>
  );
}
export { CountProvider };
