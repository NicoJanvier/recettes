import React from "react";
import axios from "axios";
import { navigate } from "@reach/router";

import useDataApi from "../hooks/useDataApi";
import formFields from "../utils/formFields";

const API_PATH = "/api";

function useFormData(id) {
  const [{ isLoading, isError, data }] = useDataApi(
    { url: `${API_PATH}/recipes/${id}`, method: "get" },
    {}
  );
  let fullData = { ...formFields };
  if (!isLoading && !isError && data.success) {
    const { data: values } = data;
    // Object.keys(fullData).forEach(key => {
    //   if (data.data.hasOwnProperty(key)) {
    //     fullData[key].value = values[key];
    //   }
    // });
    fullData.values = values;
  }

  return [{ isLoading, isError, data: fullData }];
}

const Recipe = ({ id }) => {
  const [{ isLoading, isError, formData }] = useFormData(id);

  const [formState, setState] = React.useState(formData);

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
    const results = await axios({
      url: `${API_PATH}/recipes/${id}`,
      method: "put",
      data: formState.values
    });
    console.log(results);
  };

  const onRemove = async () => {
    const results = await axios({
      url: `${API_PATH}/recipes/${id}`,
      method: "delete"
    });
    console.log(results);
    navigate("/");
  };

  return (
    <React.Fragment>
      {isLoading && "LOADING"}
      {isError && "ERROR"}
      {!isLoading && !isError && (
        <form onSubmit={handleSubmit}>
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
                    onChange={handleInputChange}
                    required={mandatory}
                    value={formState.values[key]}
                    checked={formState.values[key]}
                  />
                ) : (
                  <textarea
                    name={key}
                    onChange={handleInputChange}
                    required={mandatory}
                    value={formState.values[key]}
                  />
                )}
                {type === "url" && formState.values[key] && (
                  <a rel="noopener noreferrer" target="_blank" href={formState.values[key]}>
                    Lien
                  </a>
                )}
              </div>
            )
          )}
          <button type="submit">Sauvegarder</button>
          <button onClick={onRemove}>Supprimer</button>
        </form>
      )}
    </React.Fragment>
  );
};

export default Recipe;
