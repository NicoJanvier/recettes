import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { amber } from '@material-ui/core/colors';

import { RecipesProvider } from "./contexts/recipes";
import { UserProvider } from "./contexts/user";

import HeaderBar from "./HeaderBar";
import { Box } from "@material-ui/core";
import Routes from "./Routes";

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
      <UserProvider>
        <ThemeProvider theme={theme}>
          <div className={classes.root}>
            <CssBaseline />
            <HeaderBar />
            <Box className={classes.box}>
              <Routes />
            </Box>
          </div>
        </ThemeProvider>
      </UserProvider>
    </RecipesProvider>
  );
}
