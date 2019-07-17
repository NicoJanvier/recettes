import React from "react";
import {
  Grid,
  Container,
  InputBase,
  AppBar,
  Divider,
  Avatar,
  IconButton
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { green } from "@material-ui/core/colors";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import SortIcon from "@material-ui/icons/Sort";

import RecipeCard from "../RecipeCard";
import { compareLastDate } from "../utils/date";
import { useRecipesState } from "../contexts/recipes";

const useStyles = makeStyles({
  search: {
    padding: "8px 16px"
  },
  searchBar: {
    position: "sticky",
    background: "white",
    // top: "50px",
    zIndex: 1
  },
  gridContainer: {
    marginTop: "16px"
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  searchIcon: {
    color: "lightgrey",
    marginRight: "6px"
  },
  vegOff: {
    height: "25px",
    width: "25px",
    fontSize: "12px",
    color: "white",
    backgroundColor: green[500]
  },
  vegOn: {
    height: "25px",
    width: "25px",
    fontSize: "12px",
    color: "white",
    backgroundColor: green[800]
  },
  sortDateOn: {
    color: "black"
  },
  sortDateOff: {}
});

export default function List({ onPick }) {
  const classes = useStyles();
  const { recipes, isError } = useRecipesState();

  const [search, setSearch] = React.useState("");
  const [listRecipes, setListRecipes] = React.useState(recipes);
  const [vegFilter, setVegFilter] = React.useState(false);
  const [sortDate, setSortDate] = React.useState(true);

  React.useEffect(() => {
    const allRecipes = recipes;
    const lowSearch = search.toLowerCase();
    const searchedRecipes = allRecipes
      .filter(recipe => {
        const lowTitle = recipe.title.toLowerCase();
        return lowTitle.includes(lowSearch) && recipe;
      })
      .filter(recipe => {
        if (vegFilter) {
          return recipe.vegetarian;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortDate) {
          return compareLastDate(a.dates, b.dates);
        } else if (search) {
          return (
            a.title.toLowerCase().indexOf(lowSearch) -
            b.title.toLowerCase().indexOf(lowSearch)
          );
        } else {
          return a.title.localeCompare(b.title);
        }
      });
    setListRecipes(searchedRecipes);
  }, [recipes, search, sortDate, vegFilter]);

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
              <RecipeCard data={recipe} onPick={onPick} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
