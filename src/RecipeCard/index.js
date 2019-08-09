import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "@reach/router";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Avatar,
  TextField
} from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

import { getLastDateFromNow } from "../utils/date";
import { useStyles } from "./styles";
import { useRecipesState } from "../contexts/recipes";

import CreateIcon from "@material-ui/icons/Create";
import SaveIcon from "@material-ui/icons/Save";
import ClearIcon from "@material-ui/icons/Clear";
import EditableTextField from "../EditableTextField";


function RecipeCard({ recipe, plannedDate = "", selected = false, onPick }) {
  const classes = useStyles();
  const { title, _id, url, vegetarian: veg, dates, description } = recipe;
  const lastDate = getLastDateFromNow(dates.map(d => d.date));

  const date = recipe.dates.find(({ date }) => date === plannedDate);
  const savedNote = (date && date.note) || "";
  const [note, setNote] = React.useState(savedNote);
  const { updateRecipe } = useRecipesState();
  const onChange = event => {
    const { value } = event.target;
    setNote(value);
  }
  const onSave = () => {
    date.note = note;
    updateRecipe({ ...recipe });
  }

  const isPlanned = plannedDate !== "";
  const [showNoteField, setShowNoteField] = React.useState(isPlanned && savedNote !== "");
  const onNoteClick = () => {
    if(showNoteField) return
    setShowNoteField(true);
  }
  return (
    <Card className={selected ? classes.selectedCard : ""}>
      <CardContent>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        {lastDate && !isPlanned && (
          <Typography component="span">
            <i>{lastDate}</i>
          </Typography>
        )}
        {description && (<Typography>{description}</Typography>)}
        {showNoteField && (
          <EditableTextField
            multiline
            fullWidth
            name="note"
            value={note}
            hasChanged={note !== savedNote}
            onChange={onChange}
            onSave={onSave}
            onClear={() => setNote("")}
          />
        )}
      </CardContent>
      <CardActions className={classes.cardAction}>
        {veg && <Avatar className={classes.avatar}>V</Avatar>}
        {url && (
          <IconButton
            href={url}
            target="_blank"
            rel="noreferrer noopener"
          >
            <OpenInNewIcon style={{ fontSize: 20 }} />
          </IconButton>
        )}
        {(isPlanned && !showNoteField) && <Button onClick={onNoteClick}>NOTE</Button>}
        <Button component={RouterLink} to={`/${_id}`}>
          PLUS
        </Button>
        {!!onPick && <Button onClick={() => onPick(recipe._id)}>AJOUTER</Button>}
      </CardActions>
    </Card>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    title: PropTypes.string.isRequired
  }).isRequired
};

export default RecipeCard;
