import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WebSocketLink } from "@apollo/client/link/ws";

import './index.css';

import {split, ApolloClient, InMemoryCache, ApolloProvider, HttpLink} from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities'

const wsLink = new WebSocketLink({
    uri: 'ws://localhost:8080/graphql',
    options: {
        reconnect: true,
        reconnectionAttempts: 10
    }
})

const httpLink = new HttpLink({
    uri: 'http://localhost:8080/graphql'
})

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

const graphQLClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
})


ReactDOM.render(
  <React.StrictMode>
      <ApolloProvider client={graphQLClient}>
        <App />
      </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
