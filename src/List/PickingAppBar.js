import React from 'react'
import styled from 'styled-components';
import { lighten } from 'polished'
import { AppBar, Toolbar, IconButton, InputBase, Typography } from '@material-ui/core'
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";

const StyledSearchIcon = styled(SearchIcon)``
const SearchField = styled(InputBase)`
  color: inherit;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  background-color: ${({ theme }) => theme.palette.primary.light};
  width: 100%;
  max-width: 25em;
  margin-left: auto;
  padding-right: ${({ theme }) => theme.spacing(1)}px;
  padding-left: ${({ theme }) => theme.spacing(1)}px;
  transition: all .2s ease-in-out;
  &:hover, &:active, &:focus {
    background-color: ${({ theme }) => lighten(0.05, theme.palette.primary.light)};
  }
  ${({ theme }) => theme.breakpoints.up("sm")} {
    width: ${({ active }) => active ? '100%' : '15em'};
    &:hover, &:active, &:focus {
      width: 100%;
    }
    
  }
`
const Title = styled(Typography)`
  display: none;
  ${({ theme }) => theme.breakpoints.up("sm")} {
    display: initial;
    flex: 1;
  }
`
const PickingAppBar = ({ onBack, onNew, search, dispatch }) => {
  const onKeyPress = event => {
    if (event.key === 'Enter') {
      event.target.blur();
      event.preventDefault();
    }
  }
  return (
    <>
      <AppBar>
        <Toolbar disableGutters>
          <IconButton mr={2} onClick={onBack} color="inherit">
            <CloseIcon />
          </IconButton>
          <Title noWrap variant="h6" component="h1">Choisir une recette</Title>
          <SearchField
            placeholder="Trouver une recette..."
            value={search}
            active={!!search}
            onChange={({ target: { value } }) => dispatch({ type: 'SEARCH', payload: value })}
            onKeyPress={onKeyPress}
            endAdornment={
              <>
                {search ? (
                  <IconButton color="inherit" size="small" onClick={() => dispatch({ type: 'RESET_SEARCH' })}>
                    <ClearIcon />
                  </IconButton>
                ) : (
                    <StyledSearchIcon />
                  )}
              </>
            }
          />
          <IconButton onClick={onNew} color="inherit">
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default PickingAppBar
