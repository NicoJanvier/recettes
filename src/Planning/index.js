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
  Drawer,
  Dialog
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import { makeStyles } from "@material-ui/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DateRangeIcon from "@material-ui/icons/DateRange";
import ClearIcon from "@material-ui/icons/Clear";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"; // https://codesandbox.io/s/4qp6vjp319?from-embed

import useDataApi from "../hooks/useDataApi";
import {
  compareDateProperty,
  formatToDay,
  formatToDayOfWeek,
  addDays,
  generateDateList,
  isToday
} from "../utils/date";
import RecipeCard from "../RecipeCard";
import List from "../List";
import { scrollToRef } from "../utils/toolkit";

const API_PATH = "/api";

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
    alignItems: "center"
  },
  fab: {
    marginTop: "16px"
  },
  // Remove Button
  recipeCard: {
    position: "relative",
    "&:hover": {
      "& .MuiCard-root": {
        backgroundColor: "rgba(0, 0, 0, 0.01)"
      },
      "& button": {
        width: "25px",
        height: "25px",
        transform: "scale(1)"
        // "& svg": {
        //   display: "block",
        // }
      }
    }
  },
  rmvBtn: {
    position: "absolute",
    top: "4px",
    right: "4px",
    minHeight: "0px"
  },
  rmvBtnSize: {
    width: "25px",
    height: "25px",
    transform: "scale(0)",
    transition: "all 0.5s"
  },
  rmvIcon: {
    width: "0.8em",
    height: "0.8em"
  }
});

function Planning({ setLoading }) {
  const classes = useStyles();
  const url = { url: `${API_PATH}/recipes`, method: "get" };
  const [{ isLoading, isError, data }, setUrl] = useDataApi(url, []);
  React.useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);
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

  const [editing, setEditing] = React.useState(false);

  // Scrolling
  const todayRef = React.useRef(null);
  const executeScroll = () => scrollToRef(todayRef);

  // Draggable
  const onDragEnd = result => {
    console.log(result);
    if (!result.destination) {
      return;
    }
    const newDate = result.destination.droppableId;
    const newIndex = result.destination.index;
    const oldDate = result.source.droppableId;
    const recipeId = result.draggableId.split("_")[0];

    if (newDate !== oldDate) {
      const recipe = data.data.find(({ _id }) => _id === recipeId);

      const updatedDays = [...days];
      const oldDay = updatedDays.find(({ date }) => date === oldDate);
      const newDay = updatedDays.find(({ date }) => date === newDate);
      if (oldDay) {
        oldDay.recipes = oldDay.recipes.filter(({ _id }) => _id !== recipeId);
      }
      newDay.recipes.splice(newIndex, 0, recipe);
      setDays(updatedDays);

      const newDates = [
        ...recipe.dates.filter(date => date !== oldDate),
        newDate
      ];
      updateRecipeDates(recipe, newDates);
    }
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // styles we need to apply on draggables
    ...draggableStyle

    // ...(isDragging && {
    //   background: "rgb(235,235,235)"
    // })
  });

  const onRemove = (recipe, srcDate) => {
    const { _id: recipeId, dates } = recipe;

    const updatedDays = [...days];
    const oldDay = updatedDays.find(({ date }) => date === srcDate);
    oldDay.recipes = oldDay.recipes.filter(({ _id }) => _id !== recipeId);
    setDays(updatedDays);

    const newDates = dates.filter(date => date !== srcDate);
    updateRecipeDates(recipe, newDates);
  };

  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const updateRecipeDates = async (recipe, dates) => {
    const { _id: strictId, id, title, description, vegetarian } = recipe;
    const options = {
      url: `${API_PATH}/recipes/${strictId}`,
      method: "put",
      data: {
        id,
        title,
        description,
        vegetarian,
        dates
      }
    };
    axios(options)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
        refresh();
      });
  };

  const [pickDate, setPickDate] = React.useState(null);
  const onClickPick = date => {
    setPickDate(date);
    setDialogOpen(true);
  };
  const onPick = recipe => {
    const updatedDays = [...days];
    const targetDay = updatedDays.find(({ date }) => date === pickDate);
    targetDay.recipes.push(recipe);
    setDays(updatedDays);
    const newDates = [...recipe.dates, pickDate];
    updateRecipeDates(recipe, newDates);
    setDialogOpen(false);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        {isError && "ERROR"}
        <Grid container item spacing={4} xs={12} className={classes.leftPanel}>
          {days.map(({ date, recipes }) => {
            return (
              <React.Fragment key={date}>
                {isToday(date) && <div ref={todayRef} />}
                {(recipes.length > 0 || editing) && (
                  <Grid item container xs={12} id={date}>
                    <Grid item xs={2} className={classes.gridItemDate}>
                      <Typography>{formatToDay(date)}</Typography>
                      <Typography>{formatToDayOfWeek(date)}</Typography>
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
                                        className={classes.recipeCard}
                                      >
                                        <RecipeCard
                                          data={recipe}
                                          noDate
                                          selected={isToday(date)}
                                        />
                                        <Fab
                                          color="secondary"
                                          size="small"
                                          className={classes.rmvBtn}
                                          classes={{
                                            sizeSmall: classes.rmvBtnSize
                                          }}
                                          onClick={() => onRemove(recipe, date)}
                                        >
                                          <ClearIcon
                                            className={classes.rmvIcon}
                                          />
                                        </Fab>
                                      </Grid>
                                    </RootRef>
                                  )}
                                </Draggable>
                              );
                            })}
                            {editing && (
                              <Grid item xs={12} className={classes.addBtnCard}>
                                <IconButton
                                  color="secondary"
                                  onClick={() => onClickPick(date)}
                                >
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
        <Dialog
          open={isDialogOpen}
          onClose={() => setDialogOpen(false)}
          fullScreen={fullScreen}
          aria-labelledby="responsive-dialog-title"
        >
          <List onPick={onPick} />
        </Dialog>
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
