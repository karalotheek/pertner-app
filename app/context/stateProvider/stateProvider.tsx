import React, { createContext, useReducer, useContext } from 'react';
import rootReducer from '@reducer/index';
import LocalstorageCache from '@util/LocalstorageCache';

const initialStateType: any = { store: null };

const initialState = initialStateType;
// if (typeof window !== 'undefined') {
//   initialState = window.localStorage.getItem('Salon')
//     ? JSON.parse(window.localStorage.getItem('Salon'))
//     : initialStateType;
// }
const store = createContext(initialState);
const { Provider } = store;

const useStoreConsumer = () => useContext(store);

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider, useStoreConsumer };
