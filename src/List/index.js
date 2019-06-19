import React from "react";
import useDataApi from "../hooks/useDataApi";
import { Grid, Container, InputBase, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import SearchIcon from "@material-ui/icons/Search";
import RecipeCard from "../RecipeCard";

const API_PATH = "http://localhost:8080/api";

const useStyles = makeStyles({
  search: {
    padding: "8px 16px"
  }
});

export default function List({ setLoading }) {
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
  React.useEffect(() => {
    if (data && data.data) {
      const allRecipes = data.data;
      const lowSearch = search.toLowerCase();
      const searchedRecipes = allRecipes
        .filter(recipe => {
          const lowTitle = recipe.title.toLowerCase();
          return lowTitle.includes(lowSearch) && recipe;
        })
        .sort(
          (a, b) => a.title.indexOf(lowSearch) - b.title.indexOf(lowSearch)
        );
      setRecipes(searchedRecipes);
    }
  }, [data, search]);

  return (
    <Container>
      {isError && "ERROR"}
      <InputBase
        className={classes.search}
        placeholder="Rechercher..."
        fullWidth={true}
        value={search}
        onChange={({ target: { value } }) => setSearch(value)}
        endAdornment={
          <>
            <SearchIcon />
          </>
        }
      />
      <Grid container spacing={2}>
        {recipes.map(data => (
          <Grid item xs={12} key={data._id}>
            <RecipeCard data={data} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
