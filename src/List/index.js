import React from "react";
import Fuse from 'fuse.js'
import {
  Grid,
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

import RecipeCard from "../RecipeCard";
import { compareLastDate } from "../utils/date";
import { useRecipesState } from "../contexts/recipes";
import { useStyles } from "./styles";


export default function List({ onPick }) {
  const classes = useStyles();
  const { recipes, isError } = useRecipesState();

  const [search, setSearch] = React.useState("");
  const [vegFilter, setVegFilter] = React.useState(false);
  const [sortDate, setSortDate] = React.useState(true);


  const fuse = React.useCallback(
    () => {
      const fuseOptions = {
        keys: ['title'],
        threshold: 0.35,
      };
      const fuse = new Fuse(recipes, fuseOptions);
      return fuse.search(search);
    },
    [recipes, search],
  );


  const applyChanges = () => {
    return (search ? fuse() : recipes)
      .filter(recipe => {
        if (vegFilter) {
          return recipe.vegetarian;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortDate) {
          return compareLastDate(a.dates, b.dates);
        }
        return null;
      });
  };

  const listRecipes = applyChanges();

  return (
    <>
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
            onChange={({ target: { value } }) => setSearch(value)}
            endAdornment={
              <>
                {search ? (
                  <IconButton onClick={() => setSearch("")}>
                    <ClearIcon />
                  </IconButton>
                ) : (
                    <SearchIcon className={classes.searchIcon} />
                  )}
                <Divider className={classes.divider} />
                <IconButton onClick={() => setVegFilter(!vegFilter)}>
                  <Avatar
                    className={vegFilter ? classes.vegOn : classes.vegOff}
                  >
                    V
                  </Avatar>
                </IconButton>
                <IconButton onClick={() => setSortDate(!sortDate)}>
                  <SortIcon
                    className={
                      sortDate ? classes.sortDateOn : classes.sortDateOff
                    }
                  />
                </IconButton>
              </>
            }
          />
        </Container>
      </AppBar>
      <Container>
        {isError && "ERROR"}
        <Grid container spacing={2} className={classes.gridContainer}>
          {listRecipes.map(recipe => (
            <Grid item xs={12} key={recipe._id}>
              <RecipeCard recipe={recipe} onPick={onPick} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
