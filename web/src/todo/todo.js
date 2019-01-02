import React, { Component } from 'react';

import { ToDoList } from './todo-list';
import { AddTodo } from './add-todo';

import store from './todo-store';
import TodoApi from './todo-api';
import { initialize, updateTodo, addTodo, deleteTodo } from './todo-actions';

const todoApi = new TodoApi();

export class Todo extends Component{
    constructor(props){
        super(props);
        this.state = { value: 0, todos: []};
      }
    
      componentDidMount = () => {
        this.storeSubscription = store.subscribe(() => {
          const nextItems = store.getState();
          this.setState({
            todos: nextItems
          });
        });
      }
    
      componentWillMount = () => {
        todoApi.getItems().then(items => {
          store.dispatch(initialize(items.data));
        });
      }
    
      componentWillUnmount = () => {
        this.storeSubscription();
      }
    
      onChange = (value) => {
        this.setState({
          value: value
        });
      }
    
    onAddTodo = (todo) => {
        this.toggleAddTodo();
        if(todo === null){
          return;
        }
        todoApi.postItem(todo).then(item => {
          if(todo.id && !isNaN(parseInt(todo.id))){
              store.dispatch(updateTodo(item.data));
          }else{
              store.dispatch(addTodo(item.data));
          }
        })
        .catch(err => {
          console.log(err);
        });
      }
    
      onItemEdit = (itemId) => {
        this.setState({
          selectedItemId: itemId,
          addTodoVisible: !this.state.addTodoVisible
        })
      }
    
      onItemRemove = (itemId, e) => {
        todoApi.deleteItem(itemId).then(item => {
            store.dispatch(deleteTodo( {id:itemId}));
        });
      }
    
      toggleAddTodo = () => {
        this.setState({
          selectedItemId: null,
          addTodoVisible: !this.state.addTodoVisible
        });
      }
    
    render(){
    const addTodo = this.state.addTodoVisible ? <AddTodo onFinished={this.onAddTodo} selectedItemId={this.state.selectedItemId} /> : <ToDoList items={this.state.todos} onItemEdit={this.onItemEdit} onItemRemove={this.onItemRemove}/>;

        return (
            <div>
                <div className="container">
                    <div className="col-sm">
                        <button onClick={this.toggleAddTodo} className="btn btn-primary">Add Todo</button>
                    </div>
                </div>
                {addTodo}
            </div>
        )

    }
}
