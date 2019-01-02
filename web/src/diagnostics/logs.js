import React, { Component } from 'react';

import { LogApi } from './log-api';
import { formatDate } from '../shared/date';
const logApi = new LogApi();

export class Logs extends Component{

    constructor(){
        super();
        this.state = { logs: []};
    }

    componentDidMount(){
        logApi.get().then( logs => {
            this.setState({
                logs: logs.data
            });
        });
    }

    render(){
        const items = [];
        for(var item of this.state.logs){
            const id = item.id;
            try{
                const log = JSON.parse(item.log);
            items.push(
                <tr key={id}>
                    <th scope="row">{id}</th>
                    <td>{log.track}</td>
                    <td>{formatDate(item.createdAt)}</td>
                </tr>);
            }catch(e){

            }
        }
        return (
            <table className="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Log</th>
                <th scope="col">Created at</th>
                </tr>
            </thead>
            <tbody>
            {items}
            </tbody>
            </table>
            
        )
    }
}
