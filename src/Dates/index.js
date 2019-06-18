import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Dates extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    dates: PropTypes.array.isRequired
  };
  constructor(props) {
    super(props);
    this.state = { value: "", event: null };
  }

  onChange = event => {
    event.persist();
    this.setState({ value: event.target.value, event });
  };

  onAdd = () => {
    if (this.state.event) {
      const { value } = this.state;
      this.props.onSubmit({
        target: { name: "dates", value: [value, ...this.props.dates] }
      });
      this.setState({
        value: "",
        event: null
      });
    }
  };

  onRemove = index => {
    const { dates, onSubmit } = this.props;
    const newDates = [...dates];
    newDates.splice(index, 1);
    onSubmit({
      target: { name: "dates", value: newDates}
    })
  }

  render() {
    const { dates } = this.props;
    return (
      <>
        <div>
          <label htmlFor="date">Ajouter une date</label>
          <input
            name="dates"
            type="date"
            value={this.state.value}
            onChange={this.onChange}
          />
          <button onClick={this.onAdd}>Ajouter</button>
        </div>
        <div>
          {dates &&
            dates.map((date, i) => (
              <div key={`${date}-${i}`}>
                {date}
                <button onClick={i => this.onRemove(i)}>x</button>
              </div>
            ))}
        </div>
      </>
    );
  }
}
