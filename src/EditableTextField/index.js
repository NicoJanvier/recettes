import React from 'react'
import PropTypes from 'prop-types'
import { TextField, IconButton } from '@material-ui/core';
import CreateIcon from "@material-ui/icons/Create";
import SaveIcon from "@material-ui/icons/Save";
import ClearIcon from "@material-ui/icons/Clear";

import { useStyles } from "./styles";

const EditableTextField = ({ value, hasChanged, name, onChange, onSave, onClear, ...textFieldProps }) => {
  const classes = useStyles();

  return (
    <TextField
      value={value}
      name={name}
      onChange={onChange}
      InputProps={{
        endAdornment:
          <>
            {hasChanged && (
              <IconButton onClick={onSave} className={classes.actionButtons}>
                <SaveIcon />
              </IconButton>
            )}
            {value && (
              <IconButton onClick={onClear} className={classes.actionButtons}>
                <ClearIcon />
              </IconButton>
            )}
            {(!value && !hasChanged) && (
              <CreateIcon className={classes.editIcon} />
            )}
          </>
      }}
      {...textFieldProps}
    />
  )
}

EditableTextField.propTypes = {
  value: PropTypes.string.isRequired,
  hasChanged: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
}

export default EditableTextField
