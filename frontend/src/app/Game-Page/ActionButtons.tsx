import { useState, useEffect } from 'react'
import '../../styles/buttons.css'
import { useWebSocketContext } from '../../context/WebsocketContext'
import Modal from './Modal'
import PlayDevCardModalContent from './PlayDevCardModalContent'
import EndTurnModalContent from './EndTurnModalContent'
import TradeModalContent from './TradeModalContent'
import MaritimeTradeModalContent from './MaritimeTradeModalContent'
import PlayerTradeModalContent from './PlayerTradeModalContent'
import BuyModalContent from './BuyModalContent'

import { TradeContext } from '../../context/TradeContext'

function ActionButtons() {

  const {myTurn, setupPhase, displayDice} = useWebSocketContext()
  
  const [dcModalIsVisible,setDCModalIsVisible] = useState(false)
  const [tradeModalIsVisible,setTradeModalIsVisible] = useState(false)
  const [buyModalIsVisible,setBuyModalIsVisible] = useState(false)
  const [endModalIsVisible,setEndModalIsVisible] = useState(false)

  // Trade Modals
  const [marTradeModalIsVisible,setMarTradeModalIsVisible] = useState(false)
  const [playerTradeModalIsVisible,setPlayerTradeModalIsVisible] = useState(false)

  // Action buttons
  const [disableActions,setDisableActions] = useState(false)
  // const [disableEndTurn,setDisableEndTurn] = useState(false)

  useEffect(() => {
    if (!myTurn || setupPhase || displayDice) {
      setDisableActions(true)
    } else {
      setDisableActions(false)
    }

    // if (!myTurn || displayDice) {
    //   setDisableEndTurn(true)
    // } else {
    //   setDisableEndTurn(false)
    // }

  },[myTurn, setupPhase, displayDice])

  


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
        <button className={disableActions ? "button disabled" : "button"} type="button" onClick={() => setDCModalIsVisible(true)} disabled={disableActions}>Play Dev Card</button>
        <button className={disableActions ? "button disabled" : "button"} type="button" onClick={() => setTradeModalIsVisible(true)} disabled={disableActions}>Trade</button>
        <button className={disableActions ? "button disabled" : "button"} type="button" onClick={() => setBuyModalIsVisible(true)} disabled={disableActions}>Buy</button>
        <button className={disableActions ? "button disabled" : "button"} type="button" onClick={() => setEndModalIsVisible(true)} disabled={disableActions}>End Turn</button>
      </div>
    </>
  )
}

export default ActionButtons
