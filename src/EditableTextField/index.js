import React from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@material-ui/core';
import CreateIcon from "@material-ui/icons/Create";
import SaveIcon from "@material-ui/icons/Save";
import ClearIcon from "@material-ui/icons/Clear";

import { ActionButton } from './index.style';

const EditableTextField = ({ value, hasChanged, name, onChange, onSave, onClear, ...textFieldProps }) => {
  return (
    <TextField
      value={value}
      name={name}
      onChange={onChange}
      InputProps={{
        endAdornment:
          <>
            {hasChanged && (
              <ActionButton onClick={onSave}>
                <SaveIcon />
              </ActionButton>
            )}
            {value && (
              <ActionButton onClick={onClear}>
                <ClearIcon />
              </ActionButton>
            )}
            {(!value && !hasChanged) && (
              <CreateIcon/>
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
