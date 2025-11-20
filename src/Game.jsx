import { useState, useLayoutEffect, useRef } from 'react'
import './styles/Game.css'
import { GlobalContext } from './GlobalContext.jsx'
import Player from './player.jsx'
import CloseButton from './close-btn.jsx'
import LRLAIndicators from './LR-LA-indicator.jsx'
import PlayerInfo from './player-info.jsx'
import ActionButtons from './action-buttons.jsx'
import Board from './board.jsx'
import fetchBackend from './utils/func-fetchBackend.jsx'


function Game() {

  const playerIDs = ["mp","p1","p2","p3"];
  const playerNames = ["Main Player","Player 1","Player 2","Player 3"]
  const playerColors = ["red","blue","green","white"]

  const [turn,setTurn] = useState(playerIDs[0]);

  let initialResources = {};
  playerIDs.map(id => initialResources[id] = {"wood":1,"brick":1,"wheat":1,"sheep":1,"ore":1});
  const [resources,setResources] = useState(initialResources);
  
  let initialDevCards = {};
  playerIDs.map(id => initialDevCards[id] = {"knight":1,"victoryPoint":1,"roadBuilding":0,"yearOfPlenty":0,"monopoly":0,"knightsPlayed":0});
  const [devCards,setDevCards] = useState(initialDevCards);

  let initialStructures = {};
  playerIDs.map(id => initialStructures[id] = {"roads":15,"settlements":5,"cities":4});
  const [structures,setStructures] = useState(initialStructures);

  let initialVPs = {};
  playerIDs.map(id => initialVPs[id] = 0);
  const [vps,setVPs] = useState(initialVPs);

  const [longestRoad,setLongestRoad] = useState('Unclaimed');
  const [largestArmy,setLargestArmy] = useState('Unclaimed');
  let missions = {longestRoad,largestArmy};


  

  // fetchBackend() // Future fetch function

  return (
    <div className='game-background'>
      <div className='app-content'>
        <GlobalContext.Provider
          value={{
            playerIDs,
            playerNames,
            playerColors,
            'turnState':[turn,setTurn],
            'resourcesState':[resources,setResources],
            'devCardsState':[devCards,setDevCards],
            'structuresState':[structures,setStructures],
            'VPsState':[vps,setVPs],
            'LRState':[longestRoad,setLongestRoad],
            'LAState':[largestArmy,setLargestArmy],
            'resIcons':{
              'woodIcon':'🪵',
              'brickIcon':'🧱',
              'wheatIcon':'🌾' ,
              'sheepIcon':'🐑',
              'oreIcon':'🪨'
            }
          }}
        >

          <LRLAIndicators missionState={missions}/>
          
          {playerIDs.map((id,i) => 
              <Player
                id={id}
                playerName={playerNames[i]}
                color={playerColors[i]}
                missionState={missions}
                resourceState={resources}
                devCardState={devCards}
                vpState={vps}
              />
            )
          }
          
          <Board />
          

          <PlayerInfo />

          <ActionButtons
            ids={playerIDs}
            turn={turn}
            turnSetter={setTurn}
          />

          <CloseButton />

        </GlobalContext.Provider>
      </div>
    </div>
  );
}

export default Game;