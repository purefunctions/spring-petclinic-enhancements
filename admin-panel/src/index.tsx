import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {Store} from "redux";
import configureStore from "./configureStore";
import App from './containers/App/index';
import registerServiceWorker from './registerServiceWorker';
import {IRootState} from "./store";


const store: Store<IRootState> = configureStore();

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
