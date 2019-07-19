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
  Avatar
} from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

import { getLastDateFromNow } from "../utils/date";
import { useStyles } from "./styles";

function RecipeCard({ recipe, noDate = false, selected = false, onPick}) {
  const classes = useStyles();
  const { title, _id, url, vegetarian: veg, dates } = recipe;
  const lastDate = getLastDateFromNow(dates);
  return (
    <Card className={selected ? classes.selectedCard : ""}>
      <CardContent>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        {lastDate && !noDate && (
          <Typography component="span">
            <i>{lastDate}</i>
          </Typography>
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
        <Button component={RouterLink} to={`/${_id}`}>
          PLUS
        </Button>
        {!!onPick && <Button onClick={() => onPick(recipe)}>AJOUTER</Button>}
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
