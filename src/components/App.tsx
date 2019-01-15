import * as React from "react"
import gql from "graphql-tag"
import "./../assets/scss/App.scss"
import { Query, Mutation, Subscription } from "react-apollo"
import ScoreButton from "./ScoreButton"
import Loader from "./Loader"
import EnterNickname from "./EnterNickname"
import Players from "./Players"

export interface AppProps {}

const Wrapper = props => (
  <div
    style={{
      padding: "20px",
      margin: "0 auto",
      maxWidth: "500px",
    }}
    {...props}
  />
)

const UserFields = gql`
  fragment UserFields on users {
    id
    score
  }
`

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($nickname: String!) {
    insert_users(objects: [{ id: $nickname, score: 0 }]) {
      returning {
        ...UserFields
      }
    }
  }
  ${UserFields}
`

const GET_USERS_SUBSCRIPTION = gql`
  subscription GetUsers {
    users(order_by: { score: desc }) {
      ...UserFields
    }
  }
  ${UserFields}
`

const GET_USERS_QUERY = gql`
  query GetUsersQuery {
    users(order_by: { score: desc }) {
      ...UserFields
    }
  }
  ${UserFields}
`

const GAME_SUBSCRIPTION = gql`
  subscription GetGames {
    games(limit: 1) {
      id
      playing
    }
  }
`

const UPDATE_USER_SCORE_MUTATION = gql`
  mutation UpdateUser($nickname: String!) {
    update_users(where: { id: { _eq: $nickname } }, _inc: { score: 1 }) {
      returning {
        ...UserFields
      }
    }
  }
  ${UserFields}
`

interface GameProps {
  validId: string
  subscribeToMore: any
  players: any[]
}

class Game extends React.Component<GameProps> {
  componentDidMount() {
    const { subscribeToMore, validId } = this.props

    // User subscribeToMore to get more data
    // when Hasura triggers subscription
    subscribeToMore({
      document: GET_USERS_SUBSCRIPTION,
      variables: {},
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        return {
          users: subscriptionData.data.users,
        }
      },
    })
  }
  render() {
    const { players, validId } = this.props
    return (
      <React.Fragment>
        {/* Renders the list of players */}
        <Players players={players} />

        {/* Implement score button and updates the cache with optimisticResponse */}
        <Mutation
          mutation={UPDATE_USER_SCORE_MUTATION}
          variables={{
            nickname: validId,
          }}
          optimisticResponse={{
            update_users: {
              __typename: "users_mutation_response",
              returning: [
                {
                  __typename: "users",
                  id: validId,
                  score: players.find(u => u.id === validId).score + 1,
                },
              ],
            },
          }}
          // Update the local cache
          update={(cache, { data: { update_users } }) => {
            cache.writeFragment({
              fragment: UserFields,
              id: validId,
              data: {
                __typename: "users",
                id: validId,
                score: players.find(u => u.id === validId).score + 1,
              },
            })
          }}
        >
          {scoreUp => <ScoreButton onClick={scoreUp} />}
        </Mutation>
      </React.Fragment>
    )
  }
}

export default class App extends React.Component<AppProps> {
  state = {
    nickname: "",
    validId: "",
  }

  setNickname = event => {
    this.setState({
      nickname: event.target.value,
    })
  }

  setValidId = validId => {
    this.setState({
      validId,
    })
  }

  render() {
    if (this.state.validId === "") {
      return (
        <Wrapper>
          <EnterNickname
            nickname={this.state.nickname}
            setValidId={this.setValidId}
            setNickname={this.setNickname}
          />
        </Wrapper>
      )
    }

    return (
      <Wrapper>
        {/* Subscribe to the game */}
        <Subscription subscription={GAME_SUBSCRIPTION}>
          {({ loading, data }) => {
            if (loading) return <Loader />

            const game = data.games[0]

            // Check if the game started
            if (!game.playing) {
              return (
                <p style={{ color: "white", textAlign: "center" }}>
                  Waiting for players to join... ({data.users.length})
                </p>
              )
            }

            // return
            // Query the current users
            // after loading, pass the users to the game.
            return (
              // Loads users first, render the game
              // and pass subscribeToMore to game.
              <Query query={GET_USERS_QUERY}>
                {({ data, loading, subscribeToMore }) => {
                  if (loading) return <Loader />

                  // Render the game here
                  return (
                    <Game
                      validId={this.state.validId}
                      players={data.users}
                      subscribeToMore={subscribeToMore}
                    />
                  )
                }}
              </Query>
            )
          }}
        </Subscription>
      </Wrapper>
    )
  }
}
