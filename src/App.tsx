import React, { Component } from 'react';


import './App.scss';
import Dashboard from './components/layout/dashboard/Dashboard';


export interface IAppProps { }
export interface IAppState { }

class App extends Component<IAppProps, IAppState> {
  render() {
    return (
      <Dashboard />
    );
  }
}

export default App;
