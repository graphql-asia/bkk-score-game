import * as React from "react"
import TextField from "material-ui/TextField"
import RaisedButton from "material-ui/RaisedButton"
import { Mutation } from "react-apollo"

import { CREATE_USER_MUTATION } from "./App"

const EnterNickname = ({ setValidId, setNickname, nickname }) => (
  <Mutation
    mutation={CREATE_USER_MUTATION}
    onCompleted={data => {
      console.log("User saved...", data)
      setValidId(data.insert_users.returning[0].id)
    }}
    onError={error => {
      console.log(error)
      alert("Error creating user. Maybe already exists?")
    }}
  >
    {createUser => (
      <div>
        <p style={{ color: "white", textAlign: "center" }}>
          Enter your nickname
        </p>
        <TextField
          type="text"
          name="nickname"
          onKeyPress={e => {
            if (e.keyCode === 13 || e.key === "Enter") {
              createUser({
                variables: {
                  nickname,
                },
              })
            }
          }}
          onChange={setNickname}
          value={nickname}
          inputStyle={{ color: "white", textAlign: "center" }}
          style={{ width: "100%" }}
        />
        <RaisedButton
          fullWidth
          disabled={nickname === ""}
          onClick={() =>
            createUser({
              variables: {
                nickname: nickname,
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

export default EnterNickname
