import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { amber } from '@material-ui/core/colors';

import { UserProvider } from "./contexts/user";

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
}));

export default function App() {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <div className={classes.root}>
          <CssBaseline />
          <Routes />
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}
