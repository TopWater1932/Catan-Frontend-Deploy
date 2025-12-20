import { useState } from 'react'
import './styles/index.css'
import Game from './app/Game-Page/Game.jsx'
import LandingPage from './app/Landing-Page/LandingPage.jsx'
import OptionsPage from './app/Options-Page/OptionsPage.jsx'
import Player from './classes/Player.jsx'
import { WebsocketContext } from './context/WebsocketContext.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

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
    <WebsocketContext.Provider
      value={{
        players, setPlayers,
        missions,
        turn, setTurn,
        playerIDs,
        playerNames,
        playerColors
      }}
    >
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<LandingPage />} />
          <Route path="/setup" element={<OptionsPage />} />
          <Route path="/game" element={<Game />} />

        </Routes>
      </BrowserRouter>

    </WebsocketContext.Provider>
  );
}

export default App