import React from "react"
import ReactDOM from "react-dom"
import App from "./App"

const data = {
  topLabel: "Reichtum",
  bottomLabel: "Armut",
  order: ["item2", "item5", "item4", "item1", "item3"],
  items: {
    item1: {
      image: "https://picsum.photos/400/300/?image=651",
      info: "infoText1"
    },
    item2: {
      image: "https://picsum.photos/400/300/?image=652",
      info: "infoText2"
    },
    item3: {
      image: "https://picsum.photos/400/300/?image=653",
      info: "infoText3"
    },
    item4: {
      image: "https://picsum.photos/400/300/?image=654",
      info: "infoText4"
    },
    item5: {
      image: "https://picsum.photos/400/300/?image=655",
      info: "infoText5"
    }
  }
}

ReactDOM.render(<App data={ data } />, document.getElementById("root"))
