import React from 'react'
import * as queryString from 'query-string'
import HeaderBar from '../../HeaderBar'
import List from '../../List'
import { useRecipesState } from '../../contexts/recipes'
import { usePlanningState } from '../../contexts/planning'
import { BoxNextAppBar, Title } from '../../HeaderBar/index.style'

import { AppBar, Toolbar, IconButton } from '@material-ui/core'
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import { useDaysList } from '../../Planning/hooks/useDaysList'

const RecipesPage = ({ navigate, location }) => {
  const { isLoading: recipesLoading } = useRecipesState();
  const { isLoading: planningLoading } = usePlanningState();

  const { isPicking } = location.state;
  const { date } = queryString.parse(location.search);
  const { moveRecipe } = useDaysList();
  const onPick = recipe => {
    moveRecipe({ recipe, add: { date } });
    navigate("../");
  }

  return (
    <>
      {!isPicking ?
        <HeaderBar isLoading={recipesLoading || planningLoading} /> :
        <PickingAppBar {...{ navigate, location }} />
      }
      <BoxNextAppBar>
        <List onPick={isPicking ? onPick : null} />
      </BoxNextAppBar>
    </>
  )
}

const PickingAppBar = ({ navigate, location }) =>
  <AppBar>
    <Toolbar>
      <IconButton mr={2} onClick={() => navigate("../")} color="inherit">
        <CloseIcon />
      </IconButton>
      <Title variant="h6" component="h1">Choisir une recette</Title>
      <IconButton onClick={() => navigate(`new${location.search}`, { state: { ...location.state } })} color="inherit">
        <AddIcon />
      </IconButton>
    </Toolbar>
  </AppBar>

export default RecipesPage
