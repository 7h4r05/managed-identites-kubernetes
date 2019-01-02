import React, { Component } from 'react';
import store from './todo-store';

export class AddTodo extends Component{

    constructor(props){
        super(props);
    }

    componentWillMount = () => {
        if(this.props.selectedItemId != null){
            const state = store.getState();
            const selectedItem = state.filter(item => item.id === this.props.selectedItemId);
            if(selectedItem.length === 1){
                this.setState({
                    note: selectedItem[0].note,
                    isDone: selectedItem[0].isDone,
                    id: selectedItem[0].id
                });
            }
        }else{
            this.setState({
                note: '',
                isDone: false
            });
        }
    }

    handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        const name = e.target.name;
        this.setState({
            [name] : value
        });
    }

    render(){
        return (
        <div className="add-todo">
        <div>
            Note: <textarea name="note" value={this.state.note} onChange={this.handleChange}></textarea> <br />
            Is done: <input name="isDone" type="checkbox" checked={this.state.isDone} onChange={this.handleChange} />
        </div>
        <div>
            <button onClick={() => this.props.onFinished(null)}>Cancel</button>
            <button onClick={() => this.props.onFinished(this.state)}>Save</button>
        </div>
        </div>);
    }
}