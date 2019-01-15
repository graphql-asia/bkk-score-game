import * as React from "react"
import posed from "react-pose"

const PlayerListItem = posed.div({
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

const Player = ({ id, score }) => (
  <PlayerListItem
    key={id}
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
    <span style={{ color: "white" }}>{id}</span>
    <span
      style={{
        color: "white",
        fontWeight: "bold",
        padding: 10,
        position: "absolute",
        right: 0,
      }}
    >
      {score}
    </span>
  </PlayerListItem>
)

export default Player
