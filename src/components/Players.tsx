import * as React from "react"
import { PoseGroup } from "react-pose"
import { sortBy } from "lodash"
import Player from "./Player"

const Players = ({ players }) => (
  <PoseGroup>
    {sortBy(players, "score")
      .reverse()
      .map(player => (
        <Player key={player.id} id={player.id} score={player.score} />
      ))}
  </PoseGroup>
)

export default Players
