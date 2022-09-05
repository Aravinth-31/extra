import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ErrorBoundary from './containers/ErrorBoundry/ErrorBoundry';
import store from './redux/store/ConfigureStore';
import { init as initApm } from "@elastic/apm-rum";
import Routes from './routes';
import './styles/common.css';

const apm = !(process.env.NODE_ENV === "development") && initApm({
  serviceName: "Extramile-front-end",
  serverUrl: "https://apm.extramileplay.com",
  environment: "development",
  serviceVersion: "",
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <Routes />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
