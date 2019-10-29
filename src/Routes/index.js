import React from 'react';
import { Router, Redirect } from "@reach/router";

import { useUserState } from '../contexts/user';
import { RecipesProvider } from "../contexts/recipes";
import { PlanningProvider } from "../contexts/planning";

import HeaderBar from "../HeaderBar";
import LoginPage from '../pages/login';
import RecipePage from '../pages/recipe';
import RecipesPage from '../pages/recipes';
import PlanningPage from '../pages/planning';

const Routes = () => {
  const { isLogged, isLoading: isUserLoading } = useUserState();
  if (isUserLoading) return <HeaderBar isLoading hideMenu />
  return (
    !isLogged ? (
      <Router>
        <LoginPage path="/login" />
        <Redirect from="*" to="/login" noThrow />
      </Router>
    ) : (
        <RecipesProvider>
          <PlanningProvider>
            <Router>
              <RecipePage path="/recipes/:id" />
              <RecipesPage path="/recipes" />
              <RecipePage path="/planning/recipes/:id" />
              <RecipesPage path="/planning/recipes" />
              <PlanningPage path="/planning" />
              <Redirect from="/login" to="/planning" noThrow />
              <Redirect from="/" to="/planning" noThrow />
            </Router>
          </PlanningProvider>
        </RecipesProvider>
      )
  )
}

export default Routes
