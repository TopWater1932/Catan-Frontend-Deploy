import { useContext } from 'react'
import { GameContext } from "../../context/GameContext.jsx";
import { WebsocketContext } from "../../context/WebsocketContext.jsx";
import '../../styles/player-info.css'



function PlayerInfo() {
  
  const {players,turn} = useContext(WebsocketContext);
  const {resIcons} = useContext(GameContext);
  const {resources,structures,devCards,vps} = players[turn];

  const {woodIcon,brickIcon,wheatIcon,sheepIcon,oreIcon} = resIcons;
  
  let {wood,brick,wheat,sheep,ore} = resources;
  let {roads,settlements,cities} = structures;
  let {knightsPlayed} = devCards;

  
  return (
    <div id="player-info" className="panel-background">
      <table className="table">
        <tbody>

          <tr>
            <td><span className="res-icon">{woodIcon}| </span>{wood}</td>
            <td><span className="bold">Victory Points: </span>{vps}</td>
          </tr>
          
          <tr>
            <td><span className="res-icon">{brickIcon}| </span>{brick}</td>
            <td><span className="bold">Knights Played: </span>{knightsPlayed}</td>
          </tr>

          <tr>
            <td><span className="res-icon">{wheatIcon}| </span>{wheat}</td>
          <td><span className="bold">Roads Remaining: </span>{roads}</td>
          </tr>

          <tr>
            <td><span className="res-icon">{sheepIcon}| </span>{sheep}</td>
            <td><span className="bold">Settlements Remaining: </span>{settlements}</td>
          </tr>

          <tr>
            <td><span className="res-icon">{oreIcon}| </span>{ore}</td>
            <td><span className="bold">Cities Remaining: </span>{cities}</td>
          </tr>
        </tbody>

      </table>
    </div>
  )
}

export default PlayerInfo
