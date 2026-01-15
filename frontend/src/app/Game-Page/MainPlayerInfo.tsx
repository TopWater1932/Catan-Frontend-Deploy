import { useWebSocketContext } from '../../context/WebsocketContext'
import '../../styles/player.css'
import createCardArray from '../../utils/func-createCardArray'

import {
  MainPlayerInfoArgs
} from '../../ts-contracts/interfaces'


function MainPlayerInfo({id, position}: MainPlayerInfoArgs) {

  const {players,missions,turn,playerID,stealCard,setStealCard,stealList,sendJsonMessage,setMoveRobber} = useWebSocketContext()

  const {name,color,activeTurn,resources,devCards,structures,vps} = players[id];
  const {longestRoad,largestArmy} = missions;
  let {knightsPlayed} = devCards;

  
  let cardArray = createCardArray(resources,devCards);

  const handleChoice = () => {
    if (stealCard && stealList.includes(id)) {
      sendJsonMessage({
        'actionCategory':'game',
        'actionType':'steal-from',
        'data':{
          'from':id,
          'to':playerID
        }
      });
      setStealCard(false);
      setMoveRobber(false);
    }
  }

  return (
      <div id={position} className="player">
        <div className="cardsAndName">
          <div className="cards">

            {cardArray.map(type => (
              type==="R"?
                <div className={(stealCard && stealList.includes(id)) ? "card res choose-steal":"card res"} onClick={handleChoice}>{type}</div> :
                <div className="card dev">{type}</div>
            ))}
          </div>
          
          <div className="player-name">
            <span className="player-color" aria-hidden="true" style={{color}}>&#x25CF;</span>
            <h3 className={turn === id ? "current-turn panel-background" : "panel-background"}>
              {name + " "}
              {longestRoad===name? '🛣️' : ''}
              {largestArmy===name? '🗡️' : ''}
            </h3>
          </div>
        </div>
        
        {id!==playerID && ( 
          <ul className="panel-background list">
            <li><span className="bold">Victory Points: </span>{vps}</li>
            <li><span className="bold">Knights Played: </span>{knightsPlayed}</li>
          </ul>
      )}
        
      </div>

  )
}

export default MainPlayerInfo
