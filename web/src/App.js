import React, { Component } from 'react';
import logo from './logo.svg';
import azurelogo from './azure-1.png';
import './App.css';

import { Todo } from './todo/todo';
import { Logs } from './diagnostics/logs';


export const Pages ={
  TODO: 1,
  LOGS: 2
}
class App extends Component {

  constructor(props){
    super(props);
    this.state = { currentPage: Pages.TODO};
  }

  switchPage = (page) => {
    this.setState({
      currentPage: page
    });
  }

  render() {
    var currentPage = this.state.currentPage === Pages.TODO ? <Todo /> : <Logs />;
    return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" /> <img src={azurelogo} className="App-logo no-rotate" alt="logo" />
        <h1 className="App-title">Keyless application</h1>
      </header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Todo</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className={'nav-item ' + (this.state.currentPage === Pages.TODO ? 'active' : '')}>
              <a className="nav-link" href="#" onClick={() => this.switchPage(Pages.TODO)} >Home { (this.state.currentPage === Pages.TODO ? <span className="sr-only">(current)</span> : '')}</a>
            </li>
            <li className={'nav-item ' + (this.state.currentPage === Pages.LOGS ? 'active' : '')}>
              <a className="nav-link" href="#" onClick={() => this.switchPage(Pages.LOGS)}>Logs { (this.state.currentPage === Pages.LOGS ? <span className="sr-only">(current)</span> : '')}</a>
            </li>
          </ul>
        </div>
      </nav>
  {currentPage}

    </div>
    );
  }
}

export default App;
