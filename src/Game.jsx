import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import './Game.css'
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
  playerIDs.map(id => initialResources[id] = {"wood":1,"brick":2,"wheat":0,"sheep":0,"ore":0});
  const [resources,setResources] = useState(initialResources);
  
  let initialDevCards = {};
  playerIDs.map(id => initialDevCards[id] = {"knight":0,"victoryPoint":0,"roadBuilding":0,"yearOfPlenty":0,"monopoly":0,"knightsPlayed":0});
  const [devCards,setDevCards] = useState(initialDevCards);

  let initialStructures = {};
  playerIDs.map(id => initialStructures[id] = {"roads":0,"settlements":0,"cities":0});
  const [structures,setStructures] = useState(initialStructures);

  let initialVPs = {};
  playerIDs.map(id => initialVPs[id] = 0);
  const [vps,setVPs] = useState(initialVPs);

  const [longestRoad,setLongestRoad] = useState('Unclaimed');
  const [largestArmy,setLargestArmy] = useState('Unclaimed');
  let missions = {longestRoad,largestArmy};

  

  // fetchBackend() // Future fetch function

  return (
    <>
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
        

        <PlayerInfo
          id={playerIDs[0]}
          playerName={playerNames[0]}
          missionState={missions}
          resourceState={resources}
          devCardState={devCards}
          vpState={vps}
          remainingStructures={structures}
        />
        <ActionButtons
          ids={playerIDs}
          turn={turn}
          turnSetter={setTurn}
        />
        <CloseButton />
    </>
  )
}

export default Game