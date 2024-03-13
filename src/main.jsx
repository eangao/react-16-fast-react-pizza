import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);

//create react project using vite
//npm create vite@latest  -> for future project
//npm create vite@4 -> to match in training

///////////////
// install eslint
//npm i eslint vite-plugin-eslint eslint-config-react-app --save-dev

///////
//installin react router
//docs ->  https://reactrouter.com/en/main
//npm i react-router-dom@6
