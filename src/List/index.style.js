import styled from 'styled-components'
import { Grid, AppBar, InputBase, Divider, Avatar } from '@material-ui/core'
import SearchIcon from "@material-ui/icons/Search";
import SortIcon from "@material-ui/icons/Sort";
import { green } from "@material-ui/core/colors";

const GridContainer = styled(Grid)`
  margin-top: ${({ theme }) => theme.spacing(2)}px;
`
const AppBarWrapper = styled(AppBar)`
  position: sticky;
  background-color: white;
  z-index: 1;
`
const SearchInput = styled(InputBase)`
  padding: ${({ theme }) => theme.spacing(1)}px ${({ theme }) => theme.spacing(2)}px;;
`
const StyledSearchIcon = styled(SearchIcon)`
  color: lightgrey;
  margin-right: ${({ theme }) => theme.spacing(1)}px;
`

const StyledDivider = styled(Divider)`
  width: 1px;
  height: 28px;
  margin: 4px;
`

const VegAvatar = styled(Avatar)`
  height: 25px;
  width: 25px;
  font-size: 12px;
  color: white;
  background-color: ${({ on }) => on ? green[800] : green[500]};
`

const StyledSortIcon = styled(SortIcon)`
  color: ${({ on }) => !on && "black"};
`
export {
  GridContainer,
  AppBarWrapper,
  SearchInput,
  StyledSearchIcon,
  StyledDivider,
  VegAvatar,
  StyledSortIcon,
}