import React from "react";
import {
  Grid,
  Container,
  IconButton,
  Button,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
// import DateRangeIcon from "@material-ui/icons/DateRange";
import ClearIcon from "@material-ui/icons/Clear";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"; // https://codesandbox.io/s/4qp6vjp319?from-embed

import { formatToDay, formatToDayOfWeek, isToday } from "../utils/date";
import RecipeCard from "../RecipeCard";
import List from "../List";
import { scrollToRef } from "../utils/toolkit";
import { useDaysList } from "./hooks/useDaysList";


import {
  GridRow,
  DateText,
  AddBtnCard,
  RecipeCardWrapper,
  RemoveButton,
  DialogWrapper,
} from "./index.style";

function Planning() {
  const { days, addDays, isError, moveRecipe } = useDaysList();

  // Scrolling
  const todayRef = React.useRef(null);
  // const executeScroll = (smooth = true) => scrollToRef(todayRef, smooth);
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
    const planningPointId = draggableId.split("_")[0];

    if (newDate !== oldDate) {
      const add = { date: newDate, index: newIndex };
      const remove = { date: oldDate };
      moveRecipe({ id: planningPointId, add, remove });
    }
  };

  const onRemove = (id, date) => moveRecipe({ id, remove: { date } })

  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [pickDate, setPickDate] = React.useState(null);
  const onClickPick = date => {
    setPickDate(date);
    setDialogOpen(true);
  };
  const onPick = recipe => {
    moveRecipe({ recipe, add: { date: pickDate } });
    setDialogOpen(false);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        {isError && "ERROR"}
        <Grid container spacing={4} direction="column" alignItems="center">
          <Grid item>
            <Button onClick={() => onPreviousClick()} color="primary" >Jours précédents</Button>
          </Grid>
          {days.map(({ date, planningPoints }) => (
            <React.Fragment key={date}>
              {isToday(date) && <div ref={todayRef} />}
              {(planningPoints.length > 0) && (
                <Grid
                  item
                  container
                  spacing={2}
                  id={date}
                  ref={topRefDate === date ? topRef : null}
                >
                  <Grid item>
                    <DateText>
                      {formatToDayOfWeek(date)}
                    </DateText>
                    <DateText>
                      {formatToDay(date)}
                    </DateText>
                  </Grid>
                  <Droppable droppableId={date}>
                    {provided => (
                      <RootRef rootRef={provided.innerRef}>
                        <GridRow
                          item
                          container
                        >
                          {planningPoints.map((planningPoint, index) => {
                            const id = `${planningPoint._id}_${date}_${index}`;
                            return (
                              <Draggable
                                key={id}
                                index={index}
                                draggableId={id}
                              >
                                {provided => (
                                  <RootRef rootRef={provided.innerRef}>
                                    <RecipeCardWrapper
                                      item
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={provided.draggableProps.style}
                                    >
                                      <RecipeCard
                                        recipe={planningPoint.recipe}
                                        selected={isToday(date)}
                                        planningPoint={planningPoint}
                                      />
                                      <RemoveButton
                                        color="primary"
                                        size="small"
                                        onClick={() => onRemove(planningPoint._id, date)}
                                        name="remove"
                                      >
                                        <ClearIcon />
                                      </RemoveButton>
                                    </RecipeCardWrapper>
                                  </RootRef>
                                )}
                              </Draggable>
                            );
                          })}
                          <AddBtnCard item xs={12}>
                            <IconButton
                              color="primary"
                              onClick={() => onClickPick(date)}
                            >
                              <AddIcon />
                            </IconButton>
                          </AddBtnCard>
                          {provided.placeholder}
                        </GridRow>
                      </RootRef>
                    )}
                  </Droppable>
                </Grid>
              )}
            </React.Fragment>
          ))}
        </Grid>
        <DialogWrapper
          open={isDialogOpen}
          onClose={() => setDialogOpen(false)}
          classes={{ paper: "paper" }}
          fullScreen={fullScreen}
          maxWidth="sm"
          fullWidth
          scroll="paper"
        >
          <DialogContent
            dividers
            classes={{
              root: "content",
              dividers: "dividers"
            }}
          >
            <List onPick={onPick} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </DialogWrapper>
      </Container>
    </DragDropContext>
  );
}

Planning.propTypes = {};

export default Planning;
