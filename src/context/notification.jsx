import { createContext, useContext, useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "SET_NOTIFICATION": {
      return action.message;
    }
    case "CLEAR_NOTIFICATION": {
      return null;
    }
    default: {
      return state;
    }
  }
}

const NotificationContext = createContext(undefined);

let timeoutId = null;

export function NotificationProvider(props) {
  const { children } = props;

  const [notification, dispatch] = useReducer(reducer, null);

  const notify = (message) => {
    if (timeoutId) {
      dispatch({ type: "CLEAR_NOTIFICATION" });
      clearTimeout(timeoutId);
    }

    dispatch({ type: "SET_NOTIFICATION", message });

    timeoutId = setTimeout(
      () => dispatch({ type: "CLEAR_NOTIFICATION" }),
      5000
    );
  };

  return (
    <NotificationContext.Provider
      value={{ notification, notify }}
      children={children}
    />
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("<NotificationProvider /> is missing");
  }

  return context;
}
