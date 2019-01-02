import React, { Component } from 'react';

import { formatDate } from '../shared/date';

export class ToDoList extends Component{

    constructor(props){
        super(props);
        this.state = {
            items: props.items
        };
    }

    componentWillReceiveProps(props, p2){
        this.setState({
            items: props.items
        });
    }

    render(){
        const items = [];
        for(var item of this.state.items){
            const id = item.id;
            items.push(
                <tr key={item.id}>
                    <th scope="row">{item.id}</th>
                    <td>{item.note}</td>
                    <td>{item.isDone ? 'yep' : 'nope'}</td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>
                        <button className="btn btn-info" onClick={() => this.props.onItemEdit(id)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => this.props.onItemRemove(id)}>X</button>
                    </td>
                </tr>);
        }
        return (
            <table className="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Is checked</th>
                <th scope="col">Created at</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
            {items}
            </tbody>
            </table>
            
        )
    }
}
