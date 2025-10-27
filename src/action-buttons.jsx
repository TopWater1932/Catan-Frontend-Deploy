import { useState } from 'react'
import { useEffect } from 'react'
import './styles/buttons.css'
import Modal from './Modal.jsx'
import PlayDevCardModalContent from './PlayDevCardModalContent.jsx'
import handleEndTurnClick from './utils/event-handler/func-handleEndTurnClick.jsx'
import handleBuyClick from './utils/event-handler/func-handleBuyClick.jsx'
import handleTradeClick from './utils/event-handler/func-handleTradeClick.jsx'


function ActionButtons() {
  
  const [dcModalIsVisible,setDCModalIsVisible] = useState(false)


  return (
    <>
      <Modal
        isVisible={dcModalIsVisible}
        setIsVisible={setDCModalIsVisible}
        modalClassTypes='playDC-modal'
        content={
          <PlayDevCardModalContent setDCModalIsVisible={setDCModalIsVisible}/>
        }
      />

      <div id="action-buttons" className="buttons">
        <button className="button" type="button" onClick={() => setDCModalIsVisible(true)}>Play Dev Card</button>
        <button className="button" type="button" onClick={(e) => handleTradeClick(e)}>Trade</button>
        <button className="button" type="button" onClick={(e) => handleBuyClick(e)}>Buy</button>
        <button className="button" type="button" onClick={(e) => handleEndTurnClick(e)}>End Turn</button>
      </div>
    </>
  )
}

export default ActionButtons
