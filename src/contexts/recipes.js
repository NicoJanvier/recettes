import React from "react";
import axios from 'axios';
import useDataApi from "../hooks/useDataApi";

const RecipesStateContext = React.createContext();
function RecipesProvider({ children }) {
  const api = { url: `/api/recipes`, method: "get" };
  const [{ isLoading, isError, data }, setUrl] = useDataApi(api, []);
  const refresh = () => setUrl(api);

  async function updateRecipe(recipe) {
    const { _id: strictId, title, description, url, vegetarian, dates } = recipe;
    const options = {
      url: `/api/recipes/${strictId}`,
      method: "put",
      data: {
        title,
        description,
        url,
        vegetarian,
        dates
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

  async function createRecipe(recipe) {
    const { title, description, url, vegetarian, dates } = recipe;
    const options = {
      url: `/api/recipes`,
      method: "post",
      data: {
        title,
        description,
        vegetarian,
        url,
        dates,
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

  async function deleteRecipe(id) {
    return axios({
      url: `api/recipes/${id}`,
      method: "delete"
    })
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
  }

  const recipes = data.data || [];
  return (
    <RecipesStateContext.Provider
      value={{
        recipes,
        isLoading,
        isError,
        createRecipe,
        updateRecipe,
        deleteRecipe
      }}
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
