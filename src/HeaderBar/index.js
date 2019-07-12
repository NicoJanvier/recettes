import React from "react";
import PropTypes from "prop-types";
import { Location, Link } from "@reach/router";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Typography,
  IconButton,
  LinearProgress,
  Button,
  Toolbar
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "../Menu";

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  }
}));

function HeaderBar({ loading }) {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  React.useEffect(() => {

  }, [])
  return (
    <Location>
      {({ location }) => (
        <React.Fragment>
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                edge="start"
                onClick={() => setMobileOpen(!mobileOpen)}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>

              <Typography
                variant="h6"
                component="h1"
                noWrap
              >
                Mes Recettes
              </Typography>
            </Toolbar>
            {loading && <LinearProgress color="secondary" />}
          </AppBar>
          <Menu
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            classes={classes}
          />
        </React.Fragment>
      )}
    </Location>
  );
}

HeaderBar.propTypes = {
  loading: PropTypes.bool.isRequired
};

export default HeaderBar;
