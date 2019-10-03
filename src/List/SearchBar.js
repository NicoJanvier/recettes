import React from 'react'
import PropTypes from 'prop-types'

import {
  Container,
  InputBase,
  AppBar,
  Divider,
  Avatar,
  IconButton
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import SortIcon from "@material-ui/icons/Sort";

const SearchBar = ({
  classes,
  search,
  veg,
  sortByDate,
  dispatch,
 }) => {
  return (
    <AppBar
        className={classes.searchBar}
        elevation={1}
        square
        component="div"
      >
        <Container>
          <InputBase
            className={classes.search}
            placeholder="Rechercher..."
            autoFocus
            fullWidth={true}
            value={search}
            onChange={({ target: { value } }) => dispatch({ type: 'SEARCH', payload: value })}
            endAdornment={
              <>
                {search ? (
                  <IconButton onClick={() => dispatch({ type: 'RESET_SEARCH' })}>
                    <ClearIcon />
                  </IconButton>
                ) : (
                    <SearchIcon className={classes.searchIcon} />
                  )}
                <Divider className={classes.divider} />
                <IconButton onClick={() => dispatch({ type: 'TOGGLE_VEG' })}>
                  <Avatar
                    className={veg ? classes.vegOn : classes.vegOff}
                  >
                    V
                  </Avatar>
                </IconButton>
                <IconButton onClick={() => dispatch({ type: 'TOGGLE_SORT_BY_DATE' })}>
                  <SortIcon
                    className={
                      sortByDate ? classes.sortDateOn : classes.sortDateOff
                    }
                  />
                </IconButton>
              </>
            }
          />
        </Container>
      </AppBar>
  )
}

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
  search: PropTypes.string.isRequired,
  veg: PropTypes.bool.isRequired,
  sortByDate: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default SearchBar
