import React from 'react';
import PropTypes from 'prop-types';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import SaveIcon from "@material-ui/icons/Save";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";

const EditableTextField = ({
  value,
  hasChanged,
  name,
  onChange,
  onSave,
  onClear,
  onClose,
  ...textFieldProps
}) => {
  return (
    <TextField
      multiline
      fullWidth
      variant="filled"
      name="note"
      label="Notes"
      value={value}
      onChange={onChange}
      InputProps={{
        endAdornment:
          <InputAdornment position="end">
            {hasChanged && (
              <IconButton onClick={onSave} edge="end">
                <SaveIcon />
              </IconButton>
            )}
            {value && (
              <IconButton onClick={onClear} edge="end">
                <ClearIcon />
              </IconButton>
            )}
            {(!value && !hasChanged) && (
              <IconButton onClick={onClose} edge="end">
                <DeleteIcon />
              </IconButton>
            )}
          </InputAdornment>
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
