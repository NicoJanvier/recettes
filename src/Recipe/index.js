import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

import {
  Container,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  InputAdornment,
  IconButton
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

import formFields from "../utils/formFields";
import { navigate } from "@reach/router";
import Dates from "../Dates/";

const API_PATH = "http://localhost:8080/api";

class Recipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formState: formFields,
      values: {},
      hasChanged: false,
      isLoading: true,
      isError: false,
      isNew: props.id === "new"
    };
  }

  componentDidMount() {
    if (!this.state.isNew) {
      axios({ url: `${API_PATH}/recipes/${this.props.id}`, method: "get" })
        .then(response => {
          let newState = {};
          if (response.data && response.data.success) {
            const { data } = response.data;
            const values = Object.keys({ ...formFields, dates: [] }).reduce(
              (acc, key) => ({
                ...acc,
                [key]: data[key]
              }),
              {}
            );
            newState = { values: values };
          } else {
            newState = { isError: true };
          }
          this.setState(newState);
          console.log(response);
        })
        .catch(error => {
          console.log(error);
          this.setState({ isError: true });
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    } else {
      this.setState({ isLoading: false });
    }
  }

  componentDidUpdate(prevProps) {
    const state = {};
    if (prevProps.id !== this.props.id) {
      state.hasChanged = false;
      if (this.props.id === "new") {
        state.values = {};
        state.isNew = true;
      }
      this.setState(state);
    }
  }

  handleInputChange = event => {
    if (event && event.preventDefault) event.preventDefault();
    const {
      target: { name, value }
    } = event;
    this.setState(({ values }) => {
      values[name] = value;
      return { values, hasChanged: true };
    });
  };

  handleSubmit = async () => {
    const { isNew } = this.state;
    const options = { data: this.state.values };
    let callback = () => {};
    if (isNew) {
      options.url = `${API_PATH}/recipes`;
      options.method = "post";
      callback = ({ _id }) => {
        navigate(`/${_id}`);
      };
    } else {
      options.url = `${API_PATH}/recipes/${this.props.id}`;
      options.method = "put";
      callback = () => {
        navigate("/");
      };
    }
    this.setState({ hasChanged: false });
    axios(options)
      .then(function(response) {
        console.log(response);
        if (response.data && response.data.success) {
          callback(response.data.data);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  onRemove = async () => {
    await axios({
      url: `${API_PATH}/recipes/${this.props.id}`,
      method: "delete"
    })
      .then(function(response) {
        console.log(response);
        navigate("/");
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  onCheck = (event, checked) => {
    const { name } = event.target;
    this.setState(({ values }) => {
      values[name] = checked;
      return { values, hasChanged: true };
    });
  };

  renderFields = () => {
    const { formState, values } = this.state;
    const fields = Object.entries(formState);

    const renderField = ([key, { label, type, mandatory }]) => {
      let field;
      switch (type) {
        case "checkbox":
          field = (
            <FormControlLabel
              control={
                <Checkbox
                  checked={values[key] || formState[key].defaultValue}
                  onChange={this.onCheck}
                  name={key}
                />
              }
              label={label}
              labelPlacement="end"
              key={key}
            />
          );
          break;
        case "date":
          field = (
            <Dates
              key={key}
              name={key}
              label={label}
              required={mandatory}
              dates={values[key] || formState[key].defaultValue}
              onChange={this.handleInputChange}
              onSubmit={this.handleInputChange}
            />
          );
          break;
        case "url":
          field = (
            <TextField
              key={key}
              label={label}
              required={mandatory}
              name={key}
              type={type}
              value={values[key] || formState[key].defaultValue}
              onChange={this.handleInputChange}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      component="a"
                      aria-label="Open link"
                      disabled={!values[key]}
                      href={values[key]}
                      rel="noopener"
                      target="_blank"
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          );
          break;
        default:
          field = (
            <TextField
              key={key}
              label={label}
              required={mandatory}
              name={key}
              type={type}
              value={values[key] || formState[key].defaultValue}
              multiline={type === "textarea"}
              onChange={this.handleInputChange}
              fullWidth
            />
          );
          break;
      }
      return field;
    };

    return fields.map(renderField);
  };

  render() {
    const { isLoading, isError, isNew, hasChanged } = this.state;

    // const shouldDisplayLink = (type, key) =>
    //   !isNew && type === "url" && this.state.values[key];

    const canRemove = !isNew;

    return (
      <Container>
        {isLoading && "LOADING"}
        {isError && "ERROR"}
        {!isLoading && !isError && (
          <form onSubmit={e => e.preventDefault()}>
            {this.renderFields()}
            {/* <Dates
              dates={values.dates || []}
              onSubmit={this.handleInputChange}
            /> */}
            <Button
              disabled={!hasChanged}
              onClick={this.handleSubmit}
              variant="outlined"
            >
              Sauvegarder
            </Button>
            {canRemove && (
              <Button onClick={this.onRemove} variant="contained">
                <DeleteIcon />
                Supprimer
              </Button>
            )}
          </form>
        )}
      </Container>
    );
  }
}

Recipe.propTypes = {
  id: PropTypes.string
};

export default Recipe;
