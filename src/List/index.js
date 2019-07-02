import React from "react";
import useDataApi from "../hooks/useDataApi";
import {
  Grid,
  Container,
  InputBase,
  Box,
  Paper,
  AppBar,
  Divider,
  Avatar,
  IconButton
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import { makeStyles } from "@material-ui/styles";
import { green } from "@material-ui/core/colors";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import SortIcon from "@material-ui/icons/Sort";

import { Draggable } from "react-beautiful-dnd"; // https://codesandbox.io/s/4qp6vjp319?from-embed

import RecipeCard from "../RecipeCard";
import { compareLastDate } from "../utils/date";

const API_PATH = "/api";

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

export default function List({ setLoading = () => {}, draggable = false }) {
  const classes = useStyles();
  const [{ isLoading, isError, data }] = useDataApi(
    { url: `${API_PATH}/recipes`, method: "get" },
    []
  );

  React.useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const [search, setSearch] = React.useState("");
  const [recipes, setRecipes] = React.useState([]);
  const [vegFilter, setVegFilter] = React.useState(false);
  const [sortDate, setSortDate] = React.useState(false);

  React.useEffect(() => {
    if (data && data.data) {
      const allRecipes = data.data;
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
      setRecipes(searchedRecipes);
    }
  }, [data, search, sortDate, vegFilter]);

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
          {draggable
            ? recipes.map((recipe, index) => {
                const id = `${recipe._id}_${index}`;
                return (
                  <Draggable
                    key={id}
                    index={index}
                    draggableId={id}
                  >
                    {(provided, snapshot) => (
                      <RootRef rootRef={provided.innerRef}>
                        <Grid
                          item
                          xs={12}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                        >
                          <RecipeCard data={recipe} />
                        </Grid>
                      </RootRef>
                    )}
                  </Draggable>
                );
              })
            : recipes.map(data => (
                <Grid item xs={12} key={data._id}>
                  <RecipeCard data={data} />
                </Grid>
              ))}
        </Grid>
      </Container>
    </>
  );
}
