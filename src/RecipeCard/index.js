import React from "react";
// import PropTypes from "prop-types";
import { navigate } from "@reach/router";
import {
  Typography,
  Button,
  IconButton,
  CardActionArea,
  CardContent,
  Menu,
  MenuItem,
  Divider,
} from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { usePlanningState } from "../contexts/planning";

import EditableTextField from "../EditableTextField";
import { fromNow } from "../utils/date";
import { CardWrapper, CardActionsWrapper, AvatarWrapper } from './index.style';

function RecipeCard({
  recipe,
  planningPoint = {},
  selected = false,
  pick = {},
  onRemove,
}) {
  const { title, _id, url, vegetarian: veg, description } = recipe;
  const savedNote = planningPoint.note || "";
  const [note, setNote] = React.useState(savedNote);
  const { updatePlanningPoint } = usePlanningState();
  const onChange = event => {
    const { value } = event.target;
    setNote(value);
  }
  const onSave = () => {
    updatePlanningPoint({ ...planningPoint, note });
  }

  const isPlanned = !!planningPoint.date;
  const [showNoteField, setShowNoteField] = React.useState(planningPoint.date && savedNote !== "");
  const onNoteClick = () => {
    setShowNoteField(!showNoteField);
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const { isPicking, onPick, toPath } = pick;
  const handleGoToRecipe = () => {
    if (isPicking) {
      toPath(_id)
    } else {
      navigate(`/recipes/${_id}`)
    }
  }
  return (
    <CardWrapper selected={selected}>
      <CardActionArea onClick={handleGoToRecipe}>
        <CardContent>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          {recipe.lastDate && (
            <Typography component="span">
              <i>{fromNow(recipe.lastDate)}</i>
            </Typography>
          )}
          {description && (<Typography>{description}</Typography>)}
        </CardContent>
      </CardActionArea>
      {(veg || url || isPicking || isPlanned) &&
        <>
          <Divider light />
          {showNoteField &&
            <CardContent>
              <EditableTextField
                value={note}
                hasChanged={note !== savedNote}
                onChange={onChange}
                onSave={onSave}
                onClear={() => setNote("")}
                onClose={onNoteClick}
              />
            </CardContent>
          }
          <CardActionsWrapper>
            {veg && <AvatarWrapper>V</AvatarWrapper>}
            {url && (
              <Button
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                size="small"
                color="primary"
              >
                LIEN
            </Button>
            )}
            {isPlanned &&
              <>
                <IconButton size="small" onClick={handleMenuClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="extras-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    onClick={() => { onNoteClick(); handleMenuClose(); }}
                    disabled={showNoteField}
                  >
                    Ajouter une note
                </MenuItem>
                  <MenuItem onClick={onRemove}>Supprimer</MenuItem>
                </Menu>
              </>
            }
            {isPicking &&
              <Button
                onClick={() => onPick(recipe)}
                size="small"
                variant="outlined"
                color="primary"
              >
                AJOUTER
              </Button>}
          </CardActionsWrapper>
        </>
      }
    </CardWrapper>
  );
}

export default RecipeCard;
