import '../../styles/LR-LA-indicator.css'
import {
  Missions
} from '../../ts-contracts/interfaces'


function LRLAIndicators(missions: Missions) {

  const {longestRoad, largestArmy} = missions;

  return (
    <div id="indicators">
      <div className="indicator-row">
        <span className="mission-icon">🛣️</span>
        <p><span className="bold">Longest Road: </span>{longestRoad}</p>
      </div>

      <div className="indicator-row">
        <span className="mission-icon">🗡️</span>
        <p><span className="bold">Largest Army: </span>{largestArmy}</p>
      </div>


    </div>
  )
}

export default LRLAIndicators
