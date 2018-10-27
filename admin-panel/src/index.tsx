import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {Store} from "redux";
import App from './components/App/index';
import configureStore from "./configureStore";
import registerServiceWorker from './registerServiceWorker';
import {IRootState} from "./store";


const store: Store<IRootState> = configureStore();

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
