import React from "react";
import PropTypes from "prop-types";
import moment from "moment-with-locales-es6";
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
import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/styles";

import OpenInNewIcon from "@material-ui/icons/OpenInNew";

const useStyles = makeStyles({
  cardAction: {
    justifyContent: "flex-end"
  },
  avatar: {
    color: "white",
    backgroundColor: green[500],
    width: "25px",
    height: "25px",
    fontSize: "12px",
    marginRight: "auto",
    marginLeft: "6px"
  }
});

const getLastDate = (dates = []) => {
  if (dates.length === 0) return false;
  moment.locale("fr");
  return dates
    .map(date => moment(date))
    .sort((a, b) => moment(a).isBefore(b))[0]
    .fromNow(true);
};

function RecipeCard({ data }) {
  const classes = useStyles();
  const { title, _id, url, vegetarian: veg, dates } = data;
  const lastDate = getLastDate(dates);
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
          {lastDate && (
            <Typography component="span">
              <i>{lastDate}</i>
            </Typography>
          )}
      </CardContent>
      <CardActions className={classes.cardAction}>
        {veg && <Avatar className={classes.avatar}>V</Avatar>}
        {url && (
          <IconButton
            size="small"
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
      </CardActions>
    </Card>
  );
}

RecipeCard.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired
  }).isRequired
};

export default RecipeCard;
