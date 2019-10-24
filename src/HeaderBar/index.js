import React from "react";
import { Location } from "@reach/router";
import {
  Typography,
  LinearProgress,
  Toolbar
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "./Menu";
import { useUserState } from "../contexts/user";
import {
  StyledAppBar,
  MenuButton,
  Title,
} from './index.style'

function HeaderBar({ isLoading }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { username } = useUserState();
  return (
    <Location>
      {({ location }) => (
        <React.Fragment>
          <StyledAppBar>
            <Toolbar>
              <MenuButton
                aria-label="Open drawer"
                edge="start"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <MenuIcon />
              </MenuButton>

              <Title variant="h6" component="h1" noWrap>
                Mes Recettes
              </Title>
              {username && <Typography variant="button">{username}</Typography>}
            </Toolbar>
            {isLoading && <LinearProgress color="secondary" />}
          </StyledAppBar>
          <Menu
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />
        </React.Fragment>
      )}
    </Location>
  );
}

export default HeaderBar;
