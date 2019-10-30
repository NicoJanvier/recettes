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
    case 'TOGGLE_PANEL':
      return { ...state, expanded: !state.expanded };
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

  const { recipes, isError, isLoading } = useEnhancedRecipes();
  const [state, dispatch] = React.useReducer(reducer, {
    search: '',
    veg: false,
    sortByDate: false,
    expanded: false,
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
      {!isPicking ?
        <HeaderBar isLoading={isLoading} /> :
        <PickingAppBar
          onBack={() => navigate('../')}
          onNew={() => navigate(`new${location.search}`, { state: { ...location.state } })}
          {...{ dispatch, ...state }}
        />
      }
      <BoxNextAppBar>
        {!isPicking ?
          <SearchBar dispatch={dispatch} {...state} /> :
          <FiltersExpansion {...{dispatch, ...state}}/>
        }
        <Container>
          {isError && "Une erreur est apparue."}
          <GridContainer container spacing={2}>
            {listRecipes.map(recipe => (
              <Grid item xs={12} key={recipe._id}>
                <RecipeCard {...{ recipe, onPick: isPicking ? onPick : null }} />
              </Grid>
            ))}
            {(!listRecipes.length && search) &&
              <Grid item xs={12}>
                <Typography color="textSecondary">{`Aucune recette pour "${search}"`}</Typography>
              </Grid>
            }
          </GridContainer>
        </Container>
      </BoxNextAppBar>
    </>
  )
}

export default RecipesPage
