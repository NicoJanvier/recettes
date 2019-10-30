import React from "react";
import axios from 'axios';
import useDataApi from "../hooks/useDataApi";

const PlanningStateContext = React.createContext();
function PlanningProvider({ children }) {
  const api = { url: `/api/planning`, method: "get" };
  const [{ isLoading, isError, data }, setUrl] = useDataApi(api, []);
  const refresh = () => setUrl(api);

  async function updatePlanningPoint(planningPoint) {
    const { _id: strictId, date, note } = planningPoint;
    const options = {
      url: `/api/planning/${strictId}`,
      method: "put",
      data: {
        date,
        note,
      }
    };
    return axios(options)
      .then(r => {
        console.log(r);
        refresh();
        return r;
      })
      .catch(e => {
        console.log(e)
        refresh();
        return e;
      });
  };

  async function createPlanningPoint(planningPoint) {
    const { date, note, recipe } = planningPoint;
    const options = {
      url: `/api/planning`,
      method: "post",
      data: {
        recipe,
        date,
        note,
      }
    };
    return axios(options)
      .then(r => {
        console.log(r);
        refresh();
        return r;
      })
      .catch(e => {
        console.log(e)
        refresh();
        return e;
      });
  };

  async function deletePlanningPoint(id) {
    return axios({
      url: `/api/planning/${id}`,
      method: "delete"
    })
      .then(r => {
        console.log(r);
        refresh();
        //REFRESH PLANNING!!!
        return r;
      })
      .catch(e => {
        console.log(e)
        refresh();
        return e;
      });
  };

  const planning = data.data || [];
  const offsetState = React.useState(0)
  return (
    <PlanningStateContext.Provider
      value={{
        planning,
        isLoading,
        isError,
        createPlanningPoint,
        updatePlanningPoint,
        deletePlanningPoint,
        offsetState,
      }}
    >
      {children}
    </PlanningStateContext.Provider>
  );
}
function usePlanningState() {
  const context = React.useContext(PlanningStateContext);
  if (context === undefined) {
    throw new Error("usePlanningState must be used within a PlanningProvider");
  }
  return context;
}
const PlanningConsumer = PlanningStateContext.Consumer;
export { PlanningProvider, usePlanningState, PlanningStateContext, PlanningConsumer };
