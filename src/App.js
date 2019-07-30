import React from "react";
import { Router, Redirect } from "@reach/router";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";

import { RecipesProvider } from "./contexts/recipes";

import Recipe from "./Recipe/index";
// import NewRecipe from "./NewRecipe";
import List from "./List";
import HeaderBar from "./HeaderBar";
import { Box } from "@material-ui/core";
import Planning from "./Planning";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  box: {
    position: "relative",
    top: "50px",
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

export default function App() {
  const classes = useStyles();
  return (
    <RecipesProvider>
      <div className={classes.root}>
        <CssBaseline />
        <HeaderBar/>
        <Box className={classes.box}>
          <Router>
            <Redirect from="/" to="/planning" noThrow/>
            <Planning path="/planning"/>
            <List path="/list"/>
            {/* <NewRecipe path="/new" /> */}
            <Recipe path="/:id"/>
          </Router>
        </Box>
      </div>
    </RecipesProvider>
  );
}
