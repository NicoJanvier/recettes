import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import styled from 'styled-components';

import { UserProvider } from "./contexts/user";

import Routes from "./Routes";
import ThemeProvider from "./contexts/theme";

const Flex = styled.div`
  > div {
    display: flex;
  }
`
export default function App() {
  return (
    <React.StrictMode>
      <CssBaseline />
      <ThemeProvider>
        <UserProvider>
          <Flex>
            <Routes />
          </Flex>
        </UserProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
