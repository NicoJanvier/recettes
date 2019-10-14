import React from 'react';
import axios from "axios";

const dataFetchReducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false
        };
      case 'FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case 'FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      case 'FETCH_CANCEL':
        return {
          ...state,
          isLoading: false,
          isError: false,
        };
      default:
        throw new Error();
    }
  };

const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = React.useState(initialUrl);

  const [state, dispatch] = React.useReducer(dataFetchReducer, {
    isLoading: true,
    isError: false,
    data: initialData
  });

  React.useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      if(!url) {
        dispatch({ type: "FETCH_CANCEL"});
      } else {
        try {
          const result = await axios(url);
  
          if (!didCancel) {
            dispatch({ type: "FETCH_SUCCESS", payload: result.data });
          }
        } catch (error) {
            console.log(error);
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" });
          }
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [url]);

  return [state, setUrl];
};

export default useDataApi;