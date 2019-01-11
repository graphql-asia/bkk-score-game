import * as React from "react"
import App from "./components/App"
// Apollo packages
import { ApolloClient } from "apollo-client"
import { ApolloProvider } from "react-apollo"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import { WebSocketLink } from "apollo-link-ws"
import { getMainDefinition } from "apollo-utilities"
import { split } from "apollo-link"

// Material UI
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import * as injectTapEventPlugin from "react-tap-event-plugin"
injectTapEventPlugin()

document.addEventListener(
  "touchmove",
  function(e) {
    e.preventDefault()
  },
  { passive: false },
)

const cache = new InMemoryCache({})

const httpLink = new HttpLink({
  uri: "https://graphql-asia.herokuapp.com/v1alpha1/graphql",
  headers: {
    "X-Hasura-Access-Key": "luc45hasura",
  },
})

const wsLink = new WebSocketLink({
  uri: `wss://graphql-asia.herokuapp.com/v1alpha1/graphql`,
  options: {
    reconnect: true,
  },
})

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === "OperationDefinition" && operation === "subscription"
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  link,
  cache,
})

const Root = () => (
  <ApolloProvider client={client}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </ApolloProvider>
)

export default Root
