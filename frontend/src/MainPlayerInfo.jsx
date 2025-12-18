import { useContext } from 'react'
import { GlobalContext } from "./GlobalContext.jsx";
import './styles/player.css'
import createCardArray from './utils/func-createCardArray.jsx'


function MainPlayerInfo({id}) {

  const {players,missions,turn} = useContext(GlobalContext)

  const {name,color,activeTurn,resources,devCards,structures,vps} = players[id];
  const {longestRoad,largestArmy} = missions;
  let {knightsPlayed} = devCards;

  
  let cardArray = createCardArray(resources,devCards);


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
              {name + " "}
              {longestRoad===name? '🛣️' : ''}
              {largestArmy===name? '🗡️' : ''}
            </h3>
          </div>
        </div>
        
        {id!=="mp" && (
          <ul className="panel-background list">
            <li><span className="bold">Victory Points: </span>{vps}</li>
            <li><span className="bold">Knights Played: </span>{knightsPlayed}</li>
          </ul>
      )}
        
      </div>

  )
}

export default MainPlayerInfo
