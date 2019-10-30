import React from "react";
import {
  Grid,
  IconButton,
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import AddIcon from "@material-ui/icons/Add";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"; // https://codesandbox.io/s/4qp6vjp319?from-embed

import { formatToDay, formatToDayOfWeek, isToday } from "../utils/date";
import RecipeCard from "../RecipeCard";
import { scrollToRef } from "../utils/toolkit";
import { useDaysList } from "./hooks/useDaysList";


import {
  GridRow,
  BeforeButton,
  DateText,
  AddBtnCard,
  RecipeCardWrapper,
  ContainerWrapper,
} from "./index.style";

const Planning = ({ navigate }) => {
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

  const onClickPick = date => {
    navigate(`recipes?date=${date}`, { state: { isPicking: true }})
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ContainerWrapper>
        {isError && "ERROR"}
        <Grid container spacing={4} direction="column" alignItems="center">
          <BeforeButton
            onClick={() => onPreviousClick()}
            color="primary"
            size="small"
          >
            Jours précédents
          </BeforeButton>
          {days.map(({ date, planningPoints }) => (
            <React.Fragment key={date}>
              {isToday(date) && <div ref={todayRef} />}
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
                        spacing={1}
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
                                      onRemove={() => onRemove(planningPoint._id, date)}
                                    />
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
            </React.Fragment>
          ))}
        </Grid>
      </ContainerWrapper>
    </DragDropContext>
  );
}

Planning.propTypes = {};

export default Planning;
