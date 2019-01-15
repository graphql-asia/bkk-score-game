import * as React from "react"
import CircularProgress from "material-ui/CircularProgress"

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

const Loader = () => (
  <Centered>
    <CircularProgress />
  </Centered>
)

export default Loader
