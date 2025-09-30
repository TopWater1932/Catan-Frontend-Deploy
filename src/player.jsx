import { useState } from 'react'
import { useEffect } from 'react'
import './player.css'
import createCardArray from './utils/func-createCardArray.jsx'




function Player({id,color,missionState,playerName,resourceState,devCardState,vpState}) {

  
  let cardArray = createCardArray(id,resourceState,devCardState);
  let {knight,victoryPoint,roadBuilding,yearOfPlenty,monopoly,knightsPlayed} = devCardState[id];

  return (
      <div id={id} className="player">
        <div className="cardsAndName">
          <div className="cards">

            {cardArray.map(type => (
              type==="R"?
                <div className="card res">{type}</div> :
                <div className="card dev">{type}</div>
            ))}
          </div>
          
          <div className="player-name">
            <span className="player-color" aria-hidden="true" style={{color}}>&#x25CF;</span>
            <h3 className="panel-background">
              {playerName + " "}
              {missionState.longestRoad===playerName? '🛣️' : ''}
              {missionState.largestArmy===playerName? '🗡️' : ''}
            </h3>
          </div>
        </div>
        
        {id!=="mp" && (
          <ul className="panel-background list">
            <li><span className="bold">Victory Points: </span>{vpState[id]}</li>
            <li><span className="bold">Knights Played: </span>{knightsPlayed}</li>
          </ul>
      )}
        
      </div>

  )
}

export default Player
