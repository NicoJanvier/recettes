import React from 'react';
import { Router, Redirect } from "@reach/router";
import styled from 'styled-components';
import { Box } from "@material-ui/core";

import { useUserState } from '../contexts/user';
import { RecipesProvider, RecipeConsumer } from "../contexts/recipes";
import { PlanningProvider, PlanningConsumer } from "../contexts/planning";

import HeaderBar from "../HeaderBar";
import Login from "../Login";
import Planning from "../Planning";
import List from "../List";
import Recipe from "../Recipe";

const StyledBox = styled(Box)`
  position: relative;
  top: 50px;
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing(3)}px;
`
const Routes = () => {
  const { isLogged, isLoading: isUserLoading } = useUserState();
  if (isUserLoading) return <HeaderBar isLoading hideMenu />
  return (
    !isLogged ? (
      <>
        <HeaderBar isLoading={isUserLoading} hideMenu />
        <StyledBox>
          <Router>
            <Login path="/login" />
            <Redirect from="*" to="/login" noThrow />
          </Router>
        </StyledBox>
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
                      <StyledBox>
                        <Router>
                          <Recipe path="/recipes/:id" />
                          <List path="/recipes" />
                          <Planning path="/planning" />
                          <Redirect from="/login" to="/planning" noThrow />
                          <Redirect from="/" to="/planning" noThrow />
                        </Router>
                      </StyledBox>
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
