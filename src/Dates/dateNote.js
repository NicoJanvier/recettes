import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Card, Typography, TextField, CardContent, CardActions, Button, IconButton } from '@material-ui/core';
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import moment from 'moment';

function DateNoteCard({ content: { date, note }, onChange, onDelete }) {
  const onTextChange = event => {
    const { value } = event.target;
    onChange(value);
  }
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant="h5">{moment(date).format('dddd DD MMM')}</Typography>
          <Typography variant="caption"><i>{moment(date).format('DD/MM/YYYY')}</i></Typography><br />
          <TextField
            multiline
            fullWidth
            type="textarea"
            value={note}
            onChange={onTextChange}
            name="notes"
            label="Notes"
            InputProps={{
              endAdornment:
                note && (
                  <IconButton onClick={() => onChange("")}>
                    <ClearIcon />
                  </IconButton>
                )
            }}
          />
        </CardContent>
        <CardActions>
          <Button onClick={onDelete} >SUPPRIMER</Button>
        </CardActions>
      </Card>
    </Grid >
  )
}

DateNoteCard.propTypes = {
  content: PropTypes.shape({
    date: PropTypes.string.isRequired,
    note: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default DateNoteCard

