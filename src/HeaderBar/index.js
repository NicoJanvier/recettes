import React from "react";
import PropTypes from "prop-types";
import { Location, Link } from "@reach/router";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Typography,
  IconButton,
  LinearProgress,
  Button
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: "50px"
  },
  title: {
    flexGrow: 1
    // marginLeft: "20px"
  }
});

function HeaderBar({ loading }) {
  const classes = useStyles();
  return (
    <Location>
      {({ location }) => (
        <div className={classes.root}>
          <AppBar position="fixed" className={classes.appBar}>
            <IconButton component={Link} to="/">
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="h1"
              noWrap
              className={classes.title}
            >
              Mes Recettes
            </Typography>
            <Button component={Link} to="/planning">Planning</Button>
            {location.pathname !== "/new" && (
              <IconButton component={Link} to="/new">
                <AddIcon />
              </IconButton>
            )}
            <div />
          </AppBar>
          {loading && <LinearProgress color="secondary" />}
        </div>
      )}
    </Location>
  );
}

HeaderBar.propTypes = {
  loading: PropTypes.bool.isRequired
};

export default HeaderBar;
