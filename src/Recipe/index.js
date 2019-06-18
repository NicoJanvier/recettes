import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import formFields from "../utils/formFields";
import { navigate } from "@reach/router";
import Dates from "../Dates";

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
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;
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

  render() {
    const {
      isLoading,
      isError,
      formState,
      values,
      isNew,
      hasChanged
    } = this.state;

    const shouldDisplayLink = (type, key) =>
      !isNew && type === "url" && this.state.values[key];

    const canRemove = !isNew;

    return (
      <React.Fragment>
        {isLoading && "LOADING"}
        {isError && "ERROR"}
        {!isLoading && !isError && (
          <form onSubmit={e => e.preventDefault()}>
            {Object.entries(formState).map(
              ([key, { label, type, mandatory }]) => (
                <div key={key}>
                  <label htmlFor={key}>{`${label}${
                    mandatory ? "*" : ""
                  }:`}</label>
                  {type !== "textarea" ? (
                    <input
                      name={key}
                      type={type}
                      onChange={this.handleInputChange}
                      required={mandatory}
                      value={values[key] || formState[key].defaultValue}
                      checked={values[key] || formState[key].defaultValue}
                    />
                  ) : (
                    <textarea
                      name={key}
                      onChange={this.handleInputChange}
                      required={mandatory}
                      value={values[key] || formState[key].defaultValue}
                    />
                  )}
                  {shouldDisplayLink(type, key) && (
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={values[key]}
                    >
                      Lien
                    </a>
                  )}
                </div>
              )
            )}
            <Dates
              dates={values.dates || []}
              onSubmit={this.handleInputChange}
            />
            <button disabled={!hasChanged} onClick={this.handleSubmit}>
              Sauvegarder
            </button>
            {canRemove && <button onClick={this.onRemove}>Supprimer</button>}
          </form>
        )}
      </React.Fragment>
    );
  }
}

Recipe.propTypes = {
  id: PropTypes.string
};

export default Recipe;
