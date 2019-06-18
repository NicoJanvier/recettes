import React from "react";
import useDataApi from "../hooks/useDataApi";
import { Link } from "@reach/router";

const API_PATH = "http://localhost:8080/api";

export default function List() {
  const [{ isLoading, isError, data }] = useDataApi(
    { url: `${API_PATH}/recipes`, method: "get" },
    []
  );

  return (
    <div>
      {isLoading && "LOADING"}
      {isError && "ERROR"}
      {data &&
        data.data &&
        data.data.map(({ title, _id }) => (
          <React.Fragment key={_id}>
            <Link  to={`/${_id}`}>
              {title}
            </Link>
            <br />
          </React.Fragment>
        ))}
    </div>
  );
}
