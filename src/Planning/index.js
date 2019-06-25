import React from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Container,
  Typography,
  AppBar,
  FormControlLabel,
  Switch,
  IconButton,
  Button
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import { makeStyles } from "@material-ui/styles";
import AddIcon from "@material-ui/icons/Add";

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
import { scrollToRef } from "../utils/toolkit";

const API_PATH = "http://localhost:8080/api";

const useStyles = makeStyles({
  appBar: {
    position: "sticky",
    background: "white",
    top: "50px",
    zIndex: 1
  },
  switchLabel: {
    color: "black"
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
  const todayRef = React.useRef(null);
  const executeScroll = () => scrollToRef(todayRef);

  const onDragEnd = result => {
    console.log(result);
    if (!result.destination) {
      return;
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
    <>
      <AppBar className={classes.appBar} elevation={1} square component="div">
        <Container>
          <FormControlLabel
            label="Éditer"
            className={classes.switchLabel}
            control={
              <Switch checked={editing} onChange={() => setEditing(!editing)} />
            }
          />
          <Button onClick={() => executeScroll()}>Scroll</Button>
        </Container>
      </AppBar>
      <DragDropContext onDragEnd={onDragEnd}>
        <Container>
          {isError && "ERROR"}
          <Grid container spacing={4}>
            {days.map(({ date, recipes }) => {
              return (
                <>
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
                </>
              );
            })}
          </Grid>
        </Container>
      </DragDropContext>
    </>
  );
}

Planning.propTypes = {};

export default Planning;
