import { ADD_TODO, DELETE_TODO, UPDATE_TODO, INITIALIZE } from './todo-actions';

function addTodo(state = [], todo){
    return [
        ...state,
        todo.payload
    ];
}

function deleteTodo(state = [], todo){
    const todoIndex = state.findIndex(s => s.id === todo.payload.id);
    if(todoIndex >= 0){
        state.splice(todoIndex, 1);
    }
    return state;
}

function updateTodo(state = [], todo){
    const todoIndex = state.findIndex(s => s.id === todo.payload.id);
    if(todoIndex >= 0){
        state[todoIndex] = todo.payload;
    }
    return state;
}

function initialize(state =[], todo){
    state = todo.payload;
    return state;
}

function todoCrud(state = [], todo){
    switch(todo.type){
        case ADD_TODO:
            return addTodo(state, todo);
        case UPDATE_TODO:
            return updateTodo(state, todo);
        case DELETE_TODO:
            return deleteTodo(state, todo);
        case INITIALIZE:
            return initialize(state, todo);
        default:
            return state;
    }
}

const reducers = todoCrud;
export default reducers;