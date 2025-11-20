import closeBtn from "./assets/close-btn.svg"
import "./styles/close-btn.css"
import Modal from "./Modal.jsx"
import { useState } from "react";


function CloseButton() {
  
  const [exitModalIsVisible,setExitModalIsVisible] = useState(false);


  return (
    <>
      <img id="close" src={closeBtn} onClick={() => setExitModalIsVisible(true)} alt="Close button" />

      <Modal
        isVisible={exitModalIsVisible}
        setIsVisible={setExitModalIsVisible}
        modalClassTypes='end-modal'
        content={
          <>
            <p className="exit-msg">End game for all players?</p>
            <div className="exit-options">
                <a href='http://localhost:5173/'><button className="button">Yes</button></a>
                <button className="button" onClick={() => setExitModalIsVisible(false)}> Go Back</button>
            </div>
          </>
        }
      />

    </>
  )
}

export default CloseButton;
