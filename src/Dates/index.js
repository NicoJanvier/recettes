import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import {
  Button,
  Chip,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AddIcon from "@material-ui/icons/Add";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

const useStyles = makeStyles({
  button: {
    // padding: "2px",
  },
  chip: { margin: "5px"}
});

const toEventLike = value => ({
  target: {
    name: "dates",
    value
  }
});

function Dates(props) {
  const classes = useStyles();
  const { name, dates, label, mandatory, onSubmit } = props;
  const [value, setValue] = React.useState(moment());

  const onAdd = React.useCallback(() => {
    onSubmit(toEventLike([value.format("YYYY-MM-DD"), ...dates]));
    setValue(moment());
  }, [value, dates, onSubmit]);

  const onRemove = index => {
    const newDates = [...dates];
    newDates.splice(index, 1);
    onSubmit(toEventLike(newDates));
  };
  return (
    <>
      <div>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                value={value}
                onChange={date => setValue(date || moment())}
                format="DD/MM/YYYY"
                label={label}
                required={mandatory}
                name={name}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item>
            <Button aria-label="Add date" variant="outlined" onClick={onAdd}>
              <AddIcon />
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </div>
      <div>
        {dates &&
          dates.map((date, i) => (
            <Chip
              key={`${date}-${i}`}
              className={classes.chip}
              variant="outlined"
              onDelete={onRemove.bind(this, i)}
              label={date}
            />
          ))}
      </div>
    </>
  );
}

Dates.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  dates: PropTypes.array.isRequired
};

export default Dates;
