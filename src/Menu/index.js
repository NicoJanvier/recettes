import React from "react";
import { Hidden, Drawer } from "@material-ui/core";

import DrawerContent from "./DrawerContent";



const Menu = ({mobileOpen, setMobileOpen, classes}) => {
  return (
    <nav className={classes.drawer} aria-label="Mailbox folders">
      <Hidden smUp implementation="css">
        <Drawer
          // container={container}
          variant="temporary"
          // anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={() => setMobileOpen(!mobileOpen)}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          <DrawerContent classes={classes} onNavigate={() => setMobileOpen(false)}/>
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="permanent"
          open
        >
          <DrawerContent classes={classes} onNavigate={() => setMobileOpen(false)}/>
        </Drawer>
      </Hidden>
    </nav>
  );
};

export default Menu;
