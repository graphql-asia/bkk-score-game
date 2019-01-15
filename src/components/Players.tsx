import * as React from "react"
import { PoseGroup } from "react-pose"
import { sortBy } from "lodash"
import Player, { PlayerAnimated } from "./Player"

const Players = ({ players }) => (
  <PoseGroup>
    {sortBy(players, "score")
      .reverse()
      .map(player => (
        <PlayerAnimated key={player.id}>
          <Player key={player.id} id={player.id} score={player.score} />
        </PlayerAnimated>
      ))}
  </PoseGroup>
)

export default Players
