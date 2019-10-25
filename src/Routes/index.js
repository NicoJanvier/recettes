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
  flex-grow: 1;
  top: ${({ theme }) => theme.spacing(7)}px;
  @media (min-width: 0px) and (orientation: lanscape) {
    top: ${({ theme }) => theme.spacing(6)}px;
  }
  ${({ theme }) => theme.breakpoints.up("sm")} {
    top: ${({ theme }) => theme.spacing(8)}px;
  }
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
