import { combineReducers } from 'redux';
import { gender } from '@reducer/gender';
import { store } from '@reducer/store';

const rootReducer = combineReducers({
  store,
  gender
});

export default rootReducer;
