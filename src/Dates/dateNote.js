import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Card, Typography, CardContent, CardActions, Button } from '@material-ui/core';
import moment from 'moment';

function DateNoteCard({ content: { date, note }, onChange, onDelete }) {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant="h5">{moment(date).format('dddd DD MMM')}</Typography>
          <Typography variant="caption"><i>{moment(date).format('DD/MM/YYYY')}</i></Typography><br />
          {note && (<Typography>Note: {note}</Typography>)}
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

