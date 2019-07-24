import React from "react";
// import PropTypes from "prop-types";
import axios from "axios";
import {
  Grid,
  Container,
  Typography,
  IconButton,
  Button,
  Fab,
  Dialog,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DateRangeIcon from "@material-ui/icons/DateRange";
import ClearIcon from "@material-ui/icons/Clear";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"; // https://codesandbox.io/s/4qp6vjp319?from-embed

import { formatToDay, formatToDayOfWeek, isToday } from "../utils/date";
import RecipeCard from "../RecipeCard";
import List from "../List";
import { scrollToRef } from "../utils/toolkit";
import { useRecipesState } from "../contexts/recipes";
import { useStyles } from "./styles";
import { useDaysList } from "./hooks/useDaysList";

function Planning() {
  const classes = useStyles();
  const { recipes, isLoading, isError, refresh } = useRecipesState();
  const [days, setDays, addDays] = useDaysList(recipes);

  const [editing, setEditing] = React.useState(true);

  // Scrolling
  const todayRef = React.useRef(null);
  const executeScroll = (smooth = true) => scrollToRef(todayRef, smooth);
  const topRef = React.useRef(null);
  const [topRefDate, setTopRefDate] = React.useState(null);
  const onPreviousClick = () => {
    setTopRefDate(days[0].date);
    addDays();
  };
  React.useEffect(() => {
    if(days.length && !topRefDate) {
      setTopRefDate(days[0].date);
    }
    topRef.current && scrollToRef(topRef, false);
  }, [days, topRefDate]);

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
      const recipe = recipes.find(({ _id }) => _id === recipeId);

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

  const onRemove = (recipe, srcDate) => {
    const { _id: recipeId, dates } = recipe;

    const updatedDays = [...days];
    const oldDay = updatedDays.find(({ date }) => date === srcDate);
    oldDay.recipes = oldDay.recipes.filter(({ _id }) => _id !== recipeId);
    setDays(updatedDays);

    const newDates = dates.filter(date => date !== srcDate);
    updateRecipeDates(recipe, newDates);
  };

  const updateRecipeDates = async (recipe, dates) => {
    const { _id: strictId, id, title, description, vegetarian } = recipe;
    const options = {
      url: `/api/recipes/${strictId}`,
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
      .then(r => console.log(r))
      .catch(e => console.log(e))
      .finally(() => refresh());
  };

  const [isDialogOpen, setDialogOpen] = React.useState(false);
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
        <Grid container spacing={4} direction="column">
          <Button onClick={onPreviousClick}>Précédent jours</Button>
          {days.map(({ date, recipes }, dayIndex) => {
            return (
              <React.Fragment key={date}>
                {isToday(date) && <div ref={todayRef} />}
                {(recipes.length > 0 || editing) && (
                  <Grid
                    item
                    container
                    spacing={2}
                    id={date}
                    ref={topRefDate === date ? topRef : null}
                  >
                    <Grid item className={classes.gridItemDate}>
                      <Typography className={classes.dateText}>
                        {formatToDayOfWeek(date)}
                      </Typography>
                      <Typography className={classes.dateText}>
                        {formatToDay(date)}
                      </Typography>
                    </Grid>
                    <Droppable droppableId={date}>
                      {provided => (
                        <RootRef rootRef={provided.innerRef}>
                          <Grid
                            item
                            container
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
                                  {provided => (
                                    <RootRef rootRef={provided.innerRef}>
                                      <Grid
                                        item
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={provided.draggableProps.style}
                                        className={classes.recipeCard}
                                      >
                                        <RecipeCard
                                          recipe={recipe}
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
          classes={{ paper: classes.dialog }}
          fullScreen={fullScreen}
          maxWidth="sm"
          fullWidth
          scroll="paper"
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent
            dividers
            classes={{
              root: classes.dialogContent,
              dividers: classes.dialogDividers
            }}
          >
            <List onPick={onPick} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      {!isLoading && !isError && (
        <div className={classes.fabBox}>
          <Fab
            color="primary"
            className={classes.fab}
            onClick={() => setEditing(!editing)}
            size="medium"
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
