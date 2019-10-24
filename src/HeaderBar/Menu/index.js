import React from "react";
import { Hidden, Drawer } from "@material-ui/core";
import DrawerContent from "./DrawerContent";
import { StyledNav } from '../index.style';

const Menu = ({ mobileOpen, setMobileOpen }) => {
  return (
    <StyledNav>
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(!mobileOpen)}
          classes={{ paper: "drawerPaper" }}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          <DrawerContent onNavigate={() => setMobileOpen(false)} />
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          open
          classes={{ paper: "drawerPaper" }}
          variant="permanent"
        >
          <DrawerContent onNavigate={() => setMobileOpen(false)} />
        </Drawer>
      </Hidden>
    </StyledNav>
  );
};

export default Menu;
