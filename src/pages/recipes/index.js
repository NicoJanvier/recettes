import React from 'react'
import * as queryString from 'query-string'
import HeaderBar from '../../HeaderBar'
import { BoxNextAppBar } from '../../HeaderBar/index.style'

import { Container, Grid, Typography } from '@material-ui/core'
import { useDaysList } from '../../Planning/hooks/useDaysList'

import { useEnhancedRecipes } from './hooks/useEnhancedRecipes'
import Fuse from 'fuse.js'
import SearchBar from '../../List/SearchBar'
import RecipeCard from '../../RecipeCard'
import { GridContainer } from '../../List/index.style'
import PickingAppBar from '../../List/PickingAppBar'
import FiltersExpansion from '../../List/FiltersExpansion'

const initialState = {
  search: "",
  veg: false,
  sortByDate: false,
  expanded: false,
  hideNew: false,
}

function reducer(state, { type, payload }) {
  switch (type) {
    case 'SEARCH':
      return { ...state, search: payload, sortByDate: false };
    case 'RESET_SEARCH':
      return { ...state, search: "" };
    case 'TOGGLE_VEG':
      return { ...state, veg: !state.veg };
    case 'TOGGLE_SORT_BY_DATE':
      return { ...state, sortByDate: !state.sortByDate };
    case 'TOGGLE_PANEL':
      return { ...state, expanded: !state.expanded };
    case 'TOGGLE_HIDE_NEW':
      return { ...state, hideNew: !state.hideNew }
    default:
      throw new Error(`Unhandled type: ${type}`);
  }
};

const RecipesPage = ({ navigate, location }) => {

  const { isPicking } = location.state;
  const { date } = queryString.parse(location.search);
  const { moveRecipe } = useDaysList();
  const onPick = recipe => {
    moveRecipe({ recipe, add: { date } });
    navigate("../");
  }
  const pick = {
    isPicking,
    onPick,
    toPath: id => navigate(`${id}${location.search}`, { state: { ...location.state } })
  }
  const { recipes, isError, isLoading } = useEnhancedRecipes();
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { search, veg, sortByDate, hideNew } = state;

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
    .filter(recipe => {
      if (hideNew) {
        return recipe.lastDate !== "";
      }
      return true;
    })
    .sort((a, b) => {
      if (sortByDate) return a.lastDate < b.lastDate ? -1 : 1;
      return null;
    });
  const message = isError ? 'Uner erreur est apparue' :
    Boolean(listRecipes.length) ? `${listRecipes.length} recettes trouvées` :
      Boolean(search) ? `Aucune recette pour "${search}"` : null;
  return (
    <>
      {!isPicking ?
        <HeaderBar isLoading={isLoading} /> :
        <PickingAppBar
          onBack={() => navigate('../')}
          onNew={() => navigate(`new${location.search}`, { state: location.state })}
          {...{ dispatch, ...state }}
        />
      }
      <BoxNextAppBar>
        {!isPicking ?
          <SearchBar dispatch={dispatch} {...state} /> :
          <FiltersExpansion {...{ dispatch, ...state }} />
        }
        <Container>
          <GridContainer container spacing={2}>
            {message &&
              <Typography color="textSecondary" align="center" style={{ width: '100%', marginTop: "-8px" }}>
                {message}
              </Typography>
            }
            {listRecipes.map(recipe => (
              <Grid item xs={12} key={recipe._id}>
                <RecipeCard {...{ recipe, pick }} />
              </Grid>
            ))}
          </GridContainer>
        </Container>
      </BoxNextAppBar>
    </>
  )
}

export default RecipesPage
