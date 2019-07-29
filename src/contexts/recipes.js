import React from "react";
import useDataApi from "../hooks/useDataApi";

const RecipesStateContext = React.createContext();
function RecipesProvider({ children }) {
  const url = { url: `/api/recipes`, method: "get" };
  const [{ isLoading, isError, data }, setUrl] = useDataApi(url, []);
  const refresh = () => setUrl(url);
  const recipes = data.data || [];
  return (
    <RecipesStateContext.Provider
      value={{ recipes, isLoading, isError, refresh }}
    >
      {children}
    </RecipesStateContext.Provider>
  );
}
function useRecipesState() {
  const context = React.useContext(RecipesStateContext);
  if (context === undefined) {
    throw new Error("useRecipesState must be used within a RecipesProvider");
  }
  return context;
}
export { RecipesProvider, useRecipesState, RecipesStateContext };
