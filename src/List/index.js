import React from "react";
import useDataApi from "../hooks/useDataApi";
import { Grid, Container, InputBase, Paper } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import RecipeCard from "../RecipeCard";

const API_PATH = "http://localhost:8080/api";

export default function List({ setLoading }) {
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
        .sort((a, b) => a.title.indexOf(lowSearch) - b.title.indexOf(lowSearch));
      setRecipes(searchedRecipes);
    }
  }, [data, search]);

  return (
    <Container>
      {isError && "ERROR"}
      <Grid container spacing={2}>
        <Grid item>
          <Paper>
            <InputBase
              placeholder="Rechercher..."
              fullWidth
              endAdornment={<SearchIcon />}
              value={search}
              onChange={({ target: { value } }) => setSearch(value)}
            />
          </Paper>
        </Grid>
        {recipes.map(data => (
          <Grid item xs={12} key={data._id}>
            <RecipeCard data={data} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
