import React from "react";
import { Link, navigate } from "@reach/router";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";

import DateRangeIcon from "@material-ui/icons/DateRange";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import ListIcon from "@material-ui/icons/List";
import GoogleIcon from "./logo/GoogleIcon";

const DrawerContent = ({ classes, onNavigate }) => {
  const onClick = path => {
    onNavigate();
    navigate(path);
  }
  const navItems = [
    [
      {
        label: "Planning",
        icon: DateRangeIcon,
        onClick: () => onClick('/planning'), 
      },
      {
        label: "List",
        icon: ListIcon,
        onClick: () => onClick('/list'), 
      },
      {
        label: "Nouveau",
        icon: PlaylistAddIcon,
        onClick: () => onClick('/new'), 
      }
    ],
    [
      {
        label: "Shopping List",
        icon: GoogleIcon,
        component: 'a',
        href: "https://shoppinglist.google.com",
        rel: "noopener noreferrer",
        target: "_blank"
      }
    ]
  ];
  return (
    <div>
      <div className={classes.toolbar} />
      {navItems.map(navGroup => (
        <React.Fragment key={navGroup[0].label}>
          <Divider />
          <List>
            {navGroup.map(({ label, icon: Icon, ...props }) => (
              <ListItem key={label} button {...props}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={label}/>
              </ListItem>
            ))}
          </List>
        </React.Fragment>
      ))}
    </div>
  );
};

export default DrawerContent;
