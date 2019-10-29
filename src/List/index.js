import React from "react";
import Fuse from 'fuse.js';
import * as queryString from 'query-string';
import {
  Grid,
  Container,
} from "@material-ui/core";

import SearchBar from "./SearchBar";
import RecipeCard from "../RecipeCard";
import { useEnhancedRecipes } from "./hooks/useEnhancedRecipes";
import { GridContainer } from './index.style'
import { useDaysList } from "../Planning/hooks/useDaysList";

function reducer(state, { type, payload }) {
  switch (type) {
    case 'SEARCH':
      return { ...state, search: payload };
    case 'RESET_SEARCH':
      return { ...state, search: "" };
    case 'TOGGLE_VEG':
      return { ...state, veg: !state.veg };
    case 'TOGGLE_SORT_BY_DATE':
      return { ...state, sortByDate: !state.sortByDate };
    default:
      throw new Error(`Unhandled type: ${type}`);
  }
};

const List = ({ onPick }) => {
  const { recipes, isError } = useEnhancedRecipes();
  const [state, dispatch] = React.useReducer(reducer, {
    search: '',
    veg: false,
    sortByDate: true,
  });
  const { search, veg, sortByDate } = state;

  const fuse = React.useCallback(
    () => {
      const fuseOptions = {
        keys: ['title'],
        threshold: 0.35,
      };
      const fuse = new Fuse(recipes, fuseOptions);
      return fuse.search(search);
    },
    [recipes, search],
  );

  const listRecipes = (search ? fuse() : recipes)
    .filter(recipe => {
      if (veg) {
        return recipe.vegetarian;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortByDate) return a.lastDate < b.lastDate ? -1 : 1;
      return null;
    });


  return (
    <>
      <SearchBar dispatch={dispatch} {...state} />
      <Container>
        {isError && "Une erreur est apparue."}
        <GridContainer container spacing={2}>
          {listRecipes.map(recipe => (
            <Grid item xs={12} key={recipe._id}>
              <RecipeCard {...{ recipe, onPick }} />
            </Grid>
          ))}
        </GridContainer>
      </Container>
    </>
  );
}

export default List