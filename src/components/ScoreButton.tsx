import * as React from "react"
import posed from "react-pose"
import FloatingActionButton from "material-ui/FloatingActionButton"

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

const ScoreButton = ({ onClick }) => (
  <FloatingButtonWrapper>
    <PressBounce>
      <FloatingActionButton onClick={onClick}>🎫</FloatingActionButton>
    </PressBounce>
  </FloatingButtonWrapper>
)

export default ScoreButton
