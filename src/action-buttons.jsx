import { useState } from 'react'
import { useEffect } from 'react'
import './styles/buttons.css'
import handleEndTurnClick from './utils/event-handler/func-handleEndTurnClick.jsx'
import handlePlayDevCardClick from './utils/event-handler/func-handlePlayDevCardClick.jsx'
import handleBuyClick from './utils/event-handler/func-handleBuyClick.jsx'
import handleTradeClick from './utils/event-handler/func-handleTradeClick.jsx'


function ActionButtons() {
  
  


  return (
    <div id="action-buttons" className="buttons">
      <button className="button" type="button" onClick={(e) => handlePlayDevCardClick(e)}>Play Dev Card</button>
      <button className="button" type="button" onClick={(e) => handleTradeClick(e)}>Trade</button>
      <button className="button" type="button" onClick={(e) => handleBuyClick(e)}>Buy</button>
      <button className="button" type="button" onClick={(e) => handleEndTurnClick(e)}>End Turn</button>
    </div>
  )
}

export default ActionButtons
