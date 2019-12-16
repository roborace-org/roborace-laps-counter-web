import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './configureStore';


const store = configureStore();

const renderApp = () => ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
)

if (process.env.NODE_ENV !== 'production' && (module as any).hot) {
  (module as any).hot.accept('./App', renderApp)
}

renderApp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
