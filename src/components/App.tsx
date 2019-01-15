import * as React from "react"
import gql from "graphql-tag"
import "./../assets/scss/App.scss"
import FloatingActionButton from "material-ui/FloatingActionButton"
import TextField from "material-ui/TextField"
import RaisedButton from "material-ui/RaisedButton"
import Paper from "material-ui/Paper"
import posed, { PoseGroup } from "react-pose"
import CircularProgress from "material-ui/CircularProgress"

import { Query, Mutation, Subscription } from "react-apollo"
import {sortBy} from "lodash"

const Player = posed.div({
  enter: {
    y: 0,
    opacity: 1,
    delay: 300,
    transition: {
      y: { type: "spring", stiffness: 100 },
      default: { duration: 300 },
    },
  },
  exit: {
    y: 25,
    opacity: 0,
    transition: { duration: 150 },
  },
})

const PressBounce = posed.div({
  pressable: true,
  init: { scale: 1.3 },
  press: { scale: 1.6 },
})

const FloatingButtonWrapper = props => (
  <div
    style={{
      position: "fixed",
      bottom: "30px",
      right: 0,
      left: 0,
      margin: "auto",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      fontSize: "20px",
    }}
    {...props}
  />
)

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

const Centered = props => (
  <div
    style={{
      position: "fixed",
      margin: "0 auto",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
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

class Players extends React.Component<any>{
  componentDidMount(){
    const {subscribeToMore,validId}=this.props
    subscribeToMore({
      document: GET_USERS_SUBSCRIPTION,
      variables: {  },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return {
          ...prev,
          users: subscriptionData.data.users.map(tempUser => {
            if(tempUser.id===validId){
              return prev.users.find(u => u.id === validId)
            }else{
              return tempUser
            }
          })
        }
      }
    })
  }
  render(){
    const {data,validId}=this.props
    return (
      <React.Fragment>
        <PoseGroup>
          {sortBy(data.users,'score').reverse().map(user => (
            <Player
              key={user.id}
              style={{
                background: "#102261",
                position: "relative",
                height: 38,
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                paddingLeft: 10,
                borderRadius: 5,
              }}
            >
              <span style={{ color: "white" }}>{user.id}</span>
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                  padding: 10,
                  position: "absolute",
                  right: 0,
                }}
              >
                {user.score}
              </span>
            </Player>
          ))}
        </PoseGroup>

        <Mutation
          mutation={gql`
            mutation UpdateUser($nickname: String!) {
              update_users(
                where: { id: { _eq: $nickname } }
                _inc: { score: 1 }
              ) {
                returning {
                  ...UserFields
                }
              }
            }
            ${UserFields}
          `}
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
                  score:
                    data.users.find(
                      u => u.id === validId,
                    ).score + 1,
                },
              ],
            },
          }}
          update={(cache, { data: { update_users } }) => {
            cache.writeFragment({
              fragment: UserFields,
              id: validId,
              data: {
                __typename: "users",
                id: validId,
                score:
                  data.users.find(
                    u => u.id === validId,
                  ).score + 1,
              },
            })
            // cache.writeFragment({
            // id: this.state.nickname,
            // data: {

            // },
            // })
          }}
        >
          {scoreUp => (
            <FloatingButtonWrapper>
              <PressBounce>
                <FloatingActionButton
                  onClick={evt => scoreUp()}
                  primary
                >
                  🎫
                </FloatingActionButton>
              </PressBounce>
            </FloatingButtonWrapper>
          )}
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

  render() {
    return (
      <Wrapper>
        <Subscription subscription={GAME_SUBSCRIPTION}>
          {({ loading, data }) => {
            if (loading)
              return (
                <Centered>
                  <CircularProgress />
                </Centered>
              )
            const game = data.games[0]

            if (this.state.validId === "") {
              return (
                <Mutation
                  mutation={gql`
                    mutation CreateUser($nickname: String!) {
                      insert_users(objects: [{ id: $nickname, score: 0 }]) {
                        returning {
                          ...UserFields
                        }
                      }
                    }
                    ${UserFields}
                  `}
                  onCompleted={data => {
                    console.log("User saved...", data)
                    this.setState({
                      validId: data.insert_users.returning[0].id,
                    })
                  }}
                  onError={error => {
                    alert("Error creating user. Maybe already exists?")
                  }}
                >
                  {(createUser, result) => (
                    <div>
                      <p style={{ color: "white", textAlign: "center" }}>
                        Enter your nickname
                      </p>
                      <TextField
                        type="text"
                        name="nickname"
                        onKeyPress={e => {
                          if (e.keyCode === 13 || e.key === 'Enter') {
                            createUser({
                              variables: {
                                nickname: this.state.nickname,
                              },
                            })
                          }
                        }}
                        onChange={this.setNickname}
                        value={this.state.nickname}
                        inputStyle={{ color: "white", textAlign: "center" }}
                        style={{ width: "100%" }}
                      />
                      <RaisedButton
                        fullWidth
                        disabled={
                          this.state.nickname === ""                          
                        }
                        onClick={() =>
                          createUser({
                            variables: {
                              nickname: this.state.nickname,
                            },
                          })
                        }
                      >
                        Join Game
                      </RaisedButton>
                    </div>
                  )}
                </Mutation>
              )
            }

            return (
              // <Subscription subscription={GET_USERS_SUBSCRIPTION}>
              <Query query={GET_USERS_QUERY} 
              // pollInterval={1000}
              >
                {({ data, loading, subscribeToMore }) => {
                  if (loading)
                    return (
                      <Centered>
                        <CircularProgress />
                      </Centered>
                    )

                  if (!game.playing) {
                    return (
                      <p style={{ color: "white", textAlign: "center" }}>
                        Waiting for players to join... ({data.users.length})
                      </p>
                    )
                  }

                  return (
                    <Players validId={this.state.validId} data={data} subscribeToMore={subscribeToMore} />
                  )
                }}
              </Query>
              // </Subscription>
            )
          }}
        </Subscription>
      </Wrapper>
    )
  }
}
