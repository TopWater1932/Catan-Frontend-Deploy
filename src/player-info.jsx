import { useState } from 'react'
import { useEffect } from 'react'
import './player-info.css'



function PlayerInfo({id,missionState,playerName,resourceState,devCardState,vpState,remainingStructures}) {
  
  let {wood,brick,wheat,sheep,ore} = resourceState[id];
  let {knight,victoryPoint,roadBuilding,yearOfPlenty,monopoly,knightsPlayed} = devCardState[id];
  let {roads,settlements,cities} = remainingStructures[id];
  
  return (
    <div id="player-info" className="panel-background">
      <table className="table">
        <tbody>

          <tr>
            <td><span className="res-icon">🪵| </span>{wood}</td>
            <td><span className="bold">Victory Points: </span>{vpState[id]}</td>
          </tr>
          
          <tr>
            <td><span className="res-icon">🧱| </span>{brick}</td>
            <td><span className="bold">Knights Played: </span>{knightsPlayed}</td>
          </tr>

          <tr>
            <td><span className="res-icon">🌾| </span>{wheat}</td>
          <td><span className="bold">Roads Remaining: </span>{roads}</td>
          </tr>

          <tr>
            <td><span className="res-icon">🐑| </span>{sheep}</td>
            <td><span className="bold">Settlements Remaining: </span>{settlements}</td>
          </tr>

          <tr>
            <td><span className="res-icon">🪨| </span>{ore}</td>
            <td><span className="bold">Cities Remaining: </span>{cities}</td>
          </tr>
        </tbody>

      </table>
    </div>
  )
}

export default PlayerInfo
