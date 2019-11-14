import React from 'react'
import PropTypes from 'prop-types'

import {
  Container,
  IconButton
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

import {
  AppBarWrapper,
  SearchInput,
  StyledSearchIcon,
  StyledDivider,
  VegAvatar,
  StyledSortIcon,
} from './index.style'

const SearchBar = ({
  search,
  veg,
  sortByDate,
  dispatch,
}) => {
  const onKeyPress = event => {
    if (event.key === 'Enter') {
      event.target.blur();
      event.preventDefault();
    }
  }
  return (
    <AppBarWrapper
      elevation={1}
      square
      component="div"
    >
      <Container>
        <SearchInput
          placeholder="Rechercher..."
          // autoFocus
          fullWidth
          value={search}
          onChange={({ target: { value } }) => dispatch({ type: 'SEARCH', payload: value })}
          endAdornment={
            <>
              {search ? (
                <IconButton onClick={() => dispatch({ type: 'RESET_SEARCH' })}>
                  <ClearIcon />
                </IconButton>
              ) : (
                  <StyledSearchIcon />
                )}
              <StyledDivider />
              <IconButton onClick={() => dispatch({ type: 'TOGGLE_VEG' })}>
                <VegAvatar on={veg ? veg : null}>V</VegAvatar>
              </IconButton>
              <IconButton onClick={() => dispatch({ type: 'TOGGLE_SORT_BY_DATE' })} disabled={Boolean(search)}>
                <StyledSortIcon on={sortByDate}/>
              </IconButton>
            </>
          }
          onKeyPress={onKeyPress}
        />
      </Container>
    </AppBarWrapper>
  )
}

SearchBar.propTypes = {
  search: PropTypes.string.isRequired,
  veg: PropTypes.bool.isRequired,
  sortByDate: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default SearchBar
