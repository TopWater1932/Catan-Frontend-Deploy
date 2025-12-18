import { useState, useEffect } from 'react'
import './styles/Game.css'
import { GlobalContext } from './GlobalContext.jsx'
import Player from './classes/Player.jsx'
import MainPlayerInfo from './MainPlayerInfo.jsx'
import CloseButton from './CloseBtn.jsx'
import LRLAIndicators from './LR-LA-indicator.jsx'
import PlayerInfo from './PlayerInfo.jsx'
import ActionButtons from './ActionButtons.jsx'
import Board from './Board.jsx'
import useFetch from './utils/fetch/useFetch.jsx'
import Dice from "./Dice.jsx"



function Game() {
  
  const playerIDs = ["mp","p1","p2","p3"];
  const playerNames = ["Main Player","Player 1","Player 2","Player 3"]
  const playerColors = ["red","blue","green","white"]

  // Temporary
  const turnID = 'p1'
  const initialPlayers = []
  for (let i=0; i<4; i++ ) {
    initialPlayers.push({
      'id':`p${i+1}`,
      'name':`Name${i+1}`,
      'color':playerColors[i],
      'resources':{"wood":4,"brick":0,"wheat":2,"sheep":2,"ore":3},
      'devCards':{"knight":0,"victoryPoint":0,"roadBuilding":0,"yearOfPlenty":0,"monopoly":0,"knightsPlayed":0},
      'structures':{"roads":15,"settlements":5,"cities":4},
      'vps':0,
      'ports':[] // ADD 4-1 PORT FOR ALL PLAYERS BY DEFAULT
    })
  }

  const [turn,setTurn] = useState(turnID);
  const [longestRoad,setLongestRoad] = useState('Unclaimed');
  const [largestArmy,setLargestArmy] = useState('Unclaimed');
  const missions = {longestRoad,setLongestRoad,largestArmy,setLargestArmy};

  const initialPlayerState = {};
  initialPlayers.map((player) => (
    initialPlayerState[player.id] = new Player(
      player.id,
      player.name,
      player.color,
      player.id === turnID? true:false,
      player.resources,
      player.devCards,
      player.structures,
      player.vps
    )
  ));

  const [players,setPlayers] = useState(initialPlayerState);


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
            // tiles,nodes,paths,
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

          <div id="dice-area">
            <Dice />
          </div>
          
          <PlayerInfo />

          <ActionButtons />

        </GlobalContext.Provider>

        <CloseButton />
      </div>
    </div>
  );
}

export default Game;
