import React from 'react'
import styled from 'styled-components';
import { AppBar, Toolbar, IconButton, InputBase, Typography, Badge, Button } from '@material-ui/core'
import CloseIcon from "@material-ui/icons/Close";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import { lighten } from '@material-ui/core/styles';

const StyledAppBar = styled(AppBar)`
  background-color: ${({ theme }) => theme.palette.secondary.dark};
`
const SearchField = styled(({ active, ...props }) => <InputBase {...props} />)`
  color: inherit;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  width: 100%;
  max-width: 25em;
  margin-left: auto;
  margin-right: ${({ theme }) => theme.spacing(1)}px;
  padding-right: ${({ theme }) => theme.spacing(1)}px;
  padding-left: ${({ theme }) => theme.spacing(1)}px;
  transition: all .2s ease-in-out;
  &:hover, &:active, &:focus {
    background-color: ${({ theme }) => lighten(theme.palette.secondary.main, 0.2)};
  }
  ${({ theme }) => theme.breakpoints.up("sm")} {
    width: ${({ active }) => active ? '100%' : '15em'};
    &:hover, &:active, &:focus {
      width: 100%;
    }
  }
`

const StyledIconButton = styled(IconButton)`
  ${({ theme }) => theme.breakpoints.up("sm")} {
    display: none;
  }
`
const StyledButton = styled(Button)`
  display: none;
  margin-right: ${({ theme }) => theme.spacing(1)}px;
  ${({ theme }) => theme.breakpoints.up("sm")} {
    display: flex;
  }
`
const Title = styled(Typography)`
  display: none;
  ${({ theme }) => theme.breakpoints.up("sm")} {
    display: initial;
    flex: 1;
  }
`
const PickingAppBar = ({ onBack, onNew, search, dispatch, veg, sortByDate, hideNew }) => {
  const onKeyPress = event => {
    if (event.key === 'Enter') {
      event.target.blur();
      event.preventDefault();
    }
  }
  const isFiltered = veg || sortByDate || hideNew // AND/OR others...
  return (
    <>
      <StyledAppBar>
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
                    <SearchIcon />
                  )}
              </>
            }
          />
          {/* Icons for mobile */}
          <StyledIconButton
            onClick={() => dispatch({ type: "TOGGLE_PANEL" })}
            color="inherit"
            size="small"
          >
            <Badge invisible={!isFiltered} variant="dot" color="primary">
              <FilterListIcon />
            </Badge>
          </StyledIconButton>
          <StyledIconButton onClick={onNew} color="inherit" >
            <PlaylistAddIcon />
          </StyledIconButton>
          {/* Buttons for wider screens */}
          <StyledButton
            variant="outlined"
            color="inherit"
            onClick={() => dispatch({ type: "TOGGLE_PANEL" })}
            endIcon={
              <Badge invisible={!isFiltered} variant="dot" color="primary" overlap="circle">
                <FilterListIcon />
              </Badge>
            }
          >
            Filtres
          </StyledButton>
          <StyledButton
            variant="outlined"
            color="inherit"
            onClick={onNew}
            endIcon={<PlaylistAddIcon />}
          >
            Nouvelle Recette
          </StyledButton>
        </Toolbar>
      </StyledAppBar>
    </>
  )
}

export default PickingAppBar
