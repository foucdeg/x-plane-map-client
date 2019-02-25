/* globals window, document */
/* eslint no-underscore-dangle: "off" */

import React from 'react';
import { render } from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import persistState from 'redux-localstorage';

import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import xPlaneMapApp from './reducers';
import App from './components/App';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  xPlaneMapApp,
  composeEnhancer(applyMiddleware(thunk), persistState('layers')),
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
