import React from 'react';
import { Router, Redirect } from "@reach/router";
import { useUserState } from '../contexts/user';

import Login from "../Login";
import Planning from "../Planning";
import List from "../List";
import Recipe from "../Recipe";

const Routes = () => {
  const { isLogged } = useUserState();
  return (
    !isLogged ? (
      <Router>
        <Login path="/login" />
        <Redirect from="*" to="/login" noThrow />
      </Router>
    ) : (
      <Router>
        <Recipe path="/recipes/:id" />
        <List path="/recipes" />
        <Planning path="/planning" />
        <Redirect from="/login" to="/planning" noThrow />
      </Router>
    )
  )
}

export default Routes
