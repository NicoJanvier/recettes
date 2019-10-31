import React from 'react'
import * as queryString from 'query-string'
import { Container } from '@material-ui/core'
import Recipe from '../../Recipe'
import HeaderBar from '../../HeaderBar'
import { BoxNextAppBar, Title } from '../../HeaderBar/index.style'
import { useRecipesState } from '../../contexts/recipes'

import { AppBar, Toolbar, IconButton } from '@material-ui/core'
import CloseIcon from "@material-ui/icons/Close";

const RecipePage = ({ id, location, navigate }) => {
  const { isLoading } = useRecipesState()
  const { isPicking } = location.state;
  const { date } = queryString.parse(location.search)
  const onBack = () => navigate(`../${location.search}`, { state: location.state })
  return (
    <>
      {!isPicking ?
        <HeaderBar isLoading={isLoading} /> :
        <PickingAppBar {...{ onBack }} />
      }
      <BoxNextAppBar>
        <Container maxWidth="sm">
          <Recipe {...{ id, date, navigate }} />
        </Container>
      </BoxNextAppBar>
    </>
  )
}
const PickingAppBar = ({ onBack }) =>
  <AppBar>
    <Toolbar disableGutters>
      <IconButton onClick={onBack} color="inherit">
        <CloseIcon />
      </IconButton>
      <Title variant="h6" component="h1">Choisir une recette</Title>
    </Toolbar>
  </AppBar>
export default RecipePage
