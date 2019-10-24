import React from "react";
import { createMuiTheme, MuiThemeProvider, StylesProvider } from "@material-ui/core/styles";
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import theme from '../theme';

const defaultTheme = createMuiTheme(theme)

const ThemeProvider = ({ children }) => {
  return (
    <StylesProvider injectFirst>
      <MuiThemeProvider theme={defaultTheme}>
        <StyledThemeProvider theme={defaultTheme}>
          {children}
        </StyledThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  )
}

export default ThemeProvider
