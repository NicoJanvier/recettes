import React from "react";
import { Router, Redirect } from "@reach/router";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { amber } from '@material-ui/core/colors';

import { RecipesProvider } from "./contexts/recipes";

import Recipe from "./Recipe";
import List from "./List";
import HeaderBar from "./HeaderBar";
import { Box } from "@material-ui/core";
import Planning from "./Planning";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#388e3c',
    },
    secondary: amber,
  },
});

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
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          <HeaderBar />
          <Box className={classes.box}>
            <Router>
              <Redirect from="/" to="/planning" noThrow />
              <Planning path="/planning" />
              <List path="/list" />
              {/* <NewRecipe path="/new" /> */}
              <Recipe path="/:id" />
            </Router>
          </Box>
        </div>
      </ThemeProvider>
    </RecipesProvider>
  );
}
