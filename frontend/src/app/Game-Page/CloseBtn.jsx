import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WebsocketContext } from '../../context/WebsocketContext.jsx'
import closeBtn from "../../assets/close-btn.svg"
import "../../styles/close-btn.css"
import Modal from "./Modal.jsx"
import { useState } from "react";


function CloseButton() {
  
  const [exitModalIsVisible,setExitModalIsVisible] = useState(false);
  const { setSocketURL, setLobbyInitialised, setPlayerList, setCurrentLobby, setShouldReconnect } = useContext(WebsocketContext);

  const handleExit = () => {
    setShouldReconnect(false)
    setSocketURL(null)
    setLobbyInitialised(false)
    setPlayerList([])
    setCurrentLobby('[Join a Lobby]')
  }


  return (
    <>
      <img id="close" className="cancel" src={closeBtn} onClick={() => setExitModalIsVisible(true)} alt="Close button" />

      <Modal
        isVisible={exitModalIsVisible}
        setIsVisible={setExitModalIsVisible}
        modalClassTypes='end-modal'
        content={
          <>
            <p className="exit-msg">Leave game?</p>
            <div className="exit-options">
                <Link to='/'><button className="button" onClick={handleExit}>Yes</button></Link>
                <button className="button" onClick={() => setExitModalIsVisible(false)}>Go Back</button>
            </div>
          </>
        }
      />

    </>
  )
}

export default CloseButton;
