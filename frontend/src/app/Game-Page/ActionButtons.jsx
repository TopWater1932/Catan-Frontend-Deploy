import { useState, useContext } from 'react'
import '../../styles/buttons.css'
import { useWebSocketContext } from '../../context/WebsocketContext'
import Modal from './Modal.jsx'
import PlayDevCardModalContent from './PlayDevCardModalContent.jsx'
import EndTurnModalContent from './EndTurnModalContent.jsx'
import TradeModalContent from './TradeModalContent.jsx'
import MaritimeTradeModalContent from './MaritimeTradeModalContent.jsx'
import PlayerTradeModalContent from './PlayerTradeModalContent.jsx'
import BuyModalContent from './BuyModalContent.jsx'

import { TradeContext } from '../../context/TradeContext.jsx'

function ActionButtons() {

  const {displayDice} = useWebSocketContext()
  
  const [dcModalIsVisible,setDCModalIsVisible] = useState(false)
  const [tradeModalIsVisible,setTradeModalIsVisible] = useState(false)
  const [buyModalIsVisible,setBuyModalIsVisible] = useState(false)
  const [endModalIsVisible,setEndModalIsVisible] = useState(false)

  // Trade Modals
  const [marTradeModalIsVisible,setMarTradeModalIsVisible] = useState(false)
  const [playerTradeModalIsVisible,setPlayerTradeModalIsVisible] = useState(false)

  


  return (
    <>
      <Modal
        isVisible={dcModalIsVisible}
        setIsVisible={setDCModalIsVisible}
        modalClassTypes='options-modal'
        content={
          <PlayDevCardModalContent setDCModalIsVisible={setDCModalIsVisible}/>
        }
      />

      <Modal
        isVisible={endModalIsVisible}
        setIsVisible={setEndModalIsVisible}
        modalClassTypes='end-modal'
        content={
          <EndTurnModalContent setEndModalIsVisible={setEndModalIsVisible}/>
        }
      />
      
      <TradeContext.Provider
        value={{
            tradeModalIsVisible, setTradeModalIsVisible,
            marTradeModalIsVisible,setMarTradeModalIsVisible,
            playerTradeModalIsVisible, setPlayerTradeModalIsVisible
          }}
      >
        <Modal
          isVisible={tradeModalIsVisible}
          setIsVisible={setTradeModalIsVisible}
          modalClassTypes='options-modal'
          content={
            <TradeModalContent />
          }
        />

        <Modal
          isVisible={marTradeModalIsVisible}
          setIsVisible={setMarTradeModalIsVisible}
          modalClassTypes='options-modal'
          content={
            <MaritimeTradeModalContent />
          }
        />

        <Modal
          isVisible={playerTradeModalIsVisible}
          setIsVisible={setPlayerTradeModalIsVisible}
          modalClassTypes='options-modal'
          content={
            <PlayerTradeModalContent />
          }

        />

      </TradeContext.Provider>

      <Modal
        isVisible={buyModalIsVisible}
        setIsVisible={setBuyModalIsVisible}
        modalClassTypes='options-modal'
        content={
          <BuyModalContent setBuyModalIsVisible={setBuyModalIsVisible}/>
        }
      />

      <div id="action-buttons" className="buttons">
        <button className={displayDice ? "button disabled" : "button"} type="button" onClick={() => setDCModalIsVisible(true)} disabled={displayDice}>Play Dev Card</button>
        <button className={displayDice ? "button disabled" : "button"} type="button" onClick={() => setTradeModalIsVisible(true)} disabled={displayDice}>Trade</button>
        <button className={displayDice ? "button disabled" : "button"} type="button" onClick={() => setBuyModalIsVisible(true)} disabled={displayDice}>Buy</button>
        <button className={displayDice ? "button disabled" : "button"} type="button" onClick={() => setEndModalIsVisible(true)} disabled={displayDice}>End Turn</button>
      </div>
    </>
  )
}

export default ActionButtons
