# GraphQL Bangkok 4.0

- yarn install
- yarn start
- Have fun!

### Control the Game

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