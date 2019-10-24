import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "moment/locale/fr";
import MomentUtils from "@date-io/moment";
import {
  Button,
  Grid,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import DateNoteCard from "./dateNote";


function Dates(props) {
  const { name, value, label, register, onChange } = props;
  const [dates, setDates] = React.useState(value);
  const [pickerValue, setPickerValue] = React.useState(moment());

  const onAdd = () => {
    const newDates = [...dates, { date: pickerValue.format("YYYY-MM-DD"), note: "" }];
    setDates(newDates);
    onChange(); // "touch" dates input
    setPickerValue(moment());
  }

  const onNote = index => value => {
    setDates(prevDates => {
      prevDates[index].note = value;
      return prevDates;
    });
    onChange();
  }

  const onRemove = index => {
    const newDates = [...dates];
    newDates.splice(index, 1);
    setDates(newDates);
    onChange();
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
        <Grid container spacing={2}>
          {dates
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((date, i) => (
              <DateNoteCard
                key={`${date.date}-${i}`}
                content={date}
                onChange={onNote(i)}
                onDelete={onRemove.bind(this, i)}
              />
            ))}
          <input
            name={name}
            ref={register}
            value={JSON.stringify(dates)}
            onChange={() => { }}
            style={{ display: "none" }}
          />
        </Grid>
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
