import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Grid,
  Container,
  Typography,
  AppBar,
  FormControlLabel,
  Switch,
  IconButton,
  Button,
  Fab,
  Drawer
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import { makeStyles } from "@material-ui/styles";
import AddIcon from "@material-ui/icons/Add";
import DateRangeIcon from "@material-ui/icons/DateRange";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"; // https://codesandbox.io/s/4qp6vjp319?from-embed

import useDataApi from "../hooks/useDataApi";
import {
  compareDateProperty,
  formatToDay,
  addDays,
  generateDateList,
  isToday
} from "../utils/date";
import RecipeCard from "../RecipeCard";
import List from "../List";
import { scrollToRef } from "../utils/toolkit";

const API_PATH = "http://localhost:8080/api";

const useStyles = makeStyles({
  appBar: {
    position: "sticky",
    background: "white",
    top: "50px",
    zIndex: 1
  },
  gridRow: {
    borderRadius: "8px"
  },
  gridRowEditing: {
    border: "2px dashed lightgrey"
  },
  addBtnCard: {
    order: 1,
    display: "flex",
    justifyContent: "flex-end"
  },
  fabBox: {
    position: "sticky",
    width: "fit-content",
    bottom: "0px",
    padding: "20px",
    display: "flex",
    flexFlow: "column-reverse",
    alignItems: "center",
  },
  fab: {
    marginTop: "16px",
  },
  rightPanel: {
    borderLeft: "2px solid lightgrey",
    position: "fixed",
    right: "0px",
    height: "100%",
    overflow: "scroll",
    transition: "width 2s",
  },
  leftPanel: {
    transition: "width 2s",
  }
});

function Planning(props) {
  const classes = useStyles();
  const url = { url: `${API_PATH}/recipes`, method: "get" };
  const [{ isLoading, isError, data }, setUrl] = useDataApi(url, []);
  const refresh = () => setUrl(url);
  const [days, setDays] = React.useState([]);

  React.useEffect(() => {
    if (data && data.data) {
      const allRecipes = data.data;
      const allDays = allRecipes
        .map(recipe => recipe.dates.map(date => ({ date, recipe })))
        .flat()
        .sort(compareDateProperty);
      const fullDaysList = generateDateList(
        allDays[0].date,
        allDays[allDays.length - 1].date
      );

      const mergedDays = fullDaysList.map(date => ({
        date,
        recipes: allDays
          .filter(({ date: day }) => day === date)
          .map(({ recipe }) => recipe)
      }));

      const lastDate = mergedDays[mergedDays.length - 1].date;
      const emptyDays = [];
      for (let offset = 1; offset <= 7; offset++) {
        const newDay = { date: addDays(lastDate, offset), recipes: [] };
        emptyDays.push(newDay);
      }

      setDays([...mergedDays, ...emptyDays]);
    }
  }, [data]);

  const [editing, setEditing] = React.useState(true);

  // Scrolling
  const todayRef = React.useRef(null);
  const executeScroll = () => scrollToRef(todayRef);

  // Draggable
  const onDragEnd = result => {
    console.log(result);
    if (!result.destination) {
      return;
    }
    // debugger;
    const newDate = result.destination.droppableId;
    const newIndex = result.destination.index;
    const oldDate = result.source.droppableId;
    const recipeId = result.draggableId.split("_")[0];

    if (newDate !== oldDate) {
      const oldRow = days.find(({ date }) => date === oldDate);
      const recipe = oldRow.recipes.find(({ _id }) => _id === recipeId);
      const { id, title, description, dates: oldDates, vegetarian } = recipe;
      const dates = [...oldDates.filter(date => date !== oldDate), newDate];
      const options = {
        url: `${API_PATH}/recipes/${recipeId}`,
        method: "put",
        data: {
          id,
          title,
          description,
          vegetarian,
          dates
        }
      };

      const updatedDays = [...days];
      const oldDay = updatedDays.find(({ date }) => date === oldDate);
      const newDay = updatedDays.find(({ date }) => date === newDate);
      oldDay.recipes = oldDay.recipes.filter(({ _id }) => _id !== recipeId);
      newDay.recipes.splice(newIndex, 0, recipe);
      setDays(updatedDays);

      axios(options)
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
          refresh();
        });
    }
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // styles we need to apply on draggables
    ...draggableStyle

    // ...(isDragging && {
    //   background: "rgb(235,235,235)"
    // })
  });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        {isError && "ERROR"}
        <Grid container>
          <Grid container item spacing={4} xs={!editing ? 12 : 8}  className={classes.leftPanel}>
            {days.map(({ date, recipes }) => {
              return (
                <React.Fragment key={date}>
                  {isToday(date) && <div ref={todayRef} />}
                  {(recipes.length > 0 || editing) && (
                    <Grid item container xs={12}>
                      <Grid item xs={2} className={classes.gridItemDate}>
                        <Typography>{formatToDay(date)}</Typography>
                      </Grid>
                      <Droppable droppableId={date}>
                        {provided => (
                          <RootRef rootRef={provided.innerRef}>
                            <Grid
                              item
                              container
                              xs={10}
                              spacing={2}
                              className={`${classes.gridRow} 
                              ${editing ? classes.gridRowEditing : ""}`}
                            >
                              {recipes.map((recipe, index) => {
                                const id = `${recipe._id}_${date}_${index}`;
                                return (
                                  <Draggable
                                    key={id}
                                    index={index}
                                    draggableId={id}
                                    isDragDisabled={!editing}
                                  >
                                    {(provided, snapshot) => (
                                      <RootRef rootRef={provided.innerRef}>
                                        <Grid
                                          item
                                          xs={12}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                          )}
                                        >
                                          <RecipeCard data={recipe} noDate />
                                        </Grid>
                                      </RootRef>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {editing && (
                                <Grid
                                  item
                                  xs={12}
                                  className={classes.addBtnCard}
                                >
                                  <IconButton color="secondary">
                                    <AddIcon />
                                  </IconButton>
                                </Grid>
                              )}
                              {provided.placeholder}
                            </Grid>
                          </RootRef>
                        )}
                      </Droppable>
                    </Grid>
                  )}
                </React.Fragment>
              );
            })}
          </Grid>
          {editing && (
            <Grid item xs={4} className={classes.rightPanel}>
              <List side/>
            </Grid>
          )}
        </Grid>
      </Container>
      {!isLoading && !isError && (
        <div className={classes.fabBox}>
          <Fab
            color="primary"
            className={classes.fab}
            onClick={() => setEditing(!editing)}
          >
            <AddIcon />
          </Fab>
          <Fab
            color="secondary"
            className={classes.fab}
            onClick={() => executeScroll()}
            size="small"
          >
            <DateRangeIcon />
          </Fab>
        </div>
      )}
    </DragDropContext>
  );
}

Planning.propTypes = {};

export default Planning;
