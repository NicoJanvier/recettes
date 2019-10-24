import React from "react";
import { navigate } from "@reach/router";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from "@material-ui/core";

import DateRangeIcon from "@material-ui/icons/DateRange";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import ListIcon from "@material-ui/icons/List";
import Toys from "@material-ui/icons/Toys";
import GoogleIcon from "./logo/GoogleIcon";

import { ToolbarPlaceholder } from '../index.style'

const DrawerContent = ({ onNavigate }) => {
  const onClick = path => {
    onNavigate();
    navigate(path);
  }
  const navItems = [
    {
      key: 'internalLinks',
      nav: [
        {
          label: "Planning",
          icon: DateRangeIcon,
          onClick: () => onClick('/planning'),
        },
        {
          label: "List",
          icon: ListIcon,
          onClick: () => onClick('/recipes'),
        },
        {
          label: "Nouveau",
          icon: PlaylistAddIcon,
          onClick: () => onClick('/recipes/new'),
        }
      ]
    },
    {
      key: 'externalLinks',
      title: 'APP EXTERNES',
      nav: [
        {
          label: "Shopping List",
          icon: GoogleIcon,
          component: 'a',
          href: "https://shoppinglist.google.com",
          rel: "noopener noreferrer",
          target: "_blank"
        },
        {
          label: "Cookidoo",
          icon: Toys,
          component: 'a',
          href: "https://cookidoo.fr/foundation/fr-FR",
          rel: "noopener noreferrer",
          target: "_blank"
        }
      ]
    }
  ];
  return (
    <div>
      <ToolbarPlaceholder />
      {navItems.map(({ title, nav, key }) => (
        <React.Fragment key={key}>
          <Divider />
          <List
          subheader={title ? (
            <ListSubheader component="div">{title}</ListSubheader>
          ) : null}>
            {nav.map(({ label, icon: Icon, ...props }) => (
              <ListItem key={label} button {...props}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItem>
            ))}
          </List>
        </React.Fragment>
      ))}
    </div>
  );
};

export default DrawerContent;
