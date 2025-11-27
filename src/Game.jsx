import { useState, useLayoutEffect, useRef } from 'react'
import './styles/Game.css'
import { GlobalContext } from './GlobalContext.jsx'
import Player from './classes/Player.jsx'
import MainPlayerInfo from './MainPlayerInfo.jsx'
import CloseButton from './CloseBtn.jsx'
import LRLAIndicators from './LR-LA-indicator.jsx'
import PlayerInfo from './PlayerInfo.jsx'
import ActionButtons from './ActionButtons.jsx'
import Board from './Board.jsx'
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

  const initialPlayers = {};
  playerIDs.map((id,i) => (
    initialPlayers[id] = new Player(
      id,
      playerNames[i],
      playerColors[i],
      false,
      {"wood":1,"brick":1,"wheat":1,"sheep":1,"ore":1},
      {"knight":1,"victoryPoint":1,"roadBuilding":0,"yearOfPlenty":0,"monopoly":0,"knightsPlayed":0},
      {"roads":15,"settlements":5,"cities":4},
      0
    )
  ));
  const [players,setPlayers] = useState(initialPlayers);
  // console.log(playersArray)
  

  // fetchBackend() // Future fetch function

  return (
    <div className='game-background'>
      <div className='app-content'>

        <LRLAIndicators missions={missions}/>

        <GlobalContext.Provider
          value={{
            players, setPlayers,
            missions,
            turn, setTurn,
            playerIDs,
            playerNames,
            playerColors,
            'resIcons':{
              'woodIcon':'🪵',
              'brickIcon':'🧱',
              'wheatIcon':'🌾' ,
              'sheepIcon':'🐑',
              'oreIcon':'🪨'
            }
          }}
        >

          
          {Object.keys(players).map((id,i) => 
              <MainPlayerInfo
                key={`${id}-MainPlayerInfo`}
                id={id}
              />
            )
          }
          
          <Board />
          
          <PlayerInfo />

          <ActionButtons />

        </GlobalContext.Provider>

        <CloseButton />
      </div>
    </div>
  );
}

export default Game;