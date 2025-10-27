import { useState } from 'react'
import './styles/buttons.css'
import Modal from './Modal.jsx'
import PlayDevCardModalContent from './PlayDevCardModalContent.jsx'
import EndTurnModalContent from './EndTurnModalContent.jsx'
import TradeModalContent from './TradeModalContent.jsx'
import BuyModalContent from './BuyModalContent.jsx'

function ActionButtons() {
  
  const [dcModalIsVisible,setDCModalIsVisible] = useState(false)
  const [tradeModalIsVisible,setTradeModalIsVisible] = useState(false)
  const [buyModalIsVisible,setBuyModalIsVisible] = useState(false)
  const [endModalIsVisible,setEndModalIsVisible] = useState(false)


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

      <Modal
        isVisible={endModalIsVisible}
        setIsVisible={setEndModalIsVisible}
        modalClassTypes='endTurn-modal'
        content={
          <EndTurnModalContent setEndModalIsVisible={setEndModalIsVisible}/>
        }
      />
      
      <Modal
        isVisible={tradeModalIsVisible}
        setIsVisible={setTradeModalIsVisible}
        modalClassTypes='trade-modal'
        content={
          <TradeModalContent setTradeModalIsVisible={setTradeModalIsVisible}/>
        }
      />

      <Modal
        isVisible={buyModalIsVisible}
        setIsVisible={setBuyModalIsVisible}
        modalClassTypes='buy-modal'
        content={
          <BuyModalContent setBuyModalIsVisible={setBuyModalIsVisible}/>
        }
      />

      <div id="action-buttons" className="buttons">
        <button className="button" type="button" onClick={() => setDCModalIsVisible(true)}>Play Dev Card</button>
        <button className="button" type="button" onClick={() => setTradeModalIsVisible(true)}>Trade</button>
        <button className="button" type="button" onClick={() => setBuyModalIsVisible(true)}>Buy</button>
        <button className="button" type="button" onClick={() => setEndModalIsVisible(true)}>End Turn</button>
      </div>
    </>
  )
}

export default ActionButtons
