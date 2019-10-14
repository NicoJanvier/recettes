import React from 'react';
import { Router, Redirect } from "@reach/router";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

import { useUserState } from '../contexts/user';

import { RecipesProvider, RecipeConsumer } from "../contexts/recipes";
import { PlanningProvider, PlanningConsumer } from "../contexts/planning";

import HeaderBar from "../HeaderBar";

import Login from "../Login";
import Planning from "../Planning";
import List from "../List";
import Recipe from "../Recipe";

const useStyles = makeStyles(theme => ({
  box: {
    position: "relative",
    top: "50px",
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

const Routes = () => {
  const { isLogged, isLoading: isUserLoading } = useUserState();
  const classes = useStyles();
  return (
    !isLogged ? (
      <>
        <HeaderBar isLoading={isUserLoading} />
        <Box className={classes.box}>
          <Router>
            <Login path="/login" />
            <Redirect from="*" to="/login" noThrow />
          </Router>
        </Box>
      </>
    ) : (
        <RecipesProvider>
          <RecipeConsumer>
            {({ isLoading: isRecipesLoading }) => (
              <PlanningProvider>
                <PlanningConsumer>
                  {({ isLoading: isPlanningLoading }) => (
                    <>
                      <HeaderBar isLoading={isRecipesLoading || isPlanningLoading} />
                      <Box className={classes.box}>
                        <Router>
                          <Recipe path="/recipes/:id" />
                          <List path="/recipes" />
                          <Planning path="/planning" />
                          <Redirect from="/login" to="/planning" noThrow />
                        </Router>
                      </Box>
                    </>
                  )}
                </PlanningConsumer>
              </PlanningProvider>
            )}
          </RecipeConsumer>
        </RecipesProvider>
      )
  )
}

export default Routes
