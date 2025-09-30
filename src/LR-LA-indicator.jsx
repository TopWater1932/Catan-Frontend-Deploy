import { useState } from 'react'
import { useEffect } from 'react'
import './LR-LA-indicator.css'



function LRLAIndicators({missionState}) {

  

  return (
    <div id="indicators">
      <div className="indicator-row">
        <span className="mission-icon">🛣️</span>
        <p><span className="bold">Longest Road: </span>{missionState.longestRoad}</p>
      </div>

      <div className="indicator-row">
        <span className="mission-icon">🗡️</span>
        <p><span className="bold">Largest Army: </span>{missionState.largestArmy}</p>
      </div>


    </div>
  )
}

export default LRLAIndicators
