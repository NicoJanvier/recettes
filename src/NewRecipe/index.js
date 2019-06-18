import React from "react";
import axios from "axios";
import { navigate } from "@reach/router";
import formFields from "../utils/formFields";

const API_PATH = "http://localhost:8080/api";

const NewRecipe = () => {
  const [formState, setState] = React.useState({ ...formFields, values: {} });
  // const extractValues = obj =>
  //   Object.entries(obj).reduce(
  //     (acc, [key, { value }]) => ({
  //       ...acc,
  //       [key]: value
  //     }),
  //     {}
  //   );

  const handleInputChange = ({ target }) => {
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;
    setState(({ values }) => {
      values[name] = value;
      return values;
    });
  };

  const handleSubmit = async event => {
    if (event) event.preventDefault();
    console.log(formState);
    const results = await axios({
      url: `${API_PATH}/recipes`,
      method: "post",
      data: formState.values
    });
    if (results.data.success) {
      const { _id } = results.data.data;
      navigate(`/${_id}`);
    }
    console.log(results.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.entries(formState).map(
        ([key, { label, type, mandatory }]) => (
          <div key={key}>
            <label htmlFor={key}>{`${label}${mandatory ? "*" : ""}:`}</label>
            {type !== "textarea" ? (
              <input
                name={key}
                type={type}
                onChange={handleInputChange}
                required={mandatory}
                value={formState.values[key] || formFields[key].defaultValue}
              />
            ) : (
              <textarea
                name={key}
                onChange={handleInputChange}
                required={mandatory}
                value={formState.values[key] || formFields[key].defaultValue}
              />
            )}
          </div>
        )
      )}
      <button type="submit">Sauvegarder</button>
    </form>
  );
};

export default NewRecipe;
