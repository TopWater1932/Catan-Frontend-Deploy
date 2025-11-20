import { useContext } from 'react'
import { GlobalContext } from "./GlobalContext.jsx";
import './styles/player-info.css'



function PlayerInfo() {
  
  const {turnState, resourcesState, structuresState, devCardsState, VPsState, resIcons} = useContext(GlobalContext)
  const [turn] = turnState;
  const [resources] = resourcesState;
  const [structures] = structuresState;
  const [devCards] = devCardsState;
  const [vps] = VPsState;
  const {woodIcon,brickIcon,wheatIcon,sheepIcon,oreIcon} = resIcons;
  
  let {wood,brick,wheat,sheep,ore} = resources[turn];
  let {roads,settlements,cities} = structures[turn];
  let {knightsPlayed} = devCards[turn];
  let vp = vps[turn];
  
  return (
    <div id="player-info" className="panel-background">
      <table className="table">
        <tbody>

          <tr>
            <td><span className="res-icon">{woodIcon}| </span>{wood}</td>
            <td><span className="bold">Victory Points: </span>{vp}</td>
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
