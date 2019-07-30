import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/fr";
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
  chip: { margin: "5px" }
});

function Dates(props) {
  const classes = useStyles();
  const { name, value, label, register, onChange } = props;
  const [dates, setDates] = React.useState(value);
  const [pickerValue, setPickerValue] = React.useState(moment());

  const onAdd = () => {
    const newDates = [...dates, pickerValue.format("YYYY-MM-DD")]
    setDates(newDates);
    onChange(newDates)
    setPickerValue(moment());
  }

  const onRemove = index => {
    const newDates = [...dates];
    newDates.splice(index, 1);
    setDates(newDates);
  };
  return (
    <>
      <div>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item>
            <MuiPickersUtilsProvider utils={MomentUtils} locale="fr">
              <KeyboardDatePicker
                value={pickerValue}
                onChange={date => setPickerValue(date || moment())}
                format="DD/MM/YYYY"
                label={label}
                name={name}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item>
            <Button aria-label="Add date" variant="outlined" onClick={() => onAdd()}>
              <AddIcon />
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </div>
      <div>
        {dates
          .sort((a,b) => new Date(b) - new Date(a))
          .map((date, i) => (
          <Chip
            key={`${date}-${i}`}
            className={classes.chip}
            variant="outlined"
            onDelete={onRemove.bind(this, i)}
            label={date}
          />
        ))}
        <input name={name} ref={register} value={JSON.stringify(dates)} style={{display: 'none'}} onChange={() => {}}/>
      </div>
    </>
  );
}

Dates.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Dates;
