import React from 'react'
import styled from 'styled-components';
import { AppBar, IconButton, Typography, Box } from '@material-ui/core';

const drawerWidth = "240px";

const StyledAppBar = styled(({ showMenu, ...props }) => <AppBar {...props}/> )`
  position: fixed;
  margin-left: ${drawerWidth};
  ${({ theme }) => theme.breakpoints.up("sm")} {
    width: calc(100% - ${drawerWidth});
  }
  ${({ showMenu }) => !showMenu && ({
    marginLeft: "0 !important",
    width: "100% !important",
  })}
`
const MenuButton = styled(IconButton)`
  color: inherit;
  margin-right: ${({ theme }) => theme.spacing(2)}px;
  ${({ theme }) => theme.breakpoints.up("sm")} {
    display: none;
  }
`

const Title = styled(Typography)`
  flex-grow: 1;
`

const ToolbarPlaceholder = styled.div`
  ${({ theme }) => theme.mixins.toolbar}
`

const StyledNav = styled.nav`
  ${({ theme }) => theme.breakpoints.up("sm")} {
    width: ${drawerWidth};
    flex-shrink: 0;
  }
  .drawerPaper {
    width: ${drawerWidth};
  }
`
const BoxNextAppBar = styled(Box)`
  position: relative;
  flex-grow: 1;
  width: 100%;
  top: ${({ theme }) => theme.spacing(7)}px;
  @media (min-width: 0px) and (orientation: lanscape) {
    top: ${({ theme }) => theme.spacing(6)}px;
  }
  ${({ theme }) => theme.breakpoints.up("sm")} {
    top: ${({ theme }) => theme.spacing(8)}px;
  }
`

export {
  StyledAppBar,
  MenuButton,
  Title,
  ToolbarPlaceholder,
  StyledNav,
  BoxNextAppBar,
}