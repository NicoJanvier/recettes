import React from "react";
import axios from 'axios';

const UserContext = React.createContext();
const initialState = {
  username: '',
  email: '',
  house: '',
  shouldCheck: true,
  isLogged: true,
  isLoading: true
};
function UserProvider({ children }) {
  const [{
    username,
    email,
    house,
    shouldCheck,
    isLogged,
    isLoading,
  }, setState] = React.useState(initialState);

  React.useEffect(() => {
    const isLoggedIn = async () => {
      const options = { url: "/api/users/checkToken", method: "get" };
      axios(options)
        .then(res => {
          if (res.status === 200) {
            const { name: username, house, email } = res.data;
            setState(state => ({
              ...state,
              isLogged: true,
              username,
              house,
              email,
            }));
          } else {
            const error = new Error(res.error);
            throw error;
          }
        })
        .catch(err => {
          console.error(err);
          setState(state => ({ ...state, isLogged: false }));
        })
        .finally(() => {
          setState(state => ({ ...state, shouldCheck: false, isLoading: false }));
        });
    };
    if (shouldCheck) {
      isLoggedIn();
    }
  }, [shouldCheck]);

  // const checkLogStatus = () => {
  //   setState(state => ({ ...state, shouldCheck: true }));
  // };

  const authenticate = ({ email, password }, onSuccess = () => { }, onFailure = () => { }) => {
    const options = {
      url: "/api/users/authenticate",
      method: "post",
      data: {
        email,
        password,
      },
    };
    axios(options)
      .then(res => {
        if (res.status === 200) {
          const { name: username, house, email } = res.data;
          setState(state => ({
            ...state,
            isLogged: true,
            username,
            house,
            email,
          }));
          onSuccess();
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        onFailure();
      });
  };


  return (
    <UserContext.Provider
      value={{
        isLogged,
        authenticate,
        isLoading,
        username,
        email,
        house,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
function useUserState() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}
export { UserProvider, useUserState, UserContext };
