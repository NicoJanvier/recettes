import styled from 'styled-components';
import { AppBar, IconButton, Typography } from '@material-ui/core';

const drawerWidth = "240px";

const StyledAppBar = styled(AppBar)`
  position: fixed;
  margin-left: ${drawerWidth};
  ${({ theme }) => theme.breakpoints.up("sm")} {
    width: calc(100% - ${drawerWidth});
  }
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

export {
  StyledAppBar,
  MenuButton,
  Title,
  ToolbarPlaceholder,
  StyledNav,
}