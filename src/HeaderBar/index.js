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
  const { username, isLogged } = useUserState();
  return (
    <Location>
      {({ location }) => (
        <React.Fragment>
          <StyledAppBar showMenu={isLogged}>
            <Toolbar>
              {isLogged &&
                <MenuButton
                  aria-label="Open drawer"
                  edge="start"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  disabled={!isLogged}
                >
                  <MenuIcon />
                </MenuButton>
              }
              <Title variant="h6" component="h1" noWrap>
                Mes Recettes
              </Title>
              {username && <Typography variant="button">{username}</Typography>}
            </Toolbar>
            {isLoading && <LinearProgress color="secondary" />}
          </StyledAppBar>
          {isLogged &&
            <Menu
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
            />
          }
        </React.Fragment>
      )}
    </Location>
  );
}

export default HeaderBar;
