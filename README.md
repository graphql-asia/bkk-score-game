# GraphQL Bangkok 4.0

> Hasura Endpoint: https://graphql-asia.herokuapp.com/console

> App Endpoint: https://gql-asia-game.netlify.com

### Local setup

```
yarn
yarn start
```

### Game Controls

```graphql
subscription GetGames {
  games(limit: 1) {
    id
    playing
  }
}

mutation StartGame {
  update_games(where: { id: { _eq: 1 } }, _set: { playing: true }) {
    affected_rows
  }
}

mutation StopGame {
  update_games(where: { id: { _eq: 1 } }, _set: { playing: false }) {
    affected_rows
  }
}

mutation DeleteUsers {
  delete_users(where: {}) {
    affected_rows
  }
}

mutation ResetScores {
  update_users(where: {}, _set: { score: 0 }) {
    affected_rows
  }
}

subscription LiveGame {
  users(order_by: { score: desc }) {
    id
    score
  }
}
```
