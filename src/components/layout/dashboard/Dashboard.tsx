import React, { Component } from 'react';
import { Layout } from 'antd';
import { Route, Switch } from 'react-router-dom';

import './Dashboard.scss';
import Header from '../../common/header/Header';
import Footer from '../../common/footer/Footer';
import LapsCounter from '../../../containers/laps-counter/LapsCounter';
import Login from '../../pages/login/Login';


export interface IHomeProps { }
export interface IHomeState { }

class Dashboard extends Component<IHomeProps, IHomeState> {
  public render() {
    return (
      <Layout className="layout">
        <Header />
        <Layout.Content>
          <div className="main-container">
            <Switch>
              <Route exact path="/" component={LapsCounter} />
              <Route exact path="/login" component={Login} />
              <Route render={() => <h1>Pаge not Found</h1>} />
            </Switch>
          </div>
        </Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }}>
          <Footer />
        </Layout.Footer>
      </Layout>
    );
  }
}

export default Dashboard;
