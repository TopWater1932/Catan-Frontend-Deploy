import { Link } from 'react-router-dom';
import closeBtn from "../../assets/close-btn.svg"
import "../../styles/close-btn.css"
import Modal from "./Modal.jsx"
import { useState } from "react";


function CloseButton() {
  
  const [exitModalIsVisible,setExitModalIsVisible] = useState(false);


  return (
    <>
      <img id="close" className="cancel" src={closeBtn} onClick={() => setExitModalIsVisible(true)} alt="Close button" />

      <Modal
        isVisible={exitModalIsVisible}
        setIsVisible={setExitModalIsVisible}
        modalClassTypes='end-modal'
        content={
          <>
            <p className="exit-msg">End game for all players?</p>
            <div className="exit-options">
                <Link to='/'><button className="button">Yes</button></Link>
                <button className="button" onClick={() => setExitModalIsVisible(false)}> Go Back</button>
            </div>
          </>
        }
      />

    </>
  )
}

export default CloseButton;
