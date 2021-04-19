const LocalStorageCache = (reducer) => {
  return (state, action) => {
    const newState = reducer(state, action);
    localStorage.setItem('Salon', JSON.stringify(newState));
    return newState;
  };
};
export default LocalStorageCache;
