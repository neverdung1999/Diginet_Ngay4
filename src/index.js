import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import themes from "devextreme/ui/themes";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import mySaga from "./redux/sagas";
import myReducer from "./redux/reducers";

const sagaMiddleWare = createSagaMiddleware();

const store = createStore(myReducer, applyMiddleware(sagaMiddleWare));

sagaMiddleWare.run(mySaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

reportWebVitals();
