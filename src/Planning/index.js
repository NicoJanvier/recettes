import React from "react";
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
import { useStyles } from "./styles";
import { useDaysList } from "./hooks/useDaysList";

function Planning() {
  const classes = useStyles();
  const { days, addDays, isError, moveRecipe } = useDaysList();

  const [editing, setEditing] = React.useState(true);

  // Scrolling
  const todayRef = React.useRef(null);
  const executeScroll = (smooth = true) => scrollToRef(todayRef, smooth);
  const topRef = React.useRef(null);
  const [topRefDate, setTopRefDate] = React.useState(null);
  function onPreviousClick() {
    setTopRefDate(days[0].date);
    addDays();
  };
  React.useEffect(() => scrollToRef(topRef, false), [topRefDate, days]);

  // Draggable
  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    const { source, destination, draggableId } = result;
    const newDate = destination.droppableId;
    const newIndex = destination.index;
    const oldDate = source.droppableId;
    const recipeId = draggableId.split("_")[0];

    if (newDate !== oldDate) {
      const add = { date: newDate, index: newIndex };
      const remove = { date: oldDate };
      moveRecipe({ id: recipeId, add, remove });
    }
  };

  const onRemove = (id, date) => moveRecipe({ id, remove: { date } })

  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [pickDate, setPickDate] = React.useState(null);
  const onClickPick = date => {
    setPickDate(date);
    setDialogOpen(true);
  };
  const onPick = id => {
    moveRecipe({ id, add: { date: pickDate } });
    setDialogOpen(false);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        {isError && "ERROR"}
        <Grid container spacing={4} direction="column">
          <Button onClick={() => onPreviousClick()}>Précédent jours</Button>
          {days.map(({ date, recipes }) => {
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
                                          plannedDate={date}
                                          selected={isToday(date)}
                                        />
                                        <Fab
                                          color="secondary"
                                          size="small"
                                          className={classes.rmvBtn}
                                          classes={{
                                            sizeSmall: classes.rmvBtnSize
                                          }}
                                          onClick={() => onRemove(recipe._id, date)}
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
      {days.length > 0 && (
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
