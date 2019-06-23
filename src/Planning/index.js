import React from "react";
import PropTypes from "prop-types";
import { Grid, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import useDataApi from "../hooks/useDataApi";
import { compareDateProperty, formatToDay, addDays } from "../utils/date";
import RecipeCard from "../RecipeCard";

const API_PATH = "http://localhost:8080/api";

const useStyles = makeStyles({
  gridItemDate: {
    padding: "10px"
  }
});

function Planning(props) {
  const classes = useStyles();
  const [{ isLoading, isError, data }] = useDataApi(
    { url: `${API_PATH}/recipes`, method: "get" },
    []
  );
  const [days, setDays] = React.useState([]);
  React.useEffect(() => {
    if (data && data.data) {
      const allRecipes = data.data;
      const allDays = allRecipes
        .map(recipe =>
          recipe.dates.map(date => ({ date, label: formatToDay(date), recipe }))
        )
        .flat()
        .sort(compareDateProperty)

        const lastDate = allDays[allDays.length - 1].date;
        const emptyDays = [];
        for (let offset = 1; offset <= 7; offset++) {
          const newDay = {date: addDays(lastDate, offset)}
          emptyDays.push(newDay)
        }
      
      setDays([...allDays, ... emptyDays]);
    }
  }, [data]);

  const [planned, setPlanned] = React.useState([]);
  return (
    <Container>
      {isError && "ERROR"}
      <Grid container spacing={2}>
        {days.map(({ date, recipe }) => (
          <Grid item container xs={12}>
            <Grid item xs={2} className={classes.gridItemDate}>
              <Typography>{formatToDay(date)}</Typography>
            </Grid>
            <Grid item xs={planned.length ? 6 : 10}>
              {recipe && <RecipeCard data={recipe} noDate />}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

Planning.propTypes = {};

export default Planning;
