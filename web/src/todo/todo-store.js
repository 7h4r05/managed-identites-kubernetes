import { createStore } from 'redux';

import todoReducers from './todo-reducers';


const store = createStore(todoReducers);

export default store;