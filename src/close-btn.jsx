import closeBtn from "./assets/close-btn.svg"
import "./close-btn.css"

function CloseButton() {
  

  return (

    <a id="close" href="http://localhost:5173/">
        <img src={closeBtn} alt="Close button" />
    </a>

  )
}

export default CloseButton
